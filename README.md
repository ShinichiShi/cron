<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# 🚀 Cron Job Service in NestJS with MongoDB

## 📌 Overview
This is a **NestJS-based Cron Job Service** that allows users to **create, update, delete, and retrieve** cron jobs stored in **MongoDB**. The service supports **scheduled execution**, **webhooks**, and **rate limiting** for stability and scalability.

## 🛠️ Features
- ✅ **CRUD Operations** for managing cron jobs.
- ✅ **Scheduled Execution** using NestJS `@nestjs/schedule`.
- ✅ **Webhook Support** to receive and store external data.
- ✅ **Rate Limiting & API Throttling** using `@nestjs/throttler`.
- ✅ **Scalability** with MongoDB storage and optimized queries.
- ✅ **History Tracking** for cron job triggers and responses.

## 📦 Tech Stack
- **Backend**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: [MongoDB](https://www.mongodb.com/) (via `@nestjs/mongoose`)
- **Scheduler**: [node-cron](https://www.npmjs.com/package/node-cron)
- **Rate Limiting**: [@nestjs/throttler](https://docs.nestjs.com/security/rate-limiting)
- **Logging & Monitoring**: [Winston](https://www.npmjs.com/package/winston)

---

## 🚀 Getting Started
 
To setup the project, kindly refer to [SETUP.md](SETUP.md)

## 🌐 Live Service
### **You can access the live backend service at: https://cron-z85p.onrender.com**

#### Append the endpoints documented below to interact with the service.

---

## 📌 Cron Jobs

| Method  | Endpoint         | Description            |
|---------|-----------------|------------------------|
| `POST`  | `/cron-jobs`    | Create a new cron job  |
| `GET`   | `/cron-jobs`    | Get all cron jobs      |
| `GET`   | `/cron-jobs/:id`| Get a specific cron job |
| `PUT`   | `/cron-jobs/:id`| Update a cron job      |
| `DELETE`| `/cron-jobs/:id`| Delete a cron job      |

### Request Body (Create/Update)
```bash
curl -X POST http://localhost:3000/cron-jobs   
     -H "Content-Type: application/json"  
     -d '{
    "name": "Test API",
    "triggerLink": "https://api.animechan.io/v1/quotes/random",
    "apiKey": "",
    "schedule": "*/30 * * * * *",
    "startDate": "2025-04-24T07:54:02.992Z" #add your latest timestamp
  }'
```

## 📌 Webhooks

| Method  | Endpoint    | Description           |
|---------|------------|-----------------------|
| `POST`  | `/webhooks`| Receive webhook data  |
| `GET`   | `/webhooks`| Get all received webhooks |

---
## Screenshots 
![screenshot1](image.png)
![screenshot2](<Screenshot from 2025-04-26 22-52-40.png>)
## 📜 License
This project is licensed under the [MIT License](LICENSE).