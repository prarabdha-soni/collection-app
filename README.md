# FOS Field Hero - Mobile App

A mobile-first field operations app for loan collection agents built with Expo and React.

## Project Info

**URL**: https://lovable.dev/projects/df7a4b15-04a5-4b4a-a138-2db118e2c456

## Features

- **Dashboard**: Collection metrics, alerts, and task management
- **Portfolio Management**: Loan listings with search and filtering
- **Visit Forms**: Photo capture for proof of visit/collection
- **Task Scheduling**: Daily task management for field agents
- **Profile/Settings**: Account management and app settings

## Mobile Development

This app is built with Expo for cross-platform mobile deployment.

### Quick Demo (Expo Go)

1. Install Expo Go on your mobile device
2. Run `npx expo start` in your terminal
3. Scan the QR code with your device
4. Test the app instantly on your device

### Development Setup

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start

# For web preview
npx expo start --web

# For specific platform
npx expo start --ios
npx expo start --android
```

### Building for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for Android
eas build --platform android

# Build for iOS  
eas build --platform ios
```

### Native Features

- **Camera**: Capture photos for visit/collection proof using expo-camera
- **Image Picker**: Select photos from device gallery using expo-image-picker
- **Location Services**: Track field agent locations using expo-location
- **Push Notifications**: Task reminders and updates using expo-notifications

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/df7a4b15-04a5-4b4a-a138-2db118e2c456) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Tech Stack

This project is built with:

- **Frontend**: React + TypeScript
- **Mobile**: Expo
- **Build Tool**: Vite
- **UI Framework**: shadcn-ui + Tailwind CSS
- **Backend**: Supabase (authentication, database, storage)
- **Navigation**: React Router (web) / Expo Router (mobile)

## Deployment

The app can be deployed as:

- **Web App**: Via Lovable platform - click Share -> Publish
- **Mobile App**: Via Expo Application Services (EAS) 
- **Enterprise**: Internal distribution via TestFlight/Google Play Console

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
