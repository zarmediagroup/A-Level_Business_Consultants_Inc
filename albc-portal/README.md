# A-Level Business Consultants Inc — Website & Client Portal

Professional accounting practice website with a full-featured secure client portal.

**Developed by:** ZarMediaGroup (Pty) Ltd  
**Reference:** ZMG-ALBC-SOW-001

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local` and fill in your values:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="A-Level Business Consultants <noreply@albc.co.za>"

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Set Up Supabase Database
Run the SQL schema in `supabase/schema.sql` against your Supabase project.

Create a storage bucket named `documents` (private) in Supabase Storage.

### 4. Create Admin User
In Supabase Auth dashboard, create a user and then run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@email.com';
```

### 5. Run Development Server
```bash
npm run dev
```

### 6. Deploy to Vercel
```bash
vercel deploy
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Public landing page
│   ├── portal/
│   │   ├── login/                  # Portal login
│   │   ├── reset-password/         # Password reset
│   │   ├── admin/                  # Admin portal
│   │   │   ├── dashboard/          # Admin overview
│   │   │   ├── clients/            # Client management
│   │   │   ├── documents/          # Document management
│   │   │   ├── notifications/      # Notification centre
│   │   │   └── audit-log/          # Audit log
│   │   └── client/                 # Client portal
│   │       ├── dashboard/          # Client overview
│   │       ├── documents/          # Document vault
│   │       ├── upload/             # Document upload
│   │       ├── notifications/      # Client notifications
│   │       └── profile/            # Profile settings
│   └── api/                        # API routes
├── components/
│   ├── public/                     # Public website components
│   └── portal/                     # Portal UI components
└── lib/
    ├── supabase.ts                  # Browser Supabase client
    ├── supabase-server.ts           # Server Supabase client
    ├── types.ts                     # TypeScript types
    └── utils.ts                     # Utilities & constants
```

---

## 🔐 Portal Access

| Role   | URL                           | Access                              |
|--------|-------------------------------|-------------------------------------|
| Admin  | `/portal/admin/dashboard`     | Full practice management            |
| Client | `/portal/client/dashboard`    | Document vault & account management |

---

## 📋 Features

### Public Website
- Hero, About, Services, Team, Testimonials, Contact sections
- Contact form with email notifications
- SEO-optimised with metadata
- Fully responsive (mobile, tablet, desktop)

### Client Portal
- Secure JWT-based authentication (Supabase Auth)
- Role-based access control (Admin / Client)
- Admin: Create, edit, deactivate client accounts
- Admin: View all documents, filter by client/category/status
- Admin: Change document status (Received / Under Review / Processed / Requires Action)
- Admin: Internal notes per client (not visible to client)
- Admin: Full audit log of all portal activity
- Client: Drag-and-drop document upload (PDF, Word, Excel, images)
- Client: Document vault with category and status tracking
- Client: Email notification on upload confirmation
- Admin: Email notification on new document upload
- In-portal notification centre for both admin and clients
- Password reset via email

---

## 🛠 Tech Stack

| Layer        | Technology                   |
|--------------|------------------------------|
| Frontend     | Next.js 16 (App Router)      |
| Styling      | Tailwind CSS                 |
| Database     | Supabase (PostgreSQL)        |
| Auth         | Supabase Auth (JWT)          |
| File Storage | Supabase Storage             |
| Email        | Nodemailer (SMTP)            |
| Deployment   | Vercel                       |

---

## 📧 Support

**ZarMediaGroup (Pty) Ltd** — Reg. 2026/166396/07  
info@zarmediagroup.com | zubayr@zarmediagroup.com
