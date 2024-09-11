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

- `POST /api/teams`: Register a new team
  Sample input:
  ```json
  {
    "teamName": "Byte-Builders"
  }
  ```

- `GET /api/teams`: Get all teams


### Question Routes
- `GET /api/questions/round1`: Get all questions for Round 1

- `GET /api/questions/round2`: Get all questions for Round 2

- `GET /api/questions/round3`: Get a random question for Round 3
  Query parameter: `domain`
  Example: `GET /api/questions/round3?domain=algorithms`


- `POST /api/questions/submit`: Submit answers for Round 1
  Sample input:
  ```json
  {
    "teamName": "Byte-Builders",
    "round": 1,
    "answers": [
      {
        "questionId": "60a1234b5c6d7e8f90123456",
        "answer": "The correct answer"
      }
    ]
  }
  ```

- `POST /api/questions/submit-code`: Submit code for Round 2
  Sample input:
  ```json
  {
    "teamName": "Byte-Builders",
    "questionId": "60a1234b5c6d7e8f90123457",
    "code": "function solution(input) { return input; }",
    "language": "javascript"
  }
  ```


### Admin Routes

- `POST /api/admin/login`: Admin login
  Sample input:
  ```json
  {
    "username": "admin",
    "password": "adminpassword"
  }
  ```


## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Axios (for code execution API)

## Project Structure

- `server.js`: Main application file
- `app.js`: Express application setup
- `routes/`: Contains route definitions
- `controllers/`: Contains controller logic
- `services/`: Contains business logic
- `models/`: Contains database models

## Note

This application uses basic authentication for admin routes. Ensure to implement proper authentication and authorization in a production environment.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `PORT`: The port number for the server to listen on
- `MONGO_USER`: MongoDB username
- `MONGO_PASSWORD`: MongoDB password
- `MONGO_CLUSTER`: MongoDB cluster name
- `MONGO_DB`: MongoDB database name

## Running the Application

After setting up the environment variables, you can start the server by running:
- `npm run start`