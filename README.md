# TeenUp LMS - Learning Management System

Hệ thống quản lý học sinh - phụ huynh - lớp học - điểm danh - gói học.

## 🚀 Chạy nhanh (Quick Start)

### Yêu cầu
- **Docker** + **Docker Compose**
- Git

### Khởi động project

```bash
# Clone repository
git clone https://github.com/PhanBinhDev/TeenUp_Test
cd TeenUp_Test

# Chạy script tự động (khuyến nghị)
chmod +x setup.sh
./setup.sh
```

Script sẽ tự động:
1. Cài đặt dependencies (backend + frontend)
2. Copy file môi trường (.env)
3. Generate JWT keys
4. Khởi động Docker containers
5. Chạy migrations
6. Seed dữ liệu mẫu

### Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Swagger API Docs**: http://localhost:8000/api-docs  
- **MailPit**: http://localhost:11080
- **Database**: localhost:15432

---

## 🛠 Tech Stack

**Backend**: NestJS + Express + PostgreSQL + TypeORM
**Frontend**: Next.js 15 + React 19 + Bun + TailwindCSS  
**Infrastructure**: Docker + Docker Compose

---

## 📁 Project Structure

```
TeenUp_Test/
├── be/                      # Backend (NestJS)
│   ├── src/
│   │   ├── api/            # REST API modules
│   │   ├── database/       # TypeORM (migrations, models, seeds)
│   │   ├── background/     # Background jobs (BullMQ)
│   │   └── ...
│   └── Dockerfile
├── fe/                      # Frontend (Next.js)
│   ├── src/
│   │   ├── app/            # App router
│   │   ├── components/     # React components
│   │   └── ...
│   └── Dockerfile
├── docker-compose.dev.yml   # Development setup
└── setup.sh                 # Auto setup script
```

---

## 🗄️ Database Schema

### Core Tables

#### **Users** (`users`)
- `id` UUID (PK)
- `email` VARCHAR (unique)
- `password` VARCHAR
- `role` ENUM ('admin', 'teacher', 'parent', 'student')
- `name` VARCHAR
- `phone` VARCHAR

#### **Teachers** (`teachers`)
- `id` UUID (PK)
- `user_id` UUID (FK → users) UNIQUE
- `specialization` VARCHAR
- `bio` TEXT

#### **Parents** (`parents`)
- `id` UUID (PK)
- `user_id` UUID (FK → users) UNIQUE

#### **Students** (`students`)
- `id` UUID (PK)
- `user_id` UUID (FK → users) UNIQUE
- `parent_id` UUID (FK → parents)
- `dob` DATE
- `gender` ENUM ('male', 'female', 'other')
- `current_grade` VARCHAR

#### **Classes** (`classes`)
- `id` UUID (PK)
- `name` VARCHAR
- `description` TEXT
- `teacher_id` UUID (FK → teachers)
- `subject` VARCHAR
- `days_of_week` INTEGER[] (0=Sunday, 1=Monday, ..., 6=Saturday)
- `start_time` TIME
- `end_time` TIME
- `max_students` INTEGER
- `current_students` INTEGER
- `status` ENUM ('draft', 'active', 'completed', 'cancelled')

#### **ClassRegistrations** (`class_registrations`)
- `id` UUID (PK)
- `class_id` UUID (FK → classes)
- `student_id` UUID (FK → students)
- `status` ENUM ('active', 'cancelled', 'completed')
- `registered_at` TIMESTAMP
- UNIQUE(class_id, student_id)

#### **Subscriptions** (`subscriptions`)
- `id` UUID (PK)
- `student_id` UUID (FK → students)
- `package_name` VARCHAR
- `package_type` ENUM ('monthly', 'quarterly', 'yearly', 'custom')
- `start_date` DATE
- `end_date` DATE
- `total_sessions` INTEGER
- `used_sessions` INTEGER
- `status` ENUM ('active', 'expired', 'cancelled')

#### **Attendances** (`attendances`)
- `id` UUID (PK)
- `class_registration_id` UUID (FK → class_registrations)
- `subscription_id` UUID (FK → subscriptions)
- `date` DATE
- `status` ENUM ('present', 'absent', 'late', 'excused')
- `marked_by_id` UUID (FK → users)
- `note` TEXT

---

## 📡 API Documentation

Tất cả API endpoints và ví dụ sử dụng có thể xem tại **Swagger UI**:

👉 **http://localhost:8000/api-docs**  

### Các module chính:
- **Auth** - Đăng nhập, đăng ký, quản lý session
- **Users** - Quản lý người dùng
- **Teachers** - Quản lý giáo viên
- **Parents** - Quản lý phụ huynh
- **Students** - Quản lý học sinh
- **Classes** - Quản lý lớp học (tạo, cập nhật, lọc theo ngày/giờ)
- **Class Registrations** - Đăng ký học sinh vào lớp
- **Subscriptions** - Quản lý gói học
- **Attendance** - Điểm danh học sinh

---

## 🔧 Development

### Available Commands

```bash
# Start all services (Development)
npm run docker:dev
# or
docker-compose -f docker-compose.dev.yml up -d --build

# View logs
npm run docker:dev:logs
docker-compose -f docker-compose.dev.yml logs -f

# View backend logs only
npm run docker:logs:be

# View frontend logs only
npm run docker:logs:fe

# Stop all services
npm run docker:dev:down

# Backend shell
npm run be:shell

# Frontend shell
npm run fe:shell

# Database shell
npm run db:shell

# Run migrations
npm run migration:up

# Revert migration
npm run migration:down

# Seed data
npm run seed:run
```

---

## 🧪 Sample Data

After running seeds (`npm run seed:run`), you'll have:

**2 Teachers:**
- teacher1@teenup.com / 123456 (Toán học - 3 lớp)
- teacher2@teenup.com / 123456 (Tiếng Anh - 3 lớp)

**2 Parents (mỗi phụ huynh có 2 con):**
- parent1@teenup.com / 123456 (Kỹ sư - 2 học sinh)
- parent2@teenup.com / 123456 (Giáo viên - 2 học sinh)

**4 Students:**
- Học sinh 1, 2 (con của phụ huynh 1)
- Học sinh 3, 4 (con của phụ huynh 2)

**6 Classes:**

*Toán học (Teacher 1):*
1. Toán Nâng Cao 6 - Thứ 2,4,6 (08:00-09:30) - Max 15 học sinh
2. Toán Cơ Bản 7 - Thứ 3,5 (14:00-15:30) - Max 20 học sinh
3. Toán Tư Duy 8 - Thứ 2,4 (16:00-17:30) - Max 18 học sinh

*Tiếng Anh (Teacher 2):*
4. English Communication A1 - Thứ 3,5,7 (09:00-10:30) - Max 12 học sinh
5. English Grammar B1 - Thứ 2,4,6 (15:00-16:30) - Max 15 học sinh
6. IELTS Foundation - Thứ 3,5 (18:00-19:30) - Max 10 học sinh

---

## 🐛 Troubleshooting

### Database connection failed
```bash
# Check if database is running
docker ps | grep postgres

# Check database logs
docker logs teenup-postgres

# Restart database
docker-compose -f docker-compose.dev.yml restart database
```

### Migration failed
```bash
# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d database
# Wait 10 seconds
docker exec -it teenup-backend-server pnpm migration:up
```

### Port already in use
```bash
# Change ports in docker-compose.yml or be/.env.docker
# Frontend: 3000 -> 3001
# Backend: 8000 -> 8080
# Database: 15432 -> 15433
```

### Frontend build fails in Docker
```bash
# Make sure next.config.ts has output: 'standalone'
# Check Dockerfile uses correct Bun image (oven/bun:1-alpine)
```

---

## 📝 License

MIT

---

## 👥 Contact

**Email:** binhphan.dev@gmail.com