import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  Brain, 
  Calendar,
  MessageCircle,
  Camera,
  Users,
  Star,
  Clock
} from 'lucide-react-native';

import { useAuth } from '@hooks/useAuth';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const recentMemories = [
    {
      id: 1,
      title: "Wedding Day",
      date: "June 15, 1985",
      image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400",
      emotion: "Joy"
    },
    {
      id: 2,
      title: "First Grandchild",
      date: "March 22, 1995",
      image: "https://images.pexels.com/photos/1648375/pexels-photo-1648375.jpeg?auto=compress&cs=tinysrgb&w=400",
      emotion: "Love"
    },
    {
      id: 3,
      title: "Family Vacation",
      date: "July 10, 1990",
      image: "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400",
      emotion: "Happiness"
    }
  ];

  const quickActions = [
    { 
      icon: MessageCircle, 
      title: "Talk to Memories", 
      subtitle: "Chat about your past",
      color: "#6B9BD8",
      bgColor: "#EBF4FF",
      onPress: () => router.push('/chat')
    },
    { 
      icon: Camera, 
      title: "Add Memory", 
      subtitle: "Capture new moments",
      color: "#7BB686",
      bgColor: "#F0F9F4",
      onPress: () => router.push('/add-memory'),
    },
    { 
      icon: Clock, 
      title: "Daily Routine", 
      subtitle: "View today's schedule",
      color: "#E17B47",
      bgColor: "#FFF7ED"
    },
    { 
      icon: Users, 
      title: "Family Circle", 
      subtitle: "Connect with loved ones",
      color: "#8B5A9F",
      bgColor: "#F3E8FF"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=200" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Memory of the Day */}
        <LinearGradient
          colors={['#8B5A9F', '#6B9BD8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.memoryCard}
        >
          <View style={styles.memoryCardContent}>
            <View style={styles.memoryCardText}>
              <Text style={styles.memoryCardTitle}>Memory of the Day</Text>
              <Text style={styles.memoryCardSubtitle}>
                Remember your beautiful wedding day at the countryside chapel? 
                The sun was shining, and you wore your grandmother's pearl necklace.
              </Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore Memory</Text>
                <Heart size={16} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Image 
              source={{ uri: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=300" }}
              style={styles.memoryCardImage}
            />
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
              key={index} 
              style={[styles.quickActionCard, { backgroundColor: action.bgColor }]}
              onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Memories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Memories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memoriesScroll}>
            {recentMemories.map((memory) => (
              <TouchableOpacity key={memory.id} style={styles.memoryItem}>
                <Image source={{ uri: memory.image }} style={styles.memoryItemImage} />
                <View style={styles.memoryItemContent}>
                  <Text style={styles.memoryItemTitle}>{memory.title}</Text>
                  <Text style={styles.memoryItemDate}>{memory.date}</Text>
                  <View style={styles.memoryItemEmotion}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.memoryItemEmotionText}>{memory.emotion}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Daily Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Brain size={24} color="#8B5A9F" strokeWidth={2} />
              <Text style={styles.insightTitle}>Memory Activity</Text>
            </View>
            <Text style={styles.insightText}>
              You've engaged with 3 memories today and shared 2 stories with your family. 
              Keep up the great work connecting with your past!
            </Text>
            <View style={styles.insightStats}>
              <View style={styles.insightStatItem}>
                <Text style={styles.insightStatNumber}>12</Text>
                <Text style={styles.insightStatLabel}>Memories Viewed</Text>
              </View>
              <View style={styles.insightStatItem}>
                <Text style={styles.insightStatNumber}>5</Text>
                <Text style={styles.insightStatLabel}>Stories Shared</Text>
              </View>
              <View style={styles.insightStatItem}>
                <Text style={styles.insightStatNumber}>8</Text>
                <Text style={styles.insightStatLabel}>Family Chats</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  profileButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  memoryCard: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  memoryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryCardText: {
    flex: 1,
    paddingRight: 16,
  },
  memoryCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  memoryCardSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Inter-SemiBold',
  },
  memoryCardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  section: {
    paddingHorizontal: 20,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  memoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  memoryItem: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  memoryItemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  memoryItemContent: {
    padding: 12,
  },
  memoryItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  memoryItemDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  memoryItemEmotion: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryItemEmotionText: {
    fontSize: 12,
    color: '#F59E0B',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
    fontFamily: 'Inter-SemiBold',
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  insightStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightStatItem: {
    alignItems: 'center',
  },
  insightStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5A9F',
    fontFamily: 'Inter-Bold',
  },
  insightStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});