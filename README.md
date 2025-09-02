# CreaPrompt Studio 🎨✨
(https://crea-prompt-studio.vercel.app/)
> **Built with Firebase Studio AI** - This project was created using Firebase Studio AI, leveraging the power of AI-driven development to create a comprehensive content generation platform.

## Overview

CreaPrompt Studio is an AI-powered content generation hub that helps marketers, content creators, and businesses generate high-quality marketing materials with ease. The platform combines multiple AI workflows to provide a complete creative solution.

## 🚀 Features

### 📝 Marketing Copy Generation
- Generate compelling marketing copy and taglines
- Tailored content for different platforms
- Audience-specific messaging
- Call-to-action optimization

### 🎨 Brand Voice Adaptation
- Maintain consistent brand voice across content
- Adapt messaging to match brand personality
- Brand guideline compliance

### 🖼️ Visual Mockup Generation
- AI-powered visual concept creation
- Marketing material mockups
- Design inspiration and layouts

### 🛡️ Content Moderation
- Automated content review
- Brand safety compliance
- Quality assurance workflows

### 📋 Campaign Board
- Organize all generated assets in one place
- Visual campaign planning
- Export campaigns to PDF
- Asset management and organization

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with React 18
- **UI Components**: Radix UI with Tailwind CSS
- **AI Framework**: Firebase Genkit
- **AI Provider**: Google AI (Gemini)
- **Form Management**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom animations
- **PDF Export**: jsPDF with html2canvas

## 🎯 Built with Firebase Studio AI

This project showcases the power of Firebase Studio AI in creating production-ready applications. The entire application architecture, AI workflows, and user interface were designed and implemented using AI-driven development practices, demonstrating:

- **Intelligent Code Generation**: Automated creation of React components and TypeScript interfaces
- **AI Flow Architecture**: Sophisticated prompt engineering and workflow design
- **Modern UI/UX**: Clean, responsive design with accessibility in mind
- **Type Safety**: Full TypeScript implementation with proper type definitions

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CreaPrompt_Studio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash

# Add your Google AI API key and other required variables
```

4. Run the development server:
```bash
npm run dev
```

5. Run the Genkit development server (in a separate terminal):
```bash
npm run genkit:dev
```

## 🔧 Available Scripts

- `npm run dev` - Start the Next.js development server with Turbopack
- `npm run genkit:dev` - Start the Genkit AI development server
- `npm run genkit:watch` - Start Genkit in watch mode for development
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript type checking

## 🏗️ Project Structure

```
src/
├── ai/
│   ├── flows/          # AI workflow definitions
│   ├── dev.ts         # Genkit development server
│   └── genkit.ts      # Genkit configuration
├── app/               # Next.js app router
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   └── ...           # Feature-specific components
├── hooks/            # Custom React hooks
└── lib/              # Utility functions and types
```

## 🤖 AI Workflows

The application includes several AI-powered workflows:

1. **Marketing Copy Generation** - Creates compelling marketing content
2. **Brand Voice Adaptation** - Ensures consistent brand messaging
3. **Visual Mockup Generation** - Generates visual design concepts
4. **Content Moderation** - Automated content review and compliance

## 🎨 UI Components

Built with a comprehensive design system including:
- Responsive layouts
- Accessible components
- Dark/light mode support
- Interactive animations
- Form validation
- Toast notifications

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🚀 Deployment

This application is configured for deployment on Firebase App Hosting with the included `apphosting.yaml` configuration.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Powered by Firebase Studio AI** - Demonstrating the future of AI-assisted development.
