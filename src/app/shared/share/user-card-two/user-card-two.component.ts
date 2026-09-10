import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'share-user-card-two',
    templateUrl: './user-card-two.component.html',
    styleUrls: ['./user-card-two.component.scss'],
    standalone: false
})

/**
 * User Card Two Component
 */
export class UserCardTwoComponent implements OnInit {

  @Input() user: User;
	@Output() onView: EventEmitter<any> = new EventEmitter<any>();
	@Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
	@Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
	
  constructor() { }

  ngOnInit(): void { }
}
