import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'share-user-card-four',
    templateUrl: './user-card-four.component.html',
    styleUrls: ['./user-card-four.component.scss'],
    standalone: false
})

/**
 * User Card Component
 */
export class UserCardFourComponent implements OnInit {

  @Input() user: User;
  @Input() title: string = '';
  
  constructor() { }

  ngOnInit(): void { }
}
