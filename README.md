Апі, яке вказано в тестовому завданні - платне. Необхідно активувати [платну підписку](https://openweathermap.org/price#weather), інакше повертає 401. Тому вимушений був використовувати безкоштовний варіант 'https://api.openweathermap.org/data/2.5/weather'. Він не приймає параметр 'part'(exclude). Але логіку реалізував з підтримкою цього параметру. Якщо робити запити до платного апі - то буде процювати з урахуванням part(exclude).

<br />
<br />

## **Start application**

- Clone repo

- Create the `.env` file in root of project with next content:

  - WEATHER_API_KEY=
  - WEATHER_BASE_URL=
  - DB_NAME=
  - DB_USER=
  - DB_PASS=

  Ask to Karina-HR for valid values..))

- Execute `docker-compose up`

- Now you can make GET and POST requests to `http://localhost:3000/weather`:
  - for example `GET http://localhost:3000/weather?lon=94.03&lat=33.44&part=current`
  - for example `POST http://localhost:3000/weather` with body:
  ```json
  {
    "lat": 33.44,
    "lon": 94.03,
    "part": "current"
  }
  ```

<br />
<br />

## **Test task**

Створити проект на nest який буде фетчити дані із https://openweathermap.org/api/one-call-3#current та записувати в БД

**Проект повинен мати 2 доступні АПІ**

- POST який приймає lat, lon, part витягує дані із weatherAPI і записує в БД
- GET який приймає дані lat, lon і part і по цим даним витягує дані із БД і повертає у відповіді

**Вимоги до проекту**

- для GET АПІ використовувати interceptor nest для форматування відповіді у вигляді

```json
{
  "sunrise": 1684926645,
  "sunset": 1684977332,
  "temp": 292.55,
  "feels_like": 292.87,
  "pressure": 1014,
  "humidity": 89,
  "uvi": 0.16,
  "wind_speed": 3.13
}
```

- проект повинен мати Dockerfile і запускатись під докером
- в якості БД використовувати Postgres дані можна зберігати в JSON форматі
- unit tests опціонально
