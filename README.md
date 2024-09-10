# Quiz Application API

This is a backend API for a quiz application with multiple rounds and team management.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGO_USER=your_mongodb_username
   MONGO_PASSWORD=your_mongodb_password
   MONGO_CLUSTER=your_mongodb_cluster
   MONGO_DB=your_database_name
   ```
4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Team Routes

- `POST /api/teams/register`: Register a new team
- `GET /api/teams`: Get all teams
- `POST /api/teams`: Create a team
- `POST /api/teams/login`: Admin login
- `GET /api/teams/scores`: Get team scores

### Question Routes

- `GET /api/questions/round1`: Get all questions for Round 1
- `GET /api/questions/round2`: Get all questions for Round 2
- `GET /api/questions/round3`: Get a random question for Round 3
- `POST /api/questions/submit/round1`: Submit answers for Round 1
- `POST /api/questions/submit/round2`: Submit code for Round 2
- `PUT /api/questions/update/round1`: Update questions for Round 1
- `PUT /api/questions/update/round2`: Update questions for Round 2
- `PUT /api/questions/update/round3`: Update questions for Round 3

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS

## Project Structure

- `server.js`: Main application file
- `routes/`: Contains route definitions
  - `questionRoutes.js`: Question-related routes
  - `teamRoutes.js`: Team-related routes
- `controllers/`: Contains controller logic
  - `questionController.js`: Handles question-related requests
  - `teamController.js`: Handles team-related requests
- `services/`: Contains business logic
  - `questionService.js`: Question-related business logic
  - `teamService.js`: Team-related business logic
- `models/`: Contains database models
  - `Team.js`: Team model definition

## Note

This application does not use authentication middleware. Ensure to implement proper authentication and authorization in a production environment.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `PORT`: The port number for the server to listen on
- `MONGO_USER`: MongoDB username
- `MONGO_PASSWORD`: MongoDB password
- `MONGO_CLUSTER`: MongoDB cluster name
- `MONGO_DB`: MongoDB database name

## Running the Application

After setting up the environment variables, you can start the server by running:

```
node server.js
```

The server will start and connect to the MongoDB database using the provided credentials.