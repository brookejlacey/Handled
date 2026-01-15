# Handled

**Your financial adulting copilot** - A judgment-free system to help you complete the recurring financial maintenance tasks you know you should do but never have a system for.

## Overview

Handled is a subscription-based mobile app ($9.99/month or $79/year) designed for women aged 30-50 who need a simple system to stay on top of their financial life. This is NOT a budgeting app - it's a "financial life maintenance" system.

Think of it like a car maintenance schedule but for your money life. Users don't need to be told they spent too much on coffee—they need a system that reminds them to:
- Check their credit score quarterly
- Roll over that old 401k
- Update beneficiaries after life events
- Negotiate their bills annually
- Review insurance coverage yearly

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native with Expo |
| **Backend** | Node.js with Azure Functions |
| **Database** | Azure SQL Database with Prisma ORM |
| **AI** | Claude API (Anthropic) |
| **Authentication** | Azure AD B2C |
| **File Storage** | Azure Blob Storage |
| **Document Processing** | Azure Form Recognizer + Claude |
| **Push Notifications** | Azure Notification Hubs + Expo |
| **Payments** | RevenueCat |

## Project Structure

```
handled/
├── apps/
│   ├── mobile/                 # React Native Expo app
│   │   ├── app/               # Expo Router pages
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── assets/
│   └── api/                    # Azure Functions backend
│       ├── src/
│       │   ├── functions/      # Azure Function handlers
│       │   ├── services/
│       │   ├── middleware/
│       │   └── utils/
│       └── prisma/
├── packages/
│   └── shared/                 # Shared types and constants
├── infra/                      # Azure Bicep templates
└── package.json                # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI (`npm install -g expo-cli`)
- Azure Functions Core Tools (`npm install -g azure-functions-core-tools@4`)
- Azure CLI (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/handled.git
cd handled
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# For the API
cp apps/api/local.settings.example.json apps/api/local.settings.json
# Edit local.settings.json with your values
```

4. Generate Prisma client:
```bash
cd apps/api
npm run db:generate
```

### Running Locally

**Start all services (recommended):**
```bash
npm run dev
```

**Or run individually:**

```bash
# Mobile app
cd apps/mobile
npm run dev

# API
cd apps/api
npm run dev
```

### Building

```bash
# Build all packages
npm run build

# Build specific package
cd apps/mobile && npm run build
cd apps/api && npm run build
```

## Key Features

### For Users
- **Task Management**: Recurring financial tasks with reminders
- **AI Chat**: Judgment-free help with financial questions
- **Document Analysis**: Upload statements and get summaries
- **Progress Tracking**: See your financial maintenance streak

### Technical Features
- **Turborepo**: Fast monorepo builds with caching
- **Type Safety**: Shared types across frontend and backend
- **Offline Support**: Tasks available offline (coming soon)
- **Push Notifications**: Customizable reminders

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/tasks` | List user's tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| POST | `/api/chat/messages` | Send chat message |
| POST | `/api/webhooks/revenuecat` | Handle subscription events |

## Database Schema

Key models:
- **User**: Account info, subscription status
- **Task**: Financial tasks with recurrence
- **Conversation**: AI chat history
- **Document**: Uploaded files and analysis

See `apps/api/prisma/schema.prisma` for full schema.

## Deployment

### Azure Infrastructure

Deploy using Azure Bicep:

```bash
az deployment group create \
  --resource-group handled-prod \
  --template-file infra/main.bicep \
  --parameters infra/parameters.json
```

### Mobile App

```bash
# Development build
cd apps/mobile
npm run build:dev

# Production build
npm run build:prod
```

## Environment Variables

### API (`local.settings.json`)
- `DATABASE_URL`: Azure SQL connection string
- `ANTHROPIC_API_KEY`: Claude API key
- `AZURE_STORAGE_CONNECTION_STRING`: Blob storage connection
- `JWT_SECRET`: Secret for signing tokens
- `REVENUECAT_API_KEY`: RevenueCat API key

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Proprietary - All rights reserved
