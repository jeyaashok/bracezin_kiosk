import { Component, OnInit, effect, computed, signal, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Dashboard } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-dashboard-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss'],
  standalone: false
})
@UntilDestroy()

/**
 * Soteco count Component
 */
export class CountComponent implements OnInit {

  @Input() dashboard: Dashboard;

  constructor() { }

  ngOnInit(): void { }

}