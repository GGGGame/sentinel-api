import crypto from 'crypto';

export const GenApiKey = async (length: number): Promise<string> => {
    return crypto.randomBytes(length).toString('hex');
}