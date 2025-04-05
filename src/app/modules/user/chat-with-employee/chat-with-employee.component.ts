import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-with-employee',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-employee.component.html',
  styleUrl: './chat-with-employee.component.css',
})
export class ChatWithEmployeeComponent {

  message: string = '';

  sendMessage() {
    if (this.message.trim()) {
      console.log('Sending:', this.message);
      // Implement send logic here...
      this.message = ''; // Clear input after sending
    }
  }
}
