import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'share-user-card-one',
    templateUrl: './user-card-one.component.html',
    styleUrls: ['./user-card-one.component.scss'],
    standalone: false
})

/**
 * User Card Component
 */
export class UserCardOneComponent implements OnInit {

	@Input() viewMode: string = 'grid';
  @Input() user: User;
	
  constructor() { }

  ngOnInit(): void { }
}
