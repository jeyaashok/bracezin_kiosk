import { Injectable, Inject, signal, EventEmitter } from '@angular/core'
import { BehaviorSubject, Observable, Subject, from, throwError } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { Resolve } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService, CommonService, BaseService } from 'src/@bracezin/_dbShare/general';
import { TableColumn } from 'src/@bracezin/_dbShare/utils';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { Media, MediaModel, MediaMapModel, MediaPanelConfig, MediaPanelConfigModel } from 'src/@bracezin/_dbShare/directory/media';
import { HttpClient } from '@angular/common/http';

export const MAX_IMAGE_UPLOAD_SIZE = 2 * 1024 * 1024;

export interface MediaUploadProgressEvent {
  type: 'progress' | 'complete';
  chunkIndex: number;
  totalChunks: number;
  progress: number;
  ratio: string;
  uploadedBytes?: number;
  totalBytes?: number;
  response?: any;
}

export function buildChunkUploadPayload(file: File, chunkIndex: number, totalChunks: number, extraData: Record<string, any> = {}): FormData {
  const safeTotalChunks = Math.max(1, totalChunks || 1);
  const safeChunkIndex = Math.max(0, chunkIndex || 0);
  const chunkSize = Math.ceil(file.size / safeTotalChunks);
  const start = safeChunkIndex * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  const chunkBlob = file.slice(start, end, file.type || 'application/octet-stream');
  const formData = new FormData();

  formData.append('file', chunkBlob, file.name);
  formData.append('file_name', file.name);
  formData.append('name', file.name);
  formData.append('mime', file.type || 'application/octet-stream');
  formData.append('size', String(file.size));
  formData.append('disk', 'local');
  formData.append('chunk_index', String(safeChunkIndex));
  formData.append('total_chunks', String(safeTotalChunks));
  formData.append('is_last_chunk', String(safeChunkIndex === safeTotalChunks - 1));
  formData.append('chunk_offset', String(start));
  formData.append('chunk_length', String(end - start));

  Object.entries(extraData || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  });

  return formData;
}

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class MediaService extends BaseService implements Resolve<any> {

	config = signal<MediaPanelConfig>(new MediaPanelConfigModel({}));
	onSelectItem = signal<Media>(new MediaModel({}));

	constructor(public globalService: GlobalService,
		public commonService: CommonService,
		public alertService: AlertService,
		// public snackBar: MatSnackBar,
		public dialog: MatDialog, private http: HttpClient) {
		super('media',
			globalService,
			commonService,
			MediaModel,
			MediaMapModel,
			alertService,
			// snackBar,
			dialog,
			null);
		this._unsubscribeAll = new Subject();
	}

	mediaUsage = signal<any>(0);

	changeMediaUsage(count: any) {
		this.mediaUsage.set(count);
	}

	changeConfig(config: MediaPanelConfig = null) {
		config = (config) ? config : new MediaPanelConfigModel({});
		this.config.set(config);
	}

	onSelectItemEvent(item: Media) {
		this.onSelectItem.set(item);
	}

	addMedia(data: any = null) {
		return this.commonService.fileUpload('upload-media', data, true, 'optionOne');
	}

	uploadImage(file: File, extraData: Record<string, any> = {}): Observable<any> {
		if (!file) {
			return throwError(() => new Error('No file selected for upload.'));
		}

		if (!(file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('application/'))) {
			return throwError(() => new Error('Only image files are allowed.'));
		}

		const addMetadata = (payload: FormData): FormData => {
			Object.entries(extraData || {}).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					payload.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
				}
			});
			return payload;
		};

		if (file.size <= MAX_IMAGE_UPLOAD_SIZE) {
			const payload = addMetadata(new FormData());
			payload.append('file', file, file.name);
			payload.append('file_name', file.name);
			payload.append('name', file.name);
			payload.append('mime', file.type || 'application/octet-stream');
			payload.append('size', String(file.size));
			payload.append('disk', 'local');

			return new Observable((observer) => {
				this.commonService.fileUpload('upload-media', payload, true, 'optionOne').subscribe({
					next: (response) => {
						observer.next({
							type: 'progress',
							progress: 100,
							ratio: '1/1',
							chunkIndex: 0,
							totalChunks: 1,
							response,
						});
						observer.next({
							type: 'complete',
							progress: 100,
							ratio: '1/1',
							chunkIndex: 0,
							totalChunks: 1,
							response,
						});
						observer.complete();
					},
					error: (error) => observer.error(error),
				});
			});
		}

		const totalChunks = Math.ceil(file.size / MAX_IMAGE_UPLOAD_SIZE);
		return new Observable((observer) => {
			let currentChunkIndex = 0;

			const uploadNextChunk = () => {
				if (currentChunkIndex >= totalChunks) {
					return;
				}

				const payload = addMetadata(buildChunkUploadPayload(file, currentChunkIndex, totalChunks, extraData));
				this.commonService.fileUpload('upload-media', payload, true, 'optionOne').subscribe({
					next: (response) => {
						const percent = Math.round(((currentChunkIndex + 1) / totalChunks) * 100);
						const progressEvent: MediaUploadProgressEvent = {
							type: 'progress',
							chunkIndex: currentChunkIndex,
							totalChunks,
							progress: percent,
							ratio: `${currentChunkIndex + 1}/${totalChunks}`,
							uploadedBytes: Math.min((currentChunkIndex + 1) * MAX_IMAGE_UPLOAD_SIZE, file.size),
							totalBytes: file.size,
							response,
						};
						observer.next(progressEvent);

						if (currentChunkIndex === totalChunks - 1) {
							observer.next({
								type: 'complete',
								chunkIndex: currentChunkIndex,
								totalChunks,
								progress: 100,
								ratio: `${totalChunks}/${totalChunks}`,
								uploadedBytes: file.size,
								totalBytes: file.size,
								response,
							});
							observer.complete();
							return;
						}

						currentChunkIndex += 1;
						uploadNextChunk();
					},
					error: (error) => observer.error(error),
				});
			};

			uploadNextChunk();
		});
	}

	getDocumentUrl(url: string): Observable<Blob> {
		return this.commonService.convertBlob(url, { responseType: 'blob' });
	}

	onGetAllItemsResponse(response: any, input: any = null) {
		let additional = (response && response.additional) ? response.additional : null;
		var mediaUsage = additional?.MediaUsage ? additional?.MediaUsage : 0;
		let sizeInMB = (mediaUsage / 1024).toFixed(3);
		this.changeMediaUsage(this.formatSizeFromKB(sizeInMB));
	}

	formatSizeFromKB(kb: any): string {
		if (kb === undefined || kb === null || isNaN(kb)) {
			return '0 KB';
		}
		kb = Number(kb);
		const units = ['KB', 'MB', 'GB', 'TB'];
		let unitIndex = 0;
		while (kb >= 1024 && unitIndex < units.length - 1) {
			kb /= 1024;
			unitIndex++;
		}
		return kb.toFixed(3) + ' ' + units[unitIndex];
	}

	storeManagetag(data) {
		this.commonService.storeItem('media/managetag', data, true, 'optionOne')
			.pipe(untilDestroyed(this, 'unSubscribe'))
			.subscribe((data: any) => {
				if (data && data.success) {
					 
				} 
			},
				error => console.log('Error ::' + error)
			);
	}

}
