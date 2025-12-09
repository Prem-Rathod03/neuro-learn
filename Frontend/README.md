# Neuro Learn Frontend

A supportive, accessible learning platform designed specifically for neurodiverse students.

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities and API
│   ├── data/           # Static data
│   ├── styles/         # CSS files
│   └── types/          # TypeScript types
├── public/             # Static assets
└── package.json        # Dependencies
```

## Features

- **Personalized Learning** - ML-powered activity recommendations
- **Neurodiversity Support** - ADHD, Dyslexia, and ASD support features
- **Text-to-Speech** - Audio support for reading
- **Progress Tracking** - Real-time progress monitoring
- **Well-Being Layer** - Adaptive support modes

## Environment Variables

Create a `.env` file in the Frontend directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8030
```

## Building for Production

```sh
npm run build
```

The built files will be in the `dist/` directory.

## Contributing

See the main project README for contribution guidelines.
