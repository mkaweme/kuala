# Database Setup for Profile Integration

## Overview

The profile page has been connected to the Supabase database to save and retrieve user profile information.

## Database Changes

A new migration has been created to extend the existing `profiles` table with additional fields:

### New Fields Added:

- `first_name` - User's first name
- `middle_name` - User's first name
- `last_name` - User's last name
- `phone` - User's phone number
- `bio` - User's biography/description
- `location` - User's location
- `preferences` - JSON field for profile-specific preferences

### Role Updates:

- Updated role constraint to include 'tenant' (was previously only 'client', 'landlord', 'agent')
- Role values now: 'tenant', 'landlord', 'agent'

## Running the Migration

### Option 1: Using Supabase CLI

```bash
# Navigate to your project directory
cd kuala

# Apply the migration
supabase db push

# Or if you want to reset and apply all migrations
supabase db reset
```

### Option 2: Manual SQL Execution

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250814080000_extend_profiles_table.sql`
4. Execute the SQL

## New Features

### Profile Service (`services/profileService.ts`)

- `getProfile(userId)` - Retrieve user profile
- `upsertProfile(profileData)` - Create or update profile
- `createInitialProfile(userId, email)` - Create initial profile for new users
- `updatePreferences(userId, preferences)` - Update profile preferences
- `updateAvatar(userId, avatarUrl)` - Update profile avatar

### Profile Page Integration

- **Auto-loading**: Profile data is automatically loaded when the page opens
- **Auto-saving**: Profile data is saved to the database when the user clicks the save button
- **Real-time sync**: Profile type changes are immediately reflected in the database
- **Error handling**: Proper error messages for failed operations
- **Loading states**: Visual feedback during database operations

## Database Schema

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('tenant', 'landlord', 'agent')),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage

1. **First Time Users**: When a user first visits the profile page, an initial profile is automatically created
2. **Editing**: Users can edit their profile information and save changes
3. **Profile Types**: Users can switch between tenant, landlord, and agent profiles
4. **Preferences**: Profile-specific preferences are stored as JSON and can be customized per profile type

## Security

- Row Level Security (RLS) is enabled on the profiles table
- Users can only view and update their own profiles
- Profile data is validated before saving

## Troubleshooting

### Common Issues:

1. **Migration fails**: Ensure you have the latest Supabase CLI version
2. **Profile not loading**: Check that the user is authenticated and has a valid user ID
3. **Save fails**: Verify that all required fields are filled and the database connection is working

### Debug Mode:

Enable console logging to see detailed error messages:

```typescript
// In your environment variables
EXPO_PUBLIC_DEBUG = true;
```

## Next Steps

- Add profile image upload functionality
- Implement profile verification for agents/landlords
- Add profile completion percentage tracking
- Implement profile search and discovery features
