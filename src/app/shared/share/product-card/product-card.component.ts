import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/@bracezin/_dbShare';

@Component({
    selector: 'share-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    standalone: false
})

/**
 * Product Card Component
 */
export class ProductCardComponent implements OnInit {

	@Input() viewMode: string = 'grid';
  @Input() product: Product;
	
  constructor() { }

  ngOnInit(): void { }
}
