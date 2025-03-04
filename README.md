# PostX

PostX is a simple social media application built with Node.js, Express, and MongoDB. Users can register, log in, create posts, like posts, and upload profile pictures.

## Features

- User registration and login
- Create, edit, and delete posts
- Like and unlike posts
- Upload profile pictures
- Flash messages for notifications
- Session management with cookies and JWT

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Rohandalal8/PostX.git
    cd PostX
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
    JWT_SECRET=your_jwt_secret
    ```

4. Start the application:
    ```sh
    npm start
    ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Register a new account
- Log in with your credentials
- Create, edit, and delete posts
- Like and unlike posts
- Upload a profile picture

## Dependencies

- express
- mongoose
- cookie-parser
- bcrypt
- jsonwebtoken
- express-session
- connect-flash
- moment
- multer

## License

This project is licensed under the MIT License.
