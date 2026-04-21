import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { TicketCreateComponent } from '../ticket-create/ticket-create.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatCardModule, 
    MatIconModule, MatButtonModule, MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'title', 'category', 'priority', 'status', 'actions'];
  dataSource: any[] = [];
  isLoading = true;
  userRole: string | null = '';

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.dataSource = response.content ? response.content : response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error retrieving tickets:', err);
        this.isLoading = false;
      }
    });
  }

  loadMyQueue() {
    this.isLoading = true;
    this.ticketService.getMyQueue().subscribe({
      next: (response) => {
        this.dataSource = response.content ? response.content : response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching for support queue:', err);
        this.isLoading = false;
      }
    });
  }

  onTabChange(event: any) {
    if (event.index === 0) {
      this.loadTickets();
    } else {
      this.loadMyQueue();
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(TicketCreateComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.loadTickets();
      }
    });
  }
}