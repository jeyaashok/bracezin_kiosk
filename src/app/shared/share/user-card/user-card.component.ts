import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'share-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    standalone: false
})

/**
 * User Card Component
 */
export class UserCardComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit(): void { }
}
