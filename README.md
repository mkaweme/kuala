# Kuala App

A React Native app built with Expo Router that features a landing page with data loading, followed by navigation to a login page.

## App Structure

### Navigation Flow

1. **Landing Page** (`app/index.tsx`) - Shows while app data is loading
2. **Login Page** (`app/login.tsx`) - Authentication screen
3. **Main App** (`app/(tabs)/`) - Main application screens

### Key Features

#### Landing Page

- Displays a beautiful welcome screen with your app branding
- Handles app initialization and data loading
- Automatically navigates to login or main app based on authentication status
- Uses `useAppInitialization` hook for data loading logic

#### Authentication

- Supabase integration for authentication
- Auth context for managing user state across the app
- Automatic session management
- Error handling with user-friendly alerts

#### Data Loading

- Custom hook (`useAppInitialization`) for handling app startup
- Checks authentication status
- Loads user preferences (if authenticated)
- Extensible for additional initialization logic

## Customization

### Modifying Data Loading Logic

Edit `hooks/useAppInitialization.ts` to add your specific data loading requirements:

```typescript
// Add your initialization logic here
// For example:
// - Load app configuration
// - Initialize analytics
// - Load cached data
// - Check for app updates
// - Load user preferences
```

### Adding New Routes

1. Create new files in the `app/` directory
2. Update `app/_layout.tsx` to include new routes in the Stack
3. Use `router.push()` or `router.replace()` for navigation

### Authentication Flow

The app automatically handles authentication flow:

- If user is authenticated → goes directly to main app
- If user is not authenticated → goes to login page
- After successful login → navigates to main app

## Dependencies

- `expo-router` - File-based routing
- `@supabase/supabase-js` - Authentication and backend
- `expo-linear-gradient` - UI components
- `react-native-reanimated` - Animations

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your Supabase credentials in `assets/supabase_client.ts`

3. Start the development server:
   ```bash
   npm start
   ```

## File Structure

```
app/
├── _layout.tsx          # Root layout with navigation stack
├── index.tsx            # Landing page
├── login.tsx            # Login screen
├── (tabs)/              # Main app screens
│   ├── _layout.tsx
│   ├── index.tsx
│   └── two.tsx
└── modal.tsx            # Modal screen

hooks/
└── useAppInitialization.ts  # Data loading hook

contexts/
└── AuthContext.tsx      # Authentication context

assets/
├── supabase_client.ts   # Supabase configuration
└── images/              # App images
```

## Best Practices

1. **Error Handling**: Always handle errors gracefully with user feedback
2. **Loading States**: Show loading indicators during async operations
3. **Navigation**: Use `router.replace()` for auth flows to prevent back navigation
4. **State Management**: Use context for global state like authentication
5. **Type Safety**: Leverage TypeScript for better development experience
