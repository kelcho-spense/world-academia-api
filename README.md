# Restful API Express

This is a RESTful API built with Node.js, Express, and TypeScript, designed to manage a university's internal data. It provides endpoints for managing users, including roles like `user` and `admin`, and supports authentication with JWT.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Building the Project](#building-the-project)
  - [Using Docker](#using-docker)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- User and Admin management
- JWT-based authentication
- Role-based access control
- MongoDB integration
- Rate limiting and security best practices
- Environment-based configurations

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling for Node.js
- **Docker**: Containerization platform
- **Docker Compose**: Tool for defining and running multi-container Docker applications
- **JWT (JSON Web Tokens)**: For secure authentication
- **Pino**: HTTP request logging

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/university-api-express.git
cd university-api-express
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of your project and configure the necessary environment variables. Here's a sample `.env` file:

```
PORT=8000
MONGO_URI=mongodb://mongo:27017/university
JWT_SECRET=your_jwt_secret_key
```

### Running Locally

Start the development server with the following command:

```bash
npm run dev
```

This command will start the server using `nodemon` and `typescript`, allowing for live updates as you make changes to the source code.

### Building the Project

To compile TypeScript to JavaScript and build the project, run:

```bash
npm run build
```

The compiled files will be output to the `dist` directory.

### Using Docker

You can run the entire application, including MongoDB, using Docker and Docker Compose.

#### Build and Run with Docker Compose

1. Ensure Docker and Docker Compose are installed and running on your machine.
2. Build and start the containers using the following command:

   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the Express API container.
   - Start a MongoDB container.
   - Optionally, start `mongo-express` for managing the MongoDB database via a web interface.

3. The API will be available at `http://localhost:8000`.

### Stopping Docker Containers

To stop the running Docker containers, use:

```bash
docker-compose down
```

## API Endpoints

You can interact with the API using tools like Postman or `curl`. Here's a summary of the available endpoints:

- **User Registration**: `POST /api/auth/register`
- **User Login**: `POST /api/auth/login`
- **Approve User (Admin only)**: `PUT /api/auth/approve/:userId`
- **Get All Users (Admin only)**: `GET /api/auth/users`
- **Update Profile (User/Admin)**: `PUT /api/auth/me`
- **Delete Profile (User/Admin)**: `DELETE /api/auth/me`
- **Shared Action (User/Admin)**: `GET /api/auth/shared-action`

Refer to the `app.http` file for more detailed examples of API requests.

## Project Structure

```plaintext
├── dist/                     # Compiled output
├── src/                      # Source files
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Express middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── schema/               # Mongoose schemas
│   ├── utils/                # Utility functions
│   └── types/                # Custom TypeScript types
├── .env                      # Environment variables
├── Dockerfile                # Docker configuration for production
├── Dockerfile.dev            # Docker configuration for development
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

```

### Notes:

1. **Customization**: Replace the repository URL (`https://github.com/your-username/university-api-express.git`) with the actual URL of your repository.
2. **Docker**: The Docker configuration assumes MongoDB is running in a Docker container and is accessible via `mongo`. Make sure the connection string in the `.env` file matches your Docker setup.
3. **API Endpoints**: The endpoints are summarized for quick reference. For more detailed examples and usage, users can refer to the `app.http` file.
4. **Project Structure**: This section provides a high-level overview of the directory structure to help users navigate the project.

This `README.md` should give anyone who clones the repository clear instructions on how to get started, whether they are running the project locally or using Docker.