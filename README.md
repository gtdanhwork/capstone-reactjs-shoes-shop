# Shoes Shop - E-Commerce Web Application

A modern, high-performance React application for browsing, searching, and purchasing footwear. Built with Clean Architecture principles, custom hooks, Redux toolkit state management, and robust security interceptors.

---

## 🚀 Key Features

* **Product Showcase & Carousel:** Interactive hero carousel featuring top products and dynamic client-side pagination.
* **Search & Filtering:** Fast product filtering and search functionality with custom empty-state fallbacks.
* **User Authentication & Profile:** 
  * Registration & Login with validation.
  * Profile management including dynamic avatar uploads.
  * Order history and favorite product management tabs.
* **Shopping Cart & Checkout:** Redux-managed shopping cart state with local persistence and real-time total updates.
* **Security & Session Expiration:** Axios response interceptors handling automatic session expiry (`401 Unauthorized`) by clearing tokens and safely redirecting users.

---

## 🛠️ Tech Stack

* **Frontend Library:** React 18
* **State Management:** Redux Toolkit (`react-redux`)
* **Routing:** React Router DOM v6
* **HTTP Client:** Axios (with custom Request/Response Interceptors)
* **Styling:** Bootstrap 5, SCSS / CSS3
* **Backend API:** Cybersoft API Store (`https://apistore.cybersoft.edu.vn/api`)

---

## 📐 Architecture & Custom Hooks

To keep component logic clean and decoupled from external libraries, this project utilizes specialized wrapper hooks:

* **`useRedux` (`src/hooks/useRedux.jsx`):** Wraps `useDispatch` and `useSelector` into `useAppDispatch` and `useAppSelector` for decoupled state management.
* **`useRouting` (`src/hooks/useRouting.jsx`):** Centralizes `useNavigate`, `useParams`, and search query handling into a single clean hook interface.
* **Axios Interceptor (`src/middlewares/interceptors.js`):** Automatically injects Bearer tokens on requests and intercepts `401` errors to protect routes against expired JWT tokens.

---

## 📂 Project Directory Structure

```text
src/
├── assets/          # Static images, icons, and SCSS styles
├── components/      # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductItem.jsx
│   ├── PageHeader.jsx
│   ├── LoadingSpinner.jsx
│   └── EmptyState.jsx
├── hooks/           # Custom React hooks (useRedux, useRouting)
├── middlewares/     # Axios interceptors & HTTP configuration
├── pages/           # Application views (Home, Search, Detail, Carts, Profile, Login, Register)
├── redux/           # Redux slices and store configuration
├── services/        # API service modules (productService, userService, etc.)
└── App.jsx          # Root component & Route definitions
```

---

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
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 📝 License
This project was created for educational purposes as part of the Cybersoft Front-End Capstone.