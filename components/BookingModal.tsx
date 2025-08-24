import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { BookingService, CreateViewingRequest } from "@/services/bookingService";
import { Property } from "@/types/property";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  property: Property | null;
  onBookingSuccess?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  onClose,
  property,
  onBookingSuccess,
}) => {
  const { colors } = useColorScheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [clientMessage, setClientMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const getAvailableTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < endHour) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }

    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBooking = async () => {
    if (!property) return;

    setIsLoading(true);
    try {
      // Combine date and time
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(selectedTime.getHours());
      scheduledDateTime.setMinutes(selectedTime.getMinutes());
      scheduledDateTime.setSeconds(0);
      scheduledDateTime.setMilliseconds(0);

      const request: CreateViewingRequest = {
        property_id: property.id,
        scheduled_at: scheduledDateTime.toISOString(),
        client_message: clientMessage.trim() || undefined,
      };

      const { success, error } = await BookingService.createViewing(request);

      if (success) {
        Alert.alert(
          "Booking Successful!",
          "Your viewing request has been submitted. The property owner will be notified and will contact you to confirm the appointment.",
          [
            {
              text: "OK",
              onPress: () => {
                onClose();
                onBookingSuccess?.();
                // Reset form
                setSelectedDate(new Date());
                setSelectedTime(new Date());
                setClientMessage("");
              },
            },
          ],
        );
      } else {
        Alert.alert("Booking Failed", error || "Failed to create viewing request");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Error", "Failed to create viewing request");
    } finally {
      setIsLoading(false);
    }
  };

  const isDateValid = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected >= today;
  };

  if (!property) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Book a Viewing</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Property Info */}
          <View style={[styles.propertyInfo, { backgroundColor: colors.card }]}>
            <Text style={[styles.propertyTitle, { color: colors.text }]}>{property.title}</Text>
            <Text style={[styles.propertyLocation, { color: colors.textSecondary }]}>
              {property.area}, {property.town}
            </Text>
          </View>

          {/* Date Selection */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.dateTimeText, { color: colors.text }]}>
                {formatDate(selectedDate)}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Time Selection */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Time</Text>
            <TouchableOpacity
              style={[
                styles.dateTimeButton,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.dateTimeText, { color: colors.text }]}>
                {formatTime(selectedTime)}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Message */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Additional Message (Optional)
            </Text>
            <TextInput
              style={[
                styles.messageInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Add any special requests or questions..."
              placeholderTextColor={colors.textSecondary}
              value={clientMessage}
              onChangeText={setClientMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Booking Button */}
          <TouchableOpacity
            style={[
              styles.bookButton,
              {
                backgroundColor: isDateValid() ? colors.primary : colors.textSecondary,
              },
            ]}
            onPress={handleBooking}
            disabled={isLoading || !isDateValid()}
          >
            {isLoading ? (
              <Text style={[styles.bookButtonText, { color: colors.buttonText }]}>Booking...</Text>
            ) : (
              <Text style={[styles.bookButtonText, { color: colors.buttonText }]}>
                Book Viewing
              </Text>
            )}
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              The property owner will be notified of your request and will contact you to confirm
              the appointment.
            </Text>
          </View>
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
            minuteInterval={30}
          />
        )}
      </View>
    </Modal>
  );
};

export default BookingModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  propertyInfo: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateTimeText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    minHeight: 100,
  },
  bookButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
  },
});
