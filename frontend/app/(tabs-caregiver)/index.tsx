import React, { useState, useEffect } from 'react';
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
  Alert,
  Dimensions,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, 
  Users, 
  Bell, 
  Settings, 
  Heart, 
  Brain, 
  Activity, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  X,
  LogOut,
  Camera,
  Mic,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Star,
  Zap,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
  Smile,
  Frown,
  Meh,
  Pill,
  Music,
  Shield,
  Eye,
  Play,
  Pause,
  Send,
  Target,
  Award,
  Flower,
  Sun,
  Moon,
  Coffee
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';

const { width } = Dimensions.get('window');

export default function CaregiverScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalVisible, setModalVisible] = useState(false);
  const [memoryStudioVisible, setMemoryStudioVisible] = useState(false);
  const [newCaregiverName, setNewCaregiverName] = useState('');
  const [newCaregiverPhone, setNewCaregiverPhone] = useState('');
  const [newCaregiverEmail, setNewCaregiverEmail] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [playingMusic, setPlayingMusic] = useState(false);
  const [memorySessionActive, setMemorySessionActive] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    const scaleIn = Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });

    pulseAnimation.start();
    fadeIn.start();
    scaleIn.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleMemorySession = () => {
    setMemorySessionActive(!memorySessionActive);
    Alert.alert(
      memorySessionActive ? 'Session Ended' : 'Memory Session Started',
      memorySessionActive ? 'Great session with Margaret!' : 'Margaret is ready for memories!'
    );
  };

  const handleMusicToggle = () => {
    setPlayingMusic(!playingMusic);
    Alert.alert(
      playingMusic ? 'Music Paused' : 'Music Playing',
      playingMusic ? 'Classical music paused' : 'Playing Margaret\'s favorite classical music'
    );
  };

  // Enhanced patient data
  const patientData = {
    name: 'Margaret Johnson',
    nickname: 'Maggie',
    age: 78,
    stage: 'Early Stage Alzheimer\'s',
    profileImage: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150',
    currentMood: 'content',
    currentActivity: 'Listening to classical music',
    location: 'Living Room',
    timeOfDay: 'Morning',
    weather: 'Sunny',
  };

  // Memory reconstruction data
  const memoryQueue = [
    {
      id: 1,
      title: 'Wedding Day Memories',
      content: 'Processing wedding photos from 1967',
      status: 'processing',
      icon: Camera,
      color: '#EC4899',
      progress: 75
    },
    {
      id: 2,
      title: 'Grandchildren\'s Voices',
      content: 'Family conversation ready',
      status: 'ready',
      icon: Mic,
      color: '#10B981',
      progress: 100
    },
    {
      id: 3,
      title: 'Love Letters',
      content: 'Creating story from letters',
      status: 'pending',
      icon: FileText,
      color: '#F59E0B',
      progress: 30
    }
  ];

  // AI insights
  const aiInsights = [
    { text: 'Wedding photos show best engagement at 10 AM', icon: '🌅' },
    { text: 'Classical music triggers positive memories', icon: '🎵' },
    { text: 'Family names remain challenging area', icon: '👥' }
  ];

  // Care suggestions
  const caregiverSuggestions = [
    {
      id: 1,
      title: 'Perfect Memory Time',
      description: 'Margaret responds best to photos around 10 AM',
      action: 'Start Memory Session',
      priority: 'high',
      icon: Brain,
      color: '#8B5A9F',
      emoji: '🧠'
    },
    {
      id: 2,
      title: 'Music Therapy',
      description: 'Classical music showed 91% engagement',
      action: 'Play Playlist',
      priority: 'medium',
      icon: Music,
      color: '#10B981',
      emoji: '🎼'
    },
    {
      id: 3,
      title: 'Medication Reminder',
      description: 'Evening medications due soon',
      action: 'Set Reminder',
      priority: 'high',
      icon: Pill,
      color: '#F59E0B',
      emoji: '💊'
    }
  ];

  // Recent interactions
  const recentInteractions = [
    {
      id: 1,
      memory: 'Wedding Day - June 15, 1967',
      duration: '12 min',
      engagement: 95,
      timestamp: '2 hours ago',
      emotion: 'joyful',
      emoji: '💕'
    },
    {
      id: 2,
      memory: 'Tommy\'s First Birthday',
      duration: '8 min',
      engagement: 87,
      timestamp: '4 hours ago',
      emotion: 'happy',
      emoji: '🎂'
    },
    {
      id: 3,
      memory: 'Garden in Spring',
      duration: '15 min',
      engagement: 92,
      timestamp: '6 hours ago',
      emotion: 'peaceful',
      emoji: '🌸'
    }
  ];

  // Care team
  const caregivers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Primary Physician',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@healthcenter.com',
      image: 'https://images.pexels.com/photos/559827/pexels-photo-559827.jpeg?auto=compress&cs=tinysrgb&w=200',
      status: 'active',
      emergencyContact: true,
      lastContact: '2 days ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Son / Primary Caregiver',
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@email.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
      status: 'active',
      emergencyContact: true,
      lastContact: '1 hour ago'
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Memory Care Specialist',
      phone: '+1 (555) 345-6789',
      email: 'emma.davis@memorycare.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200',
      status: 'active',
      emergencyContact: false,
      lastContact: '5 hours ago'
    }
  ];

  // Smart alerts
  const alerts = [
    {
      id: 1,
      type: 'concern',
      title: 'Memory Pattern Alert',
      message: 'Confusion about family names - suggest labeled photos',
      time: '2 hours ago',
      severity: 'medium',
      actionTaken: false,
      emoji: '🤔'
    },
    {
      id: 2,
      type: 'success',
      title: 'Positive Memory Session',
      message: 'Wedding memories recalled with 95% accuracy',
      time: '5 hours ago',
      severity: 'low',
      actionTaken: true,
      emoji: '✨'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Medication Reminder',
      message: 'Evening medication reminder missed',
      time: '1 day ago',
      severity: 'high',
      actionTaken: false,
      emoji: '⚠️'
    }
  ];

  // Performance metrics
  const insights = [
    { 
      label: 'Memory Score', 
      value: '7.8/10', 
      change: '+0.5', 
      positive: true,
      emoji: '🧠'
    },
    { 
      label: 'Engagement', 
      value: '92%', 
      change: '+8%', 
      positive: true,
      emoji: '💝'
    },
    { 
      label: 'Recognition', 
      value: '78%', 
      change: '-3%', 
      positive: false,
      emoji: '👁️'
    },
    { 
      label: 'Mood Score', 
      value: '8.2/10', 
      change: '+0.7', 
      positive: true,
      emoji: '😊'
    }
  ];

  const addCaregiver = () => {
    if (newCaregiverName && newCaregiverPhone) {
      Alert.alert('Success', 'Caregiver added to care team');
      setModalVisible(false);
      setNewCaregiverName('');
      setNewCaregiverPhone('');
      setNewCaregiverEmail('');
    } else {
      Alert.alert('Error', 'Please fill in required fields');
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'concern': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle2;
      default: return Bell;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high': return '#DC2626';
      case 'medium': return '#D97706';
      case 'low': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#F59E0B';
      case 'ready': return '#10B981';
      case 'pending': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const renderDashboard = () => (
    <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enhanced Patient Status */}
        <LinearGradient
          colors={['#FDF2F8', '#F3E8FF', '#E0F2FE']}
          style={styles.patientCard}
        >
          <View style={styles.patientInfo}>
            <View style={styles.patientLeft}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: patientData.profileImage }}
                  style={styles.patientImage}
                />
                <Animated.View style={[styles.statusDot, { transform: [{ scale: pulseAnim }] }]} />
              </View>
              <View style={styles.patientDetails}>
                <Text style={styles.patientName}>{patientData.name}</Text>
                <Text style={styles.patientMeta}>Age {patientData.age} • {patientData.stage}</Text>
                <View style={styles.activityRow}>
                  <View style={styles.activityContainer}>
                    <Music size={14} color="#059669" />
                    <Text style={styles.activityText}>{patientData.currentActivity}</Text>
                  </View>
                </View>
                <View style={styles.locationRow}>
                  <MapPin size={12} color="#6B7280" />
                  <Text style={styles.locationText}>{patientData.location}</Text>
                </View>
                <View style={styles.contextRow}>
                  <View style={styles.contextItem}>
                    <Sun size={12} color="#F59E0B" />
                    <Text style={styles.contextText}>{patientData.timeOfDay}</Text>
                  </View>
                  <View style={styles.contextItem}>
                    <Coffee size={12} color="#8B5A9F" />
                    <Text style={styles.contextText}>Alert & Active</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.patientRight}>
              <View style={styles.moodContainer}>
                <Smile size={28} color="#10B981" />
                <Text style={styles.moodText}>Content</Text>
                <Text style={styles.moodEmoji}>😊</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Interactive Memory Health */}
        <TouchableOpacity style={styles.card} onPress={() => Alert.alert('Memory Health', 'Detailed memory analysis available')}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={['#8B5A9F', '#EC4899']} style={styles.gradientIcon}>
              <Brain size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Memory Health</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>7.8</Text>
              <Text style={styles.scoreLabel}>Today</Text>
              <Text style={styles.scoreEmoji}>🧠</Text>
            </View>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricEmoji}>📚</Text>
              <Text style={styles.metricValue}>15</Text>
              <Text style={styles.metricLabel}>Memories</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricEmoji}>⏰</Text>
              <Text style={styles.metricValue}>2h 45m</Text>
              <Text style={styles.metricLabel}>Engagement</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricEmoji}>💚</Text>
              <Text style={styles.metricValue}>Positive</Text>
              <Text style={styles.metricLabel}>Mood</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Enhanced AI Insights */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.gradientIcon}>
              <Sparkles size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.cardTitle}>AI Insights</Text>
          </View>
          {aiInsights.map((insight, index) => (
            <TouchableOpacity key={index} style={styles.insightItem}>
              <Text style={styles.insightEmoji}>{insight.icon}</Text>
              <Text style={styles.insightText}>{insight.text}</Text>
              <View style={styles.insightArrow}>
                <Text style={styles.insightArrowText}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Insights</Text>
            <Zap size={16} color="#F59E0B" />
          </TouchableOpacity>
        </View>

        {/* Enhanced Memory Studio */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={['#EC4899', '#8B5A9F']} style={styles.gradientIcon}>
              <Sparkles size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Memory Studio</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setMemoryStudioVisible(true)}
            >
              <Plus size={16} color="#EC4899" />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {memoryQueue.map((item) => (
              <TouchableOpacity key={item.id} style={styles.memoryItem}>
                <View style={[styles.memoryIcon, { backgroundColor: `${item.color}20` }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={styles.memoryTitle}>{item.title}</Text>
                <Text style={styles.memoryContent}>{item.content}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={styles.progressText}>{item.progress}%</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Interactive Smart Suggestions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.gradientIcon}>
              <Zap size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Smart Suggestions</Text>
          </View>
          {caregiverSuggestions.map((suggestion) => (
            <View key={suggestion.id} style={styles.suggestionItem}>
              <View style={styles.suggestionLeft}>
                <Text style={styles.suggestionEmoji}>{suggestion.emoji}</Text>
                <View style={styles.suggestionContent}>
                  <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                  <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
                </View>
              </View>
              <View style={styles.suggestionRight}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: suggestion.color }]}
                  onPress={() => {
                    if (suggestion.id === 1) handleMemorySession();
                    if (suggestion.id === 2) handleMusicToggle();
                    if (suggestion.id === 3) Alert.alert('Reminder Set', 'Medication reminder has been set');
                  }}
                >
                  {suggestion.id === 1 && (memorySessionActive ? <Pause size={16} color="#FFFFFF" /> : <Play size={16} color="#FFFFFF" />)}
                  {suggestion.id === 2 && (playingMusic ? <Pause size={16} color="#FFFFFF" /> : <Play size={16} color="#FFFFFF" />)}
                  {suggestion.id === 3 && <Bell size={16} color="#FFFFFF" />}
                </TouchableOpacity>
                <View style={[styles.priorityBadge, { 
                  backgroundColor: suggestion.priority === 'high' ? '#FEF3C7' : '#F0FDF4'
                }]}>
                  <Text style={[styles.priorityText, {
                    color: suggestion.priority === 'high' ? '#D97706' : '#059669'
                  }]}>
                    {suggestion.priority}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Enhanced Performance Metrics */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={['#8B5A9F', '#6366F1']} style={styles.gradientIcon}>
              <TrendingUp size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Performance Metrics</Text>
          </View>
          <View style={styles.metricsGrid}>
            {insights.map((insight, index) => (
              <TouchableOpacity key={index} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricEmoji}>{insight.emoji}</Text>
                  <Text style={styles.metricValue}>{insight.value}</Text>
                  {insight.positive ? (
                    <TrendingUp size={16} color="#059669" />
                  ) : (
                    <TrendingDown size={16} color="#DC2626" />
                  )}
                </View>
                <Text style={styles.metricLabel}>{insight.label}</Text>
                <Text style={[styles.metricChange, { 
                  color: insight.positive ? '#059669' : '#DC2626' 
                }]}
                >
                  {insight.change}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced Recent Memory Sessions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={['#8B5A9F', '#EC4899']} style={styles.gradientIcon}>
              <Clock size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Recent Memory Sessions</Text>
          </View>
          {recentInteractions.map((interaction) => (
            <TouchableOpacity key={interaction.id} style={styles.interactionItem}>
              <Text style={styles.interactionEmoji}>{interaction.emoji}</Text>
              <View style={styles.interactionContent}>
                <Text style={styles.interactionTitle}>{interaction.memory}</Text>
                <View style={styles.interactionMeta}>
                  <Text style={styles.interactionTime}>{interaction.timestamp}</Text>
                  <Text style={styles.interactionDuration}>{interaction.duration}</Text>
                </View>
              </View>
              <View style={styles.engagementScore}>
                <Text style={styles.engagementText}>{interaction.engagement}%</Text>
                <Text style={styles.engagementLabel}>Engagement</Text>
                <View style={styles.engagementBar}>
                  <View style={[styles.engagementFill, { width: `${interaction.engagement}%` }]} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Smart Alerts */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.gradientIcon}>
              <Bell size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.cardTitle}>Smart Alerts</Text>
          </View>
          {alerts.slice(0, 3).map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            return (
              <TouchableOpacity key={alert.id} style={styles.alertItem}>
                <Text style={styles.alertEmoji}>{alert.emoji}</Text>
                <Animated.View 
                  style={[
                    styles.alertIcon, 
                    { 
                      backgroundColor: `${getAlertColor(alert.severity)}20`,
                      transform: alert.severity === 'high' ? [{ scale: pulseAnim }] : [{ scale: 1 }]
                    }
                  ]}
                >
                  <AlertIcon size={16} color={getAlertColor(alert.severity)} />
                </Animated.View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                {!alert.actionTaken && (
                  <TouchableOpacity 
                    style={styles.alertAction}
                    onPress={() => Alert.alert('Action Taken', 'Alert has been addressed')}
                  >
                    <CheckCircle2 size={16} color="#10B981" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Enhanced Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient colors={['#8B5A9F', '#EC4899']} style={styles.quickActionGradient}>
                <Brain size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Memory Report</Text>
              <Text style={styles.quickActionEmoji}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient colors={['#6B9BD8', '#3B82F6']} style={styles.quickActionGradient}>
                <MessageSquare size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Start Chat</Text>
              <Text style={styles.quickActionEmoji}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient colors={['#E17B47', '#F59E0B']} style={styles.quickActionGradient}>
                <Calendar size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Schedule Care</Text>
              <Text style={styles.quickActionEmoji}>📅</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <LinearGradient colors={['#7BB686', '#10B981']} style={styles.quickActionGradient}>
                <Activity size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Activity Log</Text>
              <Text style={styles.quickActionEmoji}>📈</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.floatingActionButton} onPress={() => Alert.alert('Emergency', 'Emergency contact has been notified')}>
          <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.fabGradient}>
            <Phone size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );

  const renderCareTeam = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <LinearGradient colors={['#8B5A9F', '#EC4899']} style={styles.gradientIcon}>
            <Users size={20} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.cardTitle}>Care Team</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Plus size={16} color="#8B5A9F" />
          </TouchableOpacity>
        </View>

        {caregivers.map((caregiver) => (
          <TouchableOpacity key={caregiver.id} style={styles.caregiverItem}>
            <View style={styles.caregiverLeft}>
              <View style={styles.caregiverImageContainer}>
                <Image source={{ uri: caregiver.image }} style={styles.caregiverImage} />
                {caregiver.emergencyContact && (
                  <View style={styles.emergencyBadge}>
                    <Shield size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <View style={styles.caregiverInfo}>
                <Text style={styles.caregiverName}>{caregiver.name}</Text>
                <Text style={styles.caregiverRole}>{caregiver.role}</Text>
                <Text style={styles.caregiverLastContact}>Last contact: {caregiver.lastContact}</Text>
              </View>
            </View>
            <View style={styles.caregiverActions}>
              <TouchableOpacity style={styles.contactButton}>
                <Phone size={16} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <MessageSquare size={16} color="#6B9BD8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Mail size={16} color="#F59E0B" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Enhanced Permissions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <LinearGradient colors={['#10B981', '#059669']} style={styles.gradientIcon}>
            <Shield size={20} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.cardTitle}>Access & Permissions</Text>
        </View>
        <View style={styles.permissionItem}>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionEmoji}>🔒</Text>
            <Text style={styles.permissionText}>Memory Data Access</Text>
          </View>
          <Switch value={true} />
        </View>
        <View style={styles.permissionItem}>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionEmoji}>👁️</Text>
            <Text style={styles.permissionText}>24/7 Monitoring</Text>
          </View>
          <Switch value={true} />
        </View>
        <View style={styles.permissionItem}>
          <View style={styles.permissionInfo}>
            <Text style={styles.permissionEmoji}>🔔</Text>
            <Text style={styles.permissionText}>Smart Alerts</Text>
          </View>
          <Switch value={true} />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#FDF2F8', '#F3E8FF', '#E0F2FE']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#EC4899', '#8B5A9F']} style={styles.headerIcon}>
              <Heart size={24} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Care Dashboard</Text>
              <Text style={styles.headerSubtitle}>AI-Powered Memory Care ✨</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Bell size={20} color="#8B5A9F" />
              <Animated.View style={[styles.notificationBadge, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.notificationText}>3</Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Settings size={20} color="#8B5A9F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#8B5A9F" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Enhanced Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Activity size={20} color={activeTab === 'dashboard' ? '#8B5A9F' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
            Dashboard
          </Text>
          {activeTab === 'dashboard' && <Text style={styles.tabEmoji}>🏠</Text>}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'team' && styles.activeTab]}
          onPress={() => setActiveTab('team')}
        >
          <Users size={20} color={activeTab === 'team' ? '#8B5A9F' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'team' && styles.activeTabText]}>
            Care Team
          </Text>
          {activeTab === 'team' && <Text style={styles.tabEmoji}>👥</Text>}
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'dashboard' ? renderDashboard() : renderCareTeam()}

      {/* Enhanced Memory Studio Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={memoryStudioVisible}
        onRequestClose={() => setMemoryStudioVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient colors={['#FDF2F8', '#F3E8FF']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Memory Studio ✨</Text>
              <TouchableOpacity onPress={() => setMemoryStudioVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Upload content to create beautiful memory reconstructions 🌟
              </Text>
              <View style={styles.studioOptions}>
                <TouchableOpacity style={styles.studioOption}>
                  <LinearGradient colors={['#EC4899', '#F97316']} style={styles.studioOptionGradient}>
                    <Camera size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.studioOptionTitle}>Photos & Videos</Text>
                  <Text style={styles.studioOptionEmoji}>📸</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.studioOption}>
                  <LinearGradient colors={['#10B981', '#059669']} style={styles.studioOptionGradient}>
                    <Mic size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.studioOptionTitle}>Voice Recordings</Text>
                  <Text style={styles.studioOptionEmoji}>🎙️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.studioOption}>
                  <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.studioOptionGradient}>
                    <FileText size={32} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.studioOptionTitle}>Documents</Text>
                  <Text style={styles.studioOptionEmoji}>📝</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Enhanced Add Caregiver Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient colors={['#FDF2F8', '#F3E8FF']} style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Care Team Member 👥</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name 👤</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCaregiverName}
                  onChangeText={setNewCaregiverName}
                  placeholder="Enter full name"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number 📞</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCaregiverPhone}
                  onChangeText={setNewCaregiverPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address 📧</Text>
                <TextInput
                  style={styles.textInput}
                  value={newCaregiverEmail}
                  onChangeText={setNewCaregiverEmail}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
              </View>
              <TouchableOpacity style={styles.addCaregiverButton} onPress={addCaregiver}>
                <LinearGradient colors={['#8B5A9F', '#EC4899']} style={styles.addCaregiverGradient}>
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.addCaregiverButtonText}>Add to Care Team</Text>
                </LinearGradient>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  tabContainer: {
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
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#F3E8FF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#8B5A9F',
    fontWeight: '600',
  },
  tabEmoji: {
    fontSize: 14,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Enhanced Patient Card
  patientCard: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
  },
  patientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  patientMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  activityRow: {
    marginBottom: 4,
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  activityText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 4,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contextText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  patientRight: {
    alignItems: 'center',
  },
  moodContainer: {
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  moodText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  moodEmoji: {
    fontSize: 16,
    marginTop: 2,
  },

  // Enhanced Card Styles
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gradientIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D97706',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#D97706',
    marginTop: 2,
  },
  scoreEmoji: {
    fontSize: 14,
    marginTop: 2,
  },
  
  // Enhanced Metrics
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  metricEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },

  // Enhanced Insights
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  insightEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  insightArrow: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  insightArrowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
    marginRight: 8,
  },

  // Enhanced Memory Items
  memoryItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  memoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  memoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  memoryContent: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },

  // Enhanced Suggestions
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  suggestionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  suggestionRight: {
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
  },

  // Enhanced Interactions
  interactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  interactionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  interactionContent: {
    flex: 1,
  },
  interactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  interactionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  interactionDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  engagementScore: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginLeft: 12,
    minWidth: 70,
  },
  engagementText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  engagementLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  engagementBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 4,
  },
  engagementFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },

  // Enhanced Alerts
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  alertEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  alertIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  alertAction: {
    padding: 8,
  },

  // Enhanced Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionEmoji: {
    fontSize: 16,
  },

  // Floating Action Button
  floatingActionButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Enhanced Care Team
  caregiverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  caregiverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  caregiverImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  caregiverImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  emergencyBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
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
  caregiverLastContact: {
    fontSize: 12,
    color: '#6B7280',
  },
  caregiverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Enhanced Permissions
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 4,
  },

  // Buttons
  addButton: {
    backgroundColor: '#F3E8FF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
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
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  studioOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  studioOption: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  studioOptionGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  studioOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  addCaregiverButton: {
    backgroundColor: '#8B5A9F',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addCaregiverGradient: {
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCaregiverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});