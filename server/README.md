# Server (Back-end) - SocialWave

This folder contains the source code for the back-end application of the SocialWave project.

## Table of Contents

*   [Technologies Used](#technologies-used)
*   [Folder Structure](#folder-structure)
*   [Installation](#installation)
*   [Database Configuration](#database-configuration)
*   [Running the Application](#running-the-application)
*   [API Endpoints](#api-endpoints)

## Technologies Used

This back-end project is developed with the following technologies:

*   **Node.js**: Server-side JavaScript runtime environment, enabling the building of scalable and high-performance network applications.
*   **Express.js**: A minimalist and flexible web framework for Node.js, used to build robust RESTful APIs and manage routes and HTTP requests.
*   **MongoDB**: A NoSQL document-oriented database, used to store application data in a flexible and scalable manner. (To be confirmed through in-depth code analysis to ensure its effective use).
*   **Mongoose**: An Object Data Modeling (ODM) library for Node.js and MongoDB, which provides a schema-based solution to model your application data and interact with the MongoDB database.
*   **JWT (JSON Web Tokens)** (to be confirmed): Used for user authentication, enabling secure communication between the client and server via signed tokens.
*   **Passport.js** (to be confirmed): Authentication middleware for Node.js, offering a flexible and modular approach to handle various authentication strategies (local, OAuth, etc.).

## Folder Structure

The `server/` folder is organized in a modular way to separate concerns and facilitate maintenance:

*   `app.js`: The main application file. It is responsible for initializing the Express server, configuring global middlewares, and connecting to the database.
*   `package.json`: The Node.js project manifest. It lists all project dependencies (libraries and frameworks) and defines start scripts and other useful commands.
*   `config/`: Contains application configuration files, such as database connection settings (`database.js`) and authentication configuration (`passport.js`).
*   `controllers/`: This directory contains the main business logic of the application. Each controller file handles HTTP requests specific to a resource (e.g., `user.controller.js` for user-related operations).
*   `models/`: Defines Mongoose schemas and data models for MongoDB. Each model file represents a collection in the database and defines the structure of the documents.
*   `routes/`: Manages API request routing to the appropriate controllers. Each route file defines the endpoints for a specific resource (e.g., `user.route.js` for user API routes).
*   `middlewares/`: Contains Express middleware functions that can be used to intercept and process requests before they reach the controllers (e.g., for authentication, data validation, logging).
*   `services/`: This directory may contain complex business logic or interactions with external services that are not directly related to controllers or models.
*   `utils/`: Various reusable utility functions that do not fit into other categories (e.g., helper functions for validation, data formatting).
*   `data/`: May contain initial data, data import scripts, or data-specific configuration files.
*   `scripts/`: Contains automation or maintenance scripts for the server (e.g., user creation scripts, database migration).
*   `admin_tool.sh`: A shell script that could be used for specific server administration tasks, such as initial setup or administrator user management.

## Installation

To set up and install the back-end project dependencies, follow these steps:

1.  Ensure you are in the `server/` directory of your project:

    ```bash
    cd codeAlpha-SocialWave/server
    ```

2.  Install all necessary dependencies using npm or yarn:

    ```bash
    npm install
    # or
    yarn install
    ```

    This command will read the `package.json` file and download all libraries listed in `dependencies` and `devDependencies`.

## Database Configuration

Before starting the server, make sure you have a MongoDB instance running. You can use a local MongoDB instance or a cloud service like MongoDB Atlas.

*   **Local Instance**: Ensure the MongoDB service is running on your machine.
*   **MongoDB Atlas**: Obtain the connection URL for your MongoDB Atlas cluster.

Update the database connection information in the `config/database.js` file (or a similar file in the `config/` folder) if necessary, replacing placeholders with your own credentials and connection URL.

## Running the Application

To start the server in development mode, follow these steps:

1.  Ensure you are in the `server/` directory.

2.  Run the start command:

    ```bash
    npm start
    # or
    node app.js
    ```

    This command will launch the Node.js server. The server will typically be accessible at `http://localhost:5000` (this port can be configured in the `app.js` file or in environment variables).

    For development, it is often recommended to use a tool like `nodemon` (if installed globally or as a development dependency) to automatically restart the server on each file change:

    ```bash
    nodemon app.js
    ```

## API Endpoints

The application's API endpoints are defined in the `routes/` folder. Each route file corresponds to a set of functionalities or resources (e.g., `/api/users`, `/api/posts`).

To understand the available endpoints, their HTTP methods (GET, POST, PUT, DELETE), expected parameters, and responses, you can:

*   **Explore the files in `routes/`**: Each route file (e.g., `user.route.js`, `post.route.js`) defines the paths and associated controllers.
*   **Consult the API documentation** (if available): OpenAPI/Swagger documentation would be ideal for a complete understanding of the APIs. (If not present, this could be a future improvement for the project).

Controllers in the `controllers/` folder contain the detailed logic for each endpoint, including interaction with the database via models (`models/`) and application of business rules.

