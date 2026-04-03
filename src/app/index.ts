import express from "express";
import { authRouter } from "./auth/routes.js";

export function createExpressApplication() {
    const app = express();

    // middlewares
    app.use(express.json());

    // routes
    app.get('/', (req, res) => {
        return res.json({ message: "A get api call from TS Auth Backend"});
    })

    app.use('/auth', authRouter);
    return app;
}