import express from "express";

export function createExpressApplication() {
    const app = express();

    // routes
    app.get('/', (req, res) => {
        return res.json({ message: "A get api call from TS Auth Backend"});
    })

    return app;
}