import express from 'express';
import path from 'path';

const __dirname = new URL(".", import.meta.url).pathname.substr(1);

const app = express();

const PORT = 3000;

app.use(express.static(__dirname + 'dist'));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server.express is run on port ${PORT}`);
});