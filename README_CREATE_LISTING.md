# Create Listing Screen Setup

## Overview

The Create Listing Screen allows users to create new property listings with the following features:

- **Property Type Selection**: Choose from 5 property types (House, Office, Plot, Farm, Warehouse)
- **Basic Information**: Title, description, price, rate, listing type
- **Location**: Area and town selection
- **Features**: Add/remove property features
- **Photos**: Upload photos with captions (placeholder for now)
- **Map Integration**: Location selection on map (placeholder for now)

## Required Dependencies

To fully implement the create listing screen, you'll need to install these packages:

```bash
npx expo install @react-native-picker/picker expo-image-picker react-native-maps
```

### Package Details:

1. **@react-native-picker/picker**: For dropdown selection components
2. **expo-image-picker**: For photo upload functionality
3. **react-native-maps**: For map location selection

## Current Implementation

The current implementation includes:

✅ **Property Type Selection**: Visual grid with icons for all 5 property types  
✅ **Form Validation**: Required field validation  
✅ **Dynamic Form Fields**: Property type-specific fields  
✅ **Feature Management**: Add/remove property features  
✅ **Responsive Design**: Mobile-optimized layout  
✅ **Tab Navigation**: Integrated into the main tab navigation

## Features to Implement

### 1. Photo Upload

```typescript
// Install expo-image-picker first
import * as ImagePicker from "expo-image-picker";

const handlePhotoUpload = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    // Handle the selected image
  }
};
```

### 2. Map Integration

```typescript
// Install react-native-maps first
import MapView, { Marker } from 'react-native-maps';

// Add map component with location selection
<MapView
  style={styles.map}
  initialRegion={{
    latitude: form.location.latitude,
    longitude: form.location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
  onPress={(e) => updateLocation(e.nativeEvent.coordinate)}
>
  <Marker coordinate={form.location} draggable />
</MapView>
```

### 3. Enhanced Property Type Fields

Each property type has specific fields:

- **House**: Bedrooms, bathrooms, square footage, garden, parking
- **Office**: Square footage, floor number, reception, meeting rooms, parking
- **Plot**: Square footage, zoning, utilities, road access, terrain
- **Farm**: Acreage, water access, soil type, buildings, agricultural use
- **Warehouse**: Square footage, ceiling height, loading dock, office space, security

## Usage

1. **Navigate to Create Tab**: Tap the "+" tab in the bottom navigation
2. **Select Property Type**: Choose from the 5 property types
3. **Fill Basic Information**: Title, description, price, listing type
4. **Add Location**: Enter area and town
5. **Add Features**: Type and add property features
6. **Upload Photos**: Add photos with captions
7. **Submit**: Create the listing

## Form Validation

The form validates:

- Required fields (title, price, area, town)
- At least one photo uploaded
- Proper data types for numeric fields

## Styling

The screen uses:

- **Color Scheme**: Integrates with the app's color scheme
- **Card Layout**: Clean, organized form sections
- **Responsive Design**: Adapts to different screen sizes
- **Visual Feedback**: Active states, hover effects, and animations

## Next Steps

1. **Install Dependencies**: Run the installation commands above
2. **Test Photo Upload**: Verify image picker functionality
3. **Test Map Integration**: Verify map location selection
4. **Add Backend Integration**: Connect to your property database
5. **Add Image Storage**: Implement cloud storage for photos
6. **Add Form Persistence**: Save draft listings

## Troubleshooting

### Common Issues:

1. **Picker not working**: Ensure @react-native-picker/picker is installed
2. **Photos not uploading**: Check expo-image-picker permissions
3. **Map not displaying**: Verify react-native-maps installation
4. **Form validation errors**: Check required field values

### Debug Tips:

- Use console.log to track form state changes
- Check React Native debugger for component errors
- Verify all dependencies are properly linked

The create listing screen is now ready for basic use and can be enhanced with the additional dependencies for full functionality!
