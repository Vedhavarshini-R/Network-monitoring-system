import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { NetworkSignalService } from '../network-signal.service';

import {
  Chart,
  ChartConfiguration,
  ChartType,
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

/* REGISTER CHARTS */
Chart.register(
  PieController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

/* ✅ FIX: Define allowed network types */
type NetworkType = '1G' | '2G' | '3G' | '4G' | '5G';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {

  networkReports: any[] = [];

  pieChartType: ChartType = 'pie';
  barChartType: ChartType = 'bar';

  // PIE CHART (INITIAL)
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Strong', 'Moderate', 'Weak'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#16a34a', '#f59e0b', '#dc2626']
      }
    ]
  };

  // BAR CHART (INITIAL)
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['1G', '2G', '3G', '4G', '5G'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        label: 'Network Speed',
        backgroundColor: '#2563eb'
      }
    ]
  };

  constructor(private service: NetworkSignalService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.service.getAll().subscribe({
      next: (res: any) => {

        this.networkReports = res;

        // =========================
        // PIE CHART (DYNAMIC)
        // =========================
        const strong = res.filter((x: any) => x.signalStrength === 'Strong').length;
        const moderate = res.filter((x: any) => x.signalStrength === 'Moderate').length;
        const weak = res.filter((x: any) => x.signalStrength === 'Weak').length;

        this.pieChartData = {
          labels: ['Strong', 'Moderate', 'Weak'],
          datasets: [
            {
              data: [strong, moderate, weak],
              backgroundColor: ['#16a34a', '#f59e0b', '#dc2626']
            }
          ]
        };

        // =========================
        // BAR CHART (DYNAMIC)
        // =========================
        const speeds: Record<NetworkType, number> = {
          '1G': 0,
          '2G': 0,
          '3G': 0,
          '4G': 0,
          '5G': 0
        };

        res.forEach((item: any) => {
          const type = item.networkType as NetworkType;

          if (speeds[type] !== undefined) {
            speeds[type] += Number(item.downloadSpeed || 0);
          }
        });

        this.barChartData = {
          labels: ['1G', '2G', '3G', '4G', '5G'],
          datasets: [
            {
              data: [
                speeds['1G'],
                speeds['2G'],
                speeds['3G'],
                speeds['4G'],
                speeds['5G']
              ],
              label: 'Network Speed',
              backgroundColor: '#2563eb'
            }
          ]
        };
      },

      error: (err) => {
        console.log(err);
      }
    });
  }
}