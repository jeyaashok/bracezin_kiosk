import { Component, OnInit, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { User, MediaService, Media } from 'src/@bracezin/_dbShare';

@Component({
  selector: "app-contact-card-media",
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],
  standalone: false,
})
@UntilDestroy()
export class MediaComponent implements OnInit {
  @Input() item: User;
  @Input() medias: Media[] = [];
  params: any;
  readonly MAX_IMAGE_UPLOAD_SIZE = 2 * 1024 * 1024;
  uploadProgress = 0;
  uploadStatus = '';
  isUploading = false;

  constructor(
    public mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void { }

  addForm() {
    const input = document.getElementById('mediaInput') as HTMLInputElement | null;
    input?.click();
  }

  open(index: number) {
    const media = this.medias?.[index];
    if (!media?.url) {
      return;
    }
    window.open(media.url, '_blank', 'noopener,noreferrer');
  }

  imageHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }
    console.log(file.type);
    
    if (!(file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('application/'))) {
      return;
    }

    const extraData: Record<string, any> = {
      folder: 'contact',
    };

    if (this.item && this.item.id) {
      extraData.resource_id = this.item.id;
      extraData.resource_type = this.item.tableName;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadStatus = 'Preparing upload...';

    if (file.size > this.MAX_IMAGE_UPLOAD_SIZE) {
      extraData.disk = 'local';
      this.mediaService.uploadImage(file, extraData)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (event) => {
            if (event?.type === 'progress') {
              this.uploadProgress = Math.max(0, Math.min(100, Number(event.progress) || 0));
              this.uploadStatus = `Uploading ${event.ratio} (${this.uploadProgress}%)`;
            }

            if (event?.type === 'complete') {
              this.uploadProgress = 100;
              this.uploadStatus = 'Upload complete';
              this.isUploading = false;
            }
          },
          error: () => {
            this.uploadProgress = 0;
            this.uploadStatus = 'Upload failed';
            this.isUploading = false;
          },
          complete: () => {
            this.isUploading = false;
          },
        });
    } else {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('file_name', file.name);
      formData.append('mime', file.type || 'application/octet-stream');
      formData.append('size', String(file.size));
      formData.append('total_size', String(file.size));
      formData.append('folder', 'contact');
      formData.append('disk', 'local');

      if (this.item && this.item.id) {
        formData.append('resource_id', String(this.item.id));
        formData.append('resource_type', this.item.tableName);
      }

      this.mediaService.addMedia(formData)
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.uploadProgress = 100;
            this.uploadStatus = 'Upload complete';
            this.isUploading = false;
          },
          error: () => {
            this.uploadProgress = 0;
            this.uploadStatus = 'Upload failed';
            this.isUploading = false;
          },
        });
    }

    input.value = '';
  }
}