# Laravel SQLite adatbázis ellenőrzése DB Browser for SQLite‑vel

1. **Nyisd meg a DB Browser for SQLite**  
   (letöltés: https://sqlitebrowser.org/)

2. **Fájl → Open Database**  
   Válaszd ki a Laravel projekted `database/database.sqlite` fájlját.

3. **Navigálj az `users` táblába**  
   - A bal oldali panelen kattints a *Browse Data* fülre, majd válaszd ki a `users` táblát.
   - Itt megtekintheted minden felhasználó adatait.

4. **Jelszó ellenőrzése**  
   Laravel alapértelmezés szerint a jelszavakat bcrypt‑el titkosítja, így a `"password"` szöveg nem lesz nyilvánvaló.  

Ezzel gyorsan megtekintheted és módosíthatod a felhasználókat SQLite adatbázisban Laravel környezetben.
```