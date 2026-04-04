import type { Request, Response } from 'express';
import { signinPayloadModel, signupPayloadModel } from './models.js';
import { db } from '../../db/index.js';
import { userTable } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { createHmac, randomBytes } from 'node:crypto';
import { createUserToken } from './utils/token.js';

class AuthenticationController {
    public async handleSignup (req: Request, res: Response) {
        const validateResult = await signupPayloadModel.safeParseAsync(req.body);

        if (validateResult.error) return res.status(400).json({ message: 'body validation failed', error: validateResult.error.issues });

        const { firstName, lastName, email, password } = validateResult.data;

        const userEmailResult = await db.select().from(userTable).where(eq(userTable.email, email));

        if (userEmailResult.length > 0) return res.status(400).json({error: 'duplicate entry', message: `user with email ${email} already exists`})
        
        const salt = randomBytes(32).toString('hex');
        const hash = createHmac('sha256', salt).update(password).digest('hex');

        const result = await db.insert(userTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt
        }).returning({ id: userTable.id})

        return res.status(201).json({message: 'user created successfully', data: { id: result[0]?.id }});
    }

    public async handleSignin (req: Request, res: Response) {
        const validateResult = await signinPayloadModel.safeParseAsync(req.body);

        if (validateResult.error) return res.status(400).json({ message: 'body validation failed', error: validateResult.error.issues})
        
        const { email, password } = validateResult.data;

        const userSelect = await db.select().from(userTable).where(eq(userTable.email, email));
        if (userSelect.length === 0) return res.status(404).json({ message: `user not found with this ${email}` });

        const user = userSelect[0];

        const hash = createHmac('sha256', user?.salt!).update(password).digest('hex');

        if (hash !== user?.password) return res.status(400).json({ message: 'invalid email or password' });

        const token = createUserToken({ id: user.id });

        return res.status(200).json({message: 'user signed in successfully', data: { token }});
    }
}

export default AuthenticationController