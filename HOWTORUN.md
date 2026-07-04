# Kadal2Kadaai - Setup & Run Instructions

This guide will walk you through pulling the code from GitHub and getting both the Laravel Backend and Next.js Frontend running perfectly on your local machine.

---

## 🛠 Prerequisites

Before you start, make sure you have the following installed on your machine:
- **PHP** (v8.1 or higher)
- **Composer** (PHP Package Manager)
- **Node.js** (v18 or higher) and **npm**
- **MySQL** (via XAMPP, WAMP, Herd, or native installation)
- **Git**

---

## 🚀 Step 1: Pull from GitHub

1. Open your terminal or command prompt.
2. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/VishnuSenpaiIT/Kadal2Kadaai.Demo.git
   ```
3. Navigate into the project folder:
   ```bash
   cd Kadal2Kadaai.Demo
   ```

---

## 🐘 Step 2: Set Up the Laravel Backend

1. Open a terminal and navigate into the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the PHP dependencies:
   ```bash
   composer install
   ```
3. Set up your environment file:
   - Copy the `.env.example` file and rename the copy to `.env`.
   - By default, the application is configured to use **SQLite** (a local file-based database) which requires zero database server setup.
   - If you want to use MySQL instead, uncomment and configure the MySQL section in `.env` (e.g., via XAMPP):
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=kadal2kadaai
     DB_USERNAME=root
     DB_PASSWORD=
     ```
4. Generate the application encryption key:
   ```bash
   php artisan key:generate
   ```
5. **Start your Database**:
   - **SQLite (Recommended for zero-setup)**: The first time you run migrations (next step), Laravel will ask if you'd like to create the SQLite database file (`database/database.sqlite`). Select **Yes**.
   - **MySQL**: Ensure your MySQL server is running (e.g., start MySQL in XAMPP) and create a database named `kadal2kadaai` manually first.
6. Run the database migrations to build the tables and seed default data:
   ```bash
   php artisan migrate --seed
   ```
7. Start the Laravel backend server:
   ```bash
   php artisan serve
   ```
   *Your backend is now running at `http://localhost:8000`.*

---

## ⚛️ Step 3: Set Up the Next.js Frontend

1. Open a **new** terminal window (keep the backend running in the first one) and navigate into the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   - If there is an `.env.example` file, copy it and rename it to `.env.local`.
   - Ensure the API URL points to your running backend:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8000/api
     ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *Your frontend is now running at `http://localhost:3000`.*

---

## 🎉 You're All Set!

- **Consumer Website:** [http://localhost:3000](http://localhost:3000)
- **Admin Operations Portal:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

**Prebuilt Admin Credentials (for Admin Portal):**
- Email: `admin@kadal.local` | Password: `Admin@12345`
- Email: `k2k-admin@gmail.com` | Password: `admin123`

**Prebuilt Consumer Credentials (for Consumer Website):**
- Email: `customer@kadal.local` | Password: `Customer@12345`

**Prebuilt Seller Credentials:**
- Email: `seller@kadal.local` | Password: `Seller@12345`
