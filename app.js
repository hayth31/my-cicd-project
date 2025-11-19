const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hello from CI/CD Pipeline!</h1><p>This is automated deployment.</p>');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});