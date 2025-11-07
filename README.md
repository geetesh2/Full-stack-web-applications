# Expense Tracker – Full-Stack Web Application

[Live Demo](https://geetesh2.github.io/Full-stack-web-applications/)

A comprehensive full-stack expense tracker built using **.NET Web API**, **Angular**, and **SQL Server**, offering users secure budget and expense management along with AI-driven financial insights, caching for performance, and structured logging for maintainability.

---

## 🚀 Features

- Secure user authentication and JWT-based role-based authorization  
- CRUD operations for budgets and expenses with advanced filtering, search & pagination  
- AI-powered insights using the Gemini model: budget suggestions, expense forecasting, anomaly detection  
- Redis caching layer for high-performance data access and reduced backend load  
- Clean architecture: modular backend (Services + Repositories + DTOs), separation of concerns  
- Structured logging and centralized exception handling to improve reliability and observability  
- Responsive Angular frontend delivering smooth user experience across devices  

---

## 🧩 Technology Stack

| Layer         | Technologies                           |
|---------------|----------------------------------------|
| Frontend      | Angular, TypeScript, HTML, CSS         |
| Backend       | .NET Web API (C#), EF Core (Code-First)|
| Database      | SQL Server                             |
| Caching       | Redis                                  |
| Authentication| JWT, Role-Based Access                 |
| AI/Insights   | Gemini model integration               |
| Logging       | Serilog (or equivalent structured logging) |
| Architecture  | Clean Architecture, Repository/Service patterns |

---

## 📂 Project Structure

Full-stack-web-applications/
├─ api/ # .NET Web API backend
│ ├─ Controllers/ # API endpoints
│ ├─ Services/ # Business logic (incl. AI + Caching)
│ ├─ Models/ # Database entities
│ ├─ DTOs/ # Data Transfer Objects
│ ├─ Context/ # EF Core DbContext
│ ├─ Extensions/ # Middleware & setup extensions
│ ├─ Migrations/ # EF Core migrations
│ └─ Program.cs + appsettings.json
└─ client/ # Angular frontend
├─ src/
│ ├─ components/ # UI components (budgets, expenses, insights, etc.)
│ ├─ services/ # API services
│ ├─ models/ # TypeScript models
│ ├─ interceptors/ # JWT token interceptor
│ └─ AuthGuard/ # Route protection
├─ angular.json
└─ package.json



---

## 🧰 Setup & Installation

### Backend (.NET API)
cd api/ExpenseTrackerAPI
dotnet restore
dotnet ef database update
dotnet run

###Frontend (Angular)
cd client/expense-tracker-angular
npm install
ng serve


Then open http://localhost:4200 in your browser.

## 🧠 AI Integration Details

The backend service AiInsightService.cs leverages the Gemini model to:

Generate smart budget suggestions based on historical expense patterns

Forecast spending and highlight potential budget overruns

Detect anomalies in expenses (e.g., unusual spikes) and alert users

This adds a layer of intelligence beyond standard CRUD operations, making the app proactive rather than reactive.

## 🔍 Performance & Reliability Enhancements

Redis caching (RedisCacheService.cs) used to reduce database latency and serve repeated queries faster

Structured logging and centralized exception handling implemented in middleware for improved monitoring and fault diagnostics

Applied repository & service patterns for modularity and maintainability of backend codebase

## 📈 Future Enhancements

Integration with external financial APIs (bank feeds, currency rates) for real-time sync

Dashboard visualisations with rich charts and graphs

Push notifications or email alerts for anomalies and budget thresholds

Multi-user support with shared budgets and collaboration features

## 👤 Author

Geetesh Pandey
🔗 GitHub Profile

📄 Project Repo
