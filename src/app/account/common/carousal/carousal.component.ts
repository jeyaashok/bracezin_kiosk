import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'auth-common-carousal',
    templateUrl: './carousal.component.html',
    styleUrls: ['./carousal.component.scss'],
    standalone: false
})

export class CarousalComponent implements OnInit {
  
  // Carousel navigation arrow show
  showNavigationArrows: any;
  
  constructor() { }

  ngOnInit() { }

  get quotes(): string[] {
    return [
      "Built for Visibility. Designed for Growth.",
      "Smarter Reach. Stronger Brands.",
      "Digital Visibility That Drives Business.",
      "Right Message. Right Place. Right Time.",
      "Smart Advertising. Real Impact.",
      "Your Brand. Their Attention.",
      "Reach More People. Create More Impact.",
      "Powering the Future of Digital Kiosk Advertising.",
      "One Platform. Thousands of Screens. Endless Possibilities."
    ];
  }

}
