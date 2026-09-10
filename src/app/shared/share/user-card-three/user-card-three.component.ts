import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'share-user-card-three',
    templateUrl: './user-card-three.component.html',
    styleUrls: ['./user-card-three.component.scss'],
    standalone: false
})

/**
 * User Card Three Component
 */
export class UserCardThreeComponent implements OnInit {

  @Input() user: User;
	@Output() onView: EventEmitter<any> = new EventEmitter<any>();
	@Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
	@Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
	@Output() onChangePassword: EventEmitter<any> = new EventEmitter<any>();
	@Input() isActive: boolean = true;
	
  constructor() { }

  ngOnInit(): void { }
}
