# Book Search Engine

## Description
This application is a book search engine that allows users to search for books via the Google Books API. Users can create an account, search for books, and save books to their account for later reference. The application was built using the MERN stack (MongoDB, Express.js, React, Node.js) with a GraphQL API built using Apollo Server.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Deployment](#deployment)
- [License](#license)

## Features
- Search for books by title, author, or keywords
- View detailed information about books including cover image, author, description, and a link to Google Books
- Create a user account
- Save books to your personal collection
- View all saved books in one place
- Remove books from your saved collection
- Responsive design that works on various screen sizes

## Installation
To install and run this application locally, follow these steps:

1. Clone the repository to your local machine:
    ```sh
    git clone <repository-url>
    ```

2. Navigate to the project directory:
    ```sh
    cd book-search-engine
    ```

3. Install dependencies for both server and client:
    ```sh
    npm install
    ```

4. Create a `.env` file in the server directory with your MongoDB URI and JWT secret:
    ```sh
    MONGODB_URI='your-mongodb-uri'
    JWT_SECRET_KEY='your-secret-key'
    ```

5. Build the application:
    ```sh
    npm run build
    ```

6. Start the development server:
    ```sh
    npm run develop
    ```

## Usage

### Search for Books
- Use the search bar to find books by title, author, or keywords.
- Browse through the search results to find books of interest.

### Create an Account
- Click on "Login/Sign Up" to create a new account or log in.
- Fill in the required information to create an account.

### Save Books
- Once logged in, you can save books by clicking the "Save This Book!" button.
- Saved books will be stored in your account.

### View Saved Books
- Click on "See Your Books" to view all your saved books.
- You can remove books from your saved collection by clicking the "Delete This Book!" button.

## Technologies Used

### Frontend
- React
- Apollo Client
- React Bootstrap
- JWT for authentication

### Backend
- Node.js
- Express.js
- Apollo Server
- GraphQL
- MongoDB with Mongoose ODM
- JWT for authentication

## Deployment
Instructions for deployment will be added here.

https://book-search-engine-1chk.onrender.com/ 

## License
This project is licensed under the MIT License.
