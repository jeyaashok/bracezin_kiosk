import { Component, OnInit, effect, computed, signal, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Dashboard } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-dashboard-recent-request-for-quotation',
  templateUrl: './recent-request-for-quotation.component.html',
  styleUrls: ['./recent-request-for-quotation.component.scss'],
  standalone: false
})
@UntilDestroy()

/**
 * Soteco count Component
 */
export class RecentRequestForQuotationComponent implements OnInit {

  @Input() dashboard: Dashboard;

  constructor() { }

  ngOnInit(): void { }

}