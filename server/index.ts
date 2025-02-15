import express from 'express';

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
