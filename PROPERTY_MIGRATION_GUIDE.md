# Property Migration Guide

## Overview

This guide helps you complete the migration from the old `House` component to the new generic `PropertyCard` component.

## What's Been Done ✅

1. **Created new Property types** (`types/property.ts`)

   - `BaseProperty` interface with common fields
   - Specific interfaces for each property type (House, Office, Plot, Farm, Warehouse)
   - Type guards for safe type checking

2. **Created new PropertyCard component** (`components/PropertyCard.tsx`)

   - Generic component that handles all property types
   - Conditional rendering for type-specific information
   - Consistent UI across all property types

3. **Updated imports** in search.tsx and index.tsx
   - Changed from `HouseComponent` to `PropertyCard`
   - Updated type imports from `House` to `Property`

## What Needs to Be Done 🔧

### 1. Fix Type Errors in search.tsx and index.tsx

**Add missing fields to all house objects:**

```typescript
// Add these fields to each house object:
{
  id: "unique_id",
  title: "Descriptive Title",
  // ... existing fields ...
  type: "house", // lowercase
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
```

**Update all type values:**

- Change `"House"` to `"house"`
- Change `"Warehouse"` to `"warehouse"`
- Change `"Office"` to `"office"`
- Change `"Plot"` to `"plot"`
- Change `"Farm"` to `"farm"`

### 2. Update Variable Names

**In search.tsx and index.tsx:**

- Change `filteredHouses` to `filteredProperties`
- Change `selectedHouse` to `selectedProperty`
- Change `setSelectedHouse` to `setSelectedProperty`

### 3. Update Function Names

**In search.tsx and index.tsx:**

- Change `handleHousePress` to `handlePropertyPress`
- Update any other house-related function names

## Step-by-Step Migration

### Step 1: Fix Type Errors

1. Open `app/(tabs)/search.tsx`
2. Find all house objects in the `HOUSES` array
3. Add missing fields: `id`, `title`, `createdAt`, `updatedAt`
4. Change `type: "House"` to `type: "house"`

### Step 2: Update Variable Names

1. Search for `filteredHouses` and replace with `filteredProperties`
2. Search for `selectedHouse` and replace with `selectedProperty`
3. Update all related variable names

### Step 3: Test the Application

1. Run the app
2. Navigate to the search and home tabs
3. Verify that properties display correctly
4. Check that property details modal works

## Example of Updated House Object

```typescript
{
  id: "1",
  title: "Modern 1 Bedroom House",
  noOfBedrooms: 1,
  area: "Woodlands",
  town: "Lusaka",
  listing: "rent",
  price: 200000,
  rate: "pm",
  type: "house", // lowercase
  features: ["Tiles", "Built-In Kitchen Units", "Built-In Wardrobe"],
  photos: [/* ... */],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}
```

## Benefits of the New System

✅ **Generic**: One component handles all property types  
✅ **Maintainable**: Single source of truth for UI logic  
✅ **Extensible**: Easy to add new property types  
✅ **Consistent**: Uniform user experience across all types  
✅ **Type-safe**: Full TypeScript support with type guards

## Troubleshooting

### Common Issues:

1. **Type errors**: Make sure all required fields are present
2. **Property not displaying**: Check that the property object has valid data
3. **Modal not working**: Verify the property prop is passed correctly

### Debug Tips:

- Use console.log to check property data
- Verify all required fields are present
- Check that type values are lowercase

## Next Steps

After completing the migration:

1. **Add more property types** (Office, Plot, Farm, Warehouse)
2. **Enhance PropertyCard** with more type-specific features
3. **Add property filtering** by type
4. **Implement property search** functionality

The new system is much more flexible and will make it easier to add new property types in the future!
