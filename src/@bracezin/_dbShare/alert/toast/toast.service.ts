import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ToastData } from 'src/@bracezin/_dbShare/alert/toast/toastData.interface';
import { ToastModel } from 'src/@bracezin/_dbShare/alert/toast/toast_model.model';
import { AudioService } from 'src/@bracezin/_dbShare/alert/audio.service';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';

@Injectable({
	providedIn: 'root'
})

export class ToastService {

	constructor(private toastr: ToastrService,
		private alertService: AlertService,
		private audioService: AudioService) { }

	private datasSource = new BehaviorSubject<ToastData[]>([]);
	datas = this.datasSource.asObservable();

	changeDatas(datas: ToastData[]) {
		this.datasSource.next(datas);
	}

	private dataSource = new BehaviorSubject<ToastData>(null);
	data = this.dataSource.asObservable();

	changeData(datas: ToastData) {
		this.dataSource.next(datas);
	}

	concatItem(item: ToastData) {
		let lists = [];
		this.datas.subscribe(result => {
			lists = result.concat([item]);
		});
		this.changeDatas(lists);
	}

	spliceItem(id: number) {
		let datas = [];
		this.datas.subscribe(data => datas = data);
		if (datas && datas.length > 0) {
			for (var i = 0; i < datas.length; ++i) {
				if (datas[i].id === id) { datas.splice(i, 1); }
			}
		}
		this.changeDatas(datas);
	}

	keepLastFiveItems() {
		let datas = [];
		this.datas.subscribe(data => datas = data);
		if (datas && datas.length > 0) {
			datas = datas.slice(datas.length - 5, datas.length);
		}
		this.changeDatas(datas);
	}

	showMessage(data: ToastData) {
		this.changeData(data);
		let message: string = (data && data.message) ? data.message : null;
		let title: string = (data && data.title) ? data.title : null;
		this.alertService.websocketShow(data.type, data)
		this.keepLastFiveItems();
		this.audioService.playAudio();
	}

	showPrepremiumDashboard(data: ToastData) {
		this.changeData(data);
		let message: string = (data && data.message) ? data.message : null;
		let title: string = (data && data.title) ? data.title : null;
		this.alertService.websocketShow(data.type, data)
		this.keepLastFiveItems();
		this.audioService.playAudio();
	}

	showHTMLMessage(data) {
		this.changeData(data);
		let message: string = (data && data.message) ? data.message : null;
		let title: string = (data && data.title) ? data.title : null;
		this.toastr.success(message, title, {
			enableHtml: true
		});
		this.keepLastFiveItems();
		this.audioService.playAudio();
	}

}  
