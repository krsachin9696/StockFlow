# Stock & Order Management — Backend API

## ⚠️ Note on Registration Fields

The original project specification lists: **First Name, Last Name, Password, Confirm Password**.

We have **added an Email field** as the unique login identifier. This is standard practice — email is necessary to securely identify users, serve as a username, and support password recovery. It does not alter any other requirement.

**Registration fields implemented:**
- First Name *(required)*
- Last Name *(required)*
- **Email** *(added — unique login identifier)*
- Password *(required, min 6 chars)*
- Confirm Password *(required, must match password)*

---

## Setup & Run

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017

### Install & Start
```bash
cd backend
npm install
npm run dev     # development (nodemon)
npm start       # production
```

### Environment (.env)
| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/stock_order_db` | MongoDB connection string |
| `JWT_SECRET` | *(change this!)* | JWT signing secret |
| `NODE_ENV` | `development` | Environment mode |

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/login` | ❌ | Login, receive JWT |
| POST | `/logout` | ✅ | Logout current device |
| POST | `/logout-all` | ✅ | Logout all devices |
| GET | `/profile` | ✅ | Get current user |

### Stocks — `/api/stocks`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | List all stocks |
| POST | `/` | ✅ | Create stock |
| DELETE | `/:id` | ✅ | Delete stock (only if orderQty = 0) |

### Orders — `/api/orders`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | List all orders |
| POST | `/` | ✅ | Create order (deducts stock qty) |
| DELETE | `/:id` | ✅ | Delete order (reverts stock qty) |

---

## Architecture (OOP + Repository Pattern)

```
HTTP Request
    ↓
Controller   (HTTP layer — validates request shape)
    ↓
Service      (Business logic — rules & validations)
    ↓
Repository   (Data access — DB queries only)
    ↓
Mongoose Model → MongoDB
```

All layers are implemented as **ES6 classes** for full OOP compliance.
