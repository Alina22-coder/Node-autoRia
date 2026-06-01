# AutoRia Clone — REST API

Node.js + TypeScript backend платформи для продажу автомобілів.

## Tech Stack

- **Node.js 20** + **Express 5**
- **TypeScript** (strict mode)
- **PostgreSQL** (cloud: [Neon](https://neon.tech)) + **TypeORM**
- **Redis** (cloud: [Upstash](https://upstash.com))
- **JWT** authentication
- **Joi** validation
- **Docker** / **Docker Compose**

---

## Архітектура

Проєкт побудований за трирівневою архітектурою (як в OktenSchool):

```
Router → Controller → Service → Repository → Database
```

Кожен модуль містить:
- `*.routes.ts` — роутер з middleware (auth, roles, validation)
- `*.controller.ts` — клас, обробляє HTTP запит/відповідь, прокидує помилки через `next(err)`
- `*.service.ts` — клас з бізнес-логікою
- `*.repository.ts` — клас з запитами до БД через TypeORM
- `validators/*.validator.ts` — Joi схеми валідації

---

## Запуск (локально)

**Передумови:** Node.js 20+

```bash
cp .env.example .env
# Заповни credentials (дивись розділ нижче)

npm install
npm run dev
```

Seed початкових даних (марки авто + admin юзер):

```bash
npm run seed
```

API доступне на `http://localhost:3000`

---

## Запуск через Docker Compose

**Передумови:** Docker & Docker Compose

```bash
# 1. Заповни .env (cloud credentials або локальні — дивись нижче)
cp .env.example .env

# 2. Запусти
docker-compose up --build

# 3. Seed (перший раз)
docker-compose exec app npm run seed
```

### Docker credentials (локальні сервіси в docker-compose)

| Сервіс     | Змінна            | Значення   |
|------------|-------------------|------------|
| PostgreSQL | `POSTGRES_DB`     | `autoria`  |
| PostgreSQL | `POSTGRES_USER`   | `postgres` |
| PostgreSQL | `POSTGRES_PASSWORD` | `postgres` |
| PostgreSQL | Port              | `5432`     |
| Redis      | Port              | `6379`     |

**Щоб використовувати Docker з локальними DB і Redis**, встанови в `.env`:

```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=autoria
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false
```

**Щоб використовувати Docker тільки для app** (з cloud DB/Redis):

```bash
docker-compose up --build --no-deps app
```

---

## Cloud налаштування

### PostgreSQL — Neon (безкоштовно)

1. Зареєструйся на [neon.tech](https://neon.tech)
2. Створи проєкт → скопіюй Connection Details
3. Заповни `.env`:

```env
DB_HOST=ep-xxx-xxx.us-east-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=your_password
DB_SSL=true
```

### Redis — Upstash (безкоштовно)

1. Зареєструйся на [upstash.com](https://upstash.com)
2. Створи Redis database → скопіюй host і TOKEN
3. Заповни `.env`:

```env
REDIS_HOST=your-db.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_token
REDIS_TLS=true
```

---

## Environment Variables

| Змінна               | Опис                              | За замовчуванням |
|----------------------|-----------------------------------|------------------|
| `PORT`               | Порт сервера                      | `3000`           |
| `NODE_ENV`           | Середовище                        | `development`    |
| `DB_HOST`            | PostgreSQL host                   | `localhost`      |
| `DB_PORT`            | PostgreSQL port                   | `5432`           |
| `DB_NAME`            | Назва бази                        | `autoria`        |
| `DB_USER`            | Юзер БД                          | `postgres`       |
| `DB_PASSWORD`        | Пароль БД                        | `postgres`       |
| `DB_SSL`             | SSL для БД (`true` для Neon)     | `false`          |
| `REDIS_HOST`         | Redis host                        | `localhost`      |
| `REDIS_PORT`         | Redis port                        | `6379`           |
| `REDIS_PASSWORD`     | Redis password (Upstash TOKEN)    | —                |
| `REDIS_TLS`          | TLS для Redis (`true` для Upstash)| `false`          |
| `JWT_SECRET`         | Секрет для JWT                   | —                |
| `JWT_EXPIRES_IN`     | Час дії токена                   | `7d`             |
| `MAIL_HOST`          | SMTP host                        | —                |
| `MAIL_PORT`          | SMTP port                        | `587`            |
| `MAIL_USER`          | SMTP user                        | —                |
| `MAIL_PASS`          | SMTP password / App Password     | —                |
| `MAIL_FROM`          | From адреса                      | —                |
| `PRIVAT_BANK_API_URL`| URL курсів ПриватБанку           | вже заповнено    |

---

## Postman

Імпортуй `postman/AutoRia.postman_collection.json` у Postman.

Колекція повністю самодостатня:
- Base URL: `{{base_url}}` = `http://localhost:3000/api`
- Токени зберігаються **автоматично** після login-запитів
- Кожен запит містить **Postman Tests** (автоматична перевірка статусів і полів)

### Тестові credentials

| Role    | Email                | Password     | Як створюється                    |
|---------|----------------------|--------------|-----------------------------------|
| Admin   | `admin@test.com`     | `admin123`   | `npm run seed`                    |
| Seller  | `seller@test.com`    | `password123`| `1. Auth / Register Seller`       |
| Buyer   | `buyer@test.com`     | `password123`| `1. Auth / Register Buyer`        |
| Manager | `manager@test.com`   | `manager123` | `5. Users / Create Manager`       |

### Послідовність запитів

| # | Папка       | Запит                       | Що робить                              |
|---|-------------|-----------------------------|----------------------------------------|
| 1 | 1. Auth     | Register Seller             | Створює продавця, зберігає `{{seller_id}}` |
| 2 | 1. Auth     | Register Buyer              | Створює покупця                        |
| 3 | 1. Auth     | Login as Seller             | Зберігає `{{token}}`                  |
| 4 | 1. Auth     | Login as Admin              | Зберігає `{{admin_token}}`            |
| 5 | 2. Cars     | Get All Brands              | Перевіряє seed дані (20 брендів)      |
| 6 | 3. Currency | Get Rates                   | Отримує UAH/USD/EUR курси             |
| 7 | 4. Listings | Create Listing (Seller)     | Створює оголошення, зберігає `{{listing_id}}` |
| 8 | 4. Listings | Create Listing with Profanity | Оголошення → статус PENDING          |
| 9 | 4. Listings | Get All Listings            | Переглядає публічні оголошення        |
| 10| 4. Listings | Get My Listings             | Продавець бачить свої                 |
| 11| 5. Users    | Create Manager (Admin)      | Адмін створює менеджера               |
| 12| 1. Auth     | Login as Manager            | Зберігає `{{manager_token}}`          |
| 13| 4. Listings | Get Pending Listings        | Менеджер бачить PENDING оголошення    |
| 14| 4. Listings | Activate Listing            | Менеджер активує оголошення           |
| 15| 5. Users    | Upgrade to Premium          | Адмін підвищує продавця до Premium    |
| 16| 6. Statistics | Get Listing Stats         | Premium продавець переглядає статистику |

---

## API Endpoints

### Auth
| Method | URL                    | Опис                        | Auth |
|--------|------------------------|-----------------------------|------|
| POST   | `/api/auth/register`   | Реєстрація (buyer/seller)   | —    |
| POST   | `/api/auth/login`      | Логін, повертає JWT          | —    |

### Users
| Method | URL                         | Опис                        | Auth             |
|--------|-----------------------------|-----------------------------|------------------|
| GET    | `/api/users/me`             | Профіль поточного юзера     | JWT              |
| GET    | `/api/users`                | Всі користувачі             | Admin/Manager    |
| POST   | `/api/users/manager`        | Створити менеджера          | Admin            |
| PATCH  | `/api/users/:id/upgrade`    | Підвищити до Premium        | Admin/Manager    |
| PATCH  | `/api/users/:id/ban`        | Забанити юзера              | Admin/Manager    |
| PATCH  | `/api/users/:id/unban`      | Розбанити юзера             | Admin/Manager    |
| DELETE | `/api/users/:id`            | Видалити юзера              | Admin            |

### Cars
| Method | URL                                       | Опис                        | Auth |
|--------|-------------------------------------------|-----------------------------|------|
| GET    | `/api/cars/brands`                        | Всі бренди з моделями       | —    |
| GET    | `/api/cars/brands/:id/models`             | Моделі бренду               | —    |
| POST   | `/api/cars/brands/request`                | Запит відсутнього бренду    | JWT  |
| POST   | `/api/cars/brands/:id/models/request`     | Запит відсутньої моделі     | JWT  |

### Currency
| Method | URL                       | Опис                          | Auth  |
|--------|---------------------------|-------------------------------|-------|
| GET    | `/api/currency`           | Поточні курси UAH/USD/EUR     | —     |
| POST   | `/api/currency/refresh`   | Примусово оновити курси       | Admin |

### Listings
| Method | URL                            | Опис                          | Auth             |
|--------|--------------------------------|-------------------------------|------------------|
| GET    | `/api/listings`                | Активні оголошення (фільтри)  | —                |
| GET    | `/api/listings/:id`            | Одне оголошення               | —                |
| GET    | `/api/listings/my`             | Мої оголошення                | JWT              |
| GET    | `/api/listings/pending`        | На перевірці                  | Manager/Admin    |
| POST   | `/api/listings`                | Створити оголошення           | Seller           |
| PATCH  | `/api/listings/:id`            | Оновити оголошення            | Owner/Mgr/Admin  |
| DELETE | `/api/listings/:id`            | Видалити оголошення           | Owner/Mgr/Admin  |
| PATCH  | `/api/listings/:id/activate`   | Активувати                    | Manager/Admin    |
| PATCH  | `/api/listings/:id/deactivate` | Деактивувати                  | Manager/Admin    |

**Фільтри для GET /api/listings:** `brandId`, `modelId`, `region`, `minPrice`, `maxPrice`

### Statistics (тільки Premium)
| Method | URL                                | Опис                          | Auth         |
|--------|------------------------------------|-------------------------------|--------------|
| GET    | `/api/statistics/listings/:id`     | Перегляди + середні ціни      | JWT + Premium|

### Health
| Method | URL        | Опис                  |
|--------|------------|-----------------------|
| GET    | `/health`  | Статус сервера        |

---

## Формат відповідей

Всі відповіді мають структуру:

```json
{ "status": 200, "data": { ... } }
```

або для операцій з повідомленням:

```json
{ "status": 201, "message": "...", "data": { ... } }
```

Помилки:

```json
{ "status": 400, "message": "Error description" }
```

---

## Ролі

| Роль      | Права                                                    |
|-----------|----------------------------------------------------------|
| `buyer`   | Переглядати оголошення                                   |
| `seller`  | Створювати/управляти своїми оголошеннями                 |
| `manager` | Модерувати оголошення, банити юзерів                     |
| `admin`   | Все + створювати менеджерів                              |

## Типи акаунтів

| Тип       | Оголошення          | Статистика |
|-----------|---------------------|------------|
| `basic`   | Максимум 1 активне  | Ні         |
| `premium` | Необмежено          | Так        |

## Flow оголошення

```
Створення оголошення
        ↓
Перевірка профанити (bad-words)
        ↓
Чисто → статус: ACTIVE
Знайдено → статус: PENDING (продавець може редагувати, max 3 спроби)
        ↓
Після 3 невдалих спроб → статус: INACTIVE + email менеджеру
```

---

## Структура проєкту

```
src/
├── common/
│   ├── enums/              # Role, AccountType, ListingStatus, Currency
│   ├── errors/             # ApiError клас
│   ├── filters/            # Global error handler
│   ├── helpers/            # parseId
│   └── middlewares/        # authMiddleware, requireRole, validateBody
├── config/                 # app, database, redis конфіги
├── database/
│   └── seeds/              # Seed: бренди, моделі, admin юзер
└── modules/
    ├── auth/               # register, login, JWT
    │   └── validators/     # AuthValidator (Joi)
    ├── users/              # user management
    │   └── validators/     # UserValidator (Joi)
    ├── cars/               # brands, models
    │   └── validators/     # CarValidator (Joi)
    ├── currency/           # PrivatBank rates, cron
    ├── listings/           # car listings
    │   └── validators/     # ListingValidator (Joi)
    ├── statistics/         # views, avg prices (Premium)
    ├── profanity/          # ProfanityService (bad-words)
    ├── notifications/      # NotificationService (nodemailer)
    └── dealerships/        # Dealership entity (підготовка до майбутнього)
```
