import { Component, inject, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../../core/services/admin/dashboardService/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [ChartComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashboardStats: DashboardStats = {
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalEvents: 0,
  };

  isLoading = true;
  error: string | null = null;
  private _dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.error = null;

    this._dashboardService.getDashboardStats().subscribe({
      next: response => {
        console.log(response,"fghjkl")
        if (response.success && response.data) {
          this.dashboardStats = response.data;
        } else {
          this.error = 'Failed to load dashboard statistics';
        }
        this.isLoading = false;
      },
      error: error => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard statistics';
        this.isLoading = false;
      },
    });
  }
}
