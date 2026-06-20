import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NetworkSignalService } from '../network-signal.service';

// EXCEL
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

// PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {

  // SIDEBAR DATA
  totalNetworks = 125;

  strongSignals = 82;

  moderateSignals = 28;

  weakSignals = 15;

  analysisData = [

    '5G Usage Increased by 25%',

    'Strong Signals Detected Frequently',

    'High Download Speed Recorded',

    'Moderate Networks Reduced'

  ];

  notifications = [

    'Weak Signal Alert',

    'Database Connected',

    'New Network Added',

    'Connection Stable'

  ];

  activities = [

    {
      time: '10:30 AM',
      activity: '5G Network Added',
      status: 'Success'
    },

    {
      time: '10:45 AM',
      activity: 'Weak Signal Detected',
      status: 'Warning'
    },

    {
      time: '11:00 AM',
      activity: 'Export PDF Generated',
      status: 'Completed'
    },

    {
      time: '11:15 AM',
      activity: 'Database Connected',
      status: 'Active'
    }

  ];

  // CRUD DATA
  data: any[] = [];

  searchText: string = '';

  form: any = {

    networkType: '',

    location: '',

    signalStrength: '',

    downloadSpeed: null,

    uploadSpeed: null

  };

  isEditMode = false;

  editId: number | null = null;

  constructor(private service: NetworkSignalService) {}

  ngOnInit() {

    this.loadData();

  }

  // LOAD DATA
loadData() {

  this.service.getAll().subscribe({

    next: (res: any) => {

      this.data = res;

      // DYNAMIC DASHBOARD COUNTS

      this.totalNetworks = this.data.length;

      this.strongSignals =
        this.data.filter(
          x => x.signalStrength === 'Strong'
        ).length;

      this.moderateSignals =
        this.data.filter(
          x => x.signalStrength === 'Moderate'
        ).length;

      this.weakSignals =
        this.data.filter(
          x => x.signalStrength === 'Weak'
        ).length;

    },

    error: (err) => {

      console.log(err);

    }

  });

}

  // SIGNAL
  autoGenerateSignal() {

    const total =
      Number(this.form.downloadSpeed) +
      Number(this.form.uploadSpeed);

    if (total >= 150) {

      this.form.signalStrength = 'Strong';

    }

    else if (total >= 70) {

      this.form.signalStrength = 'Moderate';

    }

    else {

      this.form.signalStrength = 'Weak';

    }
  }

  // LOCATION
  getCurrentLocation() {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const latitude = position.coords.latitude;

          const longitude = position.coords.longitude;

          const url =
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en&lat=${latitude}&lon=${longitude}`;

          try {

            const response = await fetch(url);

            const data = await response.json();

            const address = data.address;

            this.form.location =

               address.suburb ||

               address.neighbourhood ||

                address.city_district ||

                address.city ||

                address.town ||

                    'Unknown Location';
          }

          catch (error) {

            alert('Location error');

          }

        }

      );

    }

  }

  // ADD
  addSignal() {

    const payload = {

      networkType: this.form.networkType,

      location: this.form.location,

      signalStrength: this.form.signalStrength,

      downloadSpeed: Number(this.form.downloadSpeed),

      uploadSpeed: Number(this.form.uploadSpeed)

    };

    // UPDATE
    if (this.isEditMode && this.editId !== null) {

      this.service.update(this.editId, payload).subscribe({

        next: () => {

          this.loadData();

          this.resetForm();

        }

      });

    }

    // CREATE
    else {

      this.service.create(payload).subscribe({

        next: () => {

          this.loadData();

          this.resetForm();

        }

      });

    }

  }

  // EDIT
  editSignal(item: any) {

    this.isEditMode = true;

    this.editId = item.id;

    this.form = {

      networkType: item.networkType,

      location: item.location,

      signalStrength: item.signalStrength,

      downloadSpeed: item.downloadSpeed,

      uploadSpeed: item.uploadSpeed

    };

  }

  // DELETE
  deleteSignal(id: number) {

    this.service.delete(id).subscribe({

      next: () => {

        this.loadData();

      }

    });

  }

  // RESET
  resetForm() {

    this.form = {

      networkType: '',

      location: '',

      signalStrength: '',

      downloadSpeed: null,

      uploadSpeed: null

    };

    this.isEditMode = false;

    this.editId = null;

  }

  // FILTER
  getFilteredData() {

    if (!this.searchText) {

      return this.data;

    }

    return this.data.filter(x =>

      x.networkType?.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.location?.toLowerCase().includes(this.searchText.toLowerCase()) ||

      x.signalStrength?.toLowerCase().includes(this.searchText.toLowerCase())

    );

  }

  // STATUS
  getStatusClass(status: string) {

    if (status === 'Strong') {

      return 'strong';

    }

    if (status === 'Moderate') {

      return 'moderate';

    }

    if (status === 'Weak') {

      return 'weak';

    }

    return '';

  }

  // EXCEL
  exportToExcel() {

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(this.data);

    const workbook: XLSX.WorkBook = {

      Sheets: { 'Signals': worksheet },

      SheetNames: ['Signals']

    };

    const excelBuffer: any =
      XLSX.write(workbook, {

        bookType: 'xlsx',

        type: 'array'

      });

    const data: Blob = new Blob(

      [excelBuffer],

      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      }

    );

    FileSaver.saveAs(data, 'NetworkSignals.xlsx');

  }

  // PDF
  exportToPDF() {

    const doc = new jsPDF();

    autoTable(doc, {

      head: [[

        'ID',

        'Network',

        'Download',

        'Upload',

        'Location',

        'Signal'

      ]],

      body: this.data.map(item => [

        item.id,

        item.networkType,

        item.downloadSpeed,

        item.uploadSpeed,

        item.location,

        item.signalStrength

      ])

    });

    doc.save('NetworkSignals.pdf');

  }

}