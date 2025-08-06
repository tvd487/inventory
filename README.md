# TV Logistics Web Application

A modern, full-stack inventory management system built with Next.js 15, designed specifically for TV logistics operations. This application provides comprehensive inventory tracking, supplier management, and user role-based access control.

## 🚀 Features

### Core Functionality
- **Inventory Management**: Track products with SKU, barcode, pricing, and quantity management
- **Category Management**: Organize products into categories for better inventory control
- **Supplier Management**: Maintain supplier information and contact details
- **User Authentication**: Secure login with NextAuth.js and role-based access control
- **Dashboard**: Modern, responsive dashboard with real-time data visualization

### User Roles & Permissions
- **Admin**: Full system access and user management
- **Moderator**: Limited administrative capabilities
- **User**: Standard inventory operations
- **Guest**: Read-only access

### Technical Features
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Form Validation**: Zod schema validation with React Hook Form
- **Database**: MySQL with Prisma ORM for type-safe database operations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Database
- **NextAuth.js** - Authentication solution
- **Prisma** - Type-safe database ORM
- **MySQL** - Database
- **JWT** - Token-based authentication

### State Management & Data Fetching
- **TanStack Query** - Server state management
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Turbopack** - Fast development bundler
- **TypeScript** - Type checking

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- **MySQL** database server
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tv-logistics-web
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/tv_logistics"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# JWT
JWT_SECRET="your-jwt-secret-here"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
tv-logistics-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── lib/                  # Utility libraries
│   │   ├── api/              # API utilities
│   │   ├── hooks/            # Custom hooks
│   │   └── validations/      # Zod schemas
│   └── types/                # TypeScript type definitions
├── prisma/                   # Database schema and migrations
└── public/                   # Static assets
```

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: Authentication and user management
- **Categories**: Product categorization
- **Suppliers**: Supplier information and contacts
- **Products**: Inventory items with pricing and stock levels
- **Roles & Permissions**: Role-based access control

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with initial data
npm run db:reset     # Reset database (development only)
```

## 🔐 Authentication

The application uses NextAuth.js for authentication with the following features:

- JWT-based authentication
- Role-based access control
- Session management
- Secure password hashing with bcrypt

## 🎨 UI Components

The application uses a custom UI component library built with:

- **Radix UI** primitives for accessibility
- **Tailwind CSS** for styling
- **Class Variance Authority** for component variants
- **Lucide React** for icons

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile devices

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL database connection string | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |

### Database Configuration

The application uses MySQL with Prisma ORM. Make sure your MySQL server is running and accessible with the credentials specified in your `DATABASE_URL`.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

Stay updated with the latest changes by:

- Following the repository
- Checking the releases page
- Reading the changelog

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
