import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@hooks/useAuth';
import { 
  LogOut, 
  Heart, 
  MapPin, 
  Phone, 
  Calendar,
  User,
  Users,
  Stethoscope,
  Clock,
  Shield,
  Star,
  Award,
  Home,
  Camera,
  Music,
  Flower,
  Edit3,
  Settings,
  Bell,
  Activity
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function PatientScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Mock patient data - in real app, this would come from your backend
  const patientData = {
    ...user,
    fullName: user?.fullName || 'Margaret Thompson',
    nickname: 'Maggie',
    age: 78,
    dateOfBirth: '1945-03-15',
    address: '123 Maple Street, Springfield, IL 62704',
    emergencyContact: {
      name: 'Sarah Thompson (Daughter)',
      phone: '(555) 123-4567',
      relationship: 'Daughter'
    },
    medicalInfo: {
      primaryDoctor: 'Dr. Emily Johnson',
      diagnosis: 'Early Stage Alzheimer\'s',
      medications: ['Donepezil', 'Memantine', 'Vitamin D'],
      allergies: ['Penicillin', 'Shellfish'],
      bloodType: 'O+',
      lastCheckup: '2024-06-15'
    },
    caregivers: [
      { name: 'Sarah Thompson', role: 'Primary Caregiver', phone: '(555) 123-4567' },
      { name: 'Michael Thompson', role: 'Secondary Caregiver', phone: '(555) 987-6543' },
      { name: 'Jennifer Clarke', role: 'Professional Caregiver', phone: '(555) 555-0123' }
    ],
    interests: ['Gardening', 'Photography', 'Classical Music', 'Cooking', 'Reading'],
    memoryAids: {
      favoritePhotos: 4,
      voiceRecordings: 12,
      familyContacts: 8,
      importantNotes: 15
    },
    achievements: [
      { title: 'Memory Champion', description: 'Completed 30 days of memory exercises', icon: Award },
      { title: 'Social Butterfly', description: 'Connected with 5 family members this week', icon: Users },
      { title: 'Photo Keeper', description: 'Organized 100 precious memories', icon: Camera },
      { title: 'Music Lover', description: 'Listened to favorite songs 20 times', icon: Music }
    ]
  };

  const ProfileTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Personal Information */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <User size={20} color="#8B5A9F" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{patientData.fullName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nickname</Text>
            <Text style={styles.infoValue}>{patientData.nickname}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{patientData.age} years old</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{new Date(patientData.dateOfBirth).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Phone size={20} color="#10B981" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <MapPin size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.contactText}>{patientData.address}</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.contactText}>{patientData.phone || '(555) 123-4567'}</Text>
          </View>
        </View>
      </View>

      {/* Interests & Hobbies */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Heart size={20} color="#EC4899" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
        </View>
        <View style={styles.interestsGrid}>
          {patientData.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Flower size={14} color="#EC4899" strokeWidth={2} />
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Memory Aids */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Star size={20} color="#F59E0B" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Memory Aids</Text>
        </View>
        <View style={styles.memoryAidsGrid}>
          <View style={styles.memoryAidItem}>
            <Camera size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.memoryAidNumber}>{patientData.memoryAids.favoritePhotos}</Text>
            <Text style={styles.memoryAidLabel}>Favorite Photos</Text>
          </View>
          <View style={styles.memoryAidItem}>
            <Music size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.memoryAidNumber}>{patientData.memoryAids.voiceRecordings}</Text>
            <Text style={styles.memoryAidLabel}>Voice Recordings</Text>
          </View>
          <View style={styles.memoryAidItem}>
            <Users size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.memoryAidNumber}>{patientData.memoryAids.familyContacts}</Text>
            <Text style={styles.memoryAidLabel}>Family Contacts</Text>
          </View>
          <View style={styles.memoryAidItem}>
            <Edit3 size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.memoryAidNumber}>{patientData.memoryAids.importantNotes}</Text>
            <Text style={styles.memoryAidLabel}>Important Notes</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Award size={20} color="#7C3AED" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
        </View>
        <View style={styles.achievementsList}>
          {patientData.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <achievement.icon size={20} color="#7C3AED" strokeWidth={2} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const MedicalTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Medical Information */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Stethoscope size={20} color="#DC2626" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Medical Information</Text>
        </View>
        <View style={styles.medicalInfo}>
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Primary Doctor</Text>
            <Text style={styles.medicalValue}>{patientData.medicalInfo.primaryDoctor}</Text>
          </View>
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Diagnosis</Text>
            <Text style={styles.medicalValue}>{patientData.medicalInfo.diagnosis}</Text>
          </View>
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Blood Type</Text>
            <Text style={styles.medicalValue}>{patientData.medicalInfo.bloodType}</Text>
          </View>
          <View style={styles.medicalItem}>
            <Text style={styles.medicalLabel}>Last Checkup</Text>
            <Text style={styles.medicalValue}>{new Date(patientData.medicalInfo.lastCheckup).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>

      {/* Medications */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Activity size={20} color="#059669" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Current Medications</Text>
        </View>
        <View style={styles.medicationsList}>
          {patientData.medicalInfo.medications.map((medication, index) => (
            <View key={index} style={styles.medicationItem}>
              <View style={styles.medicationDot} />
              <Text style={styles.medicationName}>{medication}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Allergies */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Shield size={20} color="#EF4444" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Allergies</Text>
        </View>
        <View style={styles.allergiesList}>
          {patientData.medicalInfo.allergies.map((allergy, index) => (
            <View key={index} style={styles.allergyTag}>
              <Text style={styles.allergyText}>{allergy}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Emergency Contact */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Phone size={20} color="#F59E0B" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
        </View>
        <View style={styles.emergencyContact}>
          <Text style={styles.emergencyContactName}>{patientData.emergencyContact.name}</Text>
          <Text style={styles.emergencyContactPhone}>{patientData.emergencyContact.phone}</Text>
          <Text style={styles.emergencyContactRelation}>{patientData.emergencyContact.relationship}</Text>
        </View>
      </View>
    </ScrollView>
  );

  const CaregiverTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcon}>
            <Users size={20} color="#8B5A9F" strokeWidth={2} />
          </View>
          <Text style={styles.sectionTitle}>Care Team</Text>
        </View>
        <View style={styles.caregiversList}>
          {patientData.caregivers.map((caregiver, index) => (
            <View key={index} style={styles.caregiverItem}>
              <View style={styles.caregiverAvatar}>
                <User size={24} color="#8B5A9F" strokeWidth={2} />
              </View>
              <View style={styles.caregiverInfo}>
                <Text style={styles.caregiverName}>{caregiver.name}</Text>
                <Text style={styles.caregiverRole}>{caregiver.role}</Text>
                <Text style={styles.caregiverPhone}>{caregiver.phone}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Phone size={18} color="#10B981" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FDF2F8', '#F3E8FF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: patientData.profileImage || 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150' }}
                style={styles.profileImage}
              />
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Hello,</Text>
              <Text style={styles.name}>{patientData.nickname}</Text>
              <Text style={styles.subtitle}>Having a wonderful day</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={20} color="#8B5A9F" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={20} color="#8B5A9F" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#8B5A9F" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
        >
          <User size={18} color={activeTab === 'profile' ? '#8B5A9F' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'medical' && styles.activeTab]}
          onPress={() => setActiveTab('medical')}
        >
          <Stethoscope size={18} color={activeTab === 'medical' ? '#8B5A9F' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.tabText, activeTab === 'medical' && styles.activeTabText]}>Medical</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'caregivers' && styles.activeTab]}
          onPress={() => setActiveTab('caregivers')}
        >
          <Users size={18} color={activeTab === 'caregivers' ? '#8B5A9F' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.tabText, activeTab === 'caregivers' && styles.activeTabText]}>Care Team</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'medical' && <MedicalTab />}
      {activeTab === 'caregivers' && <CaregiverTab />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B5A9F',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#F3E8FF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#8B5A9F',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 4,
  },
  interestText: {
    fontSize: 14,
    color: '#BE185D',
    marginLeft: 6,
    fontWeight: '500',
  },
  memoryAidsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memoryAidItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  memoryAidNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D97706',
    marginTop: 8,
  },
  memoryAidLabel: {
    fontSize: 12,
    color: '#D97706',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  medicalInfo: {
    gap: 16,
  },
  medicalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  medicalLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  medicalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  medicationsList: {
    gap: 12,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  medicationName: {
    fontSize: 16,
    color: '#374151',
  },
  allergiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  allergyText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  emergencyContact: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  emergencyContactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  emergencyContactPhone: {
    fontSize: 16,
    color: '#D97706',
    fontWeight: '500',
    marginBottom: 4,
  },
  emergencyContactRelation: {
    fontSize: 14,
    color: '#6B7280',
  },
  caregiversList: {
    gap: 16,
  },
  caregiverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  caregiverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  caregiverRole: {
    fontSize: 14,
    color: '#8B5A9F',
    marginBottom: 2,
  },
  caregiverPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});