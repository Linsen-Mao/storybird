import { genSalt, hash, compare } from 'bcrypt';

export const encryptPswd = async (password: string): Promise<string> => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
}

export const comparePswd = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await compare(password, hashedPassword);
}

