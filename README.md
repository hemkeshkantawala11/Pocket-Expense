
# PocketExpense

PocketExpense+ is a full-stack **expense tracking mobile application** built using **React Native (Expo)** and **Node.js + Express**, with **MongoDB** as the database.  
Unlike basic expense trackers, PocketExpense+ provides **deep insights**, **offline support**, and a **clean dark-mode UI**.

---

## Features

### Authentication
- User registration & login
- JWT-based authentication
- Secure logout
- Change password feature

### Expense Management
- Add, edit, delete expenses
- Fields: amount, category, payment method, date
- Category & payment method dropdowns
- Calendar-based date picker

### Offline Support
- Add expenses while offline
- Automatically syncs when internet is restored
- Uses AsyncStorage as an offline queue

### Filtering & Search
- Filter expenses by custom date range (calendar-based)
- Search expenses by category or payment method

### Insights & Analytics
- Monthly total spend
- Average daily spending
- Month-over-month spending comparison
- Category-wise breakdown (Pie Chart)
- Dynamic month & year selection

### UI / UX
- Complete dark mode support
- Clean card-based UI
- No default headers for a modern look

---

## Tech Stack

### Frontend
- React Native (Expo)
- React Navigation (Stack + Tabs)
- Context API
- Axios
- AsyncStorage
- Victory Native (Charts)
- React Native Calendars

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- REST APIs

---

## Project Structure

### Backend
```
backend/
 ├── src/
 │   ├── config/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middleware/
 │   ├── app.js
 │   └── server.js
 ├── .env
 └── package.json
```

### Frontend
```
frontend/
 ├── src/
 │   ├── screens/
 │   ├── navigation/
 │   ├── context/
 │   ├── services/
 │   ├── utils/
 │   └── theme/
 └── App.js
```

---

## API Endpoints (Backend)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/change-password`

### Expenses
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

### Analytics
- `GET /api/expenses/analytics/monthly`
- `GET /api/expenses/analytics/insight`
- `GET /api/expenses/analytics/category`
- `GET /api/expenses/analytics/top-category`
- `GET /api/expenses/analytics/average-daily`

---

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:
```
PORT=5000
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=your_secret
```

---

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

> Update API base URL in `src/services/api.js`  
- Emulator: `http://10.0.2.2:5000/api`
- Physical device: `http://<your-ip>:5000/api`

---

## Design Decisions

- Analytics computed on backend using MongoDB aggregation
- JWT kept stateless; logout handled on client
- Offline-first approach for reliability
- Context API for simplicity and clarity
- Modular, scalable folder structure

---

## Assignment Highlights

✔ Full-stack implementation  
✔ Offline-first support  
✔ Real-world analytics  
✔ Clean UI with dark mode  
✔ Proper error handling  
✔ Production-grade architecture  

---

## Author

**Hemkesh Kantawala**  
Full-Stack Developer  

---

## License
This project is part of an academic assignment and is intended for evaluation purposes only.
