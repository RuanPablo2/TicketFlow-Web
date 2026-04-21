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
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../../../core/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, 
    MatChipsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    MatDividerModule, MatFormFieldModule, MatInputModule, FormsModule,
    MatSlideToggleModule, MatMenuModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss'
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  ticketId: string | null = null;
  ticketData: any = null;
  isLoading = true;

  messages: any[] = [];
  newMessage: string = '';
  isSending = false;
  
  userRole: string | null = '';
  isInternalNote = false;

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    
    this.ticketId = this.route.snapshot.paramMap.get('id');
    if (this.ticketId) {
      this.loadTicketDetails(this.ticketId);
      this.loadMessages(this.ticketId);
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

  loadMessages(id: string) {
    this.ticketService.getMessages(id).subscribe({
      next: (res) => this.messages = res,
      error: (err) => console.error('Error loading messages', err)
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.ticketId) return;

    this.isSending = true;
    
    this.ticketService.sendMessage(this.ticketId, this.newMessage, this.isInternalNote).subscribe({
      next: (res) => {
        this.messages.push(res); 
        this.newMessage = ''; 
        this.isInternalNote = false;
        this.isSending = false;
      },
      error: (err) => {
        console.error('Error sending message', err);
        this.isSending = false;
      }
    });
  }

  isMyMessage(msg: any): boolean {
    const senderRole = msg.sender?.role || msg.role; 

    if (this.userRole === 'CLIENT') {
      return senderRole === 'CLIENT';
    } else {
      return senderRole === 'ADMIN' || senderRole === 'SUPPORT';
    }
  }

  assignToMe() {
    if (!this.ticketId) return;
    
    this.ticketService.assignTicket(this.ticketId).subscribe({
      next: (updatedTicket) => {
        this.ticketData = updatedTicket;
      },
      error: (err) => console.error('Erro ao atribuir ticket', err)
    });
  }

  changeStatus(newStatus: string) {
    if (!this.ticketId) return;

    this.ticketService.updateTicketStatus(this.ticketId, newStatus).subscribe({
      next: (updatedTicket) => {
        this.ticketData = updatedTicket;
      },
      error: (err) => console.error('Erro ao mudar status', err)
    });
  }

  changePriority(newPriority: string) {
    if (!this.ticketId) return;

    this.ticketService.updateTicketPriority(this.ticketId, newPriority).subscribe({
      next: (updatedTicket) => {
        this.ticketData = updatedTicket;
        
        this.snackBar.open(`✅ Priority changed to ${newPriority}`, 'Close', { 
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error('Error changing priority', err);
        this.snackBar.open('❌ Error updating priority', 'Close', { duration: 3000 });
      }
    });
  }

  resumeTicket() {
    if (!this.ticketId) return;

    this.ticketService.resumeTicket(this.ticketId).subscribe({
      next: (updatedTicket) => {
        this.ticketData = updatedTicket;
        
        this.snackBar.open('✅ Request returned to support successfully!', 'Close', { 
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        console.error('Error resuming ticket', err);
        this.snackBar.open('❌ Error returning request', 'Close', { duration: 3000 });
      }
    });
  }
}