import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Modal,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Bell, Settings, Heart, Brain, Activity, Calendar, MessageSquare, Phone, Mail, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, User, CreditCard as Edit3, Shield, Eye, X } from 'lucide-react-native';

import { LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';

export default function CaregiverScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [newCaregiverName, setNewCaregiverName] = useState('');
  const [newCaregiverPhone, setNewCaregiverPhone] = useState('');
  const [newCaregiverEmail, setNewCaregiverEmail] = useState('');

  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const caregivers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Primary Physician',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcenter.com',
      image: 'https://images.pexels.com/photos/559827/pexels-photo-559827.jpeg?auto=compress&cs=tinysrgb&w=200',
      status: 'active',
      lastContact: '2 hours ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Son / Primary Caregiver',
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@email.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      status: 'active',
      lastContact: '30 minutes ago'
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Home Care Nurse',
      phone: '+1 (555) 345-6789',
      email: 'emma.davis@homecare.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200',
      status: 'active',
      lastContact: '1 day ago'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'concern',
      title: 'Memory Pattern Alert',
      message: 'Margaret showed confusion about family names during today\'s conversation',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'success',
      title: 'Positive Interaction',
      message: 'Successfully recalled wedding day memories with high engagement',
      time: '5 hours ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Medication Reminder Missed',
      message: 'Evening medication reminder was not acknowledged',
      time: '1 day ago',
      severity: 'high'
    }
  ];

  const insights = [
    { label: 'Memory Interactions', value: '23', change: '+12%', positive: true },
    { label: 'Conversation Time', value: '2h 15m', change: '+8%', positive: true },
    { label: 'Recognition Rate', value: '78%', change: '-3%', positive: false },
    { label: 'Engagement Score', value: '8.2/10', change: '+0.5', positive: true }
  ];

  const addCaregiver = () => {
    if (newCaregiverName && newCaregiverPhone) {
      Alert.alert('Success', 'Caregiver has been added to the care team');
      setModalVisible(false);
      setNewCaregiverName('');
      setNewCaregiverPhone('');
      setNewCaregiverEmail('');
    } else {
      Alert.alert('Error', 'Please fill in all required fields');
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'concern':
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#D97706';
      case 'low':
        return '#059669';
      default:
        return '#6B7280';
    }
  };

  const renderDashboard = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Patient Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Overview</Text>
        <View style={styles.patientCard}>
          <Image 
            source={{ uri: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150" }}
            style={styles.patientImage}
          />
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>Margaret Johnson</Text>
            <Text style={styles.patientAge}>Age 78 • Alzheimer's Stage 2</Text>
            <Text style={styles.patientStatus}>Last active: 45 minutes ago</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Key Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Insights</Text>
        <View style={styles.insightsGrid}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <Text style={styles.insightValue}>{insight.value}</Text>
              <Text style={styles.insightLabel}>{insight.label}</Text>
              <Text style={[
                styles.insightChange,
                { color: insight.positive ? '#059669' : '#DC2626' }
              ]}>
                {insight.change}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {alerts.slice(0, 3).map((alert) => {
          const AlertIcon = getAlertIcon(alert.type);
          return (
            <TouchableOpacity key={alert.id} style={styles.alertCard}>
              <View style={[styles.alertIcon, { backgroundColor: `${getAlertColor(alert.severity)}20` }]}>
                <AlertIcon size={20} color={getAlertColor(alert.severity)} strokeWidth={2} />
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{alert.time}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Brain size={24} color="#8B5A9F" strokeWidth={2} />
            <Text style={styles.quickActionText}>Memory Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <MessageSquare size={24} color="#6B9BD8" strokeWidth={2} />
            <Text style={styles.quickActionText}>Send Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Calendar size={24} color="#E17B47" strokeWidth={2} />
            <Text style={styles.quickActionText}>Schedule Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Activity size={24} color="#7BB686" strokeWidth={2} />
            <Text style={styles.quickActionText}>Activity Log</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderCareTeam = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Care Team</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={20} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {caregivers.map((caregiver) => (
          <TouchableOpacity key={caregiver.id} style={styles.caregiverCard}>
            <Image source={{ uri: caregiver.image }} style={styles.caregiverImage} />
            <View style={styles.caregiverInfo}>
              <Text style={styles.caregiverName}>{caregiver.name}</Text>
              <Text style={styles.caregiverRole}>{caregiver.role}</Text>
              <Text style={styles.caregiverContact}>Last contact: {caregiver.lastContact}</Text>
            </View>
            <View style={styles.caregiverActions}>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={18} color="#8B5A9F" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Mail size={18} color="#8B5A9F" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Permissions & Access */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Access & Permissions</Text>
        <View style={styles.permissionCard}>
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Shield size={20} color="#8B5A9F" strokeWidth={2} />
              <Text style={styles.permissionText}>Data Access</Text>
            </View>
            <Switch value={true} />
          </View>
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Eye size={20} color="#8B5A9F" strokeWidth={2} />
              <Text style={styles.permissionText}>Memory Monitoring</Text>
            </View>
            <Switch value={true} />
          </View>
          <View style={styles.permissionRow}>
            <View style={styles.permissionInfo}>
              <Bell size={20} color="#8B5A9F" strokeWidth={2} />
              <Text style={styles.permissionText}>Alert Notifications</Text>
            </View>
            <Switch value={false} />
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Care Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage care and monitor well-being</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#8B5A9F" strokeWidth={2} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={22} color="#8B5A9F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Activity size={20} color={activeTab === 'dashboard' ? '#8B5A9F' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'team' && styles.activeTab]}
          onPress={() => setActiveTab('team')}
        >
          <Users size={20} color={activeTab === 'team' ? '#8B5A9F' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>
            Care Team
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'dashboard' ? renderDashboard() : renderCareTeam()}
      </View>

      {/* Add Caregiver Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Care Team Member</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCaregiverName}
                  onChangeText={setNewCaregiverName}
                  placeholder="Enter full name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCaregiverPhone}
                  onChangeText={setNewCaregiverPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCaregiverEmail}
                  onChangeText={setNewCaregiverEmail}
                  placeholder="Enter email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                />
              </View>
              
              <TouchableOpacity style={styles.addCaregiverButton} onPress={addCaregiver}>
                <Text style={styles.addCaregiverButtonText}>Add to Care Team</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#F3E8FF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: '#8B5A9F',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B5A9F',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  patientAge: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  patientStatus: {
    fontSize: 12,
    color: '#059669',
    fontFamily: 'Inter-Regular',
  },
  settingsButton: {
    padding: 8,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  insightCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  insightLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  insightChange: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  alertMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  alertTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    color: '#111827',
    marginTop: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    backgroundColor: '#8B5A9F',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caregiverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  caregiverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  caregiverRole: {
    fontSize: 14,
    color: '#8B5A9F',
    marginBottom: 2,
    fontFamily: 'Inter-Medium',
  },
  caregiverContact: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  caregiverActions: {
    flexDirection: 'row',
  },
  contactButton: {
    padding: 8,
    marginLeft: 4,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  addCaregiverButton: {
    backgroundColor: '#8B5A9F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  addCaregiverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  logoutButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});