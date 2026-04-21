import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/tickets`;

  getTickets(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createTicket(ticketData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticketData);
  }

  getTicketById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMessages(ticketId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${ticketId}/messages`);
  }

  sendMessage(ticketId: string, content: string, internalNote: boolean): Observable<any> {
    const payload = { content, internalNote };
    return this.http.post<any>(`${this.apiUrl}/${ticketId}/messages`, payload);
  }

  assignTicket(ticketId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/assign`, {});
  }

  updateTicketStatus(ticketId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/status?status=${status}`, {});
  }

  updateTicketPriority(ticketId: string, priority: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/priority?priority=${priority}`, {});
  }

  getMyQueue(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-queue?page=${page}&size=${size}`);
  }

  resumeTicket(ticketId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}/resume`, {});
  }
}