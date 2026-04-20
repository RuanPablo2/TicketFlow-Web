import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, 
    MatChipsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatDividerModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);

  ticketId: string | null = null;
  ticketData: any = null;
  isLoading = true;

  ngOnInit(): void {
    this.ticketId = this.route.snapshot.paramMap.get('id');

    if (this.ticketId) {
      this.loadTicketDetails(this.ticketId);
    }
  }

  loadTicketDetails(id: string) {
    this.ticketService.getTicketById(id).subscribe({
      next: (res) => {
        this.ticketData = res;
        this.isLoading = false;
        console.log('✅ Ticket loaded:', this.ticketData);
      },
      error: (err) => {
        console.error('❌ Error when searching ticket', err);
        this.isLoading = false;
      }
    });
  }
}