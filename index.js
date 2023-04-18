const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/:pokemon', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pokemonPage.html'));
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})