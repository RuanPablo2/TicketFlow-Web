import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { TicketCreateComponent } from '../ticket-create/ticket-create.component';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatCardModule, MatIconModule, 
    MatButtonModule, MatChipsModule, MatTabsModule, 
    MatSlideToggleModule, MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['id', 'title', 'client', 'category', 'priority', 'status', 'createdAt', 'actions'];
  
  rawTickets: any[] = [];
  dataSource: any[] = [];
  
  isLoading = true;
  userRole: string | null = '';
  showResolved = false;

  filterCategory: string = '';
  filterPriority: string = '';

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.rawTickets = response.content ? response.content : response;
        this.applyFiltersAndSorting();
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
        this.rawTickets = response.content ? response.content : response;
        this.applyFiltersAndSorting();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching for support queue:', err);
        this.isLoading = false;
      }
    });
  }

  applyFiltersAndSorting() {
    let processed = [...this.rawTickets];

    if (!this.showResolved) {
      processed = processed.filter(t => t.status !== 'RESOLVED');
    }

    if (this.filterCategory) {
      processed = processed.filter(t => t.category === this.filterCategory);
    }

    if (this.filterPriority) {
      processed = processed.filter(t => t.priority === this.filterPriority);
    }

    processed.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      if (this.userRole === 'CLIENT') {
        return dateB - dateA; 
      } else {
        return dateA - dateB; 
      }
    });

    this.dataSource = processed;
  }

  onFilterChange() {
    this.applyFiltersAndSorting();
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