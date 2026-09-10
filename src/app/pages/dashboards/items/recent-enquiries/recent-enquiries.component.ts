import { Component, OnInit, effect, computed, signal, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Dashboard } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-dashboard-recent-enquiries',
  templateUrl: './recent-enquiries.component.html',
  styleUrls: ['./recent-enquiries.component.scss'],
  standalone: false
})
@UntilDestroy()

/**
 * Soteco count Component
 */
export class RecentEnquiriesComponent implements OnInit {

  @Input() dashboard: Dashboard;

  constructor() { }

  ngOnInit(): void { }

}