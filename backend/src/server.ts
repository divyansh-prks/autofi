import app from './app';
import dotenv from 'dotenv';
import config from './config/config';

dotenv.config();


const PORT = config.PORT


app.listen(PORT, () => {
console.log(`Server listening on http://localhost:${PORT}`);
});