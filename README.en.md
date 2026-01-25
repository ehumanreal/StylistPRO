# StylistPRO - Client Management System

Professional client management system for hair salons with Node.js backend.

## 🚀 Installation & Running

### Requirements
- Node.js (download from https://nodejs.org/)
- Any web browser

### Steps

1. **Open Command Prompt (CMD)** in the folder where you have the application files, e.g. `StylistPRO`

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run server:**
   ```
   npm start
   ```
   
   You should see:
   ```
   ╔════════════════════════════════════════════════════════╗
   ║         🚀 StylistPRO - Server Running 🚀              ║
   ║                                                         ║
   ║  🇵🇱 Serwer Salon Fryzjerski uruchomiony              ║
   ║     Dane przechowywane w: salonClients.json             ║
   ║                                                         ║
   ║  🇬🇧 Hair Salon Management System active              ║
   ║     Data stored in: salonClients.json                  ║
   ║                                                         ║
   ║  📱 Opening http://localhost:3000...                   ║
   ╚════════════════════════════════════════════════════════╝
   ```

4. **Browser will open automatically** - if not, visit: http://localhost:3000
   
   ⚠️ **Keep the CMD window open! The application needs the server running.**

## 📁 Data Storage

Client data is automatically saved in the **`salonClients.json`** file in the same folder.

- Every change (adding client, service, payment) is instantly saved to disk
- JSON file contains full history and can be manually edited or backed up
- Data persists between sessions

## 📋 Features

✅ Client management (add, edit, delete)  
✅ Service registration for each client  
✅ Payment tracking and arrears management  
✅ Revenue statistics  
✅ Service history  
✅ Sorting and search  
✅ CSV and JSON export  
✅ Client notes  

## 🔧 Technology

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js + Express
- **Database:** JSON file (salonClients.json)

## 📝 Data Structure

Each client contains:
```json
{
  "id": 1234567890,
  "name": "First Last Name",
  "phone": "123456789",
  "email": "email@example.com",
  "notes": "Client notes",
  "services": [
    {
      "type": "Haircut",
      "date": "2026-01-25",
      "price": 50,
      "notes": "Service details"
    }
  ],
  "payments": [
    {
      "amount": 50,
      "date": "2026-01-25",
      "method": "cash"
    }
  ],
  "createdAt": "2026-01-25T12:00:00.000Z"
}
```

## 🐛 Troubleshooting

**Problem:** "Cannot connect to server"
- Make sure server is running (`npm start`)
- Check if it's running on `http://localhost:3000`
- Check if Command Prompt is still open

**Problem:** Missing data
- Check `salonClients.json` file
- Make sure JSON format is valid

## 💡 Tips

- Regularly backup - copy `salonClients.json` to another location
- You can edit `salonClients.json` directly in a text editor (keep JSON valid)
- Always keep server running while using the application

---

Version 2.0 | StylistPRO

☕ Optional support: https://tipply.pl/@ehumanreal
