import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { IdModel } from '../../models/id.model';

@Injectable({
    providedIn: 'root'
})
export class IdService {
    // Using a default core token for demonstration purposes
    // In production, this would be loaded from a Rust backend
    private coreToken: string = 'PDF_KEY_GENERATOR_TOKEN_2025'; 

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
}