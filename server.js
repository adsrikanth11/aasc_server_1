require('dotenv').config();
const app  = require('./src/app');

const PORT = process.env.PORT || 3500;

// Run Server
app.listen(PORT, () => {
   console.log(`Server running in ${process.env.NODE_ENV} environment at ${process.env.BASE_URL}`);
});