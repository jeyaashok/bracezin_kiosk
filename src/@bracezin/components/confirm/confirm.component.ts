import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';

export interface DialogData {
	type: string;
	title: string;
	message: string;
	icon?: string;
	buttonText?: string;
	item?: any;
}

@Component({
	selector: 'confirm-dialog',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.scss'],
	standalone: true,
	imports: [CommonModule, FlexLayoutModule, MatButtonModule, MatDialogModule, MatToolbarModule]
})
export class ConfirmComponent implements OnInit, OnChanges {

	type: string = 'success';
	title: string = 'Complete Action !!!';
	message: string = 'Are you sure you want to do this action?';
	icon!: string;
	buttonText: string = 'Ok';
	item: any = null;

	constructor(public dialogRef: MatDialogRef<ConfirmComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

	ngOnInit() { }

	ngOnChanges () {
		this.title = this.getTitle(this.data.type);
		this.message = this.data.message;
		this.icon = this.data.icon || null;
		this.buttonText = this.getButtonText(this.data.type);
		this.item = this.data.item;
	}

	onNoClick(): void {
		this.dialogRef.close({ data: false });
	}

	onOkClick(): void {
		this.dialogRef.close({ data: true });
	}

	getTitle(type: string) {
		if (this.data && this.data.title) {
			return this.data.title;
		}
		switch (type.toLowerCase()) {
			case "success":
				return "Complete Action !!!";
				break;
			case "info":
				return "For Your Kind Information !!!";
				break;
			case "update":
			case "warn":
				return "Warning !!!";
				break;
			case "delete":
				return "Do You Want to Delete !!!";
				break;
			default:
				return "Complete Action !!!";
				break;
		}
	}

	getButtonText(type: string) {
		if (this.data && this.data.buttonText) {
			return this.data.buttonText;
		}
		switch (type.toLowerCase()) {
			case "success":
				return "Complete";
				break;
			case "info":
				return "OK";
				break;
			case "update":
			case "warn":
				return "Confirm";
				break;
			case "delete":
				return "Delete";
				break;
			default:
				return "Ok";
				break;
		}
	}

	getIcon(type: string) {
		if (this.icon) {
			return this.icon;
		}
		if(this.data && this.data.icon) {
			return this.data.icon;
		}
		switch (type.toLowerCase()) {
			case "success":
				return "ri-check_circle-line";
				break;
			case "info":
				return "ri-information-line";
				break;
			case "warn":
			case "update":
				return "ri-alert-line";
				break;
			case "delete":
				return "ri-delete-bin-line";
				break;
			default:
				return "ri-check_circle-line";
				break;
		}
	}

	getColor(type: string) {
		switch (type.toLowerCase()) {
			case "success":
				return "success";
				break;
			case "info":
				return "info";
				break;
				case "warn":
				case "update":
				return "warning";
				break;
			case "delete":
				return "danger";
				break;
			default:
				return "info";
				break;
		}
	}
}
