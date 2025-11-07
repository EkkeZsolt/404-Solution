## 1️⃣  Bemeneti JSON‑ok – Markdown táblázat

| # | Endpoint | HTTP metódus | Body (JSON) |
|---|----------|--------------|-------------|
| 1 | `/api/teacher/dasboard` | GET | *Nincs body* |
| 2 | `/api/teacher/classroom` | GET | `{ "classroom_id": 1 }` |
| 3 | `/api/teacher/classroom/quiz` | GET | `{ "quiz_id": 3 }` |
| 4 | `/api/register` | POST | ```json{ "name":"János Kovács","email":"janos.kovacs@example.com","password":"S3cureP@ssw0rd","role":"diak"}``` |
| 5 | `/api/login` | POST | ```json{ "email":"casper.reymundo@example.org","password":"password" }``` |
| 6 | `/api/teacher/classroom/create` | POST | ```json{ "name":"Physics 101", "visibility":"public" }```
| 7 | `/api/teacher/classroom/quiz/create` | POST | ```json{ "classroom_id":1,"name":"Biology Basics Quiz","allow_back":true,"questions":[{"question_text":"What is the powerhouse of the cell?","answer_1":"Nucleus","answer_2":"Mitochondria","answer_3":"Ribosome","answer_4":"Endoplasmic reticulum","max_points":10,"correct_answers":["answer_2"]},{"question_text":"Which of the following are nucleotides?","answer_1":"Adenine","answer_2":"Thymine","answer_3":"Glucose","answer_4":"Cytosine","max_points":15,"correct_answers":["answer_1","answer_2","answer_4"]},{"question_text":"What is the main function of ribosomes?","answer_1":"Protein synthesis","answer_2":"DNA replication","answer_3":"Energy production","answer_4":"Cell signaling","max_points":5,"correct_answers":["answer_1"]}]} ```
| 8 | `/api/teacher/classroom/quiz/edit` | GET | `{ "quiz_id":102,"classroom_id":1 }` |
| 9 | `/api/teacher/classroom/quiz/update` | PUT | ```json{ "quiz_id":102,"classroom_id":1,"name":"Biology Basics Quizdsad","allow_back":true,"questions":[{"id":766,"question_text":"What is the powerhouse of the cell?","answer_1":"Nucleusdasd","answer_2":"Mitochondria","answer_3":"Ribosodasme","answer_4":"Endoplasmic reticulum","max_points":10,"correct_answers":["answer_2"]},{"id":767,"question_text":"Which of the following are nucleotides?","answer_1":"Adenine","answer_2":"Thymine","answer_3":"Glucose","answer_4":"Cytosine","max_points":15,"correct_answers":["answer_1","answer_2","answer_4"]},{"id":768,"question_text":"What is the main function of ribosomes?","answer_1":"Protein synthesis","answer_2":"DNA replication","answer_3":"Energy production","answer_4":"Cell signaling","max_points":5,"correct_answers":["answer_1"]}]} ```
|10 | `/api/diak/dasboard` | GET | *Nincs body* |
|11 | `/api/diak/classroom` | GET | `{ "classroom_id": 1 }` |
|12 | `/api/diak/classroom/quiz` | GET | `{ "quiz_id": 3 }` |
|13 | `/api/diak/classroom/quiz/upload` | POST | ```json{ "quiz_id": 3,"student_id": 12,"answers":[{"question_id":14,"answers":["answer_1","answer_3"]},{"question_id":15,"answers":["answer_3"]},{"question_id":16,"answers":["answer_2"]},{"question_id":17,"answers":["answer_1","answer_4","answer_3"]},{"question_id":18,"answers":["answer_4","answer_1","answer_2"]},{"question_id":19,"answers":["answer_1","answer_4"]},{"question_id":20,"answers":["answer_3"]}]} ```
|14 | `/api/teacher/classroom/joins` | GET | `{ "classroom_code":"HA57FD" }` |
|15 | `/api/teacher/classroom/joins/delete` | GET | `{ "classroom_code":"QQ48UQ","student_id":1 }` |
|16 | `/api/teacher/classroom/addstudent` | POST | `{ "classroom_id":1,"id_student":100 }` |
|17 | `/api/teacher/classroom/code` | GET | `{ "classroom_code":"HA57FD" }` |
|18 | `/api/diak/classroom/joins/create` | GET | `{ "classroom_code":"HA57FD","student_id":1 }` |

---

## 2️⃣  Válaszok – tipikus JSON szerkezet

| # | Endpoint | Válasz példa (JSON) |
|---|----------|---------------------|
| 1 | `/api/teacher/dasboard` | ```json{ "status":"success","message":"Dashboard fetched","data":{"total_classrooms":5,"active_quizzes":12} }``` |
| 2 | `/api/teacher/classroom` | ```json{ "status":"success","message":"Classroom list","data":[{"id":1,"name":"Physics 101","visibility":"public"},{"id":2,"name":"Math 201","visibility":"private"}] }``` |
| 3 | `/api/teacher/classroom/quiz` | ```json{ "status":"success","message":"Quiz details","data":{"quiz_id":3,"name":"Biology Basics Quiz","questions":[{"question_id":14,"text":"What is the powerhouse of the cell?","answers":["Nucleus","Mitochondria","Ribosome","Endoplasmic reticulum"],"max_points":10}]} }``` |
| 4 | `/api/register` | ```json{ "status":"success","message":"User registered","data":{"user_id":42,"email":"janos.kovacs@example.com"} }``` |
| 5 | `/api/login` | ```json{ "status":"success","message":"Login successful","token":"2|<jwt-token>","expires_in":3600 }``` |
| 6 | `/api/teacher/classroom/create` | ```json{ "status":"success","message":"Classroom created","data":{"classroom_id":10,"name":"Physics 101"} }``` |
| 7 | `/api/teacher/classroom/quiz/create` | ```json{ "status":"success","message":"Quiz created","data":{"quiz_id":102,"name":"Biology Basics Quiz"}}``` |
| 8 | `/api/teacher/classroom/quiz/edit` | ```json{ "status":"success","message":"Quiz fetched for editing","data":{"quiz_id":102,"name":"Biology Basics Quiz",...}}``` |
| 9 | `/api/teacher/classroom/quiz/update` | ```json{ "status":"success","message":"Quiz updated","data":{"quiz_id":102}}``` |
|10 | `/api/diak/dasboard` | ```json{ "status":"success","message":"Dashboard fetched","data":{"enrolled_classrooms":[{"id":1,"name":"Physics 101"}],"completed_quizzes":3} }``` |
|11 | `/api/diak/classroom` | ```json{ "status":"success","message":"Classroom list","data":[{"id":1,"name":"Physics 101"}] }``` |
|12 | `/api/diak/classroom/quiz` | ```json{ "status":"success","message":"Quiz details","data":{"quiz_id":3,"name":"Biology Basics Quiz",...}}``` |
|13 | `/api/diak/classroom/quiz/upload` | ```json{ "status":"success","message":"Answers submitted","data":{"score":85,"total_points":100} }``` |
|14 | `/api/teacher/classroom/joins` | ```json{ "status":"success","message":"Classroom joined","data":{"classroom_id":1,"student_count":15}}``` |
|15 | `/api/teacher/classroom/joins/delete` | ```json{ "status":"success","message":"Student removed from classroom"} ``` |
|16 | `/api/teacher/classroom/addstudent` | ```json{ "status":"success","message":"Student added to classroom","data":{"classroom_id":1,"student_id":100}}``` |
|17 | `/api/teacher/classroom/code` | ```json{ "status":"success","message":"Classroom code retrieved","data":{"classroom_code":"HA57FD"}}``` |
|18 | `/api/diak/classroom/joins/create` | ```json{ "status":"success","message":"Joined classroom successfully"} ``` |

> **Tippek**  
> * `status:"error"` esetén a `message` tartalmazza a hiba leírását, opcionálisan egy `errors` objektum is (pl. validációs hibák).  
> * A tokenek (`/api/login`) JWT‑k, amelyeket a későbbi kérésben `Authorization: Bearer <token>` fejléccel kell továbbadni.

---

## 3️⃣  Gyakorlati példa – Quiz beküldése (diák)

```http
POST /api/diak/classroom/quiz/upload HTTP/1.1
Host: 127.0.0.1:8000
Authorization: Bearer 2|JUyD7ohpeUFdJdYuGOMeC8HBStey8NvgdSE4vRm4dce2f6c0
Content-Type: application/json

{
  "quiz_id": 3,
  "student_id": 12,
  "answers": [
    {"question_id":14,"answers":["answer_1","answer_3"]},
    {"question_id":15,"answers":["answer_3"]},
    {"question_id":16,"answers":["answer_2"]},
    {"question_id":17,"answers":["answer_1","answer_4","answer_3"]},
    {"question_id":18,"answers":["answer_4","answer_1","answer_2"]},
    {"question_id":19,"answers":["answer_1","answer_4"]},
    {"question_id":20,"answers":["answer_3"]}
  ]
}
```

**Válasz**

```json
{
  "status":"success",
  "message":"Answers submitted",
  "data":{
      "score":85,
      "total_points":100
  }
}
```

---