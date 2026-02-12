# QRadar Rule Editor - Startup Guide

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed
- Git installed

## 🚀 Quick Start (Manual)

### 1. Start Backend Server

Open a **new terminal** and run:

```powershell
cd c:\Users\ANM-TUANLT26\code\qradar_siem_editor
.\venv\Scripts\activate.ps1
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ Backend API: http://localhost:8000  
✅ API Docs: http://localhost:8000/docs

---

### 2. Start Frontend Server

Open **another new terminal** and run:

```powershell
cd c:\Users\ANM-TUANLT26\code\qradar_siem_editor\frontend
npm run dev
```

**Expected output:**
```
VITE v7.3.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ Frontend App: http://localhost:5173 (or 5174)

---

### 3. Create Admin User

Open **a third terminal** and run:

```powershell
cd c:\Users\ANM-TUANLT26\code\qradar_siem_editor
.\venv\Scripts\activate.ps1
python create_admin.py
```

**Expected output:**
```
✅ User created successfully!
Username: admin
Password: admin123
```

---

## 🔐 Login Credentials

**Username:** `admin`  
**Password:** `admin123`

---

## 📁 Project Structure

```
qradar_siem_editor/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI app entry
│   │   ├── api/          # REST API routes
│   │   ├── core/         # AQL parser & rule engine
│   │   ├── models/       # Database & Pydantic models
│   │   └── storage/      # File & DB storage
│   ├── tests/            # Backend tests
│   └── requirements.txt
│
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # Auth context
│   │   ├── api/          # API client
│   │   └── styles/       # Glassmorphism CSS
│   └── package.json
│
├── data/                 # YAML storage (auto-created)
│   ├── rules/
│   └── building_blocks/
│
└── create_admin.py       # User creation script
```

---

## 🛠️ Troubleshooting

### Backend won't start
```powershell
# Reinstall dependencies
cd backend
pip install -r requirements.txt
```

### Frontend won't start
```powershell
# Reinstall dependencies
cd frontend
npm install
```

### Port already in use
- Backend: Change port in command: `--port 8001`
- Frontend: Vite will auto-increment (5173 → 5174 → 5175)

### Database issues
```powershell
# Delete and recreate database
rm qradar_editor.db
# Restart backend (will auto-create)
```

---

## 🧪 Running Tests

### Backend Tests
```powershell
cd c:\Users\ANM-TUANLT26\code\qradar_siem_editor
.\venv\Scripts\activate.ps1
cd backend
pytest tests/
```

**Expected:** All 13 tests passing ✅

---

## 📝 Common Tasks

### Create a new user
Edit `create_admin.py` and change username/password, then run:
```powershell
python create_admin.py
```

### View API documentation
Open: http://localhost:8000/docs

### Check backend health
Open: http://localhost:8000/health

---

## 🎯 What's Working

✅ **Backend:**
- AQL Parser (8/8 tests passing)
- Rule Engine with priority validation (5/5 tests passing)
- REST API (auth, rules, Building Blocks, test)
- JWT authentication
- YAML file storage

✅ **Frontend:**
- Login page with glassmorphism UI
- Dashboard with sidebar navigation
- Rules management (list view)
- Building Blocks management (list view)
- Test Rule page with results display

---

## 🔜 Next Steps (Optional)

- Visual drag-and-drop rule builder
- Monaco code editor integration
- Event file upload
- Docker containerization

---

**GitHub Repository:** https://github.com/cheaterdxd/IBM_Qradar_clone.git
