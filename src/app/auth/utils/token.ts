import jwt from 'jsonwebtoken';

interface UserTokenPayload {
    id: string;
}

export function createUserToken(payload: UserTokenPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1d'
    })
}

export function verifyUserToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as UserTokenPayload;
    } catch (error) {
        console.log(error);
    }
}