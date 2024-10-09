const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(`mongodb+srv://vjbhandari61:admin2024@cluster0.ndran.mongodb.net/byte`, { useNewUrlParser: true, useUnifiedTopology: true });

const teamRoutes = require('./routes/teamRoutes');
const questionRoutes = require('./routes/questionRoutes');

app.use('/api/teams', teamRoutes);
app.use('/api/questions', questionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
