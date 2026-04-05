import type { Request, Response, NextFunction } from 'express';
import { verifyUserToken } from '../auth/utils/token.js';
import { readonly } from 'zod';

export function authMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization']
        if (!header) next();

        if (!header?.startsWith('Bearer')) {
            return res.status(400).json({ message: 'unauthorized' });
        }

        const token = header.split(' ')[1];
        if (!token) return res.status(400).json({ message: 'unauthorized user' });

        const user = verifyUserToken(token);
        if (!user) return res.status(400).json({ message: 'unauthorized user' });

        // @ts-ignore
        req.user = user;
        next();
    }
}

export function restrictToAuthenticated(req: Request, res: Response, next: NextFunction) {
    // @ts-ignore
    if (!req.user) return res.status(401).json({ message: 'unauthorized user' })
    return next();
}