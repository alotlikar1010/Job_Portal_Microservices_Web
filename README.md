# Job Portal – Microservices Web Application

A full-stack job portal built using a **microservices architecture**, supporting job seekers and recruiters with authentication, profile management, subscriptions, notifications, and recruiter dashboards.

## Features

* Multi-account registration and authentication
* User profile management with:

  * Bio
  * Skills
  * Work experience
* Recruiter dashboard
* Job posting and management
* Real-time email notifications
* Razorpay-based subscription and payment system
* Forgot-password and reset-password flow
* Redis-based caching
* Kafka-based asynchronous communication between microservices

## Tech Stack

### Frontend

* Next.js

### Backend

* Node.js
* Express.js
* REST APIs
* Microservices Architecture

### Database

* PostgreSQL

### Messaging & Caching

* Apache Kafka – asynchronous event/message communication
* Redis – caching and fast data access

### Payments & Notifications

* Razorpay – subscription/payment processing
* Email service – transactional notifications

## Architecture

The application follows a microservices architecture where different business responsibilities are separated into independent services.

Example services:

* **Auth Service** – registration, login, password reset and authentication
* **User/Profile Service** – user profiles, skills and experience
* **Job Service** – job creation, search and management
* **Recruiter Service** – recruiter dashboard and recruitment operations
* **Subscription Service** – Razorpay subscriptions and payment processing
* **Notification Service** – email notifications
* **API Gateway** – routes client requests to the appropriate services

Apache Kafka is used for asynchronous communication and event-driven workflows between services, while Redis is used for caching frequently accessed data.

## High-Level Flow

```text
                    ┌─────────────────┐
                    │    Next.js      │
                    │    Frontend     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   API Gateway   │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │ Auth Service│    │ Job Service │    │ User Service│
   └─────────────┘    └─────────────┘    └─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ▼
                      ┌─────────────┐
                      │    Kafka    │
                      └──────┬──────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
      ┌───────────────┐             ┌──────────────┐
      │ Notification  │             │ Subscription │
      │    Service    │             │   Service    │
      └───────────────┘             └──────────────┘
              │                             │
              ▼                             ▼
        Email Service                    Razorpay

             ┌──────────┐
             │  Redis   │
             │  Cache   │
             └──────────┘

             ┌──────────┐
             │PostgreSQL│
             └──────────┘
```

## Key Technologies

| Technology   | Purpose                             |
| ------------ | ----------------------------------- |
| Next.js      | Frontend application                |
| Node.js      | Backend runtime                     |
| Express.js   | REST API and microservices          |
| PostgreSQL   | Persistent data storage             |
| Apache Kafka | Event-driven communication          |
| Redis        | Caching                             |
| Razorpay     | Subscription and payment processing |

## Architecture Benefits

* Independent deployment of services
* Better scalability
* Separation of business responsibilities
* Asynchronous processing using Kafka
* Faster data access using Redis caching
* Easier maintenance and extension of individual services
