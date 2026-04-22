import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private ticketService = inject(TicketService);

  stats: any = null;
  isLoading = true;

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Open', 'In Progress', 'Waiting Customer', 'Resolved'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#e3f2fd', '#fff3e0', '#e8eaf6', '#e8f5e9'],
        hoverBackgroundColor: ['#2196f3', '#ff9800', '#3f51b5', '#4caf50']
      }
    ]
  };

  public pieChartType: ChartType = 'pie';

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.ticketService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.pieChartData.datasets[0].data = [
          data.open,
          data.inProgress,
          data.waiting,
          data.resolved
        ];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.isLoading = false;
      }
    });
  }
}