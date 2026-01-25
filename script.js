// API URL
const API_URL = 'http://localhost:3000/api';

// Klasa do zarządzania bazą klientów
class SalonDatabase {
    constructor() {
        this.clients = [];
        this.loadClients();
    }

    // Załaduj dane z serwera
    async loadClients() {
        try {
            const response = await fetch(`${API_URL}/clients`);
            if (response.ok) {
                this.clients = await response.json();
                filterAndDisplay();
                updateStats();
                updateClientSelect();
            }
        } catch (error) {
            console.error('Błąd przy wczytywaniu klientów:', error);
            alert('Błąd: Nie mogę się połączyć z serwerem. Upewnij się, że serwer jest uruchomiony (npm start)');
        }
    }

    // Zapisz dane do serwera (automatycznie wywoływane po zmianach)
    async saveToLocalStorage() {
        // Ta metoda jest teraz nieużyteczna, ale zostawiamy dla kompatybilności
    }

    // Dodaj nowego klienta
    async addClient(clientData) {
        try {
            const response = await fetch(`${API_URL}/clients`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
            if (response.ok) {
                const client = await response.json();
                this.clients.push(client);
                filterAndDisplay();
                updateStats();
                updateClientSelect();
                return client;
            }
        } catch (error) {
            console.error('Błąd przy dodawaniu klienta:', error);
            alert('Błąd: Nie mogę się połączyć z serwerem');
        }
    }

    // Dodaj usługę do istniejącego klienta
    async addServiceToClient(clientId, serviceData) {
        try {
            const response = await fetch(`${API_URL}/clients/${clientId}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: serviceData.serviceType,
                    date: serviceData.serviceDate,
                    price: serviceData.servicePrice,
                    notes: serviceData.notes
                })
            });
            if (response.ok) {
                const client = await response.json();
                const index = this.clients.findIndex(c => c.id === clientId);
                if (index !== -1) {
                    this.clients[index] = client;
                }
                filterAndDisplay();
                updateStats();
                return client;
            }
        } catch (error) {
            console.error('Błąd przy dodawaniu usługi:', error);
            alert('Błąd: Nie mogę się połączyć z serwerem');
        }
        return null;
    }

    // Usuń klienta
    async deleteClient(clientId) {
        try {
            const response = await fetch(`${API_URL}/clients/${clientId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.clients = this.clients.filter(c => c.id !== clientId);
                filterAndDisplay();
                updateStats();
                updateClientSelect();
            }
        } catch (error) {
            console.error('Błąd przy usuwaniu klienta:', error);
            alert('Błąd: Nie mogę się połączyć z serwerem');
        }
    }

    // Usuń usługę klienta
    async deleteService(clientId, serviceIndex) {
        try {
            const response = await fetch(`${API_URL}/clients/${clientId}/services/${serviceIndex}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const client = this.clients.find(c => c.id === clientId);
                if (client) {
                    client.services.splice(serviceIndex, 1);
                    filterAndDisplay();
                    updateStats();
                }
            }
        } catch (error) {
            console.error('Błąd przy usuwaniu usługi:', error);
            alert('Błąd: Nie mogę się połączyć z serwerem');
        }
    }

    // Wyszukaj klientów
    searchClients(query) {
        const lowerQuery = query.toLowerCase();
        return this.clients.filter(client => 
            client.name.toLowerCase().includes(lowerQuery) ||
            client.phone.includes(query)
        );
    }

    // Filtruj po typie usługi
    filterByService(serviceType) {
        if (!serviceType) return this.clients;
        return this.clients.filter(client =>
            client.services.some(service => service.type === serviceType)
        );
    }

    // Edytuj dane klienta
    editClientData(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            client.name = arguments[1];
            client.phone = arguments[2];
            client.email = arguments[3];
            this.saveToLocalStorage();
            return client;
        }
        return null;
    }

    // Pobierz wszystkich klientów
    getAllClients() {
        return this.clients;
    }

    // Znajdź klienta po ID
    getClientById(clientId) {
        return this.clients.find(c => c.id === clientId);
    }

    // Dodaj płatność klienta
    addPaymentToClient(clientId, paymentData) {
        try {
            fetch(`${API_URL}/clients/${clientId}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: paymentData.amount,
                    date: paymentData.date,
                    method: paymentData.method
                })
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
            }).then(client => {
                const index = this.clients.findIndex(c => c.id === clientId);
                if (index !== -1) {
                    this.clients[index] = client;
                }
                filterAndDisplay();
                updateStats();
            });
        } catch (error) {
            console.error('Błąd przy dodawaniu płatności:', error);
            alert('Błąd: Nie mogę się połączyć z serwerem');
        }
    }

    // Eksportuj dane do JSON
    exportToJSON() {
        return JSON.stringify(this.clients, null, 2);
    }

    // Importuj dane z JSON
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (Array.isArray(data)) {
                this.clients = data;
                this.saveToLocalStorage();
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}

// Instancja bazy danych (inicjalizacja na koncu)
let db;

// Elementy DOM
const newClientForm = document.getElementById('newClientForm');
const newClientName = document.getElementById('newClientName');
const newClientPhone = document.getElementById('newClientPhone');
const newClientEmail = document.getElementById('newClientEmail');
const newClientNotes = document.getElementById('newClientNotes');
const resetNewClientBtn = document.getElementById('resetNewClientBtn');

const clientForm = document.getElementById('clientForm');
const clientSelect = document.getElementById('clientSelect');
const serviceTypeSelect = document.getElementById('serviceType');
const serviceDateInput = document.getElementById('serviceDate');
const servicePriceInput = document.getElementById('servicePrice');
const notesInput = document.getElementById('notes');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
const filterService = document.getElementById('filterService');
const sortBy = document.getElementById('sortBy');
const clientsList = document.getElementById('clientsList');
const clientCount = document.getElementById('clientCount');
const exportBtn = document.getElementById('exportBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const importJsonBtn = document.getElementById('importJsonBtn');
const importFileInput = document.getElementById('importFileInput');

// Elementy statystyk
const statTotalClients = document.getElementById('statTotalClients');
const statTotalRevenue = document.getElementById('statTotalRevenue');
const statRevenue30Days = document.getElementById('statRevenue30Days');
const statMostPopular = document.getElementById('statMostPopular');
const statTotalArrears = document.getElementById('statTotalArrears');

// Elementy zaległości
const arrearsList = document.getElementById('arrearsList');
const arrearsCount = document.getElementById('arrearsCount');

// Elementy modalu edycji
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editClientName = document.getElementById('editClientName');
const editClientPhone = document.getElementById('editClientPhone');
const editClientEmail = document.getElementById('editClientEmail');
const editClientNotes = document.getElementById('editClientNotes');

// Elementy modalu pełnej historii
const allServicesModal = document.getElementById('allServicesModal');
const allServicesList = document.getElementById('allServicesList');
const allServicesClientName = document.getElementById('allServicesClientName');

// Elementy modalu edycji usługi
const editServiceModal = document.getElementById('editServiceModal');
const editServiceForm = document.getElementById('editServiceForm');
const editServiceType = document.getElementById('editServiceType');
const editServiceDate = document.getElementById('editServiceDate');
const editServicePrice = document.getElementById('editServicePrice');
const editServiceNotes = document.getElementById('editServiceNotes');

// Elementy modalu rozliczania
const settlementModal = document.getElementById('settlementModal');
const settlementForm = document.getElementById('settlementForm');
const settlementClientName = document.getElementById('settlementClientName');
const settlementTotal = document.getElementById('settlementTotal');
const settlementPaid = document.getElementById('settlementPaid');
const settlementDue = document.getElementById('settlementDue');
const settlementAmount = document.getElementById('settlementAmount');
const settlementDate = document.getElementById('settlementDate');
const settlementMethod = document.getElementById('settlementMethod');

let currentEditingClientId = null;
let currentEditingServiceId = null;
let currentSettlementClientId = null;

// Event listenery dla zakładek
document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
});

// Funkcja do przełączania zakładek
function switchTab(tabName) {
    // Ukryj wszystkie zawartości
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Usuń aktywną klasę ze wszystkich przycisków
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Pokaż wybraną zawartość
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Zaznacz wybrany przycisk
    event.target.classList.add('active');
}

// Event listenery
newClientForm.addEventListener('submit', handleNewClientSubmit);
resetNewClientBtn.addEventListener('click', resetNewClientForm);
clientForm.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetForm);
searchInput.addEventListener('input', filterAndDisplay);
filterService.addEventListener('change', filterAndDisplay);
sortBy.addEventListener('change', filterAndDisplay);
exportBtn.addEventListener('click', exportToCSV);
exportJsonBtn.addEventListener('click', exportJSON);
importJsonBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', handleImportJSON);
editForm.addEventListener('submit', handleEditSubmit);
editServiceForm.addEventListener('submit', handleEditServiceSubmit);
settlementForm.addEventListener('submit', handleSettlementSubmit);
window.addEventListener('click', handleModalClick);

// Obsługa formularza dodawania nowego klienta
function handleNewClientSubmit(e) {
    e.preventDefault();

    const newClientData = {
        name: newClientName.value.trim(),
        phone: newClientPhone.value.trim(),
        email: newClientEmail.value.trim(),
        notes: newClientNotes.value.trim()
    };

    if (!newClientData.name) {
        alert('Proszę podać imię i nazwisko!');
        return;
    }

    // Sprawdź, czy klient już istnieje
    const existingClient = db.getAllClients().find(c => 
        c.name.toLowerCase() === newClientData.name.toLowerCase()
    );

    if (existingClient) {
        alert(`Klient "${newClientData.name}" już istnieje w bazie!`);
        return;
    }

    db.addClient(newClientData);
    alert('Nowy klient dodany do bazy!');
    resetNewClientForm();
    filterAndDisplay();
}

// Resetuj formularz dodawania nowego klienta
function resetNewClientForm() {
    newClientForm.reset();
}

// Obsługa formularza dodawania usługi
function handleFormSubmit(e) {
    e.preventDefault();

    if (!clientSelect.value) {
        alert('Proszę wybrać klienta!');
        return;
    }

    const clientId = parseInt(clientSelect.value);
    const formData = {
        serviceType: serviceTypeSelect.value,
        serviceDate: serviceDateInput.value,
        servicePrice: parseFloat(servicePriceInput.value) || 0,
        notes: notesInput.value.trim()
    };

    db.addServiceToClient(clientId, formData);
    alert('Usługa dodana do klienta!');

    resetForm();
    filterAndDisplay();
}

// Resetuj formularz
function resetForm() {
    clientForm.reset();
    currentEditingClientId = null;
    // Ustaw dzisiejszą datę
    const today = new Date().toISOString().split('T')[0];
    serviceDateInput.value = today;
    updateClientSelect();
}

// Aktualizuj listę klientów w select
function updateClientSelect() {
    const clients = db.getAllClients();
    const currentValue = clientSelect.value;
    
    const options = clients.map(client => 
        `<option value="${client.id}">${escapeHtml(client.name)}</option>`
    );

    clientSelect.innerHTML = '<option value="">-- Wybierz klienta --</option>' + options.join('');
    
    if (currentValue && clients.find(c => c.id === parseInt(currentValue))) {
        clientSelect.value = currentValue;
    }
}

// Otworz modal edycji
function openEditModal(clientId) {
    const client = db.getClientById(clientId);
    if (client) {
        currentEditingClientId = clientId;
        editClientName.value = client.name;
        editClientPhone.value = client.phone;
        editClientEmail.value = client.email;
        editClientNotes.value = client.notes || '';
        editModal.style.display = 'block';
        editClientName.focus();
    }
}

// Zamknij modal edycji
function closeEditModal() {
    editModal.style.display = 'none';
    currentEditingClientId = null;
    editForm.reset();
}

// Obsługa formularza edycji
function handleEditSubmit(e) {
    e.preventDefault();
    
    if (currentEditingClientId) {
        const clientData = {
            name: editClientName.value.trim(),
            phone: editClientPhone.value.trim(),
            email: editClientEmail.value.trim(),
            notes: editClientNotes.value.trim()
        };
        
        fetch(`${API_URL}/clients/${currentEditingClientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(client => {
            const index = db.clients.findIndex(c => c.id === currentEditingClientId);
            if (index !== -1) {
                db.clients[index] = client;
            }
            alert('Dane klienta zaktualizowane!');
            closeEditModal();
            filterAndDisplay();
            updateClientSelect();
        }).catch(error => {
            console.error('Błąd:', error);
            alert('Błąd przy aktualizacji klienta');
        });
    }
}

// Obsługa klikania na modal
function handleModalClick(e) {
    if (e.target === editModal) {
        closeEditModal();
    }
    if (e.target === editServiceModal) {
        closeEditServiceModal();
    }
}

// Otworz modal edycji usługi
function openEditServiceModal(clientId, serviceIndex) {
    const client = db.getClientById(clientId);
    if (client && client.services[serviceIndex]) {
        const service = client.services[serviceIndex];
        currentEditingServiceId = { clientId, serviceIndex };
        
        editServiceType.value = service.type;
        editServiceDate.value = service.date;
        editServicePrice.value = service.price;
        editServiceNotes.value = service.notes;
        
        editServiceModal.style.display = 'block';
        editServiceType.focus();
    }
}

// Zamknij modal edycji usługi
function closeEditServiceModal() {
    editServiceModal.style.display = 'none';
    currentEditingServiceId = null;
    editServiceForm.reset();
}

// Obsługa formularza edycji usługi
function handleEditServiceSubmit(e) {
    e.preventDefault();
    
    if (currentEditingServiceId) {
        const { clientId, serviceIndex } = currentEditingServiceId;
        const serviceData = {
            type: editServiceType.value,
            date: editServiceDate.value,
            price: parseFloat(editServicePrice.value) || 0,
            notes: editServiceNotes.value.trim()
        };
        
        fetch(`${API_URL}/clients/${clientId}/services/${serviceIndex}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serviceData)
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(client => {
            const index = db.clients.findIndex(c => c.id === clientId);
            if (index !== -1) {
                db.clients[index] = client;
            }
            alert('Usługa zaktualizowana!');
            closeEditServiceModal();
            filterAndDisplay();
            updateStats();
        }).catch(error => {
            console.error('Błąd:', error);
            alert('Błąd przy aktualizacji usługi');
        });
    }
}

// Filtruj i wyświetl klientów
function filterAndDisplay() {
    const searchQuery = searchInput.value;
    const filterType = filterService.value;

    let filtered = db.getAllClients();

    if (searchQuery) {
        filtered = db.searchClients(searchQuery);
    }

    if (filterType) {
        filtered = filtered.filter(client =>
            client.services.some(service => service.type === filterType)
        );
    }

    filtered = sortClients(filtered);
    displayClients(filtered);
    updateClientCount(filtered.length);
    updateClientSelect();
}

// Wyświetl klientów
function displayClients(clients) {
    if (clients.length === 0) {
        clientsList.innerHTML = '<p class="empty-message">Brak klientów spełniających kryteria wyszukiwania.</p>';
        return;
    }

    clientsList.innerHTML = clients.map(client => `
        <div class="client-card">
            <div class="client-header">
                <h3>${escapeHtml(client.name)}</h3>
                <div class="client-header-buttons">
                    <button class="btn-edit" onclick="openEditModal(${client.id})">Edytuj dane</button>
                    <button class="btn-settlement" onclick="openSettlementModal(${client.id})">Rozlicz</button>
                    <button class="btn-delete" onclick="deleteClient(${client.id})">Usuń</button>
                </div>
            </div>
            <div class="client-info">
                ${client.phone ? `<p><strong>Telefon:</strong> ${escapeHtml(client.phone)}</p>` : '<p><strong>Telefon:</strong> <em>Nie podano</em></p>'}
                ${client.email ? `<p><strong>Email:</strong> ${escapeHtml(client.email)}</p>` : '<p><strong>Email:</strong> <em>Nie podano</em></p>'}
                ${client.notes ? `<p><strong>Uwagi:</strong> ${escapeHtml(client.notes)}</p>` : ''}
            </div>
            <div class="services-section">
                <h4>Historia usług:</h4>
                <div class="services-list">
                    ${client.services.length === 0 ? '<p class="no-services">Brak zarejestrowanych usług</p>' : (() => {
                        const sortedServices = client.services.map((service, idx) => ({ ...service, originalIndex: idx }));
                        sortedServices.sort((a, b) => new Date(b.date) - new Date(a.date));
                        const displayedServices = sortedServices.slice(0, 3);
                        const hasMore = sortedServices.length > 3;
                        return displayedServices.map((service) => `
                        <div class="service-item">
                            <div class="service-details">
                                <span class="service-type">${escapeHtml(service.type || 'Usługa')}</span>
                                <span class="service-date">${formatDate(service.date)}</span>
                                <span class="service-price">${service.price ? service.price.toFixed(2) + ' zł' : 'Bez ceny'}</span>
                            </div>
                            ${service.notes ? `<p class="service-notes"><strong>Uwagi:</strong> ${escapeHtml(service.notes)}</p>` : ''}
                            <div class="service-buttons">
                                <button class="btn-edit-service" onclick="openEditServiceModal(${client.id}, ${service.originalIndex})">Edytuj</button>
                                <button class="btn-delete-service" onclick="deleteService(${client.id}, ${service.originalIndex})">Usuń</button>
                            </div>
                        </div>
                    `).join('') + (hasMore ? `<div class="load-more"><button class="btn btn-secondary" onclick="openAllServicesModal(${client.id})">Wczytaj wszystkie usługi (${sortedServices.length} razem)</button></div>` : '');
                    })()}
                </div>
            </div>
        </div>
    `).join('');
}

// Aktualizuj licznik klientów
function updateClientCount(count) {
    const totalClients = db.getAllClients().length;
    if (count === totalClients) {
        clientCount.textContent = `${count} ${getPlural(count)}`;
    } else {
        clientCount.textContent = `${count} ${getPlural(count)} (z ${totalClients} razem)`;
    }
}

// Usuń klienta
function deleteClient(clientId) {
    const client = db.getClientById(clientId);
    if (confirm(`Czy na pewno chcesz usunąć klienta "${client.name}" wraz z całą historią usług?`)) {
        db.deleteClient(clientId);
        filterAndDisplay();
    }
}

// Usuń usługę
function deleteService(clientId, serviceIndex) {
    if (confirm('Czy na pewno chcesz usunąć tę usługę?')) {
        db.deleteService(clientId, serviceIndex);
        filterAndDisplay();
    }
}

// Eksportuj do CSV
function exportToCSV() {
    const clients = db.getAllClients();
    if (clients.length === 0) {
        alert('Baza klientów jest pusta!');
        return;
    }

    let csv = 'Imię i nazwisko,Telefon,Email,Typ usługi,Data usługi,Cena,Uwagi\n';
    
    clients.forEach(client => {
        client.services.forEach(service => {
            csv += `"${client.name}","${client.phone}","${client.email}","${service.type}","${service.date}","${service.price}","${service.notes}"\n`;
        });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `klienci_salon_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Funkcje pomocnicze
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function getPlural(count) {
    if (count === 1) return 'klient';
    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'klientów';
    return 'klientów';
}

// Inicjalizacja
window.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    serviceDateInput.value = today;
    settlementDate.value = today;
    filterAndDisplay();
    updateStats();
});

// ==================== STATYSTYKI ====================

// Oblicz i wyświetl statystyki
function updateStats() {
    const clients = db.getAllClients();
    
    // Total clients
    statTotalClients.textContent = clients.length;
    
    // Total revenue (tylko z rozliczonych płatności)
    let totalRevenue = 0;
    let revenue30Days = 0;
    let totalArrears = 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    clients.forEach(client => {
        // Przychód z zapłaconych kwot
        (client.payments || []).forEach(payment => {
            const paymentAmount = parseFloat(payment.amount) || 0;
            totalRevenue += paymentAmount;
            
            // Count payments in last 30 days
            const paymentDate = new Date(payment.date);
            if (paymentDate >= thirtyDaysAgo) {
                revenue30Days += paymentAmount;
            }
        });
        
        // Zaległości - różnica między całkowitym kosztem usług a zapłaconymi kwotami
        const totalSpent = client.services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
        const totalPaid = (client.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const clientArrears = Math.max(0, totalSpent - totalPaid);
        totalArrears += clientArrears;
    });
    
    // Najpopularniejsza usługa (liczę wykonane, ale dla statystyki)
    const serviceTypeCounts = {};
    clients.forEach(client => {
        client.services.forEach(service => {
            serviceTypeCounts[service.type] = (serviceTypeCounts[service.type] || 0) + 1;
        });
    });
    
    statTotalRevenue.textContent = totalRevenue.toFixed(2) + ' zł';
    statRevenue30Days.textContent = revenue30Days.toFixed(2) + ' zł';
    statTotalArrears.textContent = totalArrears.toFixed(2) + ' zł';
    
    // Most popular service
    if (Object.keys(serviceTypeCounts).length > 0) {
        const mostPopular = Object.entries(serviceTypeCounts)
            .sort((a, b) => b[1] - a[1])[0];
        statMostPopular.textContent = mostPopular[0] + ' (' + mostPopular[1] + ')';
    } else {
        statMostPopular.textContent = '—';
    }
    
    // Update arrears
    updateArrears();
}

// ==================== ZALEGŁOŚCI ====================

// Oblicz i wyświetl zaległości
function updateArrears() {
    const clients = db.getAllClients();
    const arrears = [];
    
    clients.forEach(client => {
        const totalSpent = client.services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
        const totalPaid = (client.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const due = totalSpent - totalPaid;
        
        if (due > 0) {
            // Znajdź ostatnią usługę
            const lastService = client.services.length > 0 
                ? client.services[client.services.length - 1] 
                : null;
            
            arrears.push({
                id: client.id,
                name: client.name,
                phone: client.phone,
                due: due,
                lastServiceDate: lastService ? lastService.date : null,
                lastServiceType: lastService ? lastService.type : null
            });
        }
    });
    
    // Sortuj po zaległości (największa na górze)
    arrears.sort((a, b) => b.due - a.due);
    
    // Wyświetl zaległości
    displayArrears(arrears);
}

// Wyświetl zaległości
function displayArrears(arrears) {
    if (arrears.length === 0) {
        arrearsList.innerHTML = '<p class="empty-message">Brak zaległości! Wszyscy klienci rozliczeni. 🎉</p>';
        arrearsCount.textContent = '0 klientów';
        return;
    }
    
    arrearsList.innerHTML = arrears.map(arrear => `
        <div class="arrears-card">
            <div class="arrears-header">
                <div class="arrears-info">
                    <h3>${escapeHtml(arrear.name)}</h3>
                    ${arrear.phone ? `<p class="arrears-phone">${escapeHtml(arrear.phone)}</p>` : ''}
                </div>
                <div class="arrears-amount">
                    <span class="amount-label">Do zapłaty:</span>
                    <span class="amount-value">${arrear.due.toFixed(2)} zł</span>
                </div>
            </div>
            <div class="arrears-details">
                ${arrear.lastServiceDate ? `
                    <p><strong>Ostatnia usługa:</strong> ${escapeHtml(arrear.lastServiceType)} (${formatDate(arrear.lastServiceDate)})</p>
                ` : '<p><strong>Ostatnia usługa:</strong> Brak danych</p>'}
            </div>
            <div class="arrears-buttons">
                <button class="btn-settlement" onclick="openSettlementModal(${arrear.id})">Rozlicz</button>
                <button class="btn-edit" onclick="openEditModal(${arrear.id})">Edytuj klienta</button>
            </div>
        </div>
    `).join('');
    
    arrearsCount.textContent = arrears.length + ' ' + getPlural(arrears.length);
}

// Sortuj klientów
function sortClients(clients) {
    const sortValue = sortBy.value || 'name';
    const sorted = [...clients];
    
    switch(sortValue) {
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
            break;
        case 'name-desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name, 'pl'));
            break;
        case 'lastService':
            sorted.sort((a, b) => {
                const getLastServiceDate = (client) => {
                    if (client.services.length === 0) return new Date(0);
                    const dates = client.services.map(s => new Date(s.date));
                    return new Date(Math.max(...dates));
                };
                return getLastServiceDate(b) - getLastServiceDate(a);
            });
            break;
        case 'totalSpent':
            sorted.sort((a, b) => {
                const spentA = a.services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
                const spentB = b.services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
                return spentB - spentA;
            });
            break;
    }
    
    return sorted;
}

// ==================== ROZLICZANIE ====================

// Otwórz modal rozliczania
function openSettlementModal(clientId) {
    const client = db.getClientById(clientId);
    if (client) {
        currentSettlementClientId = clientId;
        settlementClientName.textContent = client.name;
        
        // Oblicz sumy
        const totalSpent = client.services.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
        const totalPaid = (client.payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const due = totalSpent - totalPaid;
        
        settlementTotal.textContent = totalSpent.toFixed(2) + ' zł';
        settlementPaid.textContent = totalPaid.toFixed(2) + ' zł';
        settlementDue.textContent = due.toFixed(2) + ' zł';
        settlementDue.className = due > 0 ? 'amount amount-due' : 'amount';
        
        settlementAmount.value = Math.max(0, due).toFixed(2);
        settlementAmount.max = due;
        
        const today = new Date().toISOString().split('T')[0];
        settlementDate.value = today;
        
        settlementModal.style.display = 'block';
    }
}

// Zamknij modal rozliczania
function closeSettlementModal() {
    settlementModal.style.display = 'none';
    currentSettlementClientId = null;
    settlementForm.reset();
}

// Otwórz modal z pełną historią usług
function openAllServicesModal(clientId) {
    const client = db.getClientById(clientId);
    if (client) {
        allServicesClientName.textContent = client.name;
        
        const sortedServices = client.services.map((service, idx) => ({ ...service, originalIndex: idx }));
        sortedServices.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        allServicesList.innerHTML = sortedServices.length === 0 ? '<p class="no-services">Brak zarejestrowanych usług</p>' : sortedServices.map((service) => `
            <div class="service-item">
                <div class="service-details">
                    <span class="service-type">${escapeHtml(service.type || 'Usługa')}</span>
                    <span class="service-date">${formatDate(service.date)}</span>
                    <span class="service-price">${service.price ? service.price.toFixed(2) + ' zł' : 'Bez ceny'}</span>
                </div>
                ${service.notes ? `<p class="service-notes"><strong>Uwagi:</strong> ${escapeHtml(service.notes)}</p>` : ''}
                <div class="service-buttons">
                    <button class="btn-edit-service" onclick="openEditServiceModal(${clientId}, ${service.originalIndex})">Edytuj</button>
                    <button class="btn-delete-service" onclick="deleteService(${clientId}, ${service.originalIndex})">Usuń</button>
                </div>
            </div>
        `).join('');
        
        allServicesModal.style.display = 'block';
    }
}

// Zamknij modal pełnej historii
function closeAllServicesModal() {
    allServicesModal.style.display = 'none';
}

// Obsługa formularza rozliczania
function handleSettlementSubmit(e) {
    e.preventDefault();
    
    if (currentSettlementClientId) {
        const paymentData = {
            amount: parseFloat(settlementAmount.value) || 0,
            date: settlementDate.value,
            method: settlementMethod.value
        };
        
        db.addPaymentToClient(currentSettlementClientId, paymentData);
        alert('Wpłata zapisana!');
        closeSettlementModal();
        filterAndDisplay();
        updateStats();
    }
}

// ==================== BACKUP I RESTORE ====================

// Eksportuj do JSON
function exportJSON() {
    const json = db.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_salon_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Importuj z JSON
function handleImportJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const success = db.importFromJSON(event.target.result);
        if (success) {
            alert('Dane przywrócone pomyślnie!');
            filterAndDisplay();
            updateStats();
        } else {
            alert('Błąd: Nieprawidłowy format pliku!');
        }
    };
    reader.readAsText(file);
    importFileInput.value = '';
}

// Inicjalizacja aplikacji
document.addEventListener('DOMContentLoaded', () => {
    db = new SalonDatabase();
});
