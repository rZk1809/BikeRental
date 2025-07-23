# 🚲 BikeRental Application

A full-stack web application for renting bikes. This project features separate, intuitive interfaces for users to browse and book bikes, and for administrators to manage the platform's inventory, users, and bookings.

***

## 🚀 Live Demo

Here are the links to the live, deployed application:

* **User Frontend:** [https://userfrontend-ktet.onrender.com/](https://userfrontend-ktet.onrender.com/)
* **Admin Frontend:** [https://adminfrontend-39ew.onrender.com/login](https://adminfrontend-39ew.onrender.com/login)
* **Backend Server:** [https://backend-bnq7.onrender.com/](https://backend-bnq7.onrender.com/)
    * *Note: Please access the backend URL first to wake up the server on the free hosting tier and ensure data loads correctly on the frontends.*

***

## 🔑 Admin Credentials

You can log in to the admin panel to test the administrative features using the following credentials:

* **Username:** `admin@bikerental.com`
* **Password:** `admin123456`

***

## ✨ Features

### 👤 User Panel

* **User Authentication:** Secure sign-up and login functionality.
* **Browse Bikes:** View a gallery of all available bikes for rent.
* **Bike Details:** See detailed information for each bike.
* **Booking System:** Easily book a bike for a specific time slot.
* **Booking History:** View a personal history of all past and current bookings.

### 👑 Admin Panel

* **Secure Login:** Dedicated login for administrators.
* **Dashboard:** An overview of key metrics like total bikes, users, and bookings.
* **Bike Management:** Full CRUD (Create, Read, Update, Delete) functionality for bikes in the inventory.
* **Booking Management:** View all user bookings, check their status, and manage them.
* **User Management:** View a list of all registered users on the platform.

***

## 🛠️ Tech Stack

This project is built using the MERN stack along with other modern web technologies.

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Deployment:** Render

***

## 🖥️ Getting Started (Local Setup)

To run this project on your local machine, follow the steps below.

### Prerequisites

* Node.js (v14 or later)
* npm or yarn
* MongoDB (local installation or a cloud instance like MongoDB Atlas)

### Installation

1.  **Clone the repository (you would replace the URL with your actual repo URL):**
    ```bash
    git clone [https://github.com/your-username/bikerental.git](https://github.com/your-username/bikerental.git)
    cd bikerental
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add your environment variables (e.g., database connection string, JWT secret).
    ```env
    MONGO_URL=your_mongodb_connection_string
    PORT=5000
    ```

3.  **Setup the User Frontend:**
    ```bash
    cd ../user-frontend
    npm install
    ```

4.  **Setup the Admin Frontend:**
    ```bash
    cd ../admin-frontend
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the /backend directory
    npm start
    ```
    The server will be running on `http://localhost:5000` (or your configured port).

2.  **Start the User Frontend:**
    ```bash
    # From the /user-frontend directory
    npm start
    ```
    The user app will open on `http://localhost:3000`.

3.  **Start the Admin Frontend:**
    ```bash
    # From the /admin-frontend directory
    npm start
    ```
    The admin app will likely run on another port, such as `http://localhost:3001`.
