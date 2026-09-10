import { Component, OnInit, effect, computed, signal, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Dashboard } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-dashboard-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss'],
  standalone: false
})
@UntilDestroy()

export class RecentActivitiesComponent implements OnInit {

  @Input() dashboard: Dashboard;
  @Input() recentActivities: any;

  constructor() { }

  ngOnInit(): void { }

}