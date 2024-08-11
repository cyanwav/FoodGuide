# FoodGuide

FoodGuide is a web application designed to help tourists discover nearby restaurants.
![图片](https://github.com/user-attachments/assets/1f87977c-e745-4c30-b8db-42db573c17b3)
![图片](https://github.com/user-attachments/assets/3eac76c6-8ec6-41ad-9c28-7339039b8b80)
![图片](https://github.com/user-attachments/assets/fa312c29-99c0-40a5-8e7e-10a0d34e1093)

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
