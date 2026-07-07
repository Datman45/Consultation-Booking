# Consultation-Booking

TypeScript/React/Next.js/Express.js/PostgreSQL full-stack application for booking and viewing consultations.

## Installation

- Clone or download the repository
- Open the project in Visual Studio Code

## How to run with Docker

- Go to the project root folder.
- Start the application:

```bash
docker compose up -d --build
```

```text
Frontend: http://localhost:3001
Backend: http://localhost:3000
```

## How to set up database

- Go to the backend root folder

```bash
cd backend
```

- Download dependencies

```bash
npm install
```

- Create a `.env` file in the backend root folder:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=consultation_booking_db
DB_USER=postgres
DB_PASSWORD=your_password

CLIENT_URL=http://localhost:3001
```

- Install and open pgAdmin
- Create a PostgreSQL database named `consultation_booking_db`
- Run database initialization script from backend root folder:

```bash
npm run init-db
```

## How to run backend

- Build backend

```bash
npx tsc
```

- Run backend

```bash
npm run dev
```

## How to run frontend

- Go to the frontend root folder

```bash
cd frontend
```

- Download dependencies

```bash
npm install
```

- Run frontend

```bash
npm run dev
```

## How to run tests

- Go to the backend root folder

```bash
cd backend
```

- Run the test suite:

```bash
npm run test
```
