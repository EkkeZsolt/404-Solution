# API Dokumentáció

## Áttekintés

A backend API Laravel Sanctum token alapú autentikációt használ.

**Base URL:** `http://127.0.0.1:8000/api`

**Autentikáció:** Minden védett endpoint-hoz szükséges:
```
Authorization: Bearer <token>
```

---

## Autentikáció

### POST `/api/register`

Új felhasználó regisztrálása.

**Request Body:**
```json
{
  "name": "Kovács János",
  "email": "janos@example.com",
  "password": "jelszo123",
  "role": "diak"
}
```

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|--------|
| name | string | ✓ | Felhasználónév (max 255) |
| email | string | ✓ | Email cím (egyedi) |
| password | string | ✓ | Jelszó (min 6 karakter) |
| role | string | ✓ | `diak` vagy `tanar` |

**Válasz (201):**
```json
{
  "message": "Sikeres regisztráció!",
  "user": {
    "id": 42,
    "name": "Kovács János",
    "email": "janos@example.com",
    "role": "diak"
  },
  "token": "1|abc123..."
}
```

---

### POST `/api/login`

Bejelentkezés.

**Request Body:**
```json
{
  "email": "janos@example.com",
  "password": "jelszo123"
}
```

**Válasz (200):**
```json
{
  "message": "Sikeres bejelentkezés!",
  "user": {
    "id": 42,
    "name": "Kovács János",
    "email": "janos@example.com",
    "role": "diak"
  },
  "token": "2|xyz789..."
}
```

**Hiba (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["Helytelen email vagy jelszó."]
  }
}
```

---

### POST `/api/teacher/logout` vagy `/api/diak/logout`

Kijelentkezés (token törlése).

**Válasz (200):**
```json
{
  "message": "Sikeres kijelentkezés."
}
```

---

## Tanár Endpoint-ok

Prefix: `/api/teacher`  
Követelmény: `auth:sanctum` + `role:tanar`

---

### GET `/api/teacher/dasboard`

Tanár dashboard - classroomok listája.

**Válasz (200):**
```json
{
  "teacher_id": 5,
  "classrooms": [
    {
      "id": 1,
      "name": "Fizika 101",
      "students_count": 25
    },
    {
      "id": 2,
      "name": "Matematika 201",
      "students_count": 18
    }
  ]
}
```

---

### GET `/api/teacher/classroom`

Classroom kvízek listája eredményszámmal.

**Query Parameters:**
| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|--------|
| classroom_id | integer | ✓ | Classroom ID |

**Példa:** `GET /api/teacher/classroom?classroom_id=1`

**Válasz (200):**
```json
[
  {
    "id": 3,
    "name": "Biológia Teszt",
    "classroom_id": 1,
    "allow_back": 1,
    "results_count": 15
  }
]
```

---

### GET `/api/teacher/classroom/quiz`

Kvíz részletes eredmények diákonként.

**Query Parameters:**
| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|--------|
| quiz_id | integer | ✓ | Quiz ID |

**Válasz (200):**
```json
{
  "quiz_id": 3,
  "quiz_name": "Biológia Teszt",
  "results": [
    {
      "student_id": 12,
      "student_name": "Kiss Péter",
      "total_score": 25.5,
      "details": [
        {
          "question_id": 14,
          "question_text": "Mi a sejt erőműve?",
          "max_points": 10,
          "score_for_question": 10,
          "correct_answers": ["Mitochondria"],
          "student_answers": ["Mitochondria"]
        }
      ]
    }
  ]
}
```

---

### POST `/api/teacher/classroom/create`

Új classroom létrehozása.

**Request Body:**
```json
{
  "name": "Fizika 101",
  "visibility": "public"
}
```

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|--------|
| name | string | ✓ | Classroom neve (max 255) |
| visibility | string | ✓ | `public` vagy `private` |

**Válasz (201):**
```json
{
  "message": "Classroom created successfully",
  "classroom": {
    "id": 10,
    "owner_id": 5,
    "name": "Fizika 101",
    "visibility": "public",
    "classroom_code": "XY12AB34"
  }
}
```

---

### POST `/api/teacher/classroom/quiz/create`

Új kvíz létrehozása kérdésekkel.

**Request Body:**
```json
{
  "classroom_id": 1,
  "name": "Biológia Alapok",
  "allow_back": true,
  "questions": [
    {
      "question_text": "Mi a sejt erőműve?",
      "answer_1": "Sejtmag",
      "answer_2": "Mitochondria",
      "answer_3": "Riboszóma",
      "answer_4": "ER",
      "max_points": 10,
      "correct_answers": ["answer_2"]
    },
    {
      "question_text": "Melyek nukleotidok?",
      "answer_1": "Adenin",
      "answer_2": "Timin",
      "answer_3": "Glükóz",
      "answer_4": "Citozin",
      "max_points": 15,
      "correct_answers": ["answer_1", "answer_2", "answer_4"]
    }
  ]
}
```

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|--------|
| classroom_id | integer | ✓ | Classroom ID |
| name | string | ✓ | Kvíz neve |
| allow_back | boolean | ✗ | Visszalépés engedélyezése |
| questions | array | ✓ | Kérdések tömbje (min 1) |
| questions.*.question_text | string | ✓ | Kérdés szövege |
| questions.*.answer_1-4 | string | ✓ | Válaszlehetőségek |
| questions.*.max_points | integer | ✓ | Maximális pontszám |
| questions.*.correct_answers | array | ✓ | Helyes válaszok kulcsai |

**Válasz (201):**
```json
{
  "message": "Quiz and its questions created successfully",
  "quiz": {
    "id": 102,
    "classroom_id": 1,
    "name": "Biológia Alapok",
    "allow_back": 1,
    "questions": [
      {
        "id": 766,
        "question_text": "Mi a sejt erőműve?",
        "answer_1": "Sejtmag",
        "answer_2": "Mitochondria",
        "answer_3": "Riboszóma",
        "answer_4": "ER",
        "max_points": 10,
        "correct_answers": ["answer_2"]
      }
    ]
  }
}
```

---

### GET `/api/teacher/classroom/quiz/edit`

Kvíz lekérése szerkesztéshez.

**Query Parameters:**
| Paraméter | Típus | Kötelező |
|-----------|-------|----------|
| quiz_id | integer | ✓ |
| classroom_id | integer | ✓ |

**Válasz (200):**
```json
{
  "quiz": {
    "id": 102,
    "classroom_id": 1,
    "name": "Biológia Alapok",
    "allow_back": 1,
    "questions": [
      {
        "id": 766,
        "question_text": "Mi a sejt erőműve?",
        "answer_1": "Sejtmag",
        "answer_2": "Mitochondria",
        "answer_3": "Riboszóma",
        "answer_4": "ER",
        "max_points": 10,
        "correct_answers": ["answer_2"]
      }
    ]
  }
}
```

---

### PUT `/api/teacher/classroom/quiz/update`

Kvíz és kérdések frissítése.

**Request Body:**
```json
{
  "quiz_id": 102,
  "classroom_id": 1,
  "name": "Biológia Alapok (Frissített)",
  "allow_back": true,
  "questions": [
    {
      "id": 766,
      "question_text": "Mi a sejt erőműve?",
      "answer_1": "Sejtmag",
      "answer_2": "Mitochondria",
      "answer_3": "Riboszóma",
      "answer_4": "Endoplazmatikus retikulum",
      "max_points": 10,
      "correct_answers": ["answer_2"]
    }
  ]
}
```

**Válasz (200):**
```json
{
  "message": "Quiz and its questions updated successfully",
  "quiz": { ... }
}
```

---

### GET `/api/teacher/classroom/joins`

Classroom diákjainak eredményei.

**Query Parameters:**
| Paraméter | Típus | Kötelező |
|-----------|-------|----------|
| classroom_code | string | ✓ |

**Válasz (200):**
```json
{
  "status": "success",
  "count": 15,
  "data": [ ... ]
}
```

---

### GET `/api/teacher/classroom/joins/delete`

Diák eredményeinek törlése.

**Query Parameters:**
| Paraméter | Típus | Kötelező |
|-----------|-------|----------|
| classroom_code | string | ✓ |
| student_id | integer | ✓ |

**Válasz (200):**
```json
{
  "status": "success",
  "message": "All results for student 12 in classroom 'XY12AB34' have been deleted."
}
```

---

### GET `/api/teacher/classroom/code`

Classroom keresése kód alapján.

**Query Parameters:**
| Paraméter | Típus | Kötelező |
|-----------|-------|----------|
| classroom_code | string | ✓ |

**Válasz (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Fizika 101",
    "visibility": "public",
    "code": "XY12AB34",
    "owner_id": 5,
    "students_count": 25,
    "quizzes_count": 3
  }
}
```

**Hiba (404):**
```json
{
  "error": "Nincs ilyen kóddal rendelkező osztály."
}
```

---

## Diák Endpoint-ok

Prefix: `/api/diak`  
Követelmény: `auth:sanctum` + `role:diak`

---

### GET `/api/diak/dasboard`

Diák dashboard - classroomok listája.

**Válasz (200):**
```json
{
  "id_student": 12,
  "classrooms": [
    {
      "id": 1,
      "name": "Fizika 101"
    }
  ]
}
```

---

### GET `/api/diak/classroom`

Classroom részletek kvíz eredményekkel.

**Query Parameters:**
| Paraméter | Típus | Kötelező |
|-----------|-------|----------|
| classroom_id | integer | ✓ |

**Válasz (200):**
```json
{
  "id": 1,
  "name": "Fizika 101",
  "code": "XY12AB34",
  "quizResults": [
    {
      "id": 3,
      "name": "Fizika Teszt",
      "score": 8
    },
    {
      "id": 4,
      "name": "Optika Kvíz",
      "score": null
    }
  ]
}
```

> `score: null` = még nem töltötte ki

---

### GET `/api/diak/classroom/quiz`

Kvíz lekérése kitöltéshez.

**Query Parameters:**
| Paraméter | Típus | Kötelező |
|-----------|-------|----------|
| quiz_id | integer | ✓ |

**Válasz (200):**
```json
{
  "status": "success",
  "questions": [
    {
      "id": 14,
      "text": "Mi a fény sebessége?",
      "options": [
        "300 000 km/s",
        "150 000 km/s",
        "450 000 km/s",
        "600 000 km/s"
      ],
      "correct_indices": [0],
      "correct_count": 1
    }
  ],
  "count": 10,
  "classroom_id": 1
}
```

---

### POST `/api/diak/classroom/quiz/upload`

Kvíz válaszok beküldése.

**Request Body:**
```json
{
  "quiz_id": 3,
  "answers": [
    {
      "question_id": 14,
      "answers": ["answer_1"]
    },
    {
      "question_id": 15,
      "answers": ["answer_2", "answer_4"]
    }
  ]
}
```

| Paraméter | Típus | Kötelező | Leírás |
|-----------|-------|----------|--------|
| quiz_id | integer | ✓ | Kvíz ID |
| answers | array | ✓ | Válaszok tömbje |
| answers.*.question_id | integer | ✓ | Kérdés ID |
| answers.*.answers | array | ✓ | Válasz kulcsok (`answer_1`, `answer_2`, stb.) |

**Válasz (201):**
```json
{
  "status": "success",
  "result_id": 456,
  "message": "Quiz result stored successfully."
}
```

---

### POST `/api/diak/classroom/joins/create`

Csatlakozás classroom-hoz.

**Request Body:**
```json
{
  "classroom_code": "XY12AB34"
}
```

**Válasz (201):**
```json
{
  "message": "Successfully joined the classroom."
}
```

**Hiba - már csatlakozott (409):**
```json
{
  "message": "Student is already joined to this classroom."
}
```

**Hiba - nem létező kód (422):**
```json
{
  "message": "Validation error",
  "errors": {
    "classroom_code": ["The selected classroom code is invalid."]
  }
}
```

---

## Hibakódok

| Kód | Jelentés |
|-----|----------|
| 200 | OK |
| 201 | Létrehozva |
| 400 | Hibás kérés |
| 401 | Nincs autentikálva |
| 403 | Nincs jogosultság |
| 404 | Nem található |
| 409 | Konfliktus (pl. már létezik) |
| 422 | Validációs hiba |
| 500 | Szerver hiba |

---

## Endpoint Összefoglaló

### Publikus
| Metódus | Endpoint | Leírás |
|---------|----------|--------|
| POST | `/api/register` | Regisztráció |
| POST | `/api/login` | Bejelentkezés |

### Tanár (`/api/teacher`)
| Metódus | Endpoint | Leírás |
|---------|----------|--------|
| POST | `/logout` | Kijelentkezés |
| GET | `/dasboard` | Dashboard |
| GET | `/classroom` | Classroom kvízek |
| GET | `/classroom/quiz` | Kvíz eredmények |
| POST | `/classroom/create` | Classroom létrehozása |
| POST | `/classroom/quiz/create` | Kvíz létrehozása |
| GET | `/classroom/quiz/edit` | Kvíz szerkesztésre |
| PUT | `/classroom/quiz/update` | Kvíz frissítése |
| GET | `/classroom/joins` | Diák eredmények |
| GET | `/classroom/joins/delete` | Diák törlése |
| GET | `/classroom/code` | Classroom kód alapján |

### Diák (`/api/diak`)
| Metódus | Endpoint | Leírás |
|---------|----------|--------|
| POST | `/logout` | Kijelentkezés |
| GET | `/dasboard` | Dashboard |
| GET | `/classroom` | Classroom részletek |
| GET | `/classroom/quiz` | Kvíz lekérése |
| POST | `/classroom/quiz/upload` | Válaszok beküldése |
| POST | `/classroom/joins/create` | Csatlakozás |