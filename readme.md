# Notes App

## Description

The Notes App is a full-stack Serverless MERN application that allows users to manage their notes efficiently. It provides functionalities for creating, editing, deleting, and viewing notes. The app includes a rich text editor powered by Tiptap for customizing note content with advanced formatting. Users can receive notifications via Toast messages for various actions like note creation, updates, and errors. Form handling and validation are implemented using Formik for a seamless user experience.

### Key Features:

- **Note Management**: Create, view, edit, and delete notes.
- **Rich Text Editing**: Use the Tiptap editor for customizing note content with formatting options like bold, italics, bullet points, etc.
- **Notifications**: Users receive real-time feedback using Toast notifications.
- **Form Handling**: Formik is used for handling user input and validations, including the user profile and note forms.
- **Authentication**: User registration, login, and profile management are supported.
- **Password Management**: Includes the ability to change passwords and reset them via email.

## Architecture

The application architecture includes:

1. **Frontend**: React.js application hosted on an S3 bucket and distributed via CloudFront.
2. **Backend**: Node.js and Express.js API functions deployed on AWS Lambda and exposed via API Gateway.
3. **Database**: MongoDB Atlas for storing user data and notes.
4. **Authentication**: JSON Web Tokens (JWT) for secure user sessions.

## MERN Stack

### Frontend

- React
- JavaScript
- Vite (VITEST, React Testing Library)

### Backend

- Node.js
- Express
- Mocha (Assertion Library used for testing)
- Chai (Testing)
- MongoDB

## Environment Files and Variables

The project uses three main environment files for different environments: `.env`, `.env.development`, and `.env.test`.

### `.env`

The `.env` file contains the common environment variables for the production and testing environment:

- `PORT`: The port number for the backend server.
- `SECRET`: The secret key used for JWT token generation.
- `PASSWORD_APP_EMAIL`: The email address from which the password reset emails will be sent.
- `EMAIL`: The email address associated with the app (for notifications, etc.).

Example of `.env`:

```bash
PORT=****
SECRET=******0f1d21f6c8681c1e5532033
PASSWORD_APP_EMAIL="******"
EMAIL=****
```

### `.env.test`

The `.env.test` contains MONGO_URI for test database

### `.env.development`

The `.env.test` contains MONGO_URI for notesapp development database

Example of `.env.test`:

```bash
MONGO_URI=***************/testdb?retryWrites=true&w=majority&appName=Node
```

```bash
Example of `.env.development`:
MONGO_URI=***************/notesapp?retryWrites=true&w=majority&appName=Node
```

## Running the Project

### Backend

1. Navigate to the backend directory:
   cd backend

2. Install dependencies:
   npm install || npm i

3. Start the backend server:
   npm run start-dev

4. Running Tests:
   npm run test-user
   npm run test-notes

### Frontend

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install || npm i

3. Start the frontend development server:
   npm run dev

4. Running Tests:
   npm run test

## Additional Features and Information

- \*User Profile Page\*\*: User Profile Page where users can view their username and email, upload a profile picture and change password.

```

```
