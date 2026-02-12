# QRadar Rule Test Stack Editor Clone

A comprehensive web application that clones IBM QRadar's Rule Test Stack Editor, enabling security analysts to create, test, and validate security rules with Building Block support.

## Features

- **Visual Rule Builder**: QRadar-style drag-and-drop interface for creating rules
- **Code Editor**: Monaco-based editor with AQL syntax highlighting
- **Building Blocks**: Full Building Block management and import/export
- **Event Testing**: Test rules against JSON events or uploaded files
- **Time-based Correlation**: Support for "N events within X time" patterns
- **Priority Validation**: BB → Logic → Regex → AQL evaluation order
- **Glassmorphism UI**: Modern, clean interface with frosted glass effects
- **Audit Trail**: Track who created/modified rules

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLite database
- YAML file storage
- PLY (Python Lex-Yacc) for AQL parsing

**Frontend:**
- React + TypeScript
- Monaco Editor
- Tailwind CSS
- React Beautiful DnD

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker Deployment

```bash
docker-compose up -d
```

## Project Structure

```
qradar_siem_editor/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── data/            # YAML storage for rules and Building Blocks
└── docker-compose.yml
```

## Documentation

- [Design Document](docs/design_document.md)
- [Implementation Plan](docs/implementation_plan.md)
- [API Documentation](http://localhost:8000/docs) (when running)

## License

MIT License

## Author

Built with ❤️ for security analysts
