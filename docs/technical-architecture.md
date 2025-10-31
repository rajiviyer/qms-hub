# QMS Hub - Technical Architecture Document

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Patterns](#architecture-patterns)
4. [Technology Stack](#technology-stack)
5. [System Components](#system-components)
6. [Data Architecture](#data-architecture)
7. [API Design](#api-design)
8. [Security Architecture](#security-architecture)
9. [Deployment Architecture](#deployment-architecture)
10. [System Access & Connectivity](#system-access--connectivity)
11. [Development Workflow](#development-workflow)
12. [Performance Considerations](#performance-considerations)
13. [Scalability & Future Enhancements](#scalability--future-enhancements)

## Executive Summary

QMS Hub is a comprehensive Corrective Action Request (CAR) management system designed to streamline quality management processes within organizations. The system follows a modern microservices architecture with a React-based frontend, FastAPI backend, and PostgreSQL database, all containerized using Docker for consistent deployment and scalability.

### Key Features
- **CAR Lifecycle Management**: Complete workflow from problem identification to resolution
- **Root Cause Analysis**: Multiple analysis methods including Fishbone, Simple, and Immediate Root Cause Analysis
- **User Management**: Role-based access with organization-level data isolation
- **Real-time Collaboration**: Multi-user support with context-aware state management
- **Audit Trail**: Comprehensive logging and tracking of all CAR activities

## System Overview

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│   Port: 3010    │    │   Port: 8910    │    │   Port: 5410    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐              ┌────▼────┐
    │  Docker │              │ Docker│              │  Docker │
    │Network  │              │Network│              │Network  │
    └─────────┘              └───────┘              └─────────┘
```

### System Boundaries
- **Frontend**: User interface and client-side state management
- **Backend**: Business logic, API endpoints, and data processing
- **Database**: Persistent data storage and complex queries
- **Infrastructure**: Docker containerization and orchestration

## Architecture Patterns

### 1. Microservices Architecture
The system is decomposed into loosely coupled services:
- **Frontend Service**: Next.js application handling UI/UX
- **Backend Service**: FastAPI application managing business logic
- **Database Service**: PostgreSQL for data persistence

### 2. Layered Architecture (Backend)
```
┌─────────────────────────────────────┐
│           API Layer                 │  ← FastAPI Routes & Controllers
├─────────────────────────────────────┤
│        Business Logic Layer         │  ← Controllers & Services
├─────────────────────────────────────┤
│         Data Access Layer           │  ← SQLModel ORM & Database
├─────────────────────────────────────┤
│         Database Layer              │  ← PostgreSQL
└─────────────────────────────────────┘
```

### 3. Component-Based Architecture (Frontend)
- **Page Components**: Route-based components for different CAR workflow steps
- **Context Providers**: Global state management for user and CAR data
- **UI Components**: Reusable components with Radix UI and Tailwind CSS
- **Form Management**: React Hook Form for complex form handling

### 4. Domain-Driven Design
The system is organized around CAR domain concepts:
- **Problem Description**: Initial CAR creation and planning
- **Look Across**: Problem redefinition and containment
- **Root Cause Analysis**: Multiple analysis methodologies
- **Corrective Action Planning**: Action plan development and tracking
- **Effectiveness Planning**: Verification and validation processes

## Technology Stack

### Frontend Technologies
- **Framework**: Next.js 15.0.3 (React 18)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI primitives
- **Form Management**: React Hook Form 7.53.2
- **HTTP Client**: Axios 1.7.7
- **Authentication**: JWT with cookies-next
- **Icons**: Lucide React, React Icons

### Backend Technologies
- **Framework**: FastAPI with Python 3.11
- **ORM**: SQLModel (Pydantic + SQLAlchemy)
- **Database Driver**: psycopg2-binary
- **Authentication**: python-jose with bcrypt
- **Password Hashing**: passlib with bcrypt
- **Server**: Uvicorn ASGI server

### Database Technologies
- **Primary Database**: PostgreSQL 16.2
- **Connection Pooling**: SQLAlchemy connection management
- **Stored Procedures**: PL/pgSQL functions for complex queries
- **Schema Management**: SQLModel metadata creation

### Infrastructure Technologies
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose
- **Networking**: Custom Docker network (qms-hub-app-network)
- **Volume Management**: Named volumes for data persistence

## System Components

### Frontend Components

#### 1. Application Structure
```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/             # User sign-in
│   │   └── sign-up/             # User registration
│   ├── create-car/              # CAR creation workflow
│   │   ├── ProblemDescription.tsx
│   │   ├── LookAcross/
│   │   ├── FishBoneAnalysis/
│   │   ├── SimpleRootCauseAnalysis/
│   │   ├── ImmediateRootCauseAnalysis/
│   │   ├── CorrectiveActionPlan/
│   │   ├── CAEffectivenessPlan/
│   │   └── QMSProcessTraining/
│   ├── _context/                # React Context providers
│   │   ├── UserContext.tsx
│   │   ├── CARProblemDescContext.tsx
│   │   ├── CARProblemRedefContext.tsx
│   │   └── CARCANeedContext.tsx
│   └── landing/                 # Landing page components
├── components/                   # Reusable UI components
│   └── ui/                      # Base UI components
├── configs/                     # Configuration files
│   └── schema.tsx               # TypeScript interfaces
└── lib/                         # Utility libraries
```

#### 2. Key Frontend Features
- **Multi-step CAR Workflow**: Guided process through CAR creation
- **Context-based State Management**: Global state for user and CAR data
- **Form Validation**: Comprehensive client-side validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication Flow**: JWT-based authentication with cookie storage

### Backend Components

#### 1. Application Structure
```
backend/
├── app/
│   ├── controllers/             # Business logic controllers
│   │   ├── auth_controller.py  # Authentication & JWT management
│   │   ├── user_controller.py  # User management
│   │   └── car_controller.py   # CAR business logic
│   ├── db_models/              # Database models
│   │   ├── user_models.py      # User-related models
│   │   ├── car_models.py       # CAR-related models
│   │   └── admin_models.py     # Admin models
│   ├── db/                     # Database configuration
│   │   └── db_connector.py     # Database connection & session management
│   ├── utils/                  # Utility functions
│   │   ├── types.py           # Type definitions
│   │   └── exceptions.py      # Custom exceptions
│   ├── route.py               # FastAPI application & routes
│   └── settings.py            # Configuration management
└── requirements.txt            # Python dependencies
```

#### 2. Key Backend Features
- **RESTful API Design**: Comprehensive API endpoints for all CAR operations
- **Database Abstraction**: SQLModel ORM for type-safe database operations
- **Authentication & Authorization**: JWT-based security with role management
- **Error Handling**: Custom exception classes with proper HTTP status codes
- **Data Validation**: Pydantic models for request/response validation

### Database Components

#### 1. Core Tables
- **car_problem_definition**: Primary CAR information
- **car_planning_phase**: CAR workflow phases and responsibilities
- **car_problem_redefinition**: Problem redefinition and containment
- **car_ca_need**: Corrective action requirements assessment
- **car_rca_type_selection**: Root cause analysis type selection
- **car_fishbone_analysis**: Fishbone analysis data
- **car_simple_root_cause_analysis**: Simple root cause analysis
- **car_immediate_root_cause_analysis**: Immediate root cause analysis
- **car_corrective_action_plan**: Corrective action planning
- **car_qpt_requirements**: QMS process and training requirements
- **car_ca_effectiveness_plan**: Effectiveness verification planning

#### 2. User Management Tables
- **user**: User account information
- **token**: JWT refresh token storage
- **employee**: Employee information
- **admin**: Administrator accounts

#### 3. Stored Procedures
- **get_root_cause_analysis()**: Dynamic root cause analysis based on RCA type

## Data Architecture

### 1. Data Flow
```
User Input → Frontend Validation → API Request → Backend Processing → Database Storage
     ↑                                                                        ↓
User Interface ← Frontend State ← API Response ← Business Logic ← Database Query
```

### 2. Data Models

#### CAR Problem Description
```typescript
interface CARProblemDesc {
  car_number: string;
  initiation_date: Date;
  initiator: string;
  recipient: string;
  coordinator: string;
  source: string;
  description: string;
  user_org: string;
  lacc_phase: string;
  lacc_responsibility: string;
  lacc_target_date: Date;
  ca_phase: string;
  ca_responsibility: string;
  ca_target_date: Date;
}
```

#### User Management
```typescript
interface User {
  user_email: string;
  user_name: string;
  organization: string;
}
```

### 3. Database Relationships
- **One-to-Many**: CAR Problem Definition → Planning Phases
- **One-to-One**: CAR Problem Definition → Problem Redefinition
- **One-to-One**: CAR Problem Definition → CA Need Assessment
- **One-to-Many**: CAR Problem Definition → Root Cause Analysis (various types)
- **One-to-Many**: CAR Problem Definition → Corrective Action Plans

### 4. Data Integrity
- **Primary Keys**: Unique identifiers for all entities
- **Foreign Keys**: Referential integrity between related tables
- **Constraints**: Data validation at database level
- **Indexes**: Optimized query performance

## API Design

### 1. RESTful Endpoints

#### Authentication Endpoints
- `POST /api/signup` - User registration
- `POST /api/signin` - User authentication
- `POST /api/getuser` - Retrieve user details

#### CAR Management Endpoints
- `POST /api/add_car_problem_desc` - Create/update CAR problem description
- `POST /api/get_car_problem_desc` - Retrieve CAR problem description
- `POST /api/add_car_problem_redef` - Add problem redefinition
- `POST /api/get_car_problem_redef` - Retrieve problem redefinition
- `POST /api/add_car_ca_need` - Add CA need assessment
- `POST /api/get_car_ca_need` - Retrieve CA need assessment
- `POST /api/add_car_rca_type` - Select RCA type
- `POST /api/get_car_rca_type` - Retrieve RCA type
- `POST /api/add_car_fishbone_analysis` - Add fishbone analysis
- `POST /api/get_car_fishbone_analysis` - Retrieve fishbone analysis
- `POST /api/get_car_rootcauses` - Get root causes (dynamic based on RCA type)
- `POST /api/add_car_cap_data` - Add corrective action plan
- `POST /api/get_car_cap_data` - Retrieve corrective action plan
- `POST /api/add_car_qpt_req` - Add QMS process/training requirements
- `POST /api/get_car_qpt_req` - Retrieve QMS requirements
- `POST /api/add_car_ca_effectiveness_plan` - Add effectiveness plan
- `POST /api/get_car_ca_effectiveness_plan` - Retrieve effectiveness plan
- `POST /api/get_car_logs` - Get CAR logs by organization

### 2. Request/Response Patterns
- **Consistent JSON**: All requests and responses use JSON format
- **Error Handling**: Standardized error responses with appropriate HTTP status codes
- **Validation**: Request validation using Pydantic models
- **Type Safety**: TypeScript interfaces for frontend type checking

### 3. Authentication Flow
1. User submits credentials via `/api/signin`
2. Backend validates credentials and generates JWT tokens
3. Tokens stored in HTTP-only cookies
4. Subsequent requests include authentication headers
5. Backend validates tokens for protected endpoints

## Security Architecture

### 1. Authentication & Authorization
- **JWT Tokens**: Stateless authentication with access and refresh tokens
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Refresh token rotation for enhanced security
- **Role-based Access**: Organization-level data isolation

### 2. Data Security
- **Input Validation**: Comprehensive validation on both frontend and backend
- **SQL Injection Prevention**: Parameterized queries and ORM usage
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: SameSite cookie attributes

### 3. Infrastructure Security
- **Container Isolation**: Docker containers for process isolation
- **Network Security**: Custom Docker network with controlled communication
- **Environment Variables**: Sensitive configuration via environment variables
- **HTTPS Ready**: SSL/TLS termination capability

### 4. Data Privacy
- **Organization Isolation**: Data segregation by user organization
- **Audit Logging**: Comprehensive activity tracking
- **Data Retention**: Configurable data retention policies
- **Access Controls**: Role-based data access restrictions

## Deployment Architecture

### 1. Containerization Strategy
```yaml
# docker-compose.yml structure
services:
  frontend:     # Next.js application
  backend:      # FastAPI application  
  pgdatabase:   # PostgreSQL database
networks:
  qms-hub-app-network: # Custom network
```

### 2. Service Configuration
- **Frontend**: Port 3010, production build with static optimization
- **Backend**: Port 8910, development mode with hot reload
- **Database**: Port 5410, persistent data storage with named volumes

### 3. Environment Management
- **Development**: Docker Compose for local development
- **Production**: Container orchestration ready (Kubernetes/Docker Swarm)
- **Configuration**: Environment-based configuration management

### 4. Data Persistence
- **Database Volume**: Named volume for PostgreSQL data
- **Backup Strategy**: Database backup and restore capabilities
- **Migration Support**: Database schema migration tools

## System Access & Connectivity

### 1. Service Endpoints

#### Frontend Application
- **URL**: `http://localhost:3010`
- **Purpose**: Main user interface for CAR management
- **Container**: `qms-hub-app-frontend`
- **Technology**: Next.js 15 with TypeScript

#### Backend API
- **URL**: `http://localhost:8910`
- **Purpose**: RESTful API for business logic and data operations
- **Container**: `qms-hub-app-backend`
- **Technology**: FastAPI with Python 3.11

#### Database
- **Host**: `localhost`
- **Port**: `5410`
- **Database**: `qmsdb`
- **Username**: `postgres`
- **Password**: `welcome1`
- **Container**: `qms-hub-app-db`
- **Technology**: PostgreSQL 16.2

### 2. Application Startup

#### Starting the System
```bash
# Navigate to project directory
cd /home/rgiyer/projects/qms-hub

# Start all services with build
./restart-docker.sh --build

# Start services without rebuild
./restart-docker.sh

# Start with no cache (clean build)
./restart-docker.sh --build --no-cache
```

#### Stopping the System
```bash
# Stop all services
./stop-docker.sh

# Or using docker-compose directly
docker-compose down
```

### 3. Service Verification

#### Check Service Status
```bash
# Verify all containers are running
docker ps

# Check specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs pgdatabase

# Check service health
docker-compose ps
```

#### Port Availability Check
```bash
# Check if ports are in use
netstat -tulpn | grep :3010  # Frontend
netstat -tulpn | grep :8910  # Backend
netstat -tulpn | grep :5410  # Database
```

### 4. User Interface Access

#### Application Routes
- **Root Home**: `http://localhost:3010/` - Default Next.js template page
- **Landing Page**: `http://localhost:3010/landing` - Main application dashboard
- **Authentication**: `http://localhost:3010/sign-in`, `http://localhost:3010/sign-up`
- **CAR Management**: `http://localhost:3010/create-car` - Multi-step CAR workflow

#### Frontend Architecture
- **App Router**: Next.js 15 App Router for file-based routing
- **Context Management**: React Context for global state (User, CAR data)
- **Component Structure**: Modular components with clear separation of concerns
- **State Persistence**: Form data maintained across navigation steps

> **Note**: For detailed user interface guidance and workflow instructions, please refer to the [User Guide](user-guide.md).

### 5. API Documentation Access

#### Interactive API Documentation
- **Swagger UI**: `http://localhost:8910/docs`
  - Interactive API testing interface
  - Request/response examples
  - Authentication testing

- **ReDoc**: `http://localhost:8910/redoc`
  - Clean, readable API documentation
  - Schema definitions
  - Request/response models

#### API Testing
```bash
# Test API health
curl http://localhost:8910/

# Test authentication
curl -X POST http://localhost:8910/api/signin \
  -H "Content-Type: application/json" \
  -d '{"user_email":"test@example.com","user_passwd":"password"}'
```

### 6. Database Access

#### Direct Database Connection
```bash
# Connect using psql
psql -h localhost -p 5410 -U postgres -d qmsdb

# Connect using Docker
docker exec -it qms-hub-app-db psql -U postgres -d qmsdb
```

#### Database Management Tools
- **pgAdmin**: Available through Docker environment
- **Database URL**: `postgresql://postgres:welcome1@localhost:5410/qmsdb`

### 7. Troubleshooting

#### Common Issues

**Port Already in Use**
```bash
# Find process using port
sudo lsof -i :3010
sudo lsof -i :8910
sudo lsof -i :5410

# Kill process if needed
sudo kill -9 <PID>
```

**Container Startup Issues**
```bash
# Check container logs
docker logs qms-hub-app-frontend
docker logs qms-hub-app-backend
docker logs qms-hub-app-db

# Restart specific service
docker-compose restart frontend
docker-compose restart backend
docker-compose restart pgdatabase
```

**Database Connection Issues**
```bash
# Check database container
docker exec -it qms-hub-app-db psql -U postgres -c "SELECT version();"

# Verify database tables
docker exec -it qms-hub-app-db psql -U postgres -d qmsdb -c "\dt"
```

**Frontend Build Issues**
```bash
# Clean rebuild frontend
docker-compose build --no-cache frontend
docker-compose up frontend
```

### 8. Network Configuration

#### Docker Network
- **Network Name**: `qms-hub-app-network`
- **Internal Communication**: Services communicate via container names
- **External Access**: Port mapping to host machine

#### Service Communication
```
Frontend (3010) → Backend (8910) → Database (5432 internal)
     ↓
User Browser → Host Machine → Docker Network
```

## Development Workflow

### 1. Development Environment Setup
```bash
# Start development environment
./restart-docker.sh --build

# Stop environment
./stop-docker.sh
```

### 2. Code Organization
- **Frontend**: Component-based architecture with TypeScript
- **Backend**: Layered architecture with clear separation of concerns
- **Database**: Schema-first approach with SQLModel
- **Testing**: Unit and integration test capabilities

### 3. Version Control
- **Git Workflow**: Feature branch development
- **Code Review**: Pull request-based code review process
- **Documentation**: Inline code documentation and architecture docs

### 4. Build & Deployment
- **Frontend Build**: Next.js production build with optimization
- **Backend Build**: Python wheel packaging
- **Database Migration**: Automated schema updates
- **Container Registry**: Docker image versioning

## Performance Considerations

### 1. Frontend Performance
- **Code Splitting**: Next.js automatic code splitting
- **Static Generation**: Pre-rendered pages where possible
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Browser caching for static assets

### 2. Backend Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: In-memory caching for frequently accessed data
- **Async Processing**: Non-blocking I/O operations

### 3. Database Performance
- **Query Optimization**: Efficient SQL queries with proper joins
- **Index Strategy**: Strategic indexing for common query patterns
- **Connection Management**: Connection pooling and timeout handling
- **Stored Procedures**: Complex operations moved to database level

### 4. Scalability Considerations
- **Horizontal Scaling**: Stateless backend design for easy scaling
- **Database Scaling**: Read replicas and connection pooling
- **Caching Layer**: Redis integration for distributed caching
- **Load Balancing**: Multiple backend instances support

## Scalability & Future Enhancements

### 1. Short-term Enhancements
- **API Rate Limiting**: Request throttling and abuse prevention
- **Enhanced Logging**: Structured logging with correlation IDs
- **Monitoring**: Application performance monitoring (APM)
- **Testing**: Comprehensive test suite implementation

### 2. Medium-term Enhancements
- **Microservices Decomposition**: Further service separation
- **Message Queue**: Asynchronous processing with Redis/RabbitMQ
- **Caching Layer**: Redis for distributed caching
- **API Gateway**: Centralized API management

### 3. Long-term Enhancements
- **Multi-tenancy**: Enhanced multi-tenant architecture
- **Advanced Analytics**: Business intelligence and reporting
- **Mobile Application**: Native mobile app development
- **Integration APIs**: Third-party system integrations

### 4. Infrastructure Evolution
- **Kubernetes**: Container orchestration platform
- **Service Mesh**: Istio for service communication
- **CI/CD Pipeline**: Automated testing and deployment
- **Monitoring Stack**: Prometheus, Grafana, and ELK stack

---

## Conclusion

The QMS Hub system represents a well-architected, modern web application that effectively addresses the complex requirements of Corrective Action Request management. The microservices architecture, combined with modern technologies and best practices, provides a solid foundation for current operations and future growth.

The system's modular design, comprehensive API structure, and robust security measures make it suitable for enterprise-level deployment while maintaining the flexibility needed for organizational customization and future enhancements.

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Author: Technical Architecture Team*
