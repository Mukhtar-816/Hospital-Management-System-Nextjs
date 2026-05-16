# MedCloud — Hospital Management System

MedCloud is an enterprise-grade, high-fidelity Hospital Management System (HMS) built to handle real-world clinical complexity, data lifecycle enforcement, and strict referential integrity. Moving beyond simple CRUD applications, MedCloud implements a resilient architecture optimized for data security, data preservation, and transactional stability in high-stakes environments.

---

## 📺 Project Resources

* **Live Production Demo:** [https://hospital-managment-system-rosy.vercel.app/](https://hospital-managment-system-rosy.vercel.app/)
* **Repository Link:** [https://github.com/Mukhtar-816/Hospital-Management-System-Nextjs](https://github.com/Mukhtar-816/Hospital-Management-System-Nextjs)

*(Note: If you have uploaded a walk-through video, you can embed your `<video>` tag right here to showcase your UI/UX features immediately.)*
<video>
https://github.com/user-attachments/assets/86d105ab-91e1-4147-9d03-f8075714209d
</video>
---

## Architectural Overview

MedCloud balances strict relational data constraints with a high-interactivity frontend. The engineering core focuses heavily on system integrity, utilizing role-scoped access control, data lifespan mitigation, and atomic transaction layers.

### System Topography
* **Frontend Architecture:** Next.js (App Router) utilizing Server Components for optimized data hydration and isolated Client Components for intensive operational dashboards.
* **Style Engine:** Tailwind CSS utilizing native CSS variables for systemic transitions and decoupled application runtime configuration.
* **Database Pipeline:** PostgreSQL managed through a connection-pooled architecture featuring a native transactional layer wrapper to guarantee operational atomicity.
* **Development Standards:** Linted and formatted exclusively through Biome for high-performance static analysis, maintaining a zero-overhead build process.

---

## Relational Schema Design & Data Sovereignty

The system enforces a 13-table normalized relational schema explicitly designed around real-world legal and clinical constraints. Data lifecycle rules adapt strictly based on the administrative and security context of the user entity:

* **Staff Domain Mitigation:** Security is treated as an absolute priority. When a medical staff or clinical profile is deactivated, database policies enforce an immediate cascading purge (`CASCADE`) of active access credentials to isolate system entry points.
* **Patient Record Continuity:** Clinical data history is bound to strict medical retention mandates. If a patient profile account is terminated, historical clinical files, transactions, and medication logs are explicitly preserved (`SET NULL` / historical persistence tracking). Data remains intact to mitigate long-term liability and safety risks.

### Core Entity Outline

| Entity Schema | Operational Vector | Core Attribute Metrics |
| :--- | :--- | :--- |
| **Users** | System Authentication | `userId (UUID)`, `userEmail (Unique)`, `userPassword (Bcrypt)`, `userName` |
| **Patient** | Clinical Records Matrix | `patientNumber (BIGSERIAL)`, `address`, `gender`, `userId (FK)` |
| **Doctor** | Resource Routing Module | `specialization`, `status (active/busy)`, `userId (FK)` |
| **AppointmentRequest** | Clinical Triage Pipeline | `symptoms`, `preferredTime`, `priority`, `status (pending/approved)` |
| **Appointment** | Core Operations Engine | `startTime`, `endTime`, `type (walk-in/online)`, `doctorId (FK)` |
| **Interaction** | Encounter Logs | `notes`, `receptionistId (FK)`, `appointmentId (FK)` |
| **Prescription** | Output / Outcome Metrics | `medicationId`, `medicine`, `frequency`, `instructions` |

---

## Key Engineering Implementation Details

### 1. Atomic Transaction Execution (`withTransaction`)
To prevent data corruption, multi-table operations—such as user onboarding where records must simultaneously populate `Users`, `UserRole`, and corresponding relational clinical profiles—are executed within a custom PostgreSQL transaction wrapper. Failure at any junction initiates a full rollback, ensuring a zero-orphan-record policy.

### 2. State-Machine Driven Triage Matrix (`AppointmentModal`)
The guided scheduling dashboard handles real-time verification vectors without overlapping states:
* **Doctor Availability Filter:** Direct timestamp interception queries the database to match specialization requirements against active/busy allocation tables to prevent double-bookings.
* **Debounced Patient Profiling:** Real-time lookup validation checks for pre-existing medical files on keystroke down-time, neutralizing duplicate data creation.

### 3. Edge-Compatible Security Framework (RBAC Middleware)
* **JWT Protocol:** Lightweight, edge-runtime authentication powered by `jose`, passing tokens through secure HTTP-only cookies to defend against Cross-Site Scripting (XSS).
* **Granular Scoping:** Custom permission middleware shifts authentication evaluation from generic role strings to itemized actions (e.g., evaluating explicitly for `patient.read` or `profile.update`). 
* **Universal Administrative Bypass:** Explicit architectural layout allowing universal validation fallback profiles reserved exclusively for the system `admin`.

### 4. Precision Geospatial Triage
* **Geospatial Coordinates Tracking:** Integrated with interactive mapping (Leaflet) to capture real-time spatial indicators from patients. Locations are committed to PostgreSQL as exact coordinate metrics, establishing a foundation for automated, proximity-based emergency triage routing.

---

## Technology Stack

* **Core Framework:** Next.js 15 (App Router, Server Actions)
* **Language Engine:** TypeScript
* **Database Engine:** PostgreSQL (Native PG Connection Pool)
* **State & Animation Engine:** Framer Motion (Staggered sequential analytics dashboard entries)
* **Styling Framework:** Tailwind CSS
* **Code Quality Optimization:** Biome

---

## Getting Started

### Prerequisites
* Node.js (Latest Long-Term Support version recommended)
* A local or cloud-hosted instance of PostgreSQL

### Installation Pipeline

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Mukhtar-816/Hospital-Management-System-Nextjs.git](https://github.com/Mukhtar-816/Hospital-Management-System-Nextjs.git)
   cd Hospital-Management-System-Nextjs
Install dependencies via your preferred package manager:

Bash
npm install
# or
pnpm install
Configure Environment Variables:
Create a .env.local file in the root subdirectory and supply your system configurations:

Code snippet
DATABASE_URL=postgresql://username:password@localhost:5432/medcloud
JWT_SECRET=your_high_entropy_jwt_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
Initialize Database Schema:
Import your structural definitions into your database engine:

Bash
psql -d medcloud -f src/db/tables.sql
psql -d medcloud -f src/db/keysandconstraints.sql
Execute Development Server:

Bash
npm run dev
# or
pnpm dev
Open http://localhost:3000 inside your web browser to examine the application environment.
