// src/app/components/chatbot/chatbot.component.ts
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WatsonService } from '../services/watson.service';

interface ChatMessage {
    from: 'user' | 'bot';
    text?: string;
    options?: { label: string, value: { input: { text: string } } }[];
}

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
    messages: ChatMessage[] = [];
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

        try {
            // Enviar a Watson
            const response = await this.watsonService.sendMessage(textToSend);

            // Procesar respuestas genéricas
            if (response.output && response.output.generic && response.output.generic.length > 0) {
                response.output.generic.forEach((g: any) => {
                    if (g.response_type === 'text') {
                        this.messages.push({ from: 'bot', text: g.text });
                    } else if (g.response_type === 'option') {
                        this.messages.push({
                            from: 'bot',
                            text: g.title || 'Por favor selecciona una opción:', // A veces viene title
                            options: g.options
                        });
                    }
                });
            } else {
                this.messages.push({ from: 'bot', text: 'No entendí tu mensaje o no hubo respuesta.' });
            }

        } catch (error) {
            console.error(error);
            this.messages.push({ from: 'bot', text: 'Ocurrió un error al comunicar con el asistente.' });
        }
    }

    handleOptionClick(optionValue: string) {
        this.userMessage = optionValue;
        this.sendMessage();
    }
}
