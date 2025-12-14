const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token");

const request = async (endpoint: string, method: string, body?: any) => {
    const token = getToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    let url = `${BASE_URL}${endpoint}`;
    let requestBody = body ? JSON.stringify(body) : undefined;

    // Handle User Request: "Send GET"
    // Browsers (fetch) DO NOT support GET with Body. 
    // We MUST convert the body to Query Parameters for a valid GET request.
    if (method === "GET" && body) {
        const params = new URLSearchParams();
        Object.keys(body).forEach(key => {
            if (body[key] !== undefined && body[key] !== null) {
                params.append(key, body[key].toString());
            }
        });
        url += `?${params.toString()}`;
        requestBody = undefined;
    }

    const config: RequestInit = {
        method,
        headers,
        body: requestBody,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    try {
        return await response.json();
    } catch (e) {
        return {};
    }
};

export const api = {
    // 1. Teacher Dashboard
    teacherDashboard: () => request("/teacher/dasboard", "GET"),

    // 2. Teacher Classroom (GET)
    teacherClassroom: (classroomId: number) =>
        request("/teacher/classroom", "GET", { classroom_id: classroomId }),

    // 3. Teacher Classroom Quiz (GET)
    teacherClassroomQuiz: (quizId: number) =>
        request("/teacher/classroom/quiz", "GET", { quiz_id: quizId }),

    // 4. Register
    register: (data: any) => request("/register", "POST", data),

    // 5. Login
    login: (data: any) => request("/login", "POST", data),

    // 6. Create Classroom
    createClassroom: (data: { name: string; visibility: string }) =>
        request("/teacher/classroom/create", "POST", data),

    // 7. Create Quiz (Bulk)
    createQuiz: (data: {
        classroom_id: number;
        name: string;
        allow_back: boolean;
        questions: any[]
    }) => request("/teacher/classroom/quiz/create", "POST", data),

    // 8. Edit Quiz (GET)
    editQuiz: (data: { quiz_id: number; classroom_id: number }) =>
        request("/teacher/classroom/quiz/edit", "GET", data),

    // 9. Update Quiz (Bulk)
    updateQuiz: (data: {
        quiz_id: number;
        classroom_id: number;
        name: string;
        allow_back: boolean;
        questions: any[]
    }) => request("/teacher/classroom/quiz/update", "PUT", data),

    // 10. Student Dashboard
    studentDashboard: () => request("/diak/dasboard", "GET"),

    // 11. Student Classroom (GET)
    studentClassroom: (classroomId: number) =>
        request("/diak/classroom", "GET", { classroom_id: classroomId }),

    // 12. Student Quiz (GET)
    studentQuiz: (quizId: number) =>
        request("/diak/classroom/quiz", "GET", { quiz_id: quizId }),

    // 13. Student Quiz Upload
    // 13. Student Quiz Upload
    studentQuizUpload: (data: {
        quiz_id: number;
        answers: any[]
    }) => request("/diak/classroom/quiz/upload", "POST", data),

    // 14. Teacher Classroom Joins (GET)
    teacherClassroomJoins: (classroomCode: string) =>
        request("/teacher/classroom/joins", "GET", { classroom_code: classroomCode }),

    // 15. Delete Join (GET) - NOTE: User spec said GET for delete? Unusual, but following spec.
    teacherDeleteJoin: (data: { classroom_code: string; student_id: number }) =>
        request("/teacher/classroom/joins/delete", "GET", data),

    // 16. Add Student
    teacherAddStudent: (data: { classroom_id: number; id_student: number }) =>
        request("/teacher/classroom/addstudent", "POST", data),

    // 17. Get Code (GET)
    teacherClassroomCode: (classroomCode: string) =>
        request("/teacher/classroom/code", "GET", { classroom_code: classroomCode }),

    // 18. Student Join Create (POST)
    studentJoinCreate: (data: { classroom_code: string; student_id: number }) =>
        request("/diak/classroom/joins/create", "POST", data),
};
