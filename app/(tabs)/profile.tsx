import { View } from "@/components/Themed";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { ProfileService } from "@/services/profileService";
import { ProfileType, UserProfile } from "@/types/auth";
import { PropertyType } from "@/types/property";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { colorScheme, setColorScheme, colors } = useColorScheme();
  const [profileType, setProfileType] = useState<ProfileType>("tenant");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    userId: user?.id || "",
    profileType: "tenant",
    firstName: user?.email?.split("@")[0] || "",
    middleName: "",
    lastName: "",
    phone: "",
    bio: "",
    location: "",
    preferences: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Load profile from database on component mount
  useEffect(() => {
    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const userProfile = await ProfileService.getProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
        setProfileType(userProfile.profileType);
      } else {
        // Create initial profile if none exists
        const initialProfile = await ProfileService.createInitialProfile(user.id, user.email || "");
        if (initialProfile) {
          setProfile(initialProfile);
          setProfileType(initialProfile.profileType);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const profileData = {
        id: user.id,
        first_name: profile.firstName,
        middle_name: profile.middleName,
        last_name: profile.lastName,
        phone: profile.phone,
        bio: profile.bio,
        location: profile.location,
        role: profileType,
        preferences: profile.preferences,
        avatar_url: profile.avatar,
      };

      const savedProfile = await ProfileService.updateProfile(profileData);
      if (savedProfile) {
        setProfile(savedProfile);
        setIsEditing(false);
        Alert.alert("Success", "Profile saved successfully");
      } else {
        Alert.alert("Error", "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/login");
          } catch (error) {
            console.error("Sign out failed:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const renderTenantPreferences = () => (
    <View style={{ ...styles.section, backgroundColor: colors.card }}>
      <Text style={{ ...styles.sectionTitle, color: colors.text }}>Property Preferences</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>City</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
              },
            ]}
            value={profile.preferences?.city || ""}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  city: text,
                },
              })
            }
            placeholder="City"
            placeholderTextColor={colors.inputPlaceholder}
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Area/Neighbourhood
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
              },
            ]}
            value={profile.preferences?.area || ""}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  area: text,
                },
              })
            }
            placeholder="Area or Neighbourhood"
            placeholderTextColor={colors.inputPlaceholder}
            editable={isEditing}
          />
        </View>
      </View>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Min Budget</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
              },
            ]}
            value={profile.preferences?.budget?.min?.toString() || ""}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  budget: {
                    ...profile.preferences?.budget,
                    min: parseInt(text) || undefined,
                  },
                },
              })
            }
            placeholder="Min Budget"
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Max Budget</Text>
          <TextInput
            style={{ ...styles.input, backgroundColor: colors.card, color: colors.text }}
            value={profile.preferences?.budget?.max?.toString() || ""}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  budget: {
                    ...profile.preferences?.budget,
                    max: parseInt(text) || undefined,
                  },
                },
              })
            }
            placeholder="Max Budget"
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>
      </View>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Min Bedrooms</Text>
          <TextInput
            style={{ ...styles.input, backgroundColor: colors.card, color: colors.text }}
            value={profile.preferences?.bedrooms?.min?.toString() || ""}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  bedrooms: {
                    ...profile.preferences?.bedrooms,
                    min: parseInt(text) || undefined,
                  },
                },
              })
            }
            placeholder="Min Bedrooms"
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Max Bedrooms</Text>
          <TextInput
            style={{ ...styles.input, backgroundColor: colors.card, color: colors.text }}
            value={profile.preferences?.bedrooms?.max?.toString() || ""}
            onChangeText={(text) =>
              setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  bedrooms: {
                    ...profile.preferences?.bedrooms,
                    max: parseInt(text) || undefined,
                  },
                },
              })
            }
            placeholder="Max Bedrooms"
            keyboardType="numeric"
            editable={isEditing}
          />
        </View>
      </View>
    </View>
  );

  const renderLandlordInfo = () => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Information</Text>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Number of Properties
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={profile.preferences?.properties?.length?.toString()}
          placeholder="Number of properties you own"
          keyboardType="numeric"
          editable={isEditing}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Property Types</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={profile.preferences?.propertyType?.join(", ") || ""}
          onChangeText={(text) =>
            setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                propertyType: text.split(", ").filter(Boolean),
              },
            })
          }
          placeholder="e.g., Apartment, House, Commercial"
          editable={isEditing}
        />
      </View>
    </View>
  );

  const renderAgentInfo = () => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Professional Information</Text>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>License Number</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={profile.preferences?.licenseNumber || ""}
          onChangeText={(text) =>
            setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                licenseNumber: text,
              },
            })
          }
          placeholder="Real Estate License Number"
          editable={isEditing}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Agency</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={profile.preferences?.agency || ""}
          onChangeText={(text) =>
            setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                agency: text,
              },
            })
          }
          placeholder="Agency Name"
          editable={isEditing}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          Years of Experience
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={profile.preferences?.experience?.toString() || ""}
          onChangeText={(text) =>
            setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                experience: parseInt(text) || undefined,
              },
            })
          }
          placeholder="Years of Experience"
          keyboardType="numeric"
          editable={isEditing}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Specializations</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          value={profile.preferences?.specializations?.join(", ") || ""}
          onChangeText={(text) =>
            setProfile({
              ...profile,
              preferences: {
                ...profile.preferences,
                specializations: text.split(", ").filter(Boolean),
              },
            })
          }
          placeholder="e.g., Residential, Commercial, Luxury"
          editable={isEditing}
        />
      </View>
    </View>
  );

  const renderProfileSpecificInfo = () => {
    switch (profileType) {
      case "tenant":
        return renderTenantPreferences();
      case "buyer":
        return renderTenantPreferences();
      case "seller":
        return renderLandlordInfo();
      case "landlord":
        return renderLandlordInfo();
      case "agent":
        return renderAgentInfo();
      default:
        return null;
    }
  };

  const renderPropertyTypeSelector = () => {
    const isSelectorVisible = ["tenant", "buyer", "seller", "landlord"].includes(profileType);
    if (!isSelectorVisible) return null;

    const selectedTypes = profile.preferences?.propertyType || [];
    const allTypes = [
      PropertyType.HOUSE,
      PropertyType.OFFICE,
      PropertyType.PLOT,
      PropertyType.FARM,
      PropertyType.WAREHOUSE,
    ];

    const toggleType = (type: PropertyType) => {
      const next = selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          propertyType: next,
        },
      });
    };

    return (
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferred Property Types</Text>
        <View style={styles.profileTypeButtons}>
          {allTypes.map((type) => {
            const isActive = selectedTypes.includes(type);
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.profileTypeButton,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                  isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => toggleType(type)}
              >
                <MaterialCommunityIcons
                  name={
                    (
                      {
                        [PropertyType.HOUSE]: "home-variant-outline",
                        [PropertyType.OFFICE]: "office-building",
                        [PropertyType.PLOT]: "map-outline",
                        [PropertyType.FARM]: "barn",
                        [PropertyType.WAREHOUSE]: "warehouse",
                      } as const
                    )[type] as keyof typeof MaterialCommunityIcons.glyphMap
                  }
                  size={22}
                  color={isActive ? colors.buttonText : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.profileTypeText,
                    { color: colors.textSecondary },
                    isActive && { color: colors.buttonText },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Ionicons name="person" size={40} color={colors.text} />
              </View>
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={{ ...styles.userName, color: colors.text }}>
              {profile.firstName} {profile.lastName}
            </Text>
            <Text style={{ ...styles.userEmail, color: colors.text }}>{user?.email}</Text>
            <Text style={styles.profileTypeBadge}>
              {profileType.charAt(0).toUpperCase() + profileType.slice(1)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                saveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <Ionicons name={isEditing ? "checkmark" : "pencil"} size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Basic Information */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
        {/* <View style={styles.inputRow}> */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>First Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={profile.firstName}
            onChangeText={(text) => setProfile({ ...profile, firstName: text })}
            placeholder="First Name"
            placeholderTextColor={colors.inputPlaceholder}
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Middle Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={profile.middleName}
            onChangeText={(text) => setProfile({ ...profile, middleName: text })}
            placeholder="Middle Name"
            placeholderTextColor={colors.inputPlaceholder}
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Last Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={profile.lastName}
            onChangeText={(text) => setProfile({ ...profile, lastName: text })}
            placeholder="Last Name"
            placeholderTextColor={colors.inputPlaceholder}
            editable={isEditing}
          />
        </View>
        {/* </View> */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            placeholder="Phone Number"
            placeholderTextColor={colors.inputPlaceholder}
            keyboardType="phone-pad"
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Location</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={profile.location}
            onChangeText={(text) => setProfile({ ...profile, location: text })}
            placeholder="City, Country"
            placeholderTextColor={colors.inputPlaceholder}
            editable={isEditing}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Bio</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            placeholder="Tell us about yourself..."
            placeholderTextColor={colors.inputPlaceholder}
            multiline
            numberOfLines={3}
            editable={isEditing}
          />
        </View>
      </View>

      {/* Profile Type Selector */}
      <View style={[styles.profileTypeContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Type</Text>
        <View style={styles.profileTypeButtons}>
          {[
            { type: "tenant" as ProfileType, label: "Tenant", icon: "home-outline" },
            { type: "buyer" as ProfileType, label: "Buyer", icon: "home-outline" },
            { type: "seller" as ProfileType, label: "Seller", icon: "home-outline" },
            { type: "landlord" as ProfileType, label: "Landlord", icon: "business-outline" },
            { type: "agent" as ProfileType, label: "Agent", icon: "person-outline" },
          ].map(({ type, label, icon }) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.profileTypeButton,
                { borderColor: colors.border, backgroundColor: colors.surface },
                profileType === type && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => {
                setProfileType(type);
                setProfile({ ...profile, profileType: type });
              }}
            >
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={profileType === type ? colors.buttonText : colors.textSecondary}
              />
              <Text
                style={[
                  styles.profileTypeText,
                  { color: colors.textSecondary },
                  profileType === type && { color: colors.buttonText },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Preferred Property Types (for tenant/buyer/seller/landlord) */}
      {renderPropertyTypeSelector()}

      {/* Profile Type Specific Information */}
      {renderProfileSpecificInfo()}

      {/* Settings Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

        {/* Color Scheme Setting */}
        <View style={styles.settingItem}>
          <View>
            <View style={styles.settingsSubHeading}>
              <Ionicons name="color-palette-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Color Scheme</Text>
            </View>
            <View style={styles.colorSchemeSelector}>
              {[
                { value: "light" as const, label: "Light", icon: "sunny-outline" },
                { value: "dark" as const, label: "Dark", icon: "moon-outline" },
                { value: "device" as const, label: "Device", icon: "phone-portrait-outline" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.colorSchemeOption,
                    colorScheme === option.value && styles.colorSchemeOptionActive,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => setColorScheme(option.value)}
                >
                  <Ionicons
                    name={option.icon as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={colorScheme === option.value ? colors.buttonText : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.colorSchemeOptionText,
                      {
                        color:
                          colorScheme === option.value ? colors.buttonText : colors.textSecondary,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="shield-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Privacy</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.settingText, { color: colors.text }]}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.card }]}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.error} />
        <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  profileTypeBadge: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  editButton: {
    padding: 10,
  },
  profileTypeContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  profileTypeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  profileTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    gap: 8,
  },
  profileTypeButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  profileTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  profileTypeTextActive: {
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputRow: {
    flexDirection: "row",
    gap: 15,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingsSubHeading: {
    flexDirection: "row",
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  colorSchemeSelector: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  colorSchemeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  colorSchemeOptionActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  colorSchemeOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6b6b",
    marginLeft: 10,
  },
  bottomSpacer: {
    height: 30,
  },
});
