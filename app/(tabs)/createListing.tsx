import { ListingType, PropertyType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";

interface PhotoWithCaption {
  uri: string;
  caption: string;
}

interface CreateListingForm {
  propertyType: PropertyType;
  title: string;
  description: string;
  price: string;
  rate: string;
  listing: ListingType;
  area: string;
  town: string;
  features: string[];
  photos: PhotoWithCaption[];
  location: {
    latitude: number;
    longitude: number;
  };
  // House-specific fields
  noOfBedrooms?: string;
  noOfBathrooms?: string;
  squareFootage?: string;
  hasGarden?: boolean;
  hasParking?: boolean;
  // Office-specific fields
  floorNumber?: string;
  hasReception?: boolean;
  hasMeetingRooms?: string;
  parkingSpaces?: string;
  // Plot-specific fields
  zoning?: string;
  hasUtilities?: boolean;
  roadAccess?: boolean;
  terrain?: string;
  // Farm-specific fields
  acreage?: string;
  hasWater?: boolean;
  soilType?: string;
  hasBuildings?: boolean;
  agriculturalUse?: string[];
  // Warehouse-specific fields
  ceilingHeight?: string;
  loadingDock?: boolean;
  hasOfficeSpace?: boolean;
  hasSecurity?: boolean;
}

const CreateListingScreen = () => {
  // const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [form, setForm] = useState<CreateListingForm>({
    propertyType: PropertyType.HOUSE,
    title: "",
    description: "",
    price: "",
    rate: "",
    listing: ListingType.RENT,
    area: "",
    town: "",
    features: [],
    photos: [],
    location: {
      latitude: -15.3875, // Lusaka coordinates
      longitude: 28.3228,
    },
  });
  const [currentFeature, setCurrentFeature] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    }

    getCurrentLocation();
  }, []);

  const propertyTypes: { value: PropertyType; label: string; icon: string }[] = [
    { value: PropertyType.HOUSE, label: "House", icon: "home-outline" },
    { value: PropertyType.OFFICE, label: "Office", icon: "business-outline" },
    { value: PropertyType.PLOT, label: "Plot", icon: "map-outline" },
    { value: PropertyType.FARM, label: "Farm", icon: "leaf-outline" },
    { value: PropertyType.WAREHOUSE, label: "Warehouse", icon: "cube-outline" },
  ];

  const listingTypes: { value: ListingType; label: string }[] = [
    { value: ListingType.RENT, label: "Rent" },
    { value: ListingType.SALE, label: "Sale" },
    { value: ListingType.LEASE, label: "Lease" },
  ];

  const rateTypes = [
    { value: "pyr", label: "Per Year" },
    { value: "pm", label: "Per Month" },
    { value: "pw", label: "Per Week" },
    { value: "pd", label: "Per Day" },
    { value: "", label: "One Time" },
  ];

  const handlePhotoUpload = async () => {
    Alert.alert(
      "Photo Upload",
      "Photo upload functionality will be available after installing expo-image-picker. For now, you can add a placeholder photo URL.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add Placeholder",
          onPress: () => {
            const newPhoto: PhotoWithCaption = {
              uri: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Property+Photo",
              caption: "Sample Photo",
            };
            setForm((prev) => ({
              ...prev,
              photos: [...prev.photos, newPhoto],
            }));
          },
        },
      ],
    );
  };

  const removePhoto = (index: number) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const updatePhotoCaption = (index: number, caption: string) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.map((photo, i) => (i === index ? { ...photo, caption } : photo)),
    }));
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateLocation = (latitude: number, longitude: number) => {
    setForm((prev) => ({
      ...prev,
      location: { latitude, longitude },
    }));
  };

  const renderPropertyTypeFields = () => {
    switch (form.propertyType) {
      case "house":
        return (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>House Details</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Bedrooms</Text>
                <TextInput
                  style={styles.input}
                  value={form.noOfBedrooms}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, noOfBedrooms: text }))}
                  placeholder="3"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Bathrooms</Text>
                <TextInput
                  style={styles.input}
                  value={form.noOfBathrooms}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, noOfBathrooms: text }))}
                  placeholder="2"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Square Footage</Text>
                <TextInput
                  style={styles.input}
                  value={form.squareFootage}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, squareFootage: text }))}
                  placeholder="1500"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasGarden && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, hasGarden: !prev.hasGarden }))}
              >
                {form.hasGarden && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Has Garden</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasParking && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, hasParking: !prev.hasParking }))}
              >
                {form.hasParking && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Has Parking</Text>
            </View>
          </View>
        );

      case "office":
        return (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Office Details</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Square Meters</Text>
                <TextInput
                  style={styles.input}
                  value={form.squareFootage}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, squareFootage: text }))}
                  placeholder="2000"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Floor Number</Text>
                <TextInput
                  style={styles.input}
                  value={form.floorNumber}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, floorNumber: text }))}
                  placeholder="1"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Meeting Rooms</Text>
                <TextInput
                  style={styles.input}
                  value={form.hasMeetingRooms}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, hasMeetingRooms: text }))}
                  placeholder="2"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Parking Spaces</Text>
                <TextInput
                  style={styles.input}
                  value={form.parkingSpaces}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, parkingSpaces: text }))}
                  placeholder="5"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasReception && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, hasReception: !prev.hasReception }))}
              >
                {form.hasReception && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Has Reception</Text>
            </View>
          </View>
        );

      case "plot":
        return (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Plot Details</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Square Footage</Text>
                <TextInput
                  style={styles.input}
                  value={form.squareFootage}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, squareFootage: text }))}
                  placeholder="5000"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Zoning</Text>
                <TextInput
                  style={styles.input}
                  value={form.zoning}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, zoning: text }))}
                  placeholder="Residential"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Terrain</Text>
                <TextInput
                  style={styles.input}
                  value={form.terrain}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, terrain: text }))}
                  placeholder="Flat"
                />
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasUtilities && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, hasUtilities: !prev.hasUtilities }))}
              >
                {form.hasUtilities && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Has Utilities</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.roadAccess && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, roadAccess: !prev.roadAccess }))}
              >
                {form.roadAccess && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Road Access</Text>
            </View>
          </View>
        );

      case "farm":
        return (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Farm Details</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Acreage</Text>
                <TextInput
                  style={styles.input}
                  value={form.acreage}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, acreage: text }))}
                  placeholder="50"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Soil Type</Text>
                <TextInput
                  style={styles.input}
                  value={form.soilType}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, soilType: text }))}
                  placeholder="Loam"
                />
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasWater && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, hasWater: !prev.hasWater }))}
              >
                {form.hasWater && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Has Water</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasBuildings && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, hasBuildings: !prev.hasBuildings }))}
              >
                {form.hasBuildings && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Has Buildings</Text>
            </View>
          </View>
        );

      case "warehouse":
        return (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Warehouse Details</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Square Footage</Text>
                <TextInput
                  style={styles.input}
                  value={form.squareFootage}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, squareFootage: text }))}
                  placeholder="10000"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Ceiling Height (ft)</Text>
                <TextInput
                  style={styles.input}
                  value={form.ceilingHeight}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, ceilingHeight: text }))}
                  placeholder="20"
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.loadingDock && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, loadingDock: !prev.loadingDock }))}
              >
                {form.loadingDock && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Loading Dock</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasOfficeSpace && styles.checkboxChecked]}
                onPress={() =>
                  setForm((prev) => ({ ...prev, hasOfficeSpace: !prev.hasOfficeSpace }))
                }
              >
                {form.hasOfficeSpace && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Office Space</Text>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, form.hasSecurity && styles.checkboxChecked]}
                onPress={() => setForm((prev) => ({ ...prev, hasSecurity: !prev.hasSecurity }))}
              >
                {form.hasSecurity && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Security System</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.area || !form.town) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    if (form.photos.length === 0) {
      Alert.alert("Photos Required", "Please upload at least one photo");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just show a success message
      Alert.alert("Success!", "Your property listing has been created successfully!", [
        { text: "OK", onPress: () => console.log("Listing created") },
      ]);

      // Reset form
      setForm({
        propertyType: PropertyType.HOUSE,
        title: "",
        description: "",
        price: "",
        rate: "",
        listing: ListingType.RENT,
        area: "",
        town: "",
        features: [],
        photos: [],
        location: {
          latitude: -15.3875,
          longitude: 28.3228,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to create listing." + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Listing</Text>
          <Text style={styles.headerSubtitle}>Add your property to the market</Text>
        </View>

        <View style={styles.form}>
          {/* Property Type Selection */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Property Type *</Text>
            <View style={styles.propertyTypeGrid}>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.propertyTypeButton,
                    form.propertyType === type.value && styles.propertyTypeButtonActive,
                  ]}
                  onPress={() => setForm((prev) => ({ ...prev, propertyType: type.value }))}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={24}
                    color={form.propertyType === type.value ? "#fff" : "#4CAF50"}
                  />
                  <Text
                    style={[
                      styles.propertyTypeText,
                      form.propertyType === type.value && styles.propertyTypeTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Basic Information *</Text>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
              placeholder="e.g., Modern 3 Bedroom House in Woodlands"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
              placeholder="Describe your property in detail..."
              multiline
              numberOfLines={4}
            />

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Price *</Text>
                <TextInput
                  style={styles.input}
                  value={form.price}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))}
                  placeholder="500000"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Rate</Text>
                <TextInput
                  style={styles.input}
                  value={form.rate}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, rate: text }))}
                  placeholder="pm (per month)"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Listing Type *</Text>
                <TextInput
                  style={styles.input}
                  value={form.listing}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, listing: text as ListingType }))
                  }
                  placeholder="rent, sale, or lease"
                />
              </View>
            </View>
          </View>

          {/* Property Type Specific Fields */}
          {renderPropertyTypeFields()}

          {/* Location */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Location *</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Area</Text>
                <TextInput
                  style={styles.input}
                  value={form.area}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, area: text }))}
                  placeholder="e.g., Woodlands"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Town</Text>
                <TextInput
                  style={styles.input}
                  value={form.town}
                  onChangeText={(text) => setForm((prev) => ({ ...prev, town: text }))}
                  placeholder="e.g., Lusaka"
                />
              </View>
            </View>

            <Text style={styles.label}>Map Location</Text>
            <TouchableOpacity style={styles.mapButton} onPressIn={() => setIsModalOpen(true)}>
              <Ionicons name="map-outline" size={20} color="#4CAF50" />
              <Text style={styles.mapButtonText}>Select Location on Map</Text>
            </TouchableOpacity>
            <Text style={styles.mapCoordinates}>
              Lat: {form.location.latitude.toFixed(4)}, Long: {form.location.longitude.toFixed(4)}
            </Text>
          </View>

          <Modal
            animationType="slide"
            visible={isModalOpen}
            style={{
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "pink",
            }}
            onRequestClose={() => {
              setIsModalOpen(!isModalOpen);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ margin: 30, justifyContent: "center", alignSelf: "flex-start" }}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={{ ...styles.mapButtonText }}>Cancel</Text>
              </TouchableOpacity>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: location ? location.latitude : 0,
                  longitude: location ? location.longitude : 0,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                showsUserLocation
                showsMyLocationButton
                onPress={(e) =>
                  setLocation({
                    ...e.nativeEvent.coordinate,
                    altitude: 0,
                    accuracy: 0,
                    altitudeAccuracy: 0,
                    heading: 0,
                    speed: 0,
                  })
                }
              >
                {location && (
                  <Marker
                    coordinate={location}
                    draggable
                    onDragEnd={(e) =>
                      setLocation({
                        ...e.nativeEvent.coordinate,
                        altitude: 0,
                        accuracy: 0,
                        altitudeAccuracy: 0,
                        heading: 0,
                        speed: 0,
                      })
                    }
                  />
                )}
              </MapView>
              <TouchableOpacity
                style={{ ...styles.mapButton, margin: 30, justifyContent: "center" }}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.mapButtonText}>Set Location</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Features */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Features</Text>
            <View style={styles.featureInput}>
              <TextInput
                style={[styles.input, styles.featureTextInput]}
                value={currentFeature}
                onChangeText={setCurrentFeature}
                placeholder="Add a feature (e.g., Tiles, Built-in Wardrobe)"
                onSubmitEditing={addFeature}
              />
              <TouchableOpacity style={styles.addFeatureButton} onPress={addFeature}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.featuresList}>
              {form.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>{feature}</Text>
                  <TouchableOpacity onPress={() => removeFeature(index)}>
                    <Ionicons name="close-circle" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Photos */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupTitle}>Photos *</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePhotoUpload}>
              <Ionicons name="camera-outline" size={24} color="#4CAF50" />
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>

            <View style={styles.photosGrid}>
              {form.photos.map((photo, index) => (
                <View key={index} style={styles.photoItem}>
                  <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                  <TextInput
                    style={styles.photoCaption}
                    value={photo.caption}
                    onChangeText={(text) => updatePhotoCaption(index, text)}
                    placeholder="Add caption..."
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close-circle" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Creating...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Create Listing</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Map functionality will be available after installing react-native-maps */}
    </KeyboardAvoidingView>
  );
};

export default CreateListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#4CAF50",
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  form: {
    padding: 20,
  },
  fieldGroup: {
    marginBottom: 25,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldGroupTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 15,
  },
  halfField: {
    flex: 1,
  },
  picker: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 16,
  },
  propertyTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  propertyTypeButton: {
    flex: 1,
    minWidth: 100,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
    backgroundColor: "#fff",
  },
  propertyTypeButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  propertyTypeText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  propertyTypeTextActive: {
    color: "#fff",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8f0",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 12,
  },
  mapButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  mapCoordinates: {
    fontSize: 14,
    color: "#666",
    fontFamily: "monospace",
  },
  map: {
    width: "100%",
    height: 500,
  },
  featureInput: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  featureTextInput: {
    flex: 1,
    marginBottom: 0,
  },
  addFeatureButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f8f0",
    padding: 12,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8f0",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 16,
  },
  uploadButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  photosGrid: {
    gap: 16,
  },
  photoItem: {
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  photoCaption: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
  },
  removePhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
