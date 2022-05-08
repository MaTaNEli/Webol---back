import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata'
import { initStorage } from './storage';
import app from './server'

// Server listen on http//localhost:3000
(async () => {
    console.log(1)
    await initStorage();
    app.listen(process.env.PORT || 3000, () => console.log('Server is running'));
})();
