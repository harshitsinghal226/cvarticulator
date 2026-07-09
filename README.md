# CVArticulate — AI-Powered Resume Builder

CVArticulate is a full-stack, state-of-the-art AI Resume Builder that allows users to transform their career histories into compelling, ATS-optimized, professional stories. With a side-by-side live editor, real-time preview, template customizers, and intelligent PDF resume parsing, CVArticulate delivers a premium writing experience.

---

## 🚀 Key Features

- **Side-by-Side Live Editor**: Write details in modular sections (Profile, Contact, Experience, Education, Skills, Projects, Certifications, and Additional Info) while viewing a real-time pixel-perfect print preview.
- **PDF Resume Import & Parsing**: Upload an existing PDF resume to automatically populate the editor sections utilizing backend text parsing.
- **Multiple ATS-Friendly Templates**: Choose from several pre-designed templates (Modern Minimalist, Executive, Creative, Technical, and Custom layouts).
- **Deep Design Customization**: Tune margins, theme colors, text sizes, section spacing, and fonts dynamically in the editor layout.
- **A4 Print & Download**: Download a print-ready PDF formatted precisely to A4 dimensions using browser printing engines (`react-to-print`).
- **Secure Authentication**: Built-in user account systems featuring password hashing (`bcryptjs`), JSON Web Tokens (`jwt`), dynamic 6-digit verification code email flows (`nodemailer` OTP verification), and password recovery systems.
- **Initials Avatar Fallbacks**: Automatically renders clean name initials on user menus if no custom profile picture is uploaded.
- **Cloudinary Image Storage**: Stores user profile pictures and resume preview thumbnails in Cloudinary CDN.

---

## 🛠️ Technology Stack

### Frontend

- **Core**: [React 19](https://react.dev/), [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [React Icons (Lucide, FontAwesome)](https://react-icons.github.io/react-icons/)
- **Printing**: [React-To-Print](https://github.com/gregnb/react-to-print)

### Backend

- **Runtime**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/) (using Mongoose ODM)
- **File Uploads**: Multer & Cloudinary
- **Parsing**: `pdf-parse`
- **Mailing**: `nodemailer` (SMTP)

---

## 📁 Project Structure

```
AI Resume Builder/
├── backend/                   # Node/Express Backend API
│   ├── api/                   # Router and Controller Logic
│   │   ├── controllers/       # Business logic (auth, resumes)
│   │   ├── models/            # Mongoose Schemas (User, Resume)
│   │   └── routes/            # API Route Definitions
│   ├── middlewares/           # JWT verification, file upload rules
│   ├── package.json
│   └── index.js               # Entry Point
│
├── frontend/                  # React/Vite Frontend
│   └── resume-builder/
│       ├── public/
│       ├── src/
│       │   ├── assets/        # Media assets & template previews
│       │   ├── components/    # Reusable inputs, layouts, modals, templates
│       │   ├── context/       # User and Theme states
│       │   ├── pages/         # Landing, Dashboard, Resume Update, Auth screens
│       │   ├── utils/         # Helper scripts, API configurations
│       │   └── index.css      # Core Tailwind stylesheet & variables
│       └── package.json
```

---

## ⚙️ Installation & Configuration

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Database Instance (Local or Atlas cloud cluster)
- Cloudinary Account
- SMTP Email Server Configuration (e.g., Gmail App Password, Mailtrap, or Sendgrid)

---

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `backend` directory and add the following environment variables:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_key

   # Cloudinary config
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # SMTP Configuration (Nodemailer)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend/resume-builder
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the `frontend/resume-builder` directory:

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

5. Access the application in your browser at `http://localhost:5173/`.

---

## 📄 License

This project is private and proprietary. All rights reserved.
