import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "HU" | "EN" | "DE";

// Translation keys and their translations
const translations = {
    // Navbar
    "nav.studentDashboard": { HU: "Diák Dashboard", EN: "Student Dashboard", DE: "Schüler Dashboard" },
    "nav.teacherDashboard": { HU: "Tanár Dashboard", EN: "Teacher Dashboard", DE: "Lehrer Dashboard" },
    "nav.back": { HU: "← Vissza", EN: "← Back", DE: "← Zurück" },
    "nav.classroom": { HU: "Classroom", EN: "Classroom", DE: "Klassenzimmer" },
    "nav.login": { HU: "Bejelentkezés", EN: "Login", DE: "Anmelden" },
    "nav.register": { HU: "Regisztráció", EN: "Register", DE: "Registrieren" },
    "nav.logout": { HU: "Kijelentkezés", EN: "Logout", DE: "Abmelden" },

    // Auth pages
    "auth.loginTitle": { HU: "Bejelentkezés", EN: "Login", DE: "Anmeldung" },
    "auth.registerTitle": { HU: "Regisztráció", EN: "Registration", DE: "Registrierung" },
    "auth.email": { HU: "Email", EN: "Email", DE: "E-Mail" },
    "auth.password": { HU: "Jelszó", EN: "Password", DE: "Passwort" },
    "auth.confirmPassword": { HU: "Jelszó újra", EN: "Confirm Password", DE: "Passwort bestätigen" },
    "auth.username": { HU: "Felhasználónév", EN: "Username", DE: "Benutzername" },
    "auth.selectRole": { HU: "Válassz szerepkört...", EN: "Select role...", DE: "Rolle auswählen..." },
    "auth.teacher": { HU: "Tanár", EN: "Teacher", DE: "Lehrer" },
    "auth.student": { HU: "Diák", EN: "Student", DE: "Schüler" },
    "auth.registerBtn": { HU: "Regisztráció", EN: "Register", DE: "Registrieren" },
    "auth.registerAndJoin": { HU: "Regisztráció és Csatlakozás", EN: "Register & Join", DE: "Registrieren & Beitreten" },
    "auth.forJoining": { HU: "(Csatlakozáshoz)", EN: "(For Joining)", DE: "(Zum Beitreten)" },

    // Student Dashboard
    "student.myClassrooms": { HU: "Saját Classroomok", EN: "My Classrooms", DE: "Meine Klassenzimmer" },
    "student.joinClassroom": { HU: "Join Classroom", EN: "Join Classroom", DE: "Klassenzimmer beitreten" },
    "student.noClassrooms": { HU: "Még nem vagy egyetlen classroom tagja sem.", EN: "You haven't joined any classroom yet.", DE: "Du bist noch keinem Klassenzimmer beigetreten." },
    "student.students": { HU: "diák", EN: "students", DE: "Schüler" },

    // Teacher Dashboard
    "teacher.groups": { HU: "Csoportok", EN: "Groups", DE: "Gruppen" },
    "teacher.newGroup": { HU: "Új csoport létrehozása", EN: "Create New Group", DE: "Neue Gruppe erstellen" },
    "teacher.noGroups": { HU: "Még nincsen csoportja.", EN: "No groups yet.", DE: "Noch keine Gruppen." },
    "teacher.members": { HU: "tag", EN: "members", DE: "Mitglieder" },

    // Classroom
    "classroom.code": { HU: "Kurzus kód", EN: "Course Code", DE: "Kurscode" },
    "classroom.name": { HU: "Classroom neve", EN: "Classroom Name", DE: "Klassenzimmername" },
    "classroom.visibility": { HU: "Láthatóság", EN: "Visibility", DE: "Sichtbarkeit" },
    "classroom.public": { HU: "Public", EN: "Public", DE: "Öffentlich" },
    "classroom.private": { HU: "Private", EN: "Private", DE: "Privat" },
    "classroom.create": { HU: "Létrehozás", EN: "Create", DE: "Erstellen" },
    "classroom.newClassroom": { HU: "Új Classroom létrehozása", EN: "Create New Classroom", DE: "Neues Klassenzimmer erstellen" },

    // Quiz
    "quiz.quizzes": { HU: "Kvízek", EN: "Quizzes", DE: "Quizze" },
    "quiz.tests": { HU: "Tesztek", EN: "Tests", DE: "Tests" },
    "quiz.newQuiz": { HU: "Új kvíz létrehozása", EN: "Create New Quiz", DE: "Neues Quiz erstellen" },
    "quiz.noQuizzes": { HU: "Még nincs létrehozott kvíz ebben a csoportban.", EN: "No quizzes in this group yet.", DE: "Noch keine Quizze in dieser Gruppe." },
    "quiz.noTests": { HU: "Nincsenek elérhető tesztek.", EN: "No available tests.", DE: "Keine verfügbaren Tests." },
    "quiz.submissions": { HU: "kitöltés", EN: "submissions", DE: "Einreichungen" },
    "quiz.edit": { HU: "Szerkesztés", EN: "Edit", DE: "Bearbeiten" },
    "quiz.delete": { HU: "Töröl", EN: "Delete", DE: "Löschen" },
    "quiz.save": { HU: "Kvíz Mentése", EN: "Save Quiz", DE: "Quiz speichern" },
    "quiz.cancel": { HU: "Mégse", EN: "Cancel", DE: "Abbrechen" },
    "quiz.addQuestion": { HU: "+ Új kérdés hozzáadása", EN: "+ Add New Question", DE: "+ Neue Frage hinzufügen" },
    "quiz.questions": { HU: "Kérdések", EN: "Questions", DE: "Fragen" },
    "quiz.quizName": { HU: "Kvíz neve", EN: "Quiz Name", DE: "Quizname" },
    "quiz.allowBack": { HU: "Visszalépés engedélyezése", EN: "Allow Back Navigation", DE: "Zurück-Navigation erlauben" },
    "quiz.points": { HU: "pont", EN: "points", DE: "Punkte" },
    "quiz.score": { HU: "Pontszám", EN: "Score", DE: "Punktzahl" },
    "quiz.percent": { HU: "Százalék", EN: "Percentage", DE: "Prozent" },
    "quiz.previous": { HU: "Előző", EN: "Previous", DE: "Zurück" },
    "quiz.next": { HU: "Következő", EN: "Next", DE: "Weiter" },
    "quiz.finish": { HU: "Befejezés", EN: "Finish", DE: "Beenden" },
    "quiz.sending": { HU: "Küldés...", EN: "Sending...", DE: "Senden..." },
    "quiz.success": { HU: "Sikeres beküldés!", EN: "Successfully submitted!", DE: "Erfolgreich eingereicht!" },
    "quiz.backToHome": { HU: "Vissza a főoldalra", EN: "Back to Home", DE: "Zurück zur Startseite" },
    "quiz.multiSelect": { HU: "Több válasz is jelölhető", EN: "Multiple answers allowed", DE: "Mehrere Antworten erlaubt" },
    "quiz.singleSelect": { HU: "Csak egy válasz jelölhető", EN: "Only one answer allowed", DE: "Nur eine Antwort erlaubt" },

    // Join Classroom
    "join.title": { HU: "Join Classroom", EN: "Join Classroom", DE: "Klassenzimmer beitreten" },
    "join.code": { HU: "Classroom kód", EN: "Classroom Code", DE: "Klassenzimmer-Code" },
    "join.placeholder": { HU: "Pl.: 2C4E7E81", EN: "e.g.: 2C4E7E81", DE: "z.B.: 2C4E7E81" },
    "join.button": { HU: "Join", EN: "Join", DE: "Beitreten" },
    "join.checking": { HU: "Ellenőrzés...", EN: "Checking...", DE: "Überprüfung..." },

    // Common
    "common.loading": { HU: "Betöltés...", EN: "Loading...", DE: "Laden..." },
    "common.error": { HU: "Hiba történt", EN: "An error occurred", DE: "Ein Fehler ist aufgetreten" },
    "common.save": { HU: "Mentés", EN: "Save", DE: "Speichern" },
    "common.cancel": { HU: "Mégse", EN: "Cancel", DE: "Abbrechen" },
    "common.yes": { HU: "Igen", EN: "Yes", DE: "Ja" },
    "common.no": { HU: "Nem", EN: "No", DE: "Nein" },
    "common.ok": { HU: "OK", EN: "OK", DE: "OK" },
    "common.success": { HU: "Siker!", EN: "Success!", DE: "Erfolg!" },
    "common.warning": { HU: "Figyelem", EN: "Warning", DE: "Warnung" },

    // Modal messages
    "modal.registerSuccess": { HU: "Sikeres regisztráció!", EN: "Registration successful!", DE: "Registrierung erfolgreich!" },
    "modal.registerAndJoinSuccess": { HU: "Sikeres regisztráció és csatlakozás!", EN: "Registration and joining successful!", DE: "Registrierung und Beitritt erfolgreich!" },
    "modal.joinFailed": { HU: "Sikeres regisztráció, de a csatlakozás nem sikerült. Kérlek jelentkezz be és próbáld újra.", EN: "Registration successful, but joining failed. Please login and try again.", DE: "Registrierung erfolgreich, aber Beitritt fehlgeschlagen. Bitte melde dich an und versuche es erneut." },

    // Errors
    "error.fillAllFields": { HU: "Kérlek, tölts ki minden mezőt!", EN: "Please fill in all fields!", DE: "Bitte alle Felder ausfüllen!" },
    "error.passwordMismatch": { HU: "A két jelszó nem egyezik meg!", EN: "Passwords don't match!", DE: "Passwörter stimmen nicht überein!" },
    "error.invalidCode": { HU: "Kérlek, adj meg egy érvényes kódot!", EN: "Please enter a valid code!", DE: "Bitte gib einen gültigen Code ein!" },
    "error.notLoggedIn": { HU: "Nem vagy bejelentkezve!", EN: "You are not logged in!", DE: "Du bist nicht angemeldet!" },
    "error.classroomNotFound": { HU: "Nem található classroom ezzel a kóddal.", EN: "Classroom not found with this code.", DE: "Klassenzimmer mit diesem Code nicht gefunden." },
    "error.noPermission": { HU: "Nincs jogosultságod a hozzáféréshez.", EN: "You don't have permission to access this.", DE: "Du hast keine Berechtigung für den Zugriff." },
    "error.joinFailed": { HU: "Hiba történt a csatlakozás során.", EN: "An error occurred while joining.", DE: "Beim Beitreten ist ein Fehler aufgetreten." },
    "error.networkError": { HU: "Hálózati hiba, próbáld újra.", EN: "Network error, please try again.", DE: "Netzwerkfehler, bitte versuche es erneut." },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Language>(() => {
        const saved = localStorage.getItem("language") as Language;
        return saved || "HU";
    });

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem("language", newLang);
    };

    const t = (key: TranslationKey): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }
        return translation[lang] || translation.HU || key;
    };

    useEffect(() => {
        document.documentElement.lang = lang.toLowerCase();
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
