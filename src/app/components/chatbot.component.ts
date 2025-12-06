// src/app/components/chatbot/chatbot.component.ts
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatsonService } from '../services/watson.service';

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {

    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    userMessage: string = '';
    messages: { from: 'user' | 'bot', text: string }[] = [];
    isOpen: boolean = false;

    constructor(private watsonService: WatsonService) { }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            // Scroll al abrir
            setTimeout(() => this.scrollToBottom(), 0);
        }
    }

    async sendMessage() {
        if (!this.userMessage.trim()) return;

        // Mostrar mensaje del usuario
        this.messages.push({ from: 'user', text: this.userMessage });

        const textToSend = this.userMessage;
        this.userMessage = '';

        // Enviar a Watson
        const response = await this.watsonService.sendMessage(textToSend);

        const botResponse =
            response.output?.generic?.[0]?.text || 'No entendí tu mensaje.';

        this.messages.push({ from: 'bot', text: botResponse });
    }
}
