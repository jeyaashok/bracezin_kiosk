import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AudioService {

	isNotifySound = false;
	audioSource = "audio/octopus-notification.mp3";
	audioSourceOrder = "audio/octopus-order-notification.mp3";
	audioSourceOrderStatus = "audio/octopus-order-status-notification.mp3";
	turnPage = "audio/turnpage.mp3";

	private playSoundSource = new BehaviorSubject<boolean>(false);
	playSound = this.playSoundSource.asObservable();

	constructor() { }

	changePlaySound(status: boolean) {
		this.playSoundSource.next(status);
		this.isNotifySound = status;
	}

	playAudio() {
		if (this.isNotifySound && this.isNotifySound === true) {
			let audio = new Audio();
			audio.src = this.audioSource;
			audio.load();
			audio.play();
		}
	}

	playOrderAudio() {
		let audio = new Audio();
		audio.src = this.audioSourceOrder;
		audio.load();
		audio.play();
	}

	playOrderStatusAudio() {
		let audio = new Audio();
		audio.src = this.audioSourceOrderStatus;
		audio.load();
		audio.play();
	}

	playTurnPageAudio() {
		let audio = new Audio();
		audio.src = this.turnPage;
		audio.load();
		audio.play();
	}
}
