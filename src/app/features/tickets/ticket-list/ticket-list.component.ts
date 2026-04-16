import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);

  displayedColumns: string[] = ['id', 'title', 'category', 'priority', 'status', 'actions'];
  
  dataSource: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.dataSource = response.content ? response.content : response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar tickets:', err);
        this.isLoading = false;
      }
    });
  }
}