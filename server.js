const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the AASC Server Application');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});