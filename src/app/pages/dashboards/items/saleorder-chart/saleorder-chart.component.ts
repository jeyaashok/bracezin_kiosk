import { Component, OnInit, effect, computed, signal, Input, OnChanges } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartType } from '../../dashboard/dashboard.model';

import { Dashboard } from 'src/@bracezin/_dbShare';

@Component({
  selector: 'app-dashboard-saleorder-chart',
  templateUrl: './saleorder-chart.component.html',
  styleUrls: ['./saleorder-chart.component.scss'],
  standalone: false
})
@UntilDestroy()

export class SaleorderChartComponent implements OnInit, OnChanges {

  @Input() dashboard: Dashboard;

  saleorderChart!: ChartType;
  colors: String[] = ['#008FFB','#00E396','#FEB019','#FF4560','#775DD0','#3F51B5','#546E7A','#D4526E','#8D5B4C','#F86624','#D7263D','#1B998B','#2E294E','#F46036','#E2C044'];

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
    if (this.dashboard && this.dashboard.saleOrderData) {
      this._buildSaleorderChart(this.dashboard.saleOrderData);
    }
  }

  private _buildSaleorderChart(data: any) {
    const categories = data?.categories;
    const series = data?.series;
    const colors = this.colors;

    this.saleorderChart = {
      chart: { height: 280, type: 'line', toolbar: { autoSelected: 'pan', show: false } },
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
    this.saleorderChart = {
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