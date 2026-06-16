from flask import Flask, render_template, request, jsonify
from database import init_db, get_patients, add_patient, delete_patient, update_patient

app = Flask(__name__)

# Инициализация базы данных
init_db()

@app.route('/')
def index():
    return render_template('index.html')

# API: получить всех пациентов
@app.route('/api/patients', methods=['GET'])
def api_get_patients():
    patients = get_patients()
    return jsonify(patients)

# API: добавить пациента
@app.route('/api/patients', methods=['POST'])
def api_add_patient():
    data = request.json
    name = data.get('name')
    age = data.get('age')
    diagnosis = data.get('diagnosis')
    status = data.get('status', 'active')
    
    if not name or not age or not diagnosis:
        return jsonify({'error': 'Все поля обязательны'}), 400
    
    add_patient(name, age, diagnosis, status)
    return jsonify({'message': 'Пациент добавлен'}), 201

# API: обновить пациента
@app.route('/api/patients/<int:patient_id>', methods=['PUT'])
def api_update_patient(patient_id):
    data = request.json
    name = data.get('name')
    age = data.get('age')
    diagnosis = data.get('diagnosis')
    status = data.get('status')
    
    update_patient(patient_id, name, age, diagnosis, status)
    return jsonify({'message': 'Пациент обновлён'})

# API: удалить пациента
@app.route('/api/patients/<int:patient_id>', methods=['DELETE'])
def api_delete_patient(patient_id):
    delete_patient(patient_id)
    return jsonify({'message': 'Пациент удалён'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)