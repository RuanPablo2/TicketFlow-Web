import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    MatListModule,
    MatProgressBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private ticketService = inject(TicketService);

  stats: any = null;
  topAgents: any[] = [];
  isLoading = true;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Open', 'In Progress', 'Waiting Customer', 'Resolved'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#2196f3', '#ff9800', '#3f51b5', '#4caf50'],
        hoverBackgroundColor: ['#1976d2', '#f57c00', '#303f9f', '#388e3c'],
        borderColor: '#ffffff',
        borderWidth: 3,
      },
    ],
  };

  public pieChartType: ChartType = 'pie';

  ngOnInit(): void {
    this.loadStats();
    this.loadAgentStats();
  }

  loadStats() {
    this.ticketService.getStats().subscribe({
      next: (data) => {
        this.stats = data;

        this.pieChartData = {
          labels: this.pieChartData.labels,
          datasets: [
            {
              ...this.pieChartData.datasets[0],
              data: [data.open, data.inProgress, data.waiting, data.resolved],
            },
          ],
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.isLoading = false;
      },
    });
  }

  loadAgentStats() {
    this.ticketService.getAgentStats().subscribe({
      next: (data) => {
        this.topAgents = data;
      },
      error: (err) => {
        console.error('Error loading agent stats', err);
      },
    });
  }
}
