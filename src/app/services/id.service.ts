import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { IdModel } from '../../models/id.model';

@Injectable({
    providedIn: 'root'
})
export class IdService {
    private readonly TOKEN_KEY = 'pdf_key_generator_token';
    private readonly DEFAULT_TOKEN = 'PDF_KEY_GENERATOR_TOKEN_2025';
    private coreToken: string;

    constructor() {
        // Intenta cargar el token desde localStorage al inicializar el servicio
        this.coreToken = this.getTokenFromStorage() || this.DEFAULT_TOKEN;
    }

    encryptData(data: IdModel, machineId: string): string {
        try {
            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(data),
                this.getKey(machineId)
            ).toString();

            return encryptedData;
        } catch (error) {
            console.error('Encryption failed:', error);
            throw error;
        }
    }

    public getKey(machineId: string): string {
        const machineIdHash = CryptoJS.SHA256(machineId).toString();
        return this.coreToken + machineIdHash.substring(0, 16);
    }

    public hasToken(): boolean {
        return !!this.getTokenFromStorage();
    }

    public saveToken(token: string): void {
        if (!token || token.trim() === '') {
            throw new Error('El token no puede estar vacío');
        }
        localStorage.setItem(this.TOKEN_KEY, token);
        this.coreToken = token;
    }

    public getTokenFromStorage(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
}