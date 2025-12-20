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
                        this.messages.push({ from: 'bot', text: this.formatDatesInText(g.text) });
                    } else if (g.response_type === 'option') {
                        const title = g.title || 'Por favor selecciona una opción:';
                        this.messages.push({
                            from: 'bot',
                            text: this.formatDatesInText(title),
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

    private formatDatesInText(text: string): string {
        if (!text) return text;
        // Regex para buscar fechas tipo: "21 dic 2025"
        // \b(\d{1,2})\s+([a-zA-Z]{3})\.?\s+(\d{4})\b
        // Mapeo básico de meses abreviados (asumiendo que vienen en español o inglés similar)
        const monthMap: { [key: string]: string } = {
            'ene': 'enero', 'jan': 'enero',
            'feb': 'febrero',
            'mar': 'marzo',
            'abr': 'abril', 'apr': 'abril',
            'may': 'mayo',
            'jun': 'junio',
            'jul': 'julio',
            'ago': 'agosto', 'aug': 'agosto',
            'sep': 'septiembre', 'set': 'septiembre',
            'oct': 'octubre',
            'nov': 'noviembre',
            'dic': 'diciembre', 'dec': 'diciembre'
        };

        return text.replace(/\b(\d{1,2})\s+([a-zA-Z]{3})\.?\s+(\d{4})\b/gi, (match, day, monAbbrev, year) => {
            const lowerMon = monAbbrev.toLowerCase();
            const fullMonth = monthMap[lowerMon];

            if (fullMonth) {
                // Formato peruano/español completo: "21 de diciembre de 2025"
                return `${day} de ${fullMonth} de ${year}`;
            }
            return match; // Si no coincide el mes, devolver original
        });
    }
}
