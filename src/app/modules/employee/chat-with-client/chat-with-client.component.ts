import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-with-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-with-client.component.html',
  styleUrl: './chat-with-client.component.css',
})
export class ChatWithClientComponent {

  message: string = '';

  sendMessage() {
    if (this.message.trim()) {
      console.log('Sending:', this.message);
      // Implement send logic here...
      this.message = ''; // Clear input after sending
    }
  }
}
