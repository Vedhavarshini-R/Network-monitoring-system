import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkSignalService } from '../network-signal.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  // COUNTS (UNCHANGED LOGIC)
  totalReports = 0;
  strongNetworks = 0;
  moderateNetworks = 0;
  weakNetworks = 0;

  // TABLE DATA
  networkReports: any[] = [];

  // ✅ CHANGED: NOW DYNAMIC
  signalAnalysis: string[] = [];

  constructor(private service: NetworkSignalService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.service.getAll().subscribe({
      next: (res: any) => {

        this.networkReports = res;

        // TOTAL
        this.totalReports = res.length;

        // STRONG
        this.strongNetworks = res.filter(
          (x: any) => x.signalStrength === 'Strong'
        ).length;

        // MODERATE
        this.moderateNetworks = res.filter(
          (x: any) => x.signalStrength === 'Moderate'
        ).length;

        // WEAK
        this.weakNetworks = res.filter(
          (x: any) => x.signalStrength === 'Weak'
        ).length;

        // ✅ NEW: GENERATE DYNAMIC ANALYSIS
        this.generateSignalAnalysis(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // =========================
  // ✅ DYNAMIC ANALYSIS (NEW ONLY)
  // =========================
  generateSignalAnalysis(data: any[]): void {

    this.signalAnalysis = [];

    const strong = data.filter(x => x.signalStrength === 'Strong').length;
    const moderate = data.filter(x => x.signalStrength === 'Moderate').length;
    const weak = data.filter(x => x.signalStrength === 'Weak').length;
    const total = data.length;

    if (strong > moderate && strong > weak) {
      this.signalAnalysis.push('Strong networks are performing best in the system.');
    }

    if (weak > 0) {
      this.signalAnalysis.push('Weak signals detected in some regions, optimization needed.');
    }

    if (moderate > 0) {
      this.signalAnalysis.push('Moderate network performance is stable but improvable.');
    }

    if (strong / total > 0.5) {
      this.signalAnalysis.push('More than 50% of networks are strong.');
    } else {
      this.signalAnalysis.push('Less than half of networks are strong.');
    }

    this.signalAnalysis.push('System is continuously analyzing real-time network data.');
  }

  // =========================
  // EXCEL EXPORT (UNCHANGED)
  // =========================
  exportExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.networkReports);

    const workbook = {
      Sheets: { 'Network Report': worksheet },
      SheetNames: ['Network Report']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });

    saveAs(blob, 'Network_Report.xlsx');
  }

  // =========================
  // PDF EXPORT (UNCHANGED)
  // =========================
  exportPDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Network Performance Report', 14, 10);

    const tableData = this.networkReports.map(item => [
      item.networkType,
      item.downloadSpeed,
      item.uploadSpeed,
      item.signalStrength
    ]);

    autoTable(doc, {
      head: [['Network', 'Download Speed', 'Upload Speed', 'Signal Status']],
      body: tableData,
      startY: 20
    });

    doc.save('Network_Report.pdf');
  }
}