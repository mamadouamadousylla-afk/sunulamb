const express = require('express');
const path = require('path');
const app = express();
const PORT = 5002;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route to serve the admin panel
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`SunuLamb Admin Panel running on http://localhost:${PORT}`);
});