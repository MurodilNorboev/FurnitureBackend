import { hash, genSalt, compare } from 'bcryptjs';

export class HashingHelper {
    static generatePassword = async (password) => {
        const salt = await genSalt(10)
        return hash(password, salt)
    }

    static comparePassword = async (password, hashPassword) => {
        return compare(password, hashPassword)
    }
}