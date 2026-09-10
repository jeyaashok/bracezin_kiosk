import { Component, OnInit, effect, computed, signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { formatDate } from '@angular/common';

import { DashboardService, Dashboard, UserService, User } from 'src/@bracezin/_dbShare';
import { format } from 'echarts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
@UntilDestroy()

export class DashboardComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  
  dashboard!: Dashboard;
  authUser!: User;

  dateRangeOptions: Array<{ key: 'today' | 'thisweek' | 'thismonth' | 'thisyear' | 'custom'; label: string }> = [
    { key: 'today', label: 'Today' },
    { key: 'thisweek', label: 'This Week' },
    { key: 'thismonth', label: 'This Month' },
    { key: 'thisyear', label: 'This Year' },
    { key: 'custom', label: 'Custom' }
  ];
  selectedDateRange: string = 'This Month';
  customDateRange!: any;
  customStartDate: string = '';
  customEndDate: string = '';

  constructor(public dashboardService: DashboardService,
    public userService: UserService) {
    this.dataInit();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Dashboard', active: true }
    ];

    this.getData();
  }

  dataInit() {
    effect(() => { this.dashboard = this.dashboardService.dashboard(); });
    this.userService.user.subscribe(data => {
      this.authUser = data;
    });
  }

  getData(param: any = {}) {
    this.dashboardService.getItemByUrl('dashboard', param);
  }

  get welcomeText(): string {
    let output: string = 'Welcome Buddy !';
    if(this.authUser && this.authUser.name) {
      output = 'Welcome ' + this.authUser.name + ' !';
    }
    
    return output;
  }

  get greetingText(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    }

    if (hour >= 12 && hour < 14) {
      return 'Good Noon';
    }

    if (hour >= 14 && hour < 18) {
      return 'Good Afternoon';
    }

    return 'Good Evening';
  }

  get today(): Date {
    return new Date();
  }

  setDateRange(range: string): void {
    this.selectedDateRange = range;
    if(range && range !== 'Custom') {
      let param: any = {};
      switch (range) {
        case 'To Day':
          param = {date_type : 'thisDay'};
          break;
        case 'This Week':
          param = {date_type : 'thisWeek'};
          break;
        case 'This Month':
          param = {date_type : 'thisMonth'};
          break;
        case 'This Year':
          param = {date_type : 'thisYear'};
          break;
        default:
          break;
      }
      this.getData(param);
    }
  }

  onCustomDateRangeChange(event: any) {
    let fromDate: string = (event && event.from) ? formatDate(event.from, 'yyyy-MM-dd', 'en-US') : null;
    let toDate: string = (event && event.to) ? formatDate(event.to, 'yyyy-MM-dd', 'en-US') : null;
    if(fromDate && toDate) {
      let param : any = {
        date_type : 'custom',
        from_date : fromDate,
        to_date : toDate
      };
      this.getData(param);
    }
  }

}