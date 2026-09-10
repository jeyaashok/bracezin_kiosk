import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})

export class UtillService {

	constructor() { }

    getPanelColor(mode = null): string {
        let color: string = 'blue';
        if(mode) {
        	switch (mode) {
                case 'success':
                case 'create':
                    color = 'green';
                    break;
                case 'edit':
                case 'update':
                    color = 'amber';
                    break;
                case 'info':
                case 'show':
                    color = 'blue';
                    break;
                case 'delete':
                    color = 'red';
                    break;
                default:
                    color = 'blue';
                    break;
        	}
        }
        return color;
    }

}
