# Shoes Shop - E-Commerce Web Application

A modern, high-performance React application for browsing, searching, and purchasing footwear. Built with Clean Architecture principles, custom hooks, Redux Toolkit state management, secure Axios interceptors, and social authentication.

## 🚀 Key Features

* **Product Showcase & Carousel:** Interactive hero carousel featuring top products and dynamic client-side pagination with smooth scrolling controls on the Home page.
* **Search & Filtering:** Fast product filtering and search functionality with custom empty-state fallbacks.
* **Social Authentication:** Secure Facebook login integration (`/api/Users/facebooklogin`) alongside standard email/password authentication.
* **User Authentication & Profile:**
  * Registration & Login with validation.
  * Profile management including dynamic avatar uploads.
  * Order history and favorite product management tabs.
* **Shopping Cart & Checkout:** Redux-managed shopping cart state with local persistence and real-time total updates.
* **Security & Session Expiration:** Advanced Axios request/response interceptors that automatically manage JWT expiration, clear invalid credentials, and conditionally fall back to guest mode on public pages or redirect on protected routes.

## 🛠️ Tech Stack

* **Frontend Library:** React 18 (Vite)
* **State Management:** Redux Toolkit (`react-redux`)
* **Routing:** React Router DOM v6
* **HTTP Client:** Axios (with custom Request/Response Interceptors)
* **Styling:** Bootstrap 5, SCSS / CSS3
* **Backend API:** Cybersoft API Store (`https://apistore.cybersoft.edu.vn/api`)

## 📐 Architecture & Custom Hooks

To keep component logic clean and decoupled from external libraries, this project utilizes specialized wrapper hooks and middleware:

* **`useRedux` (`src/hooks/useRedux.jsx`):** Wraps `useDispatch` and `useSelector` into `useAppDispatch` and `useAppSelector` for decoupled state management.
* **`useRouting` (`src/hooks/useRouting.jsx`):** Centralizes `useNavigate`, `useParams`, and search query handling into a single clean hook interface.
* **Smart Axios Interceptor (`src/middlewares/interceptors.js`):** Automatically checks token validity on requests, strips expired tokens instantly, and handles `401 Unauthorized` responses gracefully by allowing uninterrupted guest browsing on public routes while safeguarding protected actions.

## ⚡ Getting Started

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/shoes-shop.git
cd shoes-shop
npm install
```

### 3. Run Development Server

Start the development server:

```bash
npm run dev
```

Open your browser to view the application.

## 📝 License

This project was created for educational purposes as part of the Cybersoft Front-End Capstone.
