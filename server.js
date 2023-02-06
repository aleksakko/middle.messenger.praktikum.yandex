import express from 'express';
import path from 'path';

const __dirname = new URL(".", import.meta.url).pathname.substr(1);

const app = express();

//const process = NodeJS.Process;
/*global process*/
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + 'dist'));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve('dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Express_server is run on port ${PORT}`);
});
