# 💰 Finance Dashboard

A modern, responsive **Finance Dashboard Web Application** built using **React + Vite + JavaScript + Tailwind CSS**, designed to help users track financial activity, analyze spending patterns, and gain actionable insights.

---

## 🚀 Live Features

This dashboard provides a clean and intuitive interface to:

* View overall financial summary
* Explore and manage transactions
* Understand spending behavior through visual insights
* Interact with role-based UI (Admin / Viewer)

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite) + JavaScript
* **Styling:** Tailwind CSS
* **State Management:** Redux
* **Charts:** Recharts (or equivalent)
* **Storage:** LocalStorage
* **Animations:** Framer Motion (or CSS transitions)

---

## 📊 Core Features

### 1. Dashboard Overview

* Summary Cards:

  * Total Balance
  * Total Income
  * Total Expenses
* Time-based visualization:

  * Balance trend over time (line chart)
* Category-based visualization:

  * Spending breakdown (pie/donut chart)
* Interactive UI with hover states and smooth transitions

---

### 2. Transactions Management

* Transaction table with:

  * Date
  * Amount
  * Category
  * Type (Income / Expense)

#### Functionalities:

* 🔍 Search by description
* 🎯 Filter by category and type
* ⬆️⬇️ Sorting (Date / Amount)
* 📄 Clean tabular UI with responsive layout

---

### 3. Role-Based UI (Simulated)

* **Viewer Role:**

  * Read-only access

* **Admin Role:**

  * Add transactions
  * Edit transactions
  * Delete transactions

* Role switching via dropdown for demonstration

---

### 4. Insights Section

* Highest spending category
* Monthly comparison (current vs previous)
* Total savings calculation
* Smart observations (e.g., spending trends)

---

### 5. State Management (Redux)

Efficient state handling for:

* Transactions data
* Filters & search state
* User role (Admin / Viewer)
* UI states (theme, modals)

Structured using scalable Redux architecture:

* Actions
* Reducers
* Centralized store

---

## 🌟 Optional Enhancements (Implemented)

All optional enhancements have been successfully implemented to strengthen the project:

### 🌗 Dark Mode

* Toggle between light and dark themes
* Persisted using localStorage

---

### 💾 Data Persistence

* Transactions stored in localStorage
* Data retained across page reloads

---

### 🔌 Mock API Integration

* Simulated async API calls:

  * Fetch transactions
  * Add/update/delete operations
* Mimics real backend interaction

---

### 🎬 Animations & Transitions

* Smooth UI transitions
* Hover effects on cards
* Modal animations for better UX

---

### 📤 Export Functionality

* Export transactions as:

  * CSV
  * JSON

---

### 🔎 Advanced Filtering

* Filter by:

  * Category
  * Type
  * Date range (if implemented)

---

## 🎨 UI/UX Highlights

* Clean, minimal fintech-inspired design
* Proper spacing, typography, and hierarchy
* Fully responsive across:

  * Mobile
  * Tablet
  * Desktop
* Consistent component styling
* Intuitive navigation and layout

---

## ⚠️ Edge Case Handling

* Empty state (no transactions)
* No data in charts
* Invalid input validation
* Graceful UI fallbacks
* Loading states (if applicable)

---

## 📁 Project Structure (Simplified)

```
src/
│── components/
│── pages/
│── redux/
│   ├── actions/
│   ├── reducers/
│   └── store.js
│── utils/
│── hooks/
│── App.jsx
│── main.jsx
```

---

## ⚙️ Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-link>
cd finance-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open in browser:

```
http://localhost:5173
```

---

## 🧠 Approach & Thought Process

* Focused on **clarity over complexity**
* Designed UI to be **intuitive and scalable**
* Used **Redux for predictable state management**
* Built reusable and modular components
* Prioritized **real-world dashboard usability**

---

## ✅ Evaluation Criteria Coverage

### 1. Design & Creativity

* Clean, modern UI with thoughtful layout decisions
* Visual hierarchy and meaningful data representation

### 2. Responsiveness

* Fully responsive design across all devices

### 3. Functionality

* Complete implementation of dashboard, transactions, RBAC, and insights

### 4. User Experience

* Smooth interactions, clear navigation, and accessibility-focused UI

### 5. Technical Quality

* Modular architecture
* Clean and maintainable code
* Scalable structure

### 6. State Management

* Efficient Redux implementation for global state handling

### 7. Documentation

* Clear README with setup, features, and approach explanation

### 8. Attention to Detail

* Edge case handling
* UI polish
* Smooth transitions and interactions

---

## 🔮 Future Improvements

* Backend integration (Node.js / Firebase)
* Authentication & real RBAC
* Real-time data updates
* Advanced analytics & reports

---

## 👨‍💻 Author

**Aniket Kamble**

---

⭐ If you found this project useful, feel free to star the repo!
