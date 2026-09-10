import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Address } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'share-address-card',
    templateUrl: './address-card.component.html',
    styleUrls: ['./address-card.component.scss'],
    standalone: false
})

/**
 * Address Card Component
 */
export class AddressCardComponent implements OnInit {

	@Input() viewMode: string = 'one';
  @Input() address: Address;
	@Output() onEdit: EventEmitter<Address> = new EventEmitter<Address>();
	
  constructor() { }

  ngOnInit(): void { }
}
