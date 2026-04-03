import { createServer } from 'node:http';
import { createExpressApplication } from './app/index.js';

async function main() {
    try {
        const server = createServer(createExpressApplication());
        const PORT: number = 8000;

        server.listen(PORT, () => {
            console.log(`http server is running on PORT ${PORT}`);
        })
    } catch (error) {
        console.log('Error starting http server');
        throw error;
    }
}
main();