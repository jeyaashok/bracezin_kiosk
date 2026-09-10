import { Component, ElementRef, OnDestroy, OnInit, Input, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { Alert, AlertModel } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    standalone: true,
    imports: [CommonModule, FlexLayoutModule, MatIconModule],
    encapsulation: ViewEncapsulation.None,
})
export class AlertComponent implements OnInit {

    title = null;
    message = 'Success !!!';
    icon = 'done_all';
    faIcon = null;
    type = 'info';
    image = null;

    constructor(public snackBar: MatSnackBar,
        @Inject(MAT_SNACK_BAR_DATA) public data: Alert) {
        if (data && data.type) {
            data = this.appendIcon(data);
            data.type = data.type.toLowerCase();
            this.type = (data.type) ? data.type : this.type;
            this.title = (data.title) ? data.title : this.type;
            this.message = (data.message) ? data.message : this.message;
            this.image = (data.image) ? data.image : this.image;
            this.faIcon = (data.faIcon) ? data.faIcon : this.faIcon;
            this.image = (data.image) ? data.image : this.image;
        }
    }

    ngOnInit() {
    }

    // Dismiss the notification
    dismiss() {
        this.snackBar.dismiss();
    }

    appendIcon(data: Alert) {
        data.faIcon = null;
        switch (data.type.toLowerCase()) {
            case "success":
                data.icon = 'mat_outline:thumb_up';
                break;
            case "info":
                data.icon = 'mat_outline:notification_important';
                break;
            case "warn":
                data.icon = 'mat_outline:warning';
                break;
            case "warning":
                data.icon = 'mat_outline:warning';
                break;
            case "danger":
                data.icon = 'mat_outline:error';
                break;
            case "newmessage":
                data.icon = 'mat_outline:email';
                break;
            case "anewfeed": case "newfeed":
                data.icon = 'mat_outline:email';
                break;
            case "removefeed":
                data.icon = 'mat_outline:email';
                break;
            case "ticketassigned":
            case "ticketreassigned":
                data.icon = 'mat_outline:archive';
                break;
            case "aticketassigned":
            case "aticketreassigned":
                data.icon = 'mat_outline:archive';
                break;
            case "ticketabandon":
                data.icon = 'mat_outline:access_alarm';
                break;
            case "ticketremoved":
                data.icon = 'mat_outline:report_off';
                break;
            case "aticketremoved":
                data.icon = 'mat_outline:report_off';
                break;
            case "ticketclosed":
                data.icon = 'mat_outline:done_outline';
                break;
            default:
                data.icon = 'mat_outline:done_all';
                break;
        }
        return data;
    }
}
