# Octopus TMS Frontend

This is the frontend part of Octopus TMS (Transportation Management System) built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Login, registration and user profile management
- **Dashboard**: Real-time metrics and KPIs for transportation operations
- **Smart Load Search**: Advanced load searching and filtering
- **Dispatch Board**: Manage and assign loads to drivers
- **Driver Management**: Track and manage driver information and performance
- **Document Management**: Upload, view, and manage transportation documents
- **Invoicing**: Track and manage invoices
- **Tracking**: Real-time load tracking
- **Reporting**: Generate and view various reports
- **Supervisor Dashboard**: Advanced analytics and team management for supervisors

## User Roles

The system supports multiple user roles:

- **Operators**: Basic operations staff with limited permissions
- **Dispatchers**: Can manage loads and driver assignments
- **Supervisors**: Access to analytics and team management tools
- **Admins**: Full system access

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/octopus-tms.git
cd octopus-tms/frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   │   ├── charts/     # Chart components
│   │   ├── layout/     # Layout components (Topbar, etc.)
│   │   └── ui/         # Basic UI components
│   ├── context/        # React context providers
│   ├── data/           # Mock data for development
│   ├── layouts/        # Page layout containers
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── services/       # API and service functions
│   └── types/          # TypeScript type definitions
├── App.tsx             # Application root component
└── main.tsx            # Application entry point
```

## Mock Authentication

For demo purposes, you can use the following credentials:

- **Dispatcher**: Username `dispatcher1`, Password `password`
- **Operator**: Username `operator1`, Password `password`
- **Supervisor**: Username `supervisor1`, Password `password`
- **Admin**: Username `admin`, Password `password`

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- ApexCharts
- React PDF
- React Hot Toast
- Leaflet (for maps)
- Axios (for API requests)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
