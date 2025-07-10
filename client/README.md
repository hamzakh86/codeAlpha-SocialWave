# Client (Front-end) - SocialWave

This folder contains the source code for the front-end application of the SocialWave project.

## Table of Contents

*   [Technologies Used](#technologies-used)
*   [Folder Structure](#folder-structure)
*   [Installation](#installation)
*   [Running the Application](#running-the-application)
*   [Building the Application](#building-the-application)

## Technologies Used

This front-end project is developed with the following technologies:

*   **React**: A JavaScript library for building user interfaces, enabling the creation of reusable UI components and efficient management of application state.
*   **Tailwind CSS**: A utility-first CSS framework that provides low-level classes to build custom designs directly in your markup, thus accelerating the styling process.
*   **JavaScript**: The primary programming language used for front-end logic, interactivity, and communication with the server.
*   **Redux** (to be confirmed): A predictable state container for JavaScript applications, often used with React for centralized application state management.

## Folder Structure

The `client/` folder is logically organized to facilitate development and maintenance:

*   `public/`: Contains static application resources, such as `index.html` (the application's entry point), icons, and other files not processed by the Webpack build.
*   `src/`: The core of the front-end application. This directory contains all React components, pages, custom hooks, Redux logic (actions, reducers, store), utilities, and middlewares.
    *   `src/components/`: Reusable and modular React components.
    *   `src/pages/`: React components representing the different views or pages of the application.
    *   `src/redux/`: Contains the Redux configuration, including actions, reducers, and the store for global state management.
    *   `src/utils/`: Various utility functions used throughout the application.
    *   `src/hooks/`: Custom React hooks to encapsulate reusable logic.
    *   `src/middlewares/`: Client-specific middlewares, for example, for authentication token management.
*   `package.json`: The Node.js project manifest. It lists all project dependencies (libraries and frameworks), as well as development and build scripts.
*   `tailwind.config.js`: The main configuration file for Tailwind CSS, where you can customize your theme, add plugins, and configure purge paths.
*   `postcss.config.js`: The configuration file for PostCSS, a tool that transforms CSS with JavaScript plugins. It is used by Tailwind CSS to process `@tailwind` and `@apply` directives.

## Installation

To set up and install the front-end project dependencies, follow these steps:

1.  Ensure you are in the `client/` directory of your project:

    ```bash
    cd codeAlpha-SocialWave/client
    ```

2.  Install all necessary dependencies using npm or yarn:

    ```bash
    npm install
    # or
    yarn install
    ```

    This command will read the `package.json` file and download all libraries listed in `dependencies` and `devDependencies`.

## Running the Application

Once the dependencies are installed, you can start the application in development mode:

1.  Ensure you are in the `client/` directory.

2.  Run the start command:

    ```bash
    npm start
    # or
    yarn start
    ```

    This command will launch a local development server and open the application in your default browser. The application will typically be accessible at `http://localhost:3000`.

    Development mode includes Hot Module Replacement for a fast development experience, where code changes are reflected instantly without requiring a full page reload.

## Building the Application

To prepare the application for production deployment, you need to create an optimized build:

1.  Ensure you are in the `client/` directory.

2.  Run the build command:

    ```bash
    npm run build
    # or
    yarn build
    ```

    This command will compile and minify all application files (JavaScript, CSS, images, etc.) and place them in a production folder (usually `build/` or `dist/`). These files are optimized for performance and size, ready to be served by a static web server.


