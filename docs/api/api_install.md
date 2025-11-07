
# Gyorsindítás egy már klónozott Laravel projekthez

A repo letöltése után **nem** kell semmit újra létrehozni – csak ellenőrizd, hogy a környezeted készen áll.
Lent vannak letötéshez linkek előbb töltsétek le azokat és telepítsétek fel olyan sorendben. LEGYEN MINDEN PEPIPÁLVA.

## 1️⃣ PHP telepítése  
Az Laravel 10-nek **PHP 8.2+** szükséges.

- **Windows / macOS / Linux** – hivatalos útmutató:  
  <https://www.php.net/manual/en/install.php>

```bash
php -v   # meg kell jelennie a PHP 8.2.x verziónak
```

## 2️⃣ Composer telepítése  
A Composer a PHP függőségkezelője.

```bash
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
composer --version
```

> **Link:** <https://getcomposer.org/>

## 3️⃣ Projektfüggőségek telepítése  

```bash
cd a-klonolt-projekted
composer install          # letölti az összes PHP csomagot
```

## 4️⃣ Adatbázis konfigurálása  
Szerkeszd a `.env` fájlt (ha szükséges, másold le `.env.example`-ből):

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_laravel_db
DB_USERNAME=root
DB_PASSWORD=
```


## 5️⃣ Migrációk és seederek futtatása  

```bash
php artisan migrate          # táblák létrehozása
php artisan db:seed --class=AllDataSeeder   # adatbetöltés
```

## 6️⃣ Fejlesztői szerver indítása  

```bash
php artisan serve
# látogass el a http://127.0.0.1:8000 oldalra
```

---

### Gyors linkek

| Eszköz | Link |
|--------|------|
| PHP    | https://www.apachefriends.org/hu/index.html  |
| Composer | https://getcomposer.org/ |
| DB Browser for SQLite | https://sqlitebrowser.org/
Sok sikert a fejlesztéshez! 🚀
```