import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-grid-card',
  templateUrl: './stat-grid-card.component.html',
  styleUrl: './stat-grid-card.component.scss',
  standalone: false
})
export class StatGridCardComponent {
  @Input() icon: string = 'ri-calendar-line';
  @Input() label: string;
}