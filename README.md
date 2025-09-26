# Paws Telegram Mini App Clone

This repository contains both the initial setup and the final version of the Paws Telegram mini app clone project. The repository includes the basic project structure, necessary images, icons, and styling.

## Overview

This project is a clone of the popular Telegram mini app, Paws. The repository provides two branches:

1. **Initial Setup**: Contains the foundational Next.js 14 project structure with:
   - Configured Tailwind CSS
   - All necessary icons and images
   - Type definitions
   - Required fonts

2. **Final Version**: The completed application featuring:
   - Tab-based navigation
   - Home screen with wallet connection and balance display
   - Leaderboard with rankings
   - Friends invitation system
   - Tasks management system
   - Animated UI elements

## Getting Started

Follow these instructions to get started with either version of the project:

### Cloning the Repository

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/nikandr-surkov/Paws-Telegram-Mini-App-Clone.git
    cd Paws-Telegram-Mini-App-Clone
    ```

### Initial Setup

2. **Switch to the `initial-setup` Branch**:
    ```bash
    git checkout initial-setup
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Run the Development Server**:
    ```bash
    npm run dev
    ```

5. **Open Your Browser**:
    Navigate to http://localhost:3000 to see the initial setup.

### Final Version

2. **Switch to the `final-version` Branch**:
    ```bash
    git checkout final-version
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Run the Development Server**:
    ```bash
    npm run dev
    ```

5. **Open Your Browser**:
    Navigate to http://localhost:3000 to see the final version of the application.

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS

## Project Structure

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CheckFootprint.tsx
│   ├── NavigationBar.tsx
│   ├── TabContainer.tsx
│   ├── HomeTab.tsx
│   ├── LeaderboardTab.tsx
│   ├── FriendsTab.tsx
│   └── TasksTab.tsx
├── contexts/
│   └── TabContext.tsx
├── icons/
│   └── [icon files]
├── images/
│   └── [image files]
└── utils/
    └── types.ts
```

## Contact

For any inquiries, please contact me:
- Telegram: [@nikandr_s](https://t.me/nikandr_s)
- YouTube: [@NikandrSurkov](https://www.youtube.com/@NikandrSurkov)