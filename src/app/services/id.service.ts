import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { IdModel } from '../../models/id.model';

@Injectable({
    providedIn: 'root'
})
export class IdService {
    private coreToken: string = ''; // Will be loaded from Rust backend

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