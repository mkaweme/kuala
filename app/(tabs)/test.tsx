import { useAuth } from "@/contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Button, Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

const test = () => {
  const { user } = useAuth();

  const [image, setImage] = useState<ImageSourcePropType | null>(null);
  // Ensure url and key are defined, or throw an error.
  if (!url || !key) {
    throw new Error("Missing Supabase URL or Key in environment variables.");
  }

  // Import AsyncStorage from @react-native-async-storage/async-storage
  // (import should be at the top of the file, but placed here for context)
  // import AsyncStorage from "@react-native-async-storage/async-storage";

  // const AsyncStorage = require("@react-native-async-storage/async-storage").default;

  const supabase = createClient(url, key, {
    auth: {
      storage: AsyncStorage,
      detectSessionInUrl: false,
    },
  });

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      return result.assets[0];
    }

    return null;
  }

  // async function uriToBlob(uri: string): Promise<Blob> {
  //   const response = await fetch(uri);
  //   return await response.blob();
  // }

  // async function uriToBlob(uri: string): Promise<Blob> {
  //   const base64 = await FileSystem.readAsStringAsync(uri, {
  //     encoding: FileSystem.EncodingType.Base64,
  //   });

  //   const byteCharacters = atob(base64);
  //   const byteNumbers = new Array(byteCharacters.length);

  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }

  //   const byteArray = new Uint8Array(byteNumbers);

  //   return new Blob([byteArray], { type: "image/jpeg" });
  // }

  async function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
  }

  async function uploadPhoto(uri: string, userId: string): Promise<string> {
    const arrayBuffer = await uriToArrayBuffer(uri);

    console.log(arrayBuffer instanceof ArrayBuffer); // true

    const fileExt = uri.split(".").pop() ?? "jpg";
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from("photos").upload(fileName, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: false,
    });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("photos").getPublicUrl(fileName);

    return data.publicUrl;
  }

  const handleUpload = async () => {
    if (!image) {
      console.error("No image selected for upload.");
      return;
    }
    console.log("Image: ", image);

    // Replace 'user.id' with correct user value if necessary
    const userId = user?.id ?? "default_user"; // Change as needed

    try {
      const publicUrl = await uploadPhoto(image.uri, userId); // Use safe userId, and user?.id check is above
      console.log("Uploaded image URL:", publicUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleFetchImage = async () => {
    if (!image) {
      console.error("No image selected for upload.");
      return;
    }
    console.log("Image: ", image);

    // Replace 'user.id' with correct user value if necessary
    const userId = user?.id ?? "default_user"; // Change as needed

    try {
      const { data, error } = await supabase.storage.from("photos").download("folder/avatar1.png");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <View>
      <Text>Image Upload</Text>
      <Button title="Pick Image" onPress={pickImage} />
      {image !== null && <Image source={{ uri: image.uri }} style={styles.image} />}
      <Button title="Upload" onPress={handleUpload} />
      <Button title="Fetch Image" onPress={handleFetchImage} />
    </View>
  );
};

export default test;

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 10,
  },
});
