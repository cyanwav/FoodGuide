# FoodGuide

FoodGuide is a web application designed to help tourists discover nearby restaurants.

## Setup and Running the Application

To run FoodGuide, follow these steps:

### 1. Install Dependencies

Navigate to both the `client` and `server` directories and install the necessary dependencies.

For the `client` directory:

```bash
cd ../client
npm install
```

For the `server` directory:

```bash
cd ../server
npm install
```

### 2. Build the Project

In each directory, build the project:

For the `client` directory:

```bash
cd ../client
npm run build
```

For the `server` directory:

```bash
cd ../server
npm run build
```

### 3. Start the Server and Client

Start the server first, then the client:

For the `server` directory:

```bash
cd ../server
npm start
```

For the `client` directory:

```bash
cd ../client
npm start
```

You can access the frontend at http://localhost:5173.

### Docker Compose

Currently, Docker Compose containerization is not fully functional. Although the frontend displays correctly after running `docker-compose up --build`, the frontend is unable to send requests to the backend. Therefore, the API request settings are configured to work with local testing.
