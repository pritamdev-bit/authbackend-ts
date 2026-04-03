import type { Request, Response } from 'express';
import { signupPayloadModel } from './models.js';
import { db } from '../../db/index.js';
import { userTable } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { createHmac, randomBytes } from 'node:crypto';

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
}

export default AuthenticationController