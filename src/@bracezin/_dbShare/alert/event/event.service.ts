import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { UserService, User } from 'src/@bracezin/_dbShare/user';
import { CommonService } from 'src/@bracezin/_dbShare/general/common.service';
import { Alert, AlertModel } from 'src/@bracezin/_dbShare/alert/alert';
import { AlertService } from 'src/@bracezin/_dbShare/alert/alert/alert.service';
import { AudioService } from '../audio.service';
import { NotifyService } from 'src/@bracezin/_dbShare/notify/notify.service';
import { ToastData } from 'src/@bracezin/_dbShare/alert/toast/toastData.interface';
import { ToastModel } from 'src/@bracezin/_dbShare/alert/toast/toast_model.model';

import { Title } from '@angular/platform-browser';

declare function notifyMe(title, message): any;

@Injectable({
    providedIn: 'root'
})
@UntilDestroy()

export class EventService {

    authUser: User = this.userService.authUser();
    authUserId: number;
    alertData: Alert;
    toastData: ToastData;
    notificationData = [];
    isNotification: boolean = false;
    isPrepremiumDashboard: boolean = false;
    private eventDataSource = new BehaviorSubject<any>(null);
    eventData = this.eventDataSource.asObservable();
    isOffline: any = false;


    private _unsubscribeAll: Subject<any>;

    constructor(private userService: UserService,
        private commonService: CommonService,
        private notifyService: NotifyService,
        private alertService: AlertService,
        private audioService: AudioService,
        private titleService: Title) {
        this.authUserId = (this.authUser && this.authUser.id) ? this.authUser.id : null;
        var user: any = JSON.parse(localStorage.getItem('tji_user'));
        if (user && user.isPrepremiumDashboard) {
            this.isPrepremiumDashboard = user.isPrepremiumDashboard ? user.isPrepremiumDashboard : false;
        }
        updateBrowserTap();
        this.longLive();
    }

    longLive() {
        this.isOffline = globalVar;
        if (!globalVar) {
            this.titleService.setTitle('Social Media Management CRM Software, CRM Tool – aioctopus.com');
        }
        setTimeout(() => {
            this.longLive();
        }, 5);
    }

    changeEventData(eventData: any) {
        this.eventDataSource.next(eventData);
        this.changeCount(eventData);
        this.showToast(eventData);
        if (this.isOffline && eventData && eventData?.event != 'logout' && eventData?.event != 'login') {
            this.showBrowserNotification(eventData);
        }
    }

    unSubscribe() {
        // console.log('UnSubscribed');
    }

    unSubscribeFilter() {
        // console.log('UnSubscribed Filters');
    }

    clearSubscribe() {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    } 

    showAlertData(data: ToastData) {
        let type: string = (data && data.type) ? data.type : 'info';
        this.alertService.websocketShow(type, data);
        this.audioService.playAudio();
    }

    showAlert(title: string, message: string, type: string = null, icon: string = null) {
        this.alertData = new AlertModel({});
        this.alertData.type = (type) ? type : 'info';
        this.alertData.title = title;
        this.alertData.message = message;
        this.alertData.faIcon = 'fa ' + (icon) ? icon : 'fa-exclamation-circle';
        this.alertData.icon = 'fa ' + (icon) ? icon : 'fa-exclamation-circle';
        this.alertService.websocketShow(type, this.alertData);
        this.audioService.playAudio();
    }

    showToast(eventData: any) {
        let eventName = (eventData && eventData?.event) ? eventData?.event : null;
        eventName = (eventData && eventData?.eventName) ? eventData?.eventName : eventName;
        if (eventName && (eventName === 'newmessage' || eventName === 'aNewmessage' || eventName === 'acNewmessage' || eventName === 'ticketReply' || eventName === 'newfeed' || eventName === 'aNewfeed' || eventName === 'removefeed' ||
            eventName === 'ticketassigned' || eventName === 'ticketreassigned' || eventName === 'aticketassigned' || eventName === 'aticketreassigned' || eventName === 'ticketabandon' ||
            eventName === 'aticketremoved' || eventName === 'ticketremoved' || eventName === 'ticketclosed' || eventName === 'aclosedticketremoved'
            || eventName === 'aQueueticket' || eventName === 'aticketclosed')) {

            if (eventName === 'ticketReply') {
                if (eventData.notification) {
                    this.toastData = new ToastModel({});
                    this.toastData.type = eventData.event;
                    this.toastData.title = eventData.notification.heading;
                    this.toastData.message = eventData.notification.text;
                    this.toastData.icon = eventData.notification.icon;
                    this.toastData.faIcon = 'fa ' + (eventData.notification.icon) ? eventData.notification.icon : 'fa-exclamation-circle' //eventData.faIcon;
                    this.toastData.site = eventData.notification.site;
                    this.toastData.category = this.getCategory(eventData);
                    // this.toastData.image = (eventData.notification.image) ? eventData.notification.image : eventData.notification.data.peopleAvatar;
                }
            } else {

                this.toastData = new ToastModel({});
                this.toastData.type = eventData.event;
                this.toastData.title = eventData.heading;
                this.toastData.message = eventData.text;
                this.toastData.icon = eventData.icon;
                this.toastData.faIcon = 'fa ' + (eventData.icon) ? eventData.icon : 'fa-exclamation-circle' //eventData.faIcon;
                this.toastData.site = eventData.site;
                this.toastData.category = this.getCategory(eventData);
                this.toastData.image = (eventData.image) ? eventData.image : eventData.data.peopleAvatar;

            }
            let isAdmin: boolean = this.userService.isAuthUserIsAdmin();
            let isStaff: boolean = this.userService.isAuthUserIsStaff();
            
        }

    }

    showBrowserNotification(eventData: any) {
        let eventName = (eventData && eventData?.event) ? eventData?.event : null;
        eventName = (eventData && eventData?.eventName) ? eventData?.eventName : eventName;
        if (eventName) {

        }

    }

    showAlertByData(eventData: any) {
        let eventName = (eventData && eventData?.event) ? eventData?.event : null;
        eventName = (eventData && eventData?.eventName) ? eventData?.eventName : eventName;
        if (eventName && (eventName === 'newmessage' || eventName === 'aNewmessage' || eventName === 'acNewmessage' || eventName === 'ticketReply' || eventName === 'newfeed' || eventName === 'aNewfeed' || eventName === 'removefeed' ||
            eventName === 'aticketassigned' || eventName === 'aticketreassigned' || eventName === 'ticketassigned' || eventName === 'ticketreassigned' || eventName === 'ticketabandon' ||
            eventName === 'aticketremoved' || eventName === 'ticketremoved' || eventName === 'ticketclosed' || eventName === 'aclosedticketremoved')) {
            this.alertData = new AlertModel({});
            this.alertData.type = eventData.event;
            this.alertData.title = eventData.heading;
            this.alertData.message = eventData.text;
            this.alertData.faIcon = eventData.icon;
            this.alertData.image = (eventData.image) ? eventData.image : eventData.data.peopleAvatar;
            let isAdmin: boolean = this.userService.isAuthUserIsAdmin();
            let isStaff: boolean = this.userService.isAuthUserIsStaff();
            switch (eventData.event) {
                case "newmessage":
                    this.commonService.alert(this.alertData);
                    break;
                default:
                    break;
            }
        }
    }

    getCategory(eventData: any) {
        let data = eventData.data;
        if (eventData && eventData.event === 'newmessage' || eventData.event === 'aNewmessage' || eventData.event === 'acNewmessage' || eventData.event === 'ticketReply') {
            if (data && data.status) {
                return data.status;
            }
        }
        return null;
    }

    changeCount(eventData: any) {
        if (eventData && eventData.event) {
            let isAdmin: boolean = this.userService.isAuthUserIsAdmin();
            let isStaff: boolean = this.userService.isAuthUserIsStaff();
            let site = (eventData.site) ? eventData.site : null;
            if (site && eventData.event) {
                let data = eventData.data;
            }
        }
    }

    updateTicket(parent) {
        if (parent && parent.id && parent.table && parent.ticketId) {
            let ticket = null;
        }
    }

    updateTicketData(type: string, data: any) {
        let ticketData: any = JSON.parse(localStorage.getItem('tji_tickets')) || [];
        if (type === 'ticketclosed') {
            ticketData = ticketData.filter(ticket => {
                return !(ticket.id == data.id && ticket.client_site_id == data.client_site_id);
            });
        }
        else {
            const existingTicketIndex = ticketData.findIndex(ticket => ticket.id === data.id && ticket.client_site_id === data.client_site_id);
            if (existingTicketIndex === -1) {
                const newTicket = {
                    id: data.id,
                    client_site_id: data.client_site_id,
                    input: ''
                };
                ticketData.push(newTicket);
            } else {
                ticketData[existingTicketIndex] = {
                    ...ticketData[existingTicketIndex],
                    ...data
                };
            }
        }
        localStorage.setItem('tji_tickets', JSON.stringify(ticketData));
    }


}

function updateFavicon(src) {
    const favicon = document.getElementById('favicon');
    favicon.setAttribute('href', src);
}

var globalVar = false;
function updateBrowserTap() {
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            //do whatever you want
            globalVar = true;
            // updateFavicon('img/scrm/notification.png');
        }
        else {
            //do whatever you want
            globalVar = false;
            updateFavicon('img/scrm/favicon.ico');
        }
    },);
}

