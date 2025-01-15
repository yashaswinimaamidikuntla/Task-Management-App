# Task Management App

Live Demo: [Task Management App](https://task-management-app-swart-nu.vercel.app)

## Technologies Used

- React 18 with TypeScript
- Zustand for state management
- Tailwind CSS for styling
- React Beautiful DnD for drag-and-drop functionality
- Firebase for data storage and authentication

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
cd TaskManagementApp/ui-app
```

2. Configure Firebase
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
- Add your Firebase configuration to `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Install dependencies
```bash
npm install
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Features

- User authentication with Firebase
- Create, edit, and delete tasks
- Organize tasks into different columns
- Drag and drop tasks between columns
- Real-time data synchronization

## Future Improvements

- Responsive design for mobile devices
- Offline support
- Task categories and labels
- Due date reminders
- Collaborative features for team tasks

## Build for Production

```bash
npm run build
```

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Push your code to a Git repository
2. Import your project to [Vercel](https://vercel.com)
3. Set up environment variables in Vercel dashboard
4. Vercel will automatically build and deploy your application

Current deployment: [https://task-management-app-swart-nu.vercel.app](https://task-management-app-swart-nu.vercel.app)

## Project Structure

- `/src/components` - React components
- `/src/store` - Zustand store
- `/src/types` - TypeScript interfaces and types
- `/src/utils` - Utility functions
- `/src/firebase` - Firebase configuration and utilities

## Contributing

Feel free to submit issues and enhancement requests!
