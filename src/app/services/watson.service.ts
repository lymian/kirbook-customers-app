// src/app/services/watson.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WatsonService {

    private assistantId = 'a1f39170-209b-43b9-8a97-7cc09608c032';
    private version = '2023-06-01';
    private apiUrl = `https://api.au-syd.assistant.watson.cloud.ibm.com/v2`;

    // ⚠️ No guardes esto en frontend. Solo ejemplo.
    private apiKey = 'agmhE-f9w84T_uDjFUQlL_RDfm2XaUg-sUk5R379iFTc';

    private sessionId: string | null = null;

    constructor(private http: HttpClient) { }

    /** Crear sesión */
    async createSession(): Promise<string> {
        const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa(`apikey:${this.apiKey}`)
        });

        const url = `${this.apiUrl}/assistants/${this.assistantId}/sessions?version=${this.version}`;
        const response: any = await firstValueFrom(this.http.post(url, {}, { headers }));

        if (response && response.session_id) {
            this.sessionId = response.session_id;
            return this.sessionId as string;
        } else {
            throw new Error('No se pudo crear la sesión de Watson Assistant');
        }
    }

    /** Enviar mensaje */
    async sendMessage(text: string): Promise<any> {
        if (!this.sessionId) {
            await this.createSession();
        }

        const headers = new HttpHeaders({
            'Authorization': 'Basic ' + btoa(`apikey:${this.apiKey}`),
            'Content-Type': 'application/json'
        });

        const body = {
            input: {
                message_type: 'text',
                text: text
            },
            context: {
                global: {
                    system: {
                        timezone: 'America/Lima'
                    }
                }
            }
        };

        const url = `${this.apiUrl}/assistants/${this.assistantId}/sessions/${this.sessionId}/message?version=${this.version}`;
        return await firstValueFrom(this.http.post(url, body, { headers }));
    }
}
