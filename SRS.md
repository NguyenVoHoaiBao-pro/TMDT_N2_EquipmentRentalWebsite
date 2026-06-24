# 📋 Software Requirements Specification (SRS)
## Equipment Rental E-Commerce Website Platform

**Document Version:** 1.0.0  
**Date:** June 24, 2026  
**Status:** 🚀 Active Development  
**Project Name:** TMDT_N2_EquipmentRentalWebsite  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [User Roles & Use Cases](#user-roles--use-cases)
7. [Data Requirements](#data-requirements)
8. [Security Requirements](#security-requirements)
9. [Performance Requirements](#performance-requirements)
10. [Integration Requirements](#integration-requirements)
11. [Deployment Requirements](#deployment-requirements)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

The **Equipment Rental E-Commerce Website** is a modern, full-stack web application designed to facilitate the rental of equipment through an online platform. The system supports multiple user roles, real-time communication, OAuth2 authentication, and comprehensive equipment management capabilities.

**Target Users:**
- End customers seeking to rent equipment
- Equipment rental businesses/administrators
- System administrators
- Customer support representatives

**Core Value Proposition:**
- Seamless online equipment rental experience
- Real-time support through integrated chat
- Secure authentication with OAuth2 options
- Comprehensive equipment catalog and management
- Order tracking and history

---

## Project Overview

### Objectives

1. ✅ Provide a user-friendly platform for browsing and renting equipment
2. ✅ Enable efficient equipment inventory and calendar management
3. ✅ Support multiple authentication methods (JWT + OAuth2)
4. ✅ Facilitate real-time communication between customers and support
5. ✅ Ensure scalability and maintainability through microservices-ready architecture
6. ✅ Provide comprehensive API documentation and testing capabilities

### Scope

**In Scope:**
- User authentication and authorization
- Equipment catalog and search functionality
- Equipment rental booking and calendar management
- Order processing and tracking
- Real-time chat support system
- Administrative dashboard for equipment management
- Image upload and management system
- Email notification system
- OAuth2 integration (Google & Facebook)

**Out of Scope (Phase 1):**
- Payment gateway integration (Stripe, PayPal) - Planned for Phase 2
- Advanced analytics and reporting - Planned for Phase 2
- Multi-language support - Planned for Phase 2
- Mobile app (Android/iOS) - Planned for Phase 3
- Advanced recommendation engine - Future enhancement

### Success Criteria

- ✅ System is fully functional and deployable via Docker Compose
- ✅ Frontend loads within 3 seconds on 4G connection
- ✅ Backend API response time < 500ms for 90% of requests
- ✅ Support for minimum 1000+ concurrent users in production
- ✅ Zero data loss during system failures
- ✅ API documentation 100% complete with Swagger/OpenAPI

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Client Layer (Browser)                     │
│  React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui   │
└────────────┬────────────────────────────────────────────────┘
             │
             │ HTTP/WebSocket
             │ (Axios + STOMP)
             │
┌────────────▼────────────────────────────────────────────────┐
│              API Gateway / Reverse Proxy                      │
│                  (Nginx in Docker)                            │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼──────┐     ┌────▼────────┐
│ REST API │     │ WebSocket   │
│(HTTP)    │     │ Server      │
│          │     │ (STOMP)     │
└───┬──────┘     └────┬────────┘
    │                 │
┌───▼─────────────────▼──────────────────────────────────────┐
│        Spring Boot 4.0.6 Backend (Java 21)                  │
│  - Controllers, Services, Repositories                      │
│  - JWT Authentication & OAuth2                             │
│  - WebSocket Message Handling                              │
│  - Business Logic Layer                                     │
└────────────┬──────────────────────────────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
┌───▼──┐ ┌──▼────┐ ┌─▼────────┐
│MySQL │ │Redis  │ │Cloudinary│
│  DB  │ │Cache  │ │(Image)   │
└──────┘ └───────┘ └──────────┘
```

### Component Architecture

**Backend Components:**
- `controller/` - REST API endpoints
- `service/` - Business logic
- `repository/` - Data access layer (JPA)
- `entity/` - Database models
- `dto/` - Data transfer objects
- `security/` - JWT & OAuth2 handlers
- `config/` - Spring Boot configuration
- `exception/` - Custom exception handlers
- `utils/` - Helper utilities

**Frontend Components:**
- `pages/` - Page-level components
- `components/` - Reusable UI components
- `features/` - Feature modules (auth, chat, products, etc.)
- `services/` - API client services
- `store/` - Zustand state management
- `providers/` - React providers (Query, Auth, etc.)
- `lib/` - Utility functions

### Technology Stack

| Layer              | Technology                      | Version |
|--------------------|----------------------------------|---------|
| **Frontend**       | React                           | 19.2.4  |
| **Frontend**       | TypeScript                      | 6.0.2   |
| **Frontend**       | Vite                            | 8.0.4   |
| **Frontend**       | Tailwind CSS                    | 3.4.19  |
| **Frontend**       | React Router                    | 7.15.1  |
| **Frontend**       | TanStack Query                  | 5.28.0  |
| **Frontend**       | Zustand                         | 4.4.7   |
| **Frontend**       | Axios                           | 1.16.1  |
| **Frontend**       | React Hook Form                 | 7.76.1  |
| **Frontend**       | Zod                             | 3.24.1  |
| **Frontend**       | shadcn/ui                       | 4.2.0   |
| **Frontend**       | Lucide React                    | 1.8.0   |
| **Frontend**       | Sonner (Toasts)                 | 2.0.7   |
| **Frontend**       | STOMP/SockJS                    | 7.3.0   |
| **Backend**        | Spring Boot                     | 4.0.6   |
| **Backend**        | Java                            | 21      |
| **Backend**        | Spring Security                 | 6.x     |
| **Backend**        | Spring Data JPA                 | 6.x     |
| **Backend**        | JWT (JJWT)                      | Latest  |
| **Backend**        | MapStruct                       | 1.6.3   |
| **Backend**        | SpringDoc OpenAPI               | 3.0.2   |
| **Backend**        | Cloudinary                      | 2.3.2   |
| **Backend**        | Spring Mail                     | 6.x     |
| **Backend**        | Redis                           | 7       |
| **Database**       | MySQL                           | 8.0+    |
| **Cache**          | Redis                           | 7-alpine|
| **Containerization** | Docker                        | Latest  |
| **CI/CD**          | GitHub Actions                  | Latest  |

---

## Functional Requirements

### FR1: Authentication & Authorization

#### FR1.1 User Registration
**Description:** Users can create new accounts with email and password
- User provides email, password, and basic profile information
- System validates email format and password strength (min 8 chars, mixed case, numbers)
- System checks for duplicate email addresses
- User account is created with GUEST role by default
- Confirmation email is sent (optional email verification)

**Acceptance Criteria:**
- ✅ Users can register with valid email and password
- ✅ System rejects invalid email formats
- ✅ System prevents duplicate email registration
- ✅ Password validation enforced (min 8 chars)
- ✅ Account defaults to GUEST role

#### FR1.2 Login (Email/Password)
**Description:** Users can log in with email and password credentials
- User provides email and password
- System validates credentials against database
- On success, JWT token is generated (HS256, 24-hour expiration)
- Token is returned to client
- Login history is tracked

**Acceptance Criteria:**
- ✅ Valid credentials return JWT token
- ✅ Invalid credentials return error (401 Unauthorized)
- ✅ Token expires after 24 hours
- ✅ Multiple login attempts are tracked (for security)

#### FR1.3 OAuth2 Authentication (Google)
**Description:** Users can sign in using Google accounts
- User clicks "Sign in with Google" button
- Browser redirects to Google OAuth2 consent screen
- After consent, system receives authorization code
- System exchanges code for access token
- User email and basic profile retrieved
- Account is created if new, or linked if existing
- JWT token generated for application

**Acceptance Criteria:**
- ✅ Google OAuth2 flow completes successfully
- ✅ User account created automatically on first login
- ✅ Existing accounts can be linked to Google
- ✅ User can log in via Google in future sessions

#### FR1.4 OAuth2 Authentication (Facebook)
**Description:** Users can sign in using Facebook accounts
- Similar to Google OAuth2 but using Facebook credentials
- Facebook user info retrieved upon consent
- Account creation/linking automated

**Acceptance Criteria:**
- ✅ Facebook OAuth2 flow works end-to-end
- ✅ Automatic account creation on first login
- ✅ Account linking for existing users

#### FR1.5 JWT Token Management
**Description:** System manages JWT tokens securely
- Tokens signed with HS256 algorithm using secret key
- Token expiration: 24 hours (configurable)
- Token refresh mechanism available
- Tokens include: user_id, email, roles, exp, iat

**Acceptance Criteria:**
- ✅ Token format includes required claims
- ✅ Expired tokens rejected (401)
- ✅ Invalid signatures rejected
- ✅ Token refresh extends session

#### FR1.6 Role-Based Access Control (RBAC)
**Description:** System enforces permissions based on user roles

**Roles Defined:**
- **ADMIN** - Full system access, equipment management, user management
- **USER** - Browse products, create rentals, view orders, use chat
- **GUEST** - Browse public products, limited read-only access

**Access Control Rules:**
- Admin endpoints require ADMIN role
- Protected endpoints require USER or ADMIN role
- Public endpoints accessible to all

**Acceptance Criteria:**
- ✅ ADMIN can access all endpoints
- ✅ USER cannot access admin endpoints (403)
- ✅ GUEST has limited access
- ✅ Role-based authorization enforced at controller level

#### FR1.7 Password Reset
**Description:** Users can reset forgotten passwords
- User enters email address
- System sends password reset link via email
- Link contains secure token valid for 1 hour
- User sets new password
- Account is locked until password changed

**Acceptance Criteria:**
- ✅ Reset email sent within 1 minute
- ✅ Token expires after 1 hour
- ✅ Password updated successfully
- ✅ User can log in with new password

### FR2: Equipment Catalog & Search

#### FR2.1 Browse Products
**Description:** Users can browse available equipment in catalog
- Products organized by category and brand
- Products displayed with images, name, price, availability
- Support for pagination (default 20 items per page)
- Basic filtering by category

**Acceptance Criteria:**
- ✅ All products displayed with thumbnails
- ✅ Pagination works correctly
- ✅ Category filtering functional
- ✅ Page loads within 3 seconds

#### FR2.2 Product Search
**Description:** Users can search for equipment by name, brand, category
- Search box on main page and in header
- Search results displayed with relevance ranking
- Supports partial matching
- Search results paginated

**Acceptance Criteria:**
- ✅ Search finds products by name
- ✅ Search finds products by brand
- ✅ Partial matches work (e.g., "cam" finds "camera")
- ✅ Results paginated and sorted by relevance

#### FR2.3 Product Filtering & Sorting
**Description:** Users can filter and sort search results
- Filter by: Category, Brand, Price Range, Availability
- Sort by: Relevance, Price (low-high, high-low), Newest, Popularity
- Multiple filters can be combined
- Filters persist in URL for sharing

**Acceptance Criteria:**
- ✅ Each filter type works independently
- ✅ Multiple filters can combine
- ✅ Sorting options work correctly
- ✅ URL reflects current filters

#### FR2.4 Product Details
**Description:** Users can view detailed product information
- Full product information: name, description, price, specifications
- Multiple product images with zoom capability
- Rental terms and conditions
- Customer reviews and ratings (Phase 2)
- Availability calendar

**Acceptance Criteria:**
- ✅ All product details displayed
- ✅ Multiple images viewable
- ✅ Rental calendar shown
- ✅ Page responsive on mobile

#### FR2.5 Availability Check
**Description:** System displays equipment availability on calendar
- Calendar shows available/unavailable dates
- Color-coded: Green (available), Red (booked), Gray (unavailable)
- Date picker for rental period selection
- Duration calculated automatically

**Acceptance Criteria:**
- ✅ Calendar displays current month and next 3 months
- ✅ Booked dates clearly marked
- ✅ Date range selection works
- ✅ Duration calculated correctly

### FR3: Equipment Rental & Booking

#### FR3.1 Create Rental Request
**Description:** Users can create equipment rental requests
- Select equipment from catalog
- Choose rental start and end dates
- Confirm rental details (price, quantity, duration)
- Submit rental request for confirmation

**Acceptance Criteria:**
- ✅ Users can select dates from available inventory
- ✅ Total rental price calculated correctly
- ✅ Rental request created in database
- ✅ Confirmation email sent to user

#### FR3.2 Order Management
**Description:** System manages rental orders from creation to completion
- Order states: Pending, Confirmed, Paid, In Transit, Delivered, Completed, Cancelled
- Order history visible to users
- Order details show rental period, equipment, pricing
- Users can cancel orders (if in pending state)

**Acceptance Criteria:**
- ✅ Orders created successfully
- ✅ Order status transitions work correctly
- ✅ Order history displays all user's orders
- ✅ Cancellation works for pending orders

#### FR3.3 Device Calendar
**Description:** System maintains equipment availability calendar
- Each equipment item has availability calendar
- Calendar entries: booked, available, maintenance, discontinued
- Admin can block dates for maintenance
- Calendar shared between rental system and inventory management

**Acceptance Criteria:**
- ✅ Calendar created for each equipment item
- ✅ Availability updated in real-time
- ✅ Admin can update calendar
- ✅ Users see accurate availability

#### FR3.4 Rental Duration & Pricing
**Description:** System calculates rental costs based on duration
- Base rental price per day
- Discount tiers for longer rentals (7+ days, 30+ days)
- Late return fees calculation
- Total cost preview before checkout

**Acceptance Criteria:**
- ✅ Daily rate applied correctly
- ✅ Duration discounts calculated
- ✅ Late fees calculated accurately
- ✅ Total cost shows before confirmation

### FR4: Real-time Chat Support

#### FR4.1 Chat Room Management
**Description:** System creates and manages chat rooms for support
- Users can initiate new chat rooms
- Each chat room linked to user and support staff
- Chat room stores conversation history
- Rooms can be closed by support staff or user

**Acceptance Criteria:**
- ✅ New chat rooms created automatically
- ✅ Conversation history persisted
- ✅ Rooms accessible to authorized users only
- ✅ Rooms can be reopened

#### FR4.2 Real-time Message Exchange
**Description:** Users and support staff exchange messages in real-time via WebSocket
- Messages sent using STOMP protocol
- Messages broadcast to connected clients
- Messages stored in database with timestamp
- Sender information included in message

**Acceptance Criteria:**
- ✅ Messages delivered within 100ms
- ✅ All connected clients receive messages
- ✅ Message history available
- ✅ Works on mobile and desktop

#### FR4.3 Chat Notifications
**Description:** Users notified of new messages and chat events
- Browser notifications for new messages
- In-app toast notifications
- Sound alert (optional, user preference)
- Unread message badge on chat icon

**Acceptance Criteria:**
- ✅ Notifications sent within 500ms of message
- ✅ User can enable/disable notifications
- ✅ Badge counts unread messages
- ✅ Notifications work on all devices

#### FR4.4 Chat Status & Typing Indicators
**Description:** System shows online status and typing indicators
- Online/offline status for support staff
- "X is typing..." indicator
- Last seen timestamp
- Auto-status based on inactivity (5 minutes)

**Acceptance Criteria:**
- ✅ Status updates in real-time
- ✅ Typing indicator shows within 1 second
- ✅ Last seen accurate
- ✅ Status clears on disconnect

### FR5: Image Management

#### FR5.1 Product Image Upload
**Description:** Admin can upload product images
- Upload single or multiple images per product
- Images stored in Cloudinary
- Automatic thumbnail generation
- Images optimized for web delivery

**Acceptance Criteria:**
- ✅ Images upload successfully to Cloudinary
- ✅ Multiple images per product supported
- ✅ Thumbnails generated automatically
- ✅ Image URLs returned for display

#### FR5.2 Device Image Management
**Description:** System manages equipment images
- Multiple images per equipment item
- Primary image selection
- Images used in equipment calendar and listings

**Acceptance Criteria:**
- ✅ Images assigned to correct equipment
- ✅ Primary image displayed in listings
- ✅ All images accessible in detail view
- ✅ Images don't slow down page load

#### FR5.3 Image Optimization
**Description:** Images automatically optimized for delivery
- Compression applied to reduce file size
- Responsive image formats (webp where supported)
- Lazy loading implemented
- CDN delivery via Cloudinary

**Acceptance Criteria:**
- ✅ Images load quickly (< 1 second)
- ✅ File sizes optimized (< 500KB after compression)
- ✅ Lazy loading working
- ✅ Mobile resolution images served

### FR6: Product & Equipment Management

#### FR6.1 Brand Management
**Description:** Admin can manage equipment brands
- Create, read, update, delete brand entries
- Brand name and description
- Brand logo/image support
- Brands associated with multiple products

**Acceptance Criteria:**
- ✅ Admin can create new brands
- ✅ Brands display in product filters
- ✅ Edit/delete functionality works
- ✅ Brand-product relationships maintained

#### FR6.2 Category Management
**Description:** Admin can manage equipment categories
- Create hierarchical category structure
- Main categories and subcategories
- Category descriptions and icons
- Categories associated with products

**Acceptance Criteria:**
- ✅ Categories organized hierarchically
- ✅ Products assigned to categories
- ✅ Admin can manage categories
- ✅ Categories appear in UI filters

#### FR6.3 Product Management
**Description:** Admin can manage product catalog
- Create, read, update, delete products
- Product attributes: name, description, price, SKU
- Product images (multiple per product)
- Brand and category assignment
- Rental terms and conditions

**Acceptance Criteria:**
- ✅ Admin can create/edit products
- ✅ Products searchable and filterable
- ✅ Pricing updated accurately
- ✅ Product changes reflected immediately

#### FR6.4 Equipment Availability Management
**Description:** Admin can manage equipment inventory
- Set total quantity per equipment item
- Block dates for maintenance
- Mark equipment as discontinued
- Update availability status

**Acceptance Criteria:**
- ✅ Admin can update equipment details
- ✅ Availability changes reflected in calendar
- ✅ Discontinued items hidden from search
- ✅ Maintenance blocks prevent bookings

### FR7: Email Notifications

#### FR7.1 Transactional Emails
**Description:** System sends automatic emails for key events
- Registration confirmation
- Password reset link
- Order confirmation
- Order status updates
- Rental reminder (1 day before)
- Return reminder

**Acceptance Criteria:**
- ✅ Emails sent within 1 minute of event
- ✅ Email contains relevant information
- ✅ Branding and formatting consistent
- ✅ Links in emails work correctly

#### FR7.2 Email Customization
**Description:** Admin can customize email templates
- Template management interface
- Variable support (user name, order ID, etc.)
- HTML email support
- Test email sending

**Acceptance Criteria:**
- ✅ Templates stored in database
- ✅ Variables replaced correctly
- ✅ Emails rendered correctly in clients
- ✅ Admin can preview before sending

### FR8: Admin Dashboard

#### FR8.1 Admin Overview
**Description:** Admin dashboard shows key metrics
- Total equipment items
- Current bookings
- Total orders
- Revenue summary
- Recent activities

**Acceptance Criteria:**
- ✅ Dashboard loads within 2 seconds
- ✅ Metrics updated in real-time
- ✅ Data accurate
- ✅ Dashboard responsive

#### FR8.2 Equipment Management Interface
**Description:** Admin can manage equipment from dashboard
- List all equipment
- Add new equipment
- Edit equipment details
- Update availability
- View rental history per equipment

**Acceptance Criteria:**
- ✅ CRUD operations work
- ✅ Bulk actions supported (Phase 2)
- ✅ Filters and search functional
- ✅ Changes take effect immediately

#### FR8.3 Order Management Interface
**Description:** Admin can manage orders from dashboard
- View all orders
- Update order status
- View order details
- Assign to support staff

**Acceptance Criteria:**
- ✅ Admin can view all orders
- ✅ Order status updates reflected
- ✅ Order details complete
- ✅ Search and filter working

---

## Non-Functional Requirements

### NFR1: Performance

#### NFR1.1 Response Time
- **Requirement:** API endpoints respond within 500ms for 90% of requests
- **Measurement:** Response time including database query and serialization
- **Target:** P95 latency < 500ms
- **Monitoring:** APM tool (e.g., New Relic, DataDog)

#### NFR1.2 Page Load Time
- **Requirement:** Frontend pages load within 3 seconds on 4G connection
- **Measurement:** First contentful paint (FCP) and largest contentful paint (LCP)
- **Target:** FCP < 1.5s, LCP < 2.5s
- **Monitoring:** Lighthouse, Chrome DevTools

#### NFR1.3 Database Performance
- **Requirement:** Database queries execute within 100ms
- **Optimization:** Proper indexing, query optimization
- **Target:** P95 query time < 100ms

#### NFR1.4 Concurrent Users
- **Requirement:** System supports minimum 1000 concurrent users
- **Load Testing:** Conducted before production deployment
- **Scaling:** Horizontal scaling via container orchestration

### NFR2: Scalability

#### NFR2.1 Horizontal Scalability
- Application designed to run in multiple instances
- Stateless design for session management (JWT)
- Shared database and cache layer
- Load balancer distribution

#### NFR2.2 Database Scaling
- MySQL connection pooling
- Redis clustering for cache
- Database replication (read replicas)
- Sharding strategy for large datasets (future)

#### NFR2.3 Storage Scaling
- Cloudinary used for unlimited image storage
- External file storage via cloud services
- CDN for content delivery

### NFR3: Availability & Reliability

#### NFR3.1 System Availability
- **Target:** 99.5% uptime (SLA)
- **Allowable Downtime:** ~3.6 hours per month
- **Maintenance Windows:** Scheduled during low-traffic periods

#### NFR3.2 Data Backup
- **Backup Frequency:** Daily automated backups
- **Retention Policy:** 30 days local, 90 days cloud archive
- **Recovery Time Objective (RTO):** < 2 hours
- **Recovery Point Objective (RPO):** < 1 hour

#### NFR3.3 Disaster Recovery
- Database replication to backup location
- Automated failover procedures
- Regular disaster recovery drills (quarterly)

#### NFR3.4 Fault Tolerance
- Graceful error handling
- Automatic retry mechanisms
- Circuit breaker pattern for external services
- Error logging and monitoring

### NFR4: Security

#### NFR4.1 Authentication Security
- Passwords hashed with BCrypt (12 rounds minimum)
- JWT tokens signed with HS256 algorithm
- OAuth2 credential exchange secure
- Session tokens stored securely

#### NFR4.2 Authorization Security
- Role-based access control enforced
- Method-level security annotations
- API endpoint protection with Spring Security

#### NFR4.3 Data Protection
- HTTPS/TLS for all communications
- Sensitive data encrypted in transit
- Password fields never logged
- API keys never committed to repository

#### NFR4.4 Input Validation
- Server-side validation for all inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (HTML escaping)
- CSRF protection via tokens

#### NFR4.5 Secrets Management
- Environment variables for sensitive config
- .env file in .gitignore
- Secrets not hardcoded
- Rotation policy for API keys

### NFR5: Usability

#### NFR5.1 Responsive Design
- Works on desktop, tablet, mobile
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly on mobile (min 44px tap targets)

#### NFR5.2 Accessibility (WCAG 2.1 Level AA)
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratio ≥ 4.5:1

#### NFR5.3 User Interface Consistency
- Consistent button styles and interactions
- Consistent form layouts
- Consistent color scheme
- Loading states for long operations

#### NFR5.4 Error Handling
- User-friendly error messages
- Clear guidance on how to fix errors
- No technical jargon in error messages
- Error codes for debugging

### NFR6: Maintainability

#### NFR6.1 Code Quality
- Code follows Java/JavaScript conventions
- ESLint for frontend code quality
- Checkstyle for backend code quality
- Code coverage target: ≥ 70%

#### NFR6.2 Documentation
- API documentation via Swagger/OpenAPI
- Code comments for complex logic
- README files for each module
- Architecture documentation

#### NFR6.3 Testing
- Unit tests for core logic
- Integration tests for API endpoints
- End-to-end tests for critical flows
- Automated test execution in CI/CD

#### NFR6.4 Monitoring & Logging
- Centralized logging via SLF4J
- Request/response logging for API
- Error tracking and alerting
- Performance metrics collection

### NFR7: Compatibility

#### NFR7.1 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### NFR7.2 Operating System
- Windows 10+
- macOS 10.14+
- Linux (Ubuntu 18.04+)

#### NFR7.3 Java Version
- Java 21+ (required)
- Spring Boot 4.0.6+

#### NFR7.4 Database
- MySQL 8.0+
- Compatible with MariaDB 10.5+

---

## User Roles & Use Cases

### User Role: Customer (Regular User)

#### Use Case 1: Browse Equipment
**Actors:** Customer  
**Preconditions:** User has internet access  
**Main Flow:**
1. User opens application
2. User sees featured products on home page
3. User browses product categories
4. User sees product list with images and prices
5. User selects product to view details

**Alternate Flows:**
- User uses search to find specific equipment
- User applies filters (brand, category, price)

**Postconditions:** User views selected product details

#### Use Case 2: Book Equipment
**Actors:** Customer  
**Preconditions:** User logged in, equipment available  
**Main Flow:**
1. User selects equipment
2. User clicks "Rent Now"
3. User selects rental start and end dates
4. System shows total price with discounts
5. User confirms booking
6. System creates order
7. Confirmation email sent to user

**Alternate Flows:**
- Dates not available: system shows next available dates
- User cancels: booking not created

**Postconditions:** Order created, user can track order status

#### Use Case 3: Chat with Support
**Actors:** Customer, Support Staff  
**Preconditions:** User has question or issue  
**Main Flow:**
1. User clicks chat icon
2. New chat room created
3. User types message
4. Message sent via WebSocket in real-time
5. Support staff receives message
6. Support staff responds
7. User receives response in real-time

**Alternate Flows:**
- Support staff offline: message queued
- User closes chat: room can be reopened later

**Postconditions:** Issue resolved, chat room closed

### User Role: Administrator

#### Use Case 1: Manage Equipment
**Actors:** Admin  
**Preconditions:** Admin logged in  
**Main Flow:**
1. Admin accesses admin dashboard
2. Admin selects "Equipment Management"
3. Admin sees list of all equipment
4. Admin can create new equipment
5. Admin fills in equipment details (name, description, price)
6. Admin uploads equipment images
7. Admin sets availability calendar
8. Admin saves equipment

**Alternate Flows:**
- Edit existing equipment
- Delete equipment (with confirmation)
- Bulk import equipment (Phase 2)

**Postconditions:** Equipment added/updated in system

#### Use Case 2: Manage Orders
**Actors:** Admin  
**Preconditions:** Orders exist in system  
**Main Flow:**
1. Admin accesses admin dashboard
2. Admin selects "Order Management"
3. Admin sees list of all orders
4. Admin can filter orders by status
5. Admin selects order to view details
6. Admin updates order status (Confirmed, Shipped, etc.)
7. Notification sent to customer

**Alternate Flows:**
- Cancel order with reason
- Add notes to order for support team

**Postconditions:** Order status updated, notifications sent

#### Use Case 3: Manage Brands & Categories
**Actors:** Admin  
**Preconditions:** Admin logged in  
**Main Flow:**
1. Admin accesses admin dashboard
2. Admin selects "Categories" or "Brands"
3. Admin sees list of existing items
4. Admin can add new category/brand
5. Admin fills in name and description
6. Admin saves

**Alternate Flows:**
- Edit existing category/brand
- Delete with cascading checks
- Reorder categories

**Postconditions:** Category/Brand structure updated

---

## Data Requirements

### Entity Relationship Diagram (Logical)

```
User (1) ──────────────── (M) Order
         ────────────────── (M) ChatRoom

Product (1) ──────────────── (M) ProductImage
           ────────────────── (1) Category
           ────────────────── (1) Brand

Device (1) ──────────────── (M) DeviceImage
        ──────────────────── (M) DeviceCalendar
        ──────────────────── (M) Order

Category (1) ──────────────── (M) Product

Brand (1) ──────────────── (M) Product

ChatRoom (1) ──────────────── (M) ChatMessage
           ──────────────── (1) User (customer)

ChatMessage (M) ────────────── (1) User (sender)
```

### Core Entities

#### User Entity
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    role ENUM('ADMIN', 'USER', 'GUEST') DEFAULT 'GUEST',
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);
```

#### Product Entity
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id BIGINT,
    brand_id BIGINT,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);
```

#### Order Entity
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    device_id BIGINT NOT NULL,
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    total_price DECIMAL(10, 2),
    status ENUM('PENDING', 'CONFIRMED', 'PAID', 'IN_TRANSIT', 
                'DELIVERED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (device_id) REFERENCES devices(id)
);
```

#### ChatRoom Entity
```sql
CREATE TABLE chat_rooms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    admin_id BIGINT,
    status ENUM('OPEN', 'CLOSED', 'ARCHIVED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);
```

#### ChatMessage Entity
```sql
CREATE TABLE chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    chat_room_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);
```

### Data Validation Rules

- Email must be valid format
- Passwords must be minimum 8 characters
- Product prices must be positive
- Rental end date must be after start date
- Order total price calculated automatically

### Data Retention Policy

- User data: Retain indefinitely (GDPR compliant deletion on request)
- Order data: Retain 7 years (accounting requirements)
- Chat messages: Retain 1 year
- Deleted records: Soft delete (marked deleted_at) for 90 days, then hard delete

---

## Security Requirements

### Authentication Security

#### JWT Token Security
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Secret Key:** Minimum 32 characters
- **Expiration:** 24 hours (configurable)
- **Token Structure:** Header.Payload.Signature

#### Password Security
- **Hashing:** BCrypt with cost factor 12
- **Minimum Length:** 8 characters
- **Complexity:** Must include uppercase, lowercase, numbers
- **Reset:** Token-based, valid for 1 hour

#### Session Management
- **Token Storage:** LocalStorage (frontend)
- **HttpOnly Cookies:** Optional (Phase 2)
- **Session Timeout:** 24 hours
- **Concurrent Sessions:** Allow multiple (configurable)

### Authorization Security

#### Role-Based Access Control
- **ADMIN:** Can access all endpoints
- **USER:** Can access user-specific endpoints
- **GUEST:** Can access read-only public endpoints

#### Method-Level Security
```java
@PreAuthorize("hasRole('ADMIN')")
public void adminOnlyMethod() { ... }

@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public void userMethod() { ... }

@PreAuthorize("permitAll")
public void publicMethod() { ... }
```

### Data Protection

#### In Transit
- **HTTPS/TLS:** All communications encrypted
- **TLS Version:** 1.2 or higher
- **Certificate:** Valid SSL/TLS certificate

#### At Rest
- **Database:** Passwords hashed, sensitive fields encrypted
- **Sensitive Data:** API keys, OAuth credentials encrypted
- **Backups:** Encrypted before storage

### Input Validation & Sanitization

#### Server-Side Validation
- Email format validation
- Password strength validation
- String length limits enforced
- Numeric ranges validated
- Date format validation

#### SQL Injection Prevention
- Parameterized queries (JPA named parameters)
- No string concatenation in queries
- Validation of all inputs

#### XSS Prevention
- HTML content escaped
- Content Security Policy (CSP) headers
- User input sanitized in chat messages

#### CSRF Prevention
- CSRF tokens in state-changing requests
- SameSite cookie attribute
- Origin/Referer validation

### Secrets Management

#### Environment Variables
- JWT_SECRET: Stored in .env (never committed)
- Database password: Stored in .env
- API keys: Stored in .env
- OAuth credentials: Stored in .env

#### Production Secrets
- Managed by cloud provider (AWS Secrets Manager, Azure Key Vault)
- Automated rotation policy
- Access audit logging

### Logging & Monitoring

#### Security Logging
- Failed login attempts logged
- Unauthorized access attempts logged
- Admin actions logged with user ID
- Suspicious activities flagged

#### Sensitive Data Handling
- Passwords never logged
- Credit card data not logged (not stored)
- API keys redacted in logs
- User emails partially masked in logs

---

## Performance Requirements

### API Performance Targets

| Endpoint Type | Target Response Time | P95 Latency |
|---------------|----------------------|------------|
| GET Products  | 100ms                | 200ms      |
| GET Orders    | 150ms                | 300ms      |
| POST Order    | 200ms                | 400ms      |
| POST Chat     | 100ms                | 200ms      |
| GET Chat      | 50ms                 | 100ms      |

### Database Performance

#### Indexing Strategy
```sql
-- Product search
CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_brand ON products(brand_id);

-- Order queries
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created ON orders(created_at);

-- Chat messages
CREATE INDEX idx_chat_room_id ON chat_messages(chat_room_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at);
```

#### Query Optimization
- Avoid N+1 queries (use JOIN eagerly)
- Pagination for large result sets
- Query result caching in Redis
- Database connection pooling (HikariCP)

### Frontend Performance

#### Optimization Techniques
- **Code Splitting:** Route-based lazy loading
- **Image Optimization:** WebP format, compression, lazy loading
- **Caching:** Browser cache headers, service worker (Phase 2)
- **Bundle Size:** Target < 200KB gzipped (JavaScript)
- **Time to Interactive (TTI):** < 3 seconds on 4G

#### Monitoring Metrics
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### Caching Strategy

#### Frontend Caching
- HTTP headers: Cache-Control, ETag
- Service Worker: Network-first strategy
- TanStack Query: Automatic request deduplication

#### Backend Caching
- **Database Queries:** Redis cache with 5-minute TTL
- **Product Catalog:** Redis cache with 1-hour TTL
- **User Sessions:** Redis with 24-hour TTL
- **API Responses:** Optional client-side caching headers

### Load Testing

#### Load Test Scenarios
- **Normal Load:** 100 concurrent users
- **Peak Load:** 500 concurrent users
- **Stress Test:** 1000+ concurrent users
- **Duration:** 15 minutes per scenario

#### Success Criteria
- 95% of requests complete within SLA
- Database connection pool doesn't exhaust
- Memory usage stable
- CPU usage < 80%

---

## Integration Requirements

### External Services Integration

#### Cloudinary (Image Management)
- **Service:** Cloud image storage and optimization
- **API:** REST API for upload, transform, delete
- **Authentication:** API key and secret
- **Usage:** Product images, device images, user avatars
- **Error Handling:** Fallback to local storage (Phase 2)

#### Google OAuth2
- **Service:** Google Sign-In
- **Flow:** Authorization Code flow
- **Scopes:** email, profile
- **User Info:** Email, name, avatar
- **Token Management:** Access token + refresh token

#### Facebook OAuth2
- **Service:** Facebook Login
- **Flow:** Authorization Code flow
- **Scopes:** email, public_profile
- **User Info:** Email, name, avatar
- **Token Management:** Access token

#### Email Service (SMTP)
- **Service:** Gmail SMTP (or SendGrid for Phase 2)
- **Authentication:** Username and app password
- **Rate Limit:** 500 emails/day (Gmail)
- **Templates:** HTML email templates
- **Error Handling:** Retry with exponential backoff

#### WebSocket (Real-time Chat)
- **Protocol:** STOMP (Simple Text Oriented Messaging Protocol)
- **Transport:** SockJS (WebSocket + fallbacks)
- **Channels:** /app/chat/message → /user/queue/messages
- **Destination:** User-specific message queues

### Third-Party APIs (Future Integrations)

#### Payment Gateway (Stripe)
- Planned for Phase 2
- Card processing
- Payment status updates
- Webhook integration

#### SMS Notifications (Twilio)
- Planned for Phase 2
- Rental reminders
- Delivery notifications
- Two-factor authentication

#### Analytics (Google Analytics)
- Planned for Phase 2
- Page views tracking
- User behavior analysis
- Conversion tracking

---

## Deployment Requirements

### Deployment Architecture

```
GitHub Repository
    ↓
GitHub Actions CI/CD Pipeline
    ↓
Docker Build (Backend & Frontend)
    ↓
Push to Docker Registry (Docker Hub / GHCR)
    ↓
Production Environment
    ├── Docker Compose Orchestration
    │   ├── MySQL Container (Database)
    │   ├── Redis Container (Cache)
    │   ├── Backend Container (Spring Boot)
    │   └── Frontend Container (Nginx + React)
    ├── Network
    │   └── equipment-rental-network
    └── Volumes
        ├── mysql_data
        └── redis_data
```

### Environment Configurations

#### Local Development
- **Database:** MySQL on localhost
- **Cache:** Redis on localhost
- **API:** http://localhost:8080
- **Frontend:** http://localhost:5173 (Vite dev)
- **Docker:** docker-compose.yml (with -dev Dockerfiles)

#### Staging
- **Database:** Production database (replicated)
- **Cache:** Production Redis instance
- **API:** https://api-staging.example.com
- **Frontend:** https://staging.example.com
- **Docker:** docker-compose.yml (production Dockerfiles)

#### Production
- **Database:** MySQL 8.0+ managed service
- **Cache:** Redis managed service
- **API:** https://api.example.com
- **Frontend:** https://www.example.com
- **Docker:** Kubernetes or Docker Swarm (future)

### Infrastructure Requirements

#### Minimum Server Requirements
- **CPU:** 2 cores (4 cores recommended)
- **Memory:** 4GB RAM (8GB recommended)
- **Storage:** 20GB SSD
- **Network:** 100 Mbps connection

#### High Availability Setup (Recommended)
- **Load Balancer:** Nginx or HAProxy
- **Database:** MySQL replication (Primary + Replicas)
- **Cache:** Redis Sentinel or Cluster
- **App Servers:** Multiple Docker containers
- **CDN:** CloudFlare or AWS CloudFront

### CI/CD Pipeline

#### GitHub Actions Workflows

**Workflow 1: Continuous Integration (ci.yml)**
- Triggers on: push to main/develop, pull requests
- Jobs:
  - Backend: Maven build, unit tests, SonarQube analysis
  - Frontend: npm build, ESLint, unit tests
  - Integration: Docker build, image scanning
- Artifacts: Test reports, build artifacts

**Workflow 2: Docker Build (docker-build.yml)**
- Triggers on: push to main, version tags (v\*)
- Jobs:
  - Build backend image
  - Build frontend image
  - Push to Docker Registry
  - Deploy to staging/production
- Registry: Docker Hub or GitHub Container Registry

### Deployment Checklist

- [ ] Database migrations executed
- [ ] Environment variables configured
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Backup systems verified
- [ ] Monitoring and alerting enabled
- [ ] Logging system configured
- [ ] Health checks configured
- [ ] Load balancer configured
- [ ] DNS records updated

---

## Future Enhancements

### Phase 2 (Q3 2026)

1. **Payment Integration**
   - Stripe payment gateway
   - Multiple payment methods
   - Invoice generation
   - Refund processing

2. **Advanced Search**
   - Elasticsearch integration
   - Full-text search
   - Autocomplete
   - Search analytics

3. **Rating & Reviews**
   - Product ratings (1-5 stars)
   - Customer reviews
   - Review moderation
   - Rating aggregation

4. **Analytics Dashboard**
   - Revenue analytics
   - Equipment utilization
   - Popular products
   - User analytics
   - Custom reports

5. **Multi-language Support**
   - i18n internationalization
   - Vietnamese, English support
   - Future: Chinese, French, etc.

6. **Admin Features**
   - Bulk equipment import/export
   - Advanced reporting
   - User management dashboard
   - Commission management

### Phase 3 (Q4 2026)

1. **Mobile Application**
   - React Native or Flutter app
   - iOS App Store
   - Google Play Store
   - Offline capability

2. **Advanced Recommendations**
   - Machine learning recommendations
   - Personalized suggestions
   - Collaborative filtering
   - Content-based filtering

3. **Subscription Plans**
   - Monthly rental subscriptions
   - Loyalty programs
   - Subscription management
   - Recurring billing

4. **Inventory Management**
   - Barcode scanning
   - Equipment tracking
   - Condition assessment
   - Maintenance scheduling

### Phase 4 (2027+)

1. **Marketplace**
   - Multiple vendors support
   - Commission management
   - Vendor dashboard
   - Vendor rating system

2. **IoT Integration**
   - Equipment GPS tracking
   - Real-time location
   - Equipment condition monitoring
   - Usage analytics

3. **Advanced Communication**
   - Video support calls
   - Screen sharing
   - Multi-language chat
   - Chatbot support

4. **Compliance & Regulations**
   - GDPR compliance tools
   - Data export/deletion
   - Audit logging
   - Compliance reporting

---

## Appendix

### Glossary

| Term | Definition |
|------|-----------|
| JWT | JSON Web Token - stateless authentication token |
| OAuth2 | Open standard for authorization |
| RBAC | Role-Based Access Control |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| WebSocket | Protocol for real-time bidirectional communication |
| STOMP | Simple Text Oriented Messaging Protocol |
| SLA | Service Level Agreement |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
| CDN | Content Delivery Network |
| CI/CD | Continuous Integration/Continuous Deployment |
| SonarQube | Code quality and security analysis tool |
| Cloudinary | Cloud-based image management service |

### References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [OAuth2 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Security Guidelines](https://owasp.org/)

### Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | June 24, 2026 | Development Team | Initial SRS creation based on project analysis |
| 1.1.0 | (Planned) | TBD | Updates after Phase 1 completion |
| 2.0.0 | (Planned) | TBD | Phase 2 enhancements |

---

**Document End**

*Last Updated: June 24, 2026*  
*Next Review Date: September 24, 2026*

