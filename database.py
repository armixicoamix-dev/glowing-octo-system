import os
import sqlite3

DB_NAME = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'medical.db')

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            diagnosis TEXT NOT NULL,
            status TEXT DEFAULT 'active'
        )
    ''')
    conn.commit()
    conn.close()

def get_patients():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, age, diagnosis, status FROM patients ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    return [{'id': r[0], 'name': r[1], 'age': r[2], 'diagnosis': r[3], 'status': r[4]} for r in rows]

def add_patient(name, age, diagnosis, status='active'):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO patients (name, age, diagnosis, status) VALUES (?, ?, ?, ?)',
                   (name, age, diagnosis, status))
    conn.commit()
    conn.close()

def update_patient(patient_id, name, age, diagnosis, status):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE patients 
        SET name = ?, age = ?, diagnosis = ?, status = ?
        WHERE id = ?
    ''', (name, age, diagnosis, status, patient_id))
    conn.commit()
    conn.close()

def delete_patient(patient_id):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM patients WHERE id = ?', (patient_id,))
    conn.commit()
    conn.close()
