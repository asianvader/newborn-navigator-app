from db import get_db
import sqlite3


def insert_user(username, hash):
    db = get_db()
    cursor = db.cursor()
    statement = "INSERT INTO users(username, hash) VALUES (?,?)"
    cursor.execute(statement, [username, hash])
    db.commit()
    return True


def check_user(username):
    db = get_db()
    cursor = db.cursor()
    cursor.row_factory = sqlite3.Row
    statement = "SELECT * FROM users WHERE username = ?"
    values = cursor.execute(statement, [username]).fetchall()
    convert_data = []
    # Loop through to extract column headings and output as a dictionary
    for item in values:
        convert_data.append({k: item[k] for k in item.keys()})
    return convert_data


def check_baby_info(id):
    db = get_db()
    cursor = db.cursor()
    cursor.row_factory = sqlite3.Row
    statement = "SELECT users.id, users.username, baby_info.baby_name, baby_info.dob FROM users JOIN baby_info ON users.id = baby_info.user_id WHERE users.id = ?"
    values = cursor.execute(statement, [id]).fetchall()
    convert_data = []
    # Loop through to extract column headings and output as a dictionary
    for item in values:
        convert_data.append({k: item[k] for k in item.keys()})
    return convert_data


def add_baby(name, dob, id):
    db = get_db()
    cursor = db.cursor()
    statement = "INSERT INTO baby_info(baby_name, user_id, dob) VALUES (?,?,?)"
    cursor.execute(statement, [name, id, dob])
    db.commit()
    return True


def log_activity(activity, name, id, date, information):
    db = get_db()
    cursor = db.cursor()
    statement = "INSERT INTO activity(baby_name, user_id, date, activity, information) VALUES (?,?,?,?,?)"
    cursor.execute(statement, [name, id, date, activity, information])
    db.commit()
    return True


def get_activity_history(id, baby, activity):
    db = get_db()
    cursor = db.cursor()
    cursor.row_factory = sqlite3.Row
    statement = "SELECT * FROM activity WHERE user_id = ? AND baby_name = ? AND activity = ?"
    values = cursor.execute(statement, [id, baby, activity]).fetchall()
    convert_data = []
    # Loop through to extract column headings and output as a dictionary
    for item in values:
        convert_data.append({k: item[k] for k in item.keys()})
    return convert_data
