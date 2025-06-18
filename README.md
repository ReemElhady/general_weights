# Project Setup

## Requirements

- Python 3.10
- PostgreSQL

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/ReemElhady/general_weights.git

```

### 2. Install Backend

```bash
cd general_weights/backend
pip install uv
```

### 3. Setup Environment Variables

```bash
cd config
cp .env.example .env
```

Edit the `.env` file and add your environment variables (e.g., `DB_NAME`, `DB_USER`, `DB_PASSWORD`, etc.).

### 4. Create PostgreSQL Database

Create a PostgreSQL database with the same name specified in the `.env` file.

### 5. Run Migrations

```bash
uv run python manage.py migrate
```

### 6. Start Development Server

```bash
uv run python manage.py runserver
```