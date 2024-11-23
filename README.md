# Instrukcja pobrania i uruchomienia projektu BoardGame Exchange

## 1. Konfiguracja Git dla repozytorium prywatnego

1. Upewnij się, że masz skonfigurowany Git:
```bash
git config --global user.name "Twoja Nazwa"
git config --global user.email "twoj@email.com"
```

2. Utwórz token dostępu w GitHub:
   - Przejdź do Settings > Developer settings > Personal access tokens
   - Wygeneruj nowy token z odpowiednimi uprawnieniami (repo)
   - Skopiuj wygenerowany token

## 2. Sklonowanie repozytorium

```bash
git clone https://github.com/alekkowalczyk/boardgame-exchange.git
```

Gdy zostaniesz poproszony o hasło, użyj wygenerowanego tokenu zamiast hasła do GitHub.

## 3. Instalacja zależności

```bash
cd boardgame-exchange
npm install
```

## 4. Uruchomienie projektu

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

## Rozwiązywanie problemów

### Problem z uprawnieniami (EACCES)

```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Problem z node_modules

```bash
rm -rf node_modules package-lock.json
npm install
```

## Wymagania systemowe

- Node.js (v18.0.0 lub wyższa)
- npm (v9.0.0 lub wyższa)
- Git

## Struktura projektu

```
src/
├── components/           # Komponenty wielokrotnego użytku
│   ├── layout/          # Komponenty układu strony
│   │   └── Navbar.tsx   # Pasek nawigacji
│   ├── AuthModal.tsx    # Modal logowania/rejestracji
│   └── GameCard.tsx     # Karta gry
├── pages/               # Strony aplikacji
│   ├── HomePage.tsx     # Strona główna
│   └── GamesPage.tsx    # Lista gier
├── App.tsx              # Główny komponent aplikacji
└── main.tsx            # Punkt wejściowy aplikacji
```

## Technologie

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router Dom
- Lucide React

## Dostępne skrypty

- `npm run dev` - tryb deweloperski
- `npm run build` - build produkcyjny
- `npm run preview` - podgląd wersji produkcyjnej
