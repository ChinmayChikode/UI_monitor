import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getTreeNoValidDataSourceError } from '@angular/cdk/tree';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const MESSAGES = [
  {
    img: 'assets/images/avatars/avatar-1.jpg',
    subject: 'Hydrogen',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/avatars/avatar-2.jpg',
    subject: 'Helium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/avatars/avatar-3.jpg',
    subject: 'Lithium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/avatars/avatar-4.jpg',
    subject: 'Beryllium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/avatars/avatar-6.jpg',
    subject: 'Boron',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
];

@Injectable()
export class DashboardService {
  stats = [
    {
      title: 'Total Sales',
      amount: '180,200',
      progress: {
        value: 50,
      },
      color: 'bg-indigo-500',
    },
    {
      title: 'Revenue',
      amount: '70,205',
      progress: {
        value: 70,
      },
      color: 'bg-blue-500',
    },
    {
      title: 'Traffic',
      amount: '1,291,922',
      progress: {
        value: 80,
      },
      color: 'bg-green-500',
    },
    {
      title: 'New User',
      amount: '1,922',
      progress: {
        value: 40,
      },
      color: 'bg-teal-500',
    },
  ];

  charts = [
    {
      chart: {
        height: 350,
        type: 'area',
        toolbar: false,
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'straight',
        width: 2,
      },
      series: [
        {
          name: 'Processed',
          data: [31, 40, 28, 51, 42, 109, 100, 44, 32, 25],
        },
        {
          name: 'Arrived',
          data: [25, 20, 22, 25, 33, 45, 41, 30, 11, 30],
        },
        {
          name: 'Pending',
          data: [5, 0, 12, 15, 13, 35, 21, 33, 12, 33]
        },
      ],
      xaxis: {
        title: {
          text: "Time"
        },
        categories: [
          '00:10',
          '00:11',
          '00:12',
          '00:13',
          '00:14',
          '00:15',
          '00:16',
          '00:17',
          '00:18',
          '00:19'
        ],
      },
      tooltip: {
        x: {
          format: 'HH:mm',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
    },
    {
      chart: {
        height: 335,
        type: 'radar',
      },
      series: [
        {
          name: 'Request Flows',
          data: [1000, 100, 10000],
        },
      ],
      labels: ['In the Last Day', 'In the Last Hour', 'Since Startup'],
      plotOptions: {
        radar: {
          size: 140,
          polygons: {
            strokeColor: '#e9e9e9',
            fill: {
              colors: ['#f8f8f8', '#fff'],
            },
          },
        },
      },
      colors: ['#FF4560'],
      markers: {
        size: 4,
        colors: ['#fff'],
        strokeColor: '#FF4560',
        strokeWidth: 2,
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return val;
          },
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (val: number, i: number) => {
            if (i % 2 === 0) {
              return val;
            } else {
              return '';
            }
          },
        },
      },
    },
    {
      series: [
        {
          name: "License",
          data: [44, 55, 41, 64, 22, 43, 21]
        },
        {
          name: "Workers",

          data: [53, 32, 33, 52, 13, 44, 32]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007]
      }
    },
    {
      series: [10, 3],
      chart: {
        height: 250,
        type: "pie"
      },
      labels: ["Running", "Stopped"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    },
  ];

  constructor(private http: HttpClient) {}

  getData() {
    //return ELEMENT_DATA;
  }

  getMessages() {
    //return MESSAGES;
  }

  getCharts() {
    return this.charts;
  }

  getStats() {
    //return this.stats;
  }
}
