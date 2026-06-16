const API_URL = '/api/patients';

// Загрузка пациентов
async function loadPatients() {
    try {
        const response = await fetch(API_URL);
        const patients = await response.json();
        renderTable(patients);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

// Рендер таблицы
function renderTable(patients) {
    const tbody = document.getElementById('patientsTableBody');
    if (!patients || patients.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#666;">🧬 Пациентов пока нет</td></tr>`;
        return;
    }

    tbody.innerHTML = patients.map(p => `
        <tr data-id="${p.id}">
            <td><strong>#${p.id}</strong></td>
            <td>${escapeHtml(p.name)}</td>
            <td>${p.age}</td>
            <td>${escapeHtml(p.diagnosis)}</td>
            <td><span class="status-badge status-${p.status}">${translateStatus(p.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editPatient(${p.id})">✏️</button>
                    <button class="btn-delete" onclick="deletePatient(${p.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Вспомогательные функции
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function translateStatus(status) {
    const map = {
        'active': 'Активен',
        'recovered': 'Выздоровел',
        'critical': 'Критический'
    };
    return map[status] || status;
}

// Добавление пациента
document.getElementById('patientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const diagnosis = document.getElementById('diagnosis').value.trim();
    const status = document.getElementById('status').value;

    if (!name || !age || !diagnosis) {
        alert('⚠️ Заполните все поля!');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, diagnosis, status })
        });

        if (response.ok) {
            document.getElementById('patientForm').reset();
            loadPatients();
        } else {
            alert('❌ Ошибка при добавлении');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('❌ Сервер недоступен');
    }
});

// Удаление пациента
async function deletePatient(id) {
    if (!confirm(`Удалить пациента #${id}?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadPatients();
        } else {
            alert('❌ Ошибка удаления');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Редактирование (простой вариант — через prompt)
async function editPatient(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;

    const cells = row.querySelectorAll('td');
    const currentName = cells[1].textContent;
    const currentAge = cells[2].textContent;
    const currentDiagnosis = cells[3].textContent;
    const currentStatus = cells[4].querySelector('.status-badge')?.className.split('-')[1] || 'active';

    const newName = prompt('ФИО:', currentName);
    if (newName === null) return;
    const newAge = prompt('Возраст:', currentAge);
    if (newAge === null) return;
    const newDiagnosis = prompt('Диагноз:', currentDiagnosis);
    if (newDiagnosis === null) return;
    const newStatus = prompt('Статус (active / recovered / critical):', currentStatus);
    if (newStatus === null) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newName.trim(),
                age: parseInt(newAge),
                diagnosis: newDiagnosis.trim(),
                status: newStatus.trim()
            })
        });

        if (response.ok) {
            loadPatients();
        } else {
            alert('❌ Ошибка обновления');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Загружаем при старте
loadPatients();