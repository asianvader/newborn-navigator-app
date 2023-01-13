import sqlite3

DATABASE_NAME = 'baby-tracker.db'


def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    return conn


def create_tables():
    tables = [
        """CREATE TABLE IF NOT EXISTS users(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                hash TEXT NOT NULL
            )
            """,
        """CREATE TABLE IF NOT EXISTS baby_info(
                user_id,
                baby_name TEXT NOT NULL,
                dob TEXT NOT NULL
            )
            """,
        """CREATE TABLE IF NOT EXISTS activity(
                user_id,
                baby_name TEXT NOT NULL,
                activity TEXT NOT NULL,
                date TEXT NOT NULL,
                information TEXT
            )
            """
    ]
    db = get_db()
    cursor = db.cursor()
    for table in tables:
        cursor.execute(table)
