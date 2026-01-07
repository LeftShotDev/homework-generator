# Homework Generator 2000

A Next.js application for generating customized homework assessments for psychology courses. The app uses AI (OpenAI) to generate questions based on user preferences, allows review and editing of questions, and stores completed assessments in a Supabase database.

## Features

- **Question Generation**: Generate assessment questions using OpenAI's GPT-5-nano model
- **Module Selection**: Choose from 16 psychology modules
- **Question Types**: Support for Multiple Choice, Multiple Answer, Text Answer, and Matching questions
- **Question Review**: Review, edit, accept, or reject generated questions
- **Assessment Management**: Save and view completed assessments
- **Database Storage**: Persistent storage using Supabase

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Font**: Public Sans (Google Fonts)
- **AI Integration**: OpenAI API (gpt-5-nano)
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Hooks (useState, useEffect, useRef)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- OpenAI API key
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sprint-03-homework-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_default_key_here
```

4. Set up the Supabase database by running the migration:
   - Navigate to your Supabase project dashboard
   - Go to SQL Editor
   - Run the SQL from `supabase/migrations/001_create_assessments_table.sql`

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/
│   ├── assessments/
│   │   └── route.ts          # API route for saving/fetching assessments
│   └── generate/
│       └── route.ts          # API route for generating questions via OpenAI
├── assessments/
│   ├── [id]/
│   │   └── page.tsx          # Individual assessment detail page
│   └── page.tsx              # Assessments listing page
├── components/
│   ├── Header.tsx            # Reusable header component
│   └── LoadingSpinner.tsx    # Loading animation component
├── form/
│   └── page.tsx              # Question generation form
├── lib/
│   └── supabase.ts          # Supabase client utility
├── review/
│   └── page.tsx              # Question review and editing page
├── globals.css               # Global styles and CSS variables
├── layout.tsx                 # Root layout with font configuration
└── page.tsx                  # Home page

supabase/
└── migrations/
    └── 001_create_assessments_table.sql  # Database schema
```

## API Routes

### POST `/api/generate`

Generates assessment questions using OpenAI.

**Request Body:**
```json
{
  "modules": ["Module 2: Research in Psychology"],
  "number": 5,
  "question_types": ["Multiple Choice"]
}
```

**Response:**
```json
{
  "timestamp": "2026-01-07T12:00:00Z",
  "number": 5,
  "modules": ["Module 2: Research in Psychology"],
  "question_types": ["Multiple Choice"],
  "questions": [...]
}
```

### POST `/api/assessments`

Saves an assessment to the database.

**Request Body:**
```json
{
  "assessment_data": {
    "timestamp": "2026-01-07T12:00:00Z",
    "number": 5,
    "modules": ["Module 2: Research in Psychology"],
    "question_types": ["Multiple Choice"]
  },
  "accepted_questions": [...]
}
```

### GET `/api/assessments`

Fetches all saved assessments from the database.

## Database Schema

The `assessments` table structure:

- `id` (UUID): Primary key
- `timestamp` (TIMESTAMPTZ): Assessment timestamp
- `number` (INTEGER): Number of questions
- `modules` (TEXT[]): Array of module names
- `question_types` (TEXT[]): Array of question types
- `questions` (JSONB): Array of question objects
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

## Color Scheme

- **Background**: `#f4f3ef`
- **Primary Green**: `#15B976`
- **Primary Blue**: `#5367ea`
- **Green Hover**: `#12A064`
- **Blue Hover**: `#4658dc`

## Font

The application uses **Public Sans** as the primary font, loaded via Next.js Google Fonts optimization.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features Implementation

- **Question Generation**: Uses OpenAI's responses API with a specific prompt ID and version
- **Review Flow**: Questions are stored in sessionStorage and reviewed on the `/review` page
- **Duplicate Prevention**: Uses React refs to prevent duplicate saves
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy

Make sure to set all required environment variables in your deployment platform.

## License

This project is private and proprietary.
