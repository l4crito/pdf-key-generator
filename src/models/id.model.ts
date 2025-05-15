export interface IdModel {
    machineId: string;
    timestamp: number;
    value: number;
    type: IdType
    description?: string;
}

export enum IdType {
    ADD = 'ADD',
    CHANGE_CERTIFICATE = 'CHANGE_CERTIFICATE',
}