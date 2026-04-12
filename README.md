# Expense Tracker Backend

Backend API for the Expense Tracker application. This service handles user authentication, profile management, expenses, incomes, budgets, and MongoDB persistence for the frontend app.

Frontend repository: https://github.com/devMonkRahul/Expense-Tracker-Frontend

## Features

- User registration and login
- JWT-based protected routes
- Profile fetch and profile update endpoints
- Income CRUD with date-based filtering and pagination
- Expense CRUD with date-based filtering and pagination
- Budget CRUD
- MongoDB persistence with Mongoose
- Security middleware with `helmet`, `cors`, and request logging via `morgan`

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Docker and Docker Compose

## Project Structure

```text
.
├── app.js
├── Dockerfile
├── docker-compose.yaml
├── server
│   ├── config
│   ├── constants.js
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   └── utils
└── logs
```

## API Overview

Base URL: `http://localhost:4000`

### Health and Logs

- `GET /` - Server health check
- `GET /logs` - Returns the last 100 access log lines

### User Routes

- `POST /api/v1/user/register`
- `POST /api/v1/user/login`
- `GET /api/v1/user/profile`
- `PATCH /api/v1/user/profile/update`
- `PATCH /api/v1/user/profile/changePassword`
- `GET /api/v1/user/validate/username/:username`
- `GET /api/v1/user/validate/email/:email`

### Transaction Routes

- `POST /api/v1/transaction/addIncome`
- `GET /api/v1/transaction/getIncomes`
- `PATCH /api/v1/transaction/editIncome/:incomeId`
- `DELETE /api/v1/transaction/deleteIncome/:incomeId`
- `POST /api/v1/transaction/addExpense`
- `GET /api/v1/transaction/getExpenses`
- `PATCH /api/v1/transaction/editExpense/:expenseId`
- `DELETE /api/v1/transaction/deleteExpense/:expenseId`

### Budget Routes

- `POST /api/v1/budget/addBudget`
- `GET /api/v1/budget/getBudgets`
- `GET /api/v1/budget/getBudget/:budgetId`
- `PATCH /api/v1/budget/updateBudget/:budgetId`
- `DELETE /api/v1/budget/deleteBudget/:budgetId`

Most application routes require an `Authorization` header in the format `Bearer <token>`.

## Environment Variables

Create a `.env` file in the project root. You can copy the example file:

```bash
cp .env.example .env
```

Required variables:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
ACCESS_TOKEN_SECRET=replace-with-a-strong-secret
ACCESS_TOKEN_EXPIRY=1d
```

## Run Locally

### Prerequisites

- Node.js 20 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

### Setup

1. Clone the repository:

```bash
git clone https://github.com/devMonkRahul/Expense-Tracker-Backend.git
cd Expense-Tracker-Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Update `MONGODB_URI` and `ACCESS_TOKEN_SECRET` in `.env`.

5. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`.

## Run With Docker

### Using Docker Compose

This project includes a `docker-compose.yaml` that starts:

- `mongodb` on port `27017`
- `expense-tracker-backend` on port `4000`

Run:

```bash
docker compose up --build
```

To stop the services:

```bash
docker compose down
```

To stop and remove the MongoDB volume as well:

```bash
docker compose down -v
```

### Using Docker Only

Build the image:

```bash
docker build -t expense-tracker-backend .
```

Run the container:

```bash
docker run -p 4000:4000 \
  -e PORT=4000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/expense-tracker \
  -e ACCESS_TOKEN_SECRET=replace-with-a-strong-secret \
  -e ACCESS_TOKEN_EXPIRY=1d \
  expense-tracker-backend
```

If you are running Docker on Linux and `host.docker.internal` is unavailable, replace it with a reachable MongoDB host or use Docker Compose.

## Frontend Integration

Frontend repository: https://github.com/devMonkRahul/Expense-Tracker-Frontend

For local integration:

- Start this backend on `http://localhost:4000`
- Start the frontend separately
- Point the frontend API configuration to this backend URL

The backend CORS configuration already allows:

- `http://localhost:5173`
- `http://localhost:5174`
- `https://expense-tracker.therahul.xyz`
- `https://expense-tracker-mu-wheat.vercel.app`

## Scripts

- `npm run dev` - Start the app with `nodemon`
- `npm start` - Start the app in production mode

## Notes

- Access logs are written to `logs/access.log`
- The Docker image runs the app as a non-root user
- Docker Compose uses a MongoDB named volume for persistence
