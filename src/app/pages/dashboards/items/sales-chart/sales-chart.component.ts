import { Component, OnInit, effect, computed, signal, Input, OnChanges } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartType } from './../../dashboard/dashboard.model';

import { Dashboard } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-dashboard-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
  standalone: false
})
@UntilDestroy()

export class SalesChartComponent implements OnInit, OnChanges {

  @Input() dashboard: Dashboard;

  salesChart!: ChartType;
  colors: String[] = ['#0077b6', '#52b788', '#f9c74f', '#f94144', '#694fbc', '#1e2067', '#b55233', '#84f5e9'];

  constructor() {
    this.dataInit();
  }

  ngOnInit(): void {
    this._initChartShell();
  }

  ngOnChanges() {
    this.dataInit();
  }

  dataInit() {
    if (this.dashboard && this.dashboard.salesData) {
      this._buildSalesChart(this.dashboard.salesData);
    }
  }

  private _buildSalesChart(data: any) {
    const categories = data?.categories;
    const series = data?.series;
    const colors = this.colors;

    this.salesChart = {
      chart: { height: 280, type: 'area', toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2.5 },
      colors: colors,
      series: data?.series,
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 90, 100] }
      },
      markers: { size: 3, strokeWidth: 2, hover: { size: 5 } },
      xaxis: { categories: categories, axisTicks: { show: false }, axisBorder: { show: false } },
      yaxis: { labels: { formatter: (val: number) => '$' + val + 'K' } },
      grid: {
        show: true,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 0, right: 0, bottom: 0, left: 10 },
      },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: (val: number) => '$' + val + 'K' } }
    };
  }

  private _initChartShell() {
    this.salesChart = {
      chart: { height: 280, type: 'area', toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 2.5 },
      colors: this.colors,
      series: [{ name: 'Revenue', data: [] }],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [0, 90, 100] } },
      markers: { size: 3, strokeWidth: 2, hover: { size: 5 } },
      xaxis: { categories: [], axisTicks: { show: false }, axisBorder: { show: false } },
      yaxis: { labels: { formatter: (val: number) => '$' + val + 'K' } },
      grid: { show: true, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { top: 0, right: 0, bottom: 0, left: 10 } },
      dataLabels: { enabled: false },
      tooltip: { y: { formatter: (val: number) => '$' + val + 'K' } }
    };
  }

}