# Frontend Dokumentáció

## Áttekintés

A frontend egy React + TypeScript alkalmazás, amely Vite-tal van buildelve. Modern, reszponzív felületet biztosít a Quiz Management System használatához.

## Technológiai Stack

| Technológia | Verzió | Leírás |
|-------------|--------|--------|
| React | 18.x | Frontend framework |
| TypeScript | 5.x | Típusos JavaScript |
| Vite | 7.x | Build tool és dev server |
| React Router | 6.x | Kliens oldali routing |
| SCSS | - | Styling |

## Projekt Struktúra

```
frontend/
├── src/
│   ├── components/         # Újrahasználható komponensek
│   │   └── common/
│   │       └── Navbar/     # Navigációs sáv
│   ├── context/            # React Context providers
│   │   ├── LanguageContext.tsx  # Nyelvi beállítások (HU/EN/DE)
│   │   ├── ThemeContext.tsx     # Téma kezelés (4 téma)
│   │   └── ModalContext.tsx     # Modal dialógusok
│   ├── pages/              # Oldal komponensek
│   │   ├── auth/           # Login, Register
│   │   ├── student/        # Diák oldalak
│   │   └── teacher/        # Tanár oldalak
│   ├── services/           # API szolgáltatások
│   │   └── api.ts          # Backend kommunikáció
│   ├── styles/             # Globális stílusok
│   │   ├── _variables.scss # SCSS változók (referencia)
│   │   └── _utilities.scss # Utility osztályok
│   ├── index.scss          # Fő stílusfájl + téma változók
│   ├── App.tsx             # Fő alkalmazás komponens
│   └── main.tsx            # Belépési pont
├── public/                 # Statikus fájlok
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Telepítés

```bash
# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev

# Production build
npm run build
```

## Téma Rendszer

Az alkalmazás 4 témát támogat:

| Téma | Leírás |
|------|--------|
| `light` | Világos téma (alapértelmezett) |
| `light-warm` | Meleg világos téma (Solarized) |
| `dark` | Sötét téma |
| `dark-deep` | Mélysötét téma (OLED) |

### CSS Változók

Minden témához 25+ CSS változó tartozik, amelyek az `index.scss`-ben vannak definiálva:

```scss
// Háttér színek
--bg-color: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;

// Szöveg színek
--text-color: #1f2937;
--text-secondary: #4b5563;
--text-muted: #6b7280;

// Elsődleges színek
--primary-color: #3b82f6;
--primary-light: #60a5fa;
--primary-dark: #2563eb;

// Kártya stílusok
--card-bg: #ffffff;
--card-border: #e5e7eb;
--card-shadow: rgba(0, 0, 0, 0.1);

// És még sok más...
```

### Téma Használata

A téma váltása a `ThemeContext`-en keresztül történik:

```tsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, cycleTheme } = useTheme();
  
  return (
    <button onClick={cycleTheme}>
      Jelenlegi téma: {theme}
    </button>
  );
}
```

## Nyelvi Támogatás

Az alkalmazás 3 nyelvet támogat: Magyar (HU), Angol (EN), Német (DE).

### Használat

```tsx
import { useLanguage } from '../context/LanguageContext';

function MyComponent() {
  const { t, lang, setLang } = useLanguage();
  
  return (
    <div>
      <h1>{t("nav.login")}</h1>
      {/* "Bejelentkezés" / "Login" / "Anmelden" */}
    </div>
  );
}
```

### Fordítási Kulcsok

A fordítások a `LanguageContext.tsx`-ben vannak definiálva. Főbb kategóriák:

- `nav.*` - Navigációs elemek
- `auth.*` - Autentikációs szövegek
- `student.*` - Diák oldal szövegek
- `teacher.*` - Tanár oldal szövegek
- `quiz.*` - Kvíz szövegek
- `error.*` - Hibaüzenetek
- `common.*` - Általános szövegek

## Komponensek

### Navbar

Fix pozíciójú navigációs sáv, amely tartalmazza:
- Dashboard linkek (szerepkör alapján)
- Nyelvi váltó (HU/EN/DE)
- Téma váltó
- Kijelentkezés gomb

### Modal

Központosított modal dialógus rendszer:

```tsx
import { useModal } from '../context/ModalContext';

function MyComponent() {
  const { showModal } = useModal();
  
  const handleClick = () => {
    showModal({
      title: "Siker!",
      message: "A művelet sikeresen végrehajtva.",
      onConfirm: () => console.log("OK")
    });
  };
}
```

## Stílus Útmutató

### Utility Osztályok

Az alkalmazás utility osztályokat használ az egységes stílushoz:

```html
<!-- Gombok -->
<button className="btn btn-primary">Elsődleges</button>
<button className="btn btn-secondary">Másodlagos</button>
<button className="btn btn-danger">Törlés</button>
<button className="btn btn-accent">Kiemelt</button>

<!-- Form elemek -->
<input className="form-input" />
<select className="form-select" />
<label className="form-label" />

<!-- Szövegek -->
<p className="text-primary">Elsődleges szöveg</p>
<p className="text-muted">Halvány szöveg</p>
<p className="text-error">Hiba szöveg</p>
```

### Kártyák

```html
<div className="card">
  <div className="card-header">Fejléc</div>
  <div className="card-body">Tartalom</div>
  <div className="card-footer">Lábléc</div>
</div>
```

## API Kommunikáció

Az API hívások a `services/api.ts`-en keresztül történnek:

```tsx
import { api } from '../services/api';

// Példák
const dashboard = await api.studentDashboard();
const classroom = await api.studentClassroom(classroomId);
const quiz = await api.studentQuiz(quizId);
```

### Autentikáció

Az API hívásokhoz JWT token szükséges, amely a `localStorage`-ban van tárolva:

```tsx
localStorage.getItem("token"); // Token lekérése
localStorage.getItem("role");  // Szerepkör lekérése
```

## Oldalak

### Diák Oldalak

| Útvonal | Komponens | Leírás |
|---------|-----------|--------|
| `/student` | StudentDashboard | Diák főoldal, classroomok listája |
| `/student/join-classroom` | JoinClassroom | Classroom csatlakozás kóddal |
| `/student/classroom/:id` | ClassroomView | Classroom részletek, tesztek |
| `/student/quiz/:id` | QuizRunner | Teszt kitöltése |

### Tanár Oldalak

| Útvonal | Komponens | Leírás |
|---------|-----------|--------|
| `/teacher` | TeacherDashboard | Tanár főoldal, csoportok listája |
| `/teacher/create-classroom` | CreateClassroom | Új classroom létrehozása |
| `/teacher/classroom/:id` | ClassroomDetails | Csoport részletek, kvízek |
| `/teacher/classroom/:id/quiz/create` | CreateQuiz | Új kvíz létrehozása |
| `/teacher/quiz/:id` | QuizPreview | Kvíz előnézet, eredmények |
| `/teacher/quiz/:quizId/user/:userId` | StudentResultDetail | Diák eredményei |

## Fejlesztési Útmutató

### Új Oldal Hozzáadása

1. Hozd létre a komponenst a megfelelő mappában (`pages/student/` vagy `pages/teacher/`)
2. Hozd létre a hozzá tartozó SCSS fájlt (CSS változókkal!)
3. Add hozzá az útvonalat az `App.tsx`-hez
4. Add hozzá a fordításokat a `LanguageContext.tsx`-hez

### CSS Változók Használata

**Mindig** CSS változókat használj a színekhez:

```scss
// ✅ Helyes
.my-component {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--card-border);
}

// ❌ Helytelen
.my-component {
  background-color: #ffffff;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}
```

## Build és Deploy

```bash
# Production build
npm run build

# Build kimenet: dist/ mappa
```

A build kimenete a `dist/` mappába kerül, amely bármilyen statikus hosting szolgáltatásra feltölthető.
