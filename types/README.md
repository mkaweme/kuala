# Type Organization Strategy

This directory contains all TypeScript type definitions for the Kuala project, organized by domain for better maintainability and clarity.

## Structure

```
types/
├── index.ts          # Main export file - exports all types
├── house.ts          # House and property-related types
├── auth.ts           # Authentication and user-related types
├── navigation.ts     # Navigation and routing types
├── api.ts            # API response and error types
└── README.md         # This file
```

## Best Practices

### 1. **Domain-Specific Organization**

- Group related types in separate files by domain (e.g., `house.ts`, `auth.ts`)
- This makes it easier to find and maintain related types
- Prevents large, monolithic type files

### 2. **Centralized Export**

- All types are exported through `types/index.ts`
- Import types using: `import { House, User } from '@/types'`
- This provides a single import point for all types

### 3. **When to Use Each Approach**

#### **Use the `types/` directory for:**

- ✅ Shared types used across multiple components
- ✅ Domain-specific types (House, User, Auth, etc.)
- ✅ API response types
- ✅ Navigation types
- ✅ Complex interfaces and unions

#### **Use inline types for:**

- ✅ Simple prop interfaces used only in one component
- ✅ Local component state types
- ✅ Temporary or experimental types

#### **Use `global.d.ts` for:**

- ✅ Module declarations (like your existing image imports)
- ✅ Global type augmentations
- ✅ Third-party library type extensions

### 4. **Naming Conventions**

- Use PascalCase for interfaces and types: `House`, `User`, `AuthState`
- Use descriptive names that indicate the purpose
- Add suffixes when needed: `HouseProps`, `ApiResponse<T>`

### 5. **Type Reusability**

- Create generic types for common patterns: `ApiResponse<T>`, `PaginatedResponse<T>`
- Use union types for constrained values: `"rent" | "sale"`
- Export types that might be reused elsewhere

## Usage Examples

```typescript
// Import types
import { House, User, ApiResponse } from "@/types";

// Use in components
interface HouseListProps {
  houses: House[];
  onHouseSelect: (house: House) => void;
}

// Use in API functions
async function fetchHouses(): Promise<ApiResponse<House[]>> {
  // implementation
}
```

## Migration Guide

When adding new types:

1. **Determine the domain** - Which file should this type go in?
2. **Check for existing similar types** - Can you extend or reuse existing types?
3. **Export from the domain file** - Make sure it's exported
4. **Update index.ts** - If it's a new domain, add the export
5. **Use in components** - Import from `@/types`

This organization makes the codebase more maintainable and provides better TypeScript support across your entire application.
