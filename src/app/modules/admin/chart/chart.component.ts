import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements AfterViewInit {
 @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  public chart!: Chart;

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        },
        // {
        //   label: 'Dataset 2',
        //   data: [28, 48, 40, 19, 86, 27, 90],
        //   backgroundColor: 'rgba(54, 162, 235, 0.5)',
        //   borderColor: 'rgb(54, 162, 235)',
        //   borderWidth: 1
        // }
      ]
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

}
