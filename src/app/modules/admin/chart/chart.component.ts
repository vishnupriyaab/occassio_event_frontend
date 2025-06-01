import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { DashboardService, MonthlyRevenue } from '../../../core/services/admin/dashboardService/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements AfterViewInit, OnDestroy {
 @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  public chart!: Chart;
  private _subscription: Subscription = new Subscription();
  private _dashboardService = inject(DashboardService)


  ngAfterViewInit(): void {
     setTimeout(() => {
      this.loadChartData();
    }, 100);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private loadChartData(): void {
    this._subscription.add(
      this._dashboardService.getMonthlyRevenue().subscribe({
        next: (response) => {
          console.log('Chart data response:', response); 
          if (response.success && response.data) {
            this.createChart(response.data);
          } else {
            this.createDefaultChart();
          }
        },
        error: (error) => {
          console.error('Error loading chart data:', error);
          this.createDefaultChart();
        }
      })
    );
  }

private createChart(monthlyData: MonthlyRevenue[]): void {
  if (this.chart) {
      this.chart.destroy();
    }
    const allMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const chartData = allMonths.map(month => {
      const found = monthlyData.find(item => item.month === month);
      return found ? found.revenue : 0;
    });

    const data = {
      labels: allMonths,
      datasets: [
        {
          label: 'Monthly Revenue',
          data: chartData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
          tension: 0.4,
          fill: false
        },
      ]
    };

    const config: ChartConfiguration = {
      type: 'line', 
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Revenue Chart',
            font: {
              size: 16
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (₹)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              callback: function(value: any) {
                const numValue = Number(value);
                if (numValue >= 10000000) { // 1 crore and above
                  return '₹' + (numValue / 10000000).toFixed(1) + ' Cr';
                } else if (numValue >= 100000) { // 1 lakh and above
                  return '₹' + (numValue / 100000).toFixed(1) + ' L';
                } else if (numValue >= 1000) { // 1 thousand and above
                  return '₹' + (numValue / 1000).toFixed(1) + 'K';
                } else {
                  return '₹' + numValue.toLocaleString();
                }
              },
              maxTicksLimit: 8 
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      },
    };
    
    try {
      this.chart = new Chart(this.chartCanvas.nativeElement, config);
      console.log('Chart created successfully'); // Debug log
    } catch (error) {
      console.error('Error creating chart:', error);
      this.createDefaultChart();
    }
  }

  private createDefaultChart(): void {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Monthly Revenue',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: 'rgba(201, 203, 207, 0.5)',
          borderColor: 'rgb(201, 203, 207)',
          borderWidth: 2,
          tension: 0.4,
          fill: false
        },
      ]
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Revenue Chart (No Data)',
            font: {
              size: 16
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
              font: {
                size: 14,
                weight: 'bold'
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue (₹)',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              callback: function(value: any) {
                return '₹' + Number(value).toLocaleString();
              },
              stepSize: 100000, // Show increments of 1 lakh when no data
              // max: 500000 // Set a reasonable max for empty chart
            }
          }
        }
      },
    };
    
    try {
      this.chart = new Chart(this.chartCanvas.nativeElement, config);
      console.log('Default chart created'); // Debug log
    } catch (error) {
      console.error('Error creating default chart:', error);
    }
  }

}
