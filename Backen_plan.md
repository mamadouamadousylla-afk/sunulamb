unuLamb Production Architecture & Admin Panel Plan
This document outlines the architectural requirements and implementation plan for transforming the SunuLamb MVP into a production-ready application with a comprehensive administrative system.

1. Core Architecture
Database System (PostgreSQL)
Users: Admin, Organizer, Customer roles.
Events: Name, date, venue, categories (VIP, Normal), pricing, total/available tickets.
Tickets: QR code association, owner, status (Paid, Validated, Cancelled).
Transactions: Payment reference (Wave/Free), amount, status, timestamps.
Settings: Dynamic site configuration (logos, contacts, maintenance mode).
Authentication & Authorization
NextAuth.js / Auth.js: Multi-provider support.
Role-Based Access Control (RBAC):
ADMIN: Full system access, financial reports.
ORGANIZER: Manage specific events, scan tickets.
USER: Purchase history, profile management.
2. Admin Panel Features (The "Control Tower")
Dashboard
Real-time sales statistics (Revenue, Tickets sold).
Recent transactions feed.
Event performance charts.
Event Management
Create/Edit/Delete wrestling events.
Manage pricing tiers dynamically.
Upload event banners and images.
Set ticket quotas and deadlines.
User & Access Management
List all registered users.
Assign roles (Promote a user to Organizer).
Block/Unblock accounts.
Content Management (CMS)
Edit homepage sections (Hero text, Featured events).
Update partner logos (Wave, Free, etc.).
Manage "About Us" and "Contact" info.
3. Communication & Integrations
SMS Gateway (e.g., Twilio or local provider like Infobip/Orange)
Use Case: Sending ticket QR codes via SMS after payment.
Alerts: Notification to organizers on sold-out events.
SMTP (Email)
Provider: Resend or SendGrid.
Function: Transactional emails, PDF ticket delivery, password resets.
Payment Integration
Aggregator: Hub2, PayTech, or direct Wave/Free Money APIs.
Webhooks: Automated ticket generation upon successful payment callback.
4. Implementation Roadmap (Step-by-Step)
Phase 1: Persistence
Initialize Replit PostgreSQL database.
Define Prisma/Drizzle schema for Users, Events, and Tickets.
Migrate existing static data to the database.
Phase 2: Security & Auth
Setup NextAuth.js.
Implement protected routes for /admin and /organizer.
Create the Login/Signup flows.
Phase 3: The Admin Interface
Build the /admin layout (Sidebar, Stats cards).
Create CRUD (Create, Read, Update, Delete) interfaces for Events.
Add a "Global Settings" page for site-wide customization.
Phase 4: Communication & Logistics
Integrate SMTP for email delivery.
Integrate SMS API for mobile ticket delivery.
Implement QR code generation and a simple validation route for scanners.
Phase 5: Production Hardening
Add environment variable validation.
Error logging and monitoring.
Performance optimization (Caching with React Query).