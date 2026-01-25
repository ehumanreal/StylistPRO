# StylistPRO - System Zarządzania Klientami

Profesjonalny system zarządzania klientami dla salonów fryzjerskich z backendem Node.js.

## 🚀 Instalacja i Uruchomienie

### Wymagania
- Node.js (pobierz z https://nodejs.org/)
- Dowolna przeglądarka internetowa

### Kroki

1. **Otwórz Command Prompt (CMD)** w folderze w którym masz pliki aplikacji np `salonfryzjerski`

2. **Zainstaluj zależności:**
   ```
   npm install
   ```

3. **Uruchom serwer:**
   ```
   npm start
   ```
   
   Powinieneś zobaczyć:
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

4. **Przeglądarka otworzy się automatycznie** - jeśli nie, wejdź na: http://localhost:3000
   
   ⚠️ **Trzymaj okno CMD otwarte! Aplikacja potrzebuje uruchomionego serwera.**

## 📁 Przechowywanie Danych

Dane klientów są automatycznie zapisywane w pliku **`salonClients.json`** w tym samym folderze.

- Każda zmiana (dodanie klienta, usługi, płatności) jest natychmiast zapisywana na dysku
- Plik JSON zawiera pełną historię i może być edytowany lub backupowany ręcznie
- Dane przechowywane są między sesjami

## 📋 Funkcje

✅ Zarządzanie klientami (dodawanie, edytowanie, usuwanie)  
✅ Rejestracja usług dla każdego klienta  
✅ Śledzenie płatności i zarządzanie zaległościami  
✅ Statystyki przychodu  
✅ Historia usług  
✅ Sortowanie i wyszukiwanie  
✅ Export CSV i JSON  
✅ Notatki o klientach  

## 🔧 Technologia

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js + Express
- **Baza danych:** Plik JSON (salonClients.json)

## 📝 Struktura Danych

Każdy klient zawiera:
```json
{
  "id": 1234567890,
  "name": "Imię Nazwisko",
  "phone": "123456789",
  "email": "email@example.com",
  "notes": "Notatki o kliencie",
  "services": [
    {
      "type": "Strzyżenie",
      "date": "2026-01-25",
      "price": 50,
      "notes": "Szczegóły usługi"
    }
  ],
  "payments": [
    {
      "amount": 50,
      "date": "2026-01-25",
      "method": "gotówka"
    }
  ],
  "createdAt": "2026-01-25T12:00:00.000Z"
}
```

## 🐛 Rozwiązywanie Problemów

**Problem:** "Nie mogę się połączyć z serwerem"
- Upewnij się, że serwer jest uruchomiony (`npm start`)
- Sprawdź czy pracuje na `http://localhost:3000`
- Sprawdź czy Command Prompt jest wciąż otwarty

**Problem:** Brakuje danych
- Sprawdź plik `salonClients.json`
- Upewnij się że format JSON jest prawidłowy

## 💡 Porady

- Regularnie rób backup - skopiuj plik `salonClients.json` do innego miejsca
- Możesz edytować `salonClients.json` bezpośrednio w edytorze tekstu (trzymaj JSON prawidłowy)
- Zawsze trzymaj serwer uruchomiony podczas pracy z aplikacją

---

Wersja 2.0 | StylistPRO
