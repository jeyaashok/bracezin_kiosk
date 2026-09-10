import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class LoaderService {

    public pageLoaderSource = new BehaviorSubject<boolean>(false);
	pageLoader = this.pageLoaderSource.asObservable();

    private adSubLoaderSource = new BehaviorSubject<boolean>(false);
    adSubLoader = this.adSubLoaderSource.asObservable();

    private adSendMsgLoaderSource = new BehaviorSubject<boolean>(false);
    adSendMsgLoader = this.adSendMsgLoaderSource.asObservable();

    constructor() { }

	changePageLoader(pageLoader: boolean) {
		this.pageLoaderSource.next(pageLoader);
		if(pageLoader === true){
			setTimeout(() => {
				this.pageLoaderSource.next(false);
			}, 5000);
		}
	}

    changeAdSubLoader(res: boolean) {
        this.adSubLoaderSource.next(res);
        if(res && res === true) {
            setTimeout(() => { this.adSubLoaderSource.next(false); }, 5000);
        }
    }

    changeAdSendMsgLoader(res: boolean) {
        this.adSendMsgLoaderSource.next(res);
        if (res && res === true) {
            setTimeout(() => { this.adSendMsgLoaderSource.next(false); }, 5000);
        }
    }
}
