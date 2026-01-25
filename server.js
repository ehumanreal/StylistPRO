const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'salonClients.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Funkcja do wczytania danych z pliku
function loadClients() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Błąd przy wczytywaniu danych:', error);
        return [];
    }
}

// Funkcja do zapisania danych do pliku
function saveClients(clients) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(clients, null, 2), 'utf-8');
        console.log('Dane zapisane do pliku');
    } catch (error) {
        console.error('Błąd przy zapisywaniu danych:', error);
    }
}

// GET - Pobierz wszystkich klientów
app.get('/api/clients', (req, res) => {
    const clients = loadClients();
    res.json(clients);
});

// POST - Dodaj nowego klienta
app.post('/api/clients', (req, res) => {
    const clients = loadClients();
    const newClient = {
        id: Date.now(),
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        notes: req.body.notes || '',
        services: [],
        payments: [],
        createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    saveClients(clients);
    res.json(newClient);
});

// GET - Pobierz konkretnego klienta
app.get('/api/clients/:id', (req, res) => {
    const clients = loadClients();
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client) {
        res.json(client);
    } else {
        res.status(404).json({ error: 'Klient nie znaleziony' });
    }
});

// PUT - Aktualizuj klienta
app.put('/api/clients/:id', (req, res) => {
    const clients = loadClients();
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client) {
        client.name = req.body.name || client.name;
        client.phone = req.body.phone || client.phone;
        client.email = req.body.email || client.email;
        client.notes = req.body.notes !== undefined ? req.body.notes : client.notes;
        saveClients(clients);
        res.json(client);
    } else {
        res.status(404).json({ error: 'Klient nie znaleziony' });
    }
});

// DELETE - Usuń klienta
app.delete('/api/clients/:id', (req, res) => {
    let clients = loadClients();
    const index = clients.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        const deletedClient = clients[index];
        clients.splice(index, 1);
        saveClients(clients);
        res.json({ message: 'Klient usunięty', client: deletedClient });
    } else {
        res.status(404).json({ error: 'Klient nie znaleziony' });
    }
});

// POST - Dodaj usługę do klienta
app.post('/api/clients/:id/services', (req, res) => {
    const clients = loadClients();
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client) {
        client.services.push({
            type: req.body.type,
            date: req.body.date,
            price: req.body.price,
            notes: req.body.notes || ''
        });
        saveClients(clients);
        res.json(client);
    } else {
        res.status(404).json({ error: 'Klient nie znaleziony' });
    }
});

// PUT - Aktualizuj usługę klienta
app.put('/api/clients/:id/services/:serviceIndex', (req, res) => {
    const clients = loadClients();
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client && client.services[req.params.serviceIndex]) {
        client.services[req.params.serviceIndex] = {
            type: req.body.type,
            date: req.body.date,
            price: req.body.price,
            notes: req.body.notes || ''
        };
        saveClients(clients);
        res.json(client);
    } else {
        res.status(404).json({ error: 'Usługa nie znaleziona' });
    }
});

// DELETE - Usuń usługę klienta
app.delete('/api/clients/:id/services/:serviceIndex', (req, res) => {
    const clients = loadClients();
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client && client.services[req.params.serviceIndex]) {
        client.services.splice(req.params.serviceIndex, 1);
        saveClients(clients);
        res.json(client);
    } else {
        res.status(404).json({ error: 'Usługa nie znaleziona' });
    }
});

// POST - Dodaj płatność do klienta
app.post('/api/clients/:id/payments', (req, res) => {
    const clients = loadClients();
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (client) {
        if (!client.payments) client.payments = [];
        client.payments.push({
            amount: req.body.amount,
            date: req.body.date,
            method: req.body.method
        });
        saveClients(clients);
        res.json(client);
    } else {
        res.status(404).json({ error: 'Klient nie znaleziony' });
    }
});

// POST - Export wszystkich danych
app.get('/api/export', (req, res) => {
    const clients = loadClients();
    res.json(clients);
});

// POST - Import danych
app.post('/api/import', (req, res) => {
    try {
        saveClients(req.body);
        res.json({ message: 'Dane zaimportowane pomyślnie' });
    } catch (error) {
        res.status(400).json({ error: 'Błąd przy imporcie danych' });
    }
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║         🚀 StylistPRO - Server Running 🚀              ║
║                                                         ║
║  🇵🇱 Serwer Salon Fryzjerski uruchomiony              ║
║     Dane przechowywane w: salonClients.json             ║
║                                                         ║
║  🇬🇧 Hair Salon Management System active              ║
║     Data stored in: salonClients.json                  ║
║                                                         ║
║  📱 Opening http://localhost:${PORT}...                ║
╚════════════════════════════════════════════════════════╝
    `);
    
    // Otwórz przeglądarkę / Open browser
    const url = `http://localhost:${PORT}`;
    if (process.platform === 'win32') {
        exec(`start ${url}`);
    } else if (process.platform === 'darwin') {
        exec(`open ${url}`);
    } else {
        exec(`xdg-open ${url}`);
    }
});
