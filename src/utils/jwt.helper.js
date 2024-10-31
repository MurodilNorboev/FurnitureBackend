import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

export class JwtHelper {
    static sign = async (id) => {
        return sign({id}, JWT_SECRET, {expiresIn: '1d'})
    };
    static verify = (token) => {
        return verify(token, JWT_SECRET);
    }
}