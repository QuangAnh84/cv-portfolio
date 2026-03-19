# Portfolio CV (Angular + Spring Boot)

This project contains:

- `frontend/`: Angular app
  - Public CV page: `http://localhost:4200/cv`
  - Admin editor: `http://localhost:4200/admin`
- `backend/`: Spring Boot REST API (Java 17)
  - Public CV JSON: `GET http://localhost:8080/api/cv`
  - Admin save: `PUT http://localhost:8080/api/admin/cv` (Basic Auth)

## Run backend

Prereqs: Java 17, Maven.

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

Default admin credentials are configured in `backend/src/main/resources/application.yml`:

- username: `admin`
- password: `admin`

## Run frontend

Prereqs: Node.js + npm.

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

## Using the admin page

1. Open `http://localhost:4200/admin`
2. Enter the admin username/password (default `admin/admin`)
3. Click **Save credentials**
4. Edit your CV and click **Save CV**

