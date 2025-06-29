import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@hooks/useAuth';
import { LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PatientScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image
            source={{ uri: user?.profileImage || 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user?.fullName || 'Patient'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color="#8B5A9F" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image
            source={{ uri: user?.profileImage || 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user?.fullName || 'Patient'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Details</Text>
          <Text style={styles.detail}>Phone: {user?.phone || 'N/A'}</Text>
          <Text style={styles.detail}>Role: {user?.role || 'N/A'}</Text>
          {/* Add more patient details as needed */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 8,
  },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#8B5A9F', marginBottom: 4 },
  email: { fontSize: 16, color: '#6B7280', marginBottom: 8 },
  logoutButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  content: { padding: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  detail: { fontSize: 16, color: '#374151', marginBottom: 4 },
});