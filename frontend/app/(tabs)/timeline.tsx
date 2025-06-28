import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Users,
  Heart,
  Camera,
  Music,
  Briefcase,
  GraduationCap
} from 'lucide-react-native';

export default function TimelineScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('All');

  const decades = ['All', '2020s', '2010s', '2000s', '1990s', '1980s', '1970s'];

  const timelineEvents = [
    {
      id: 1,
      year: '2023',
      month: 'March',
      title: 'Golden Anniversary Celebration',
      description: 'Celebrated 50 years of marriage with family and friends',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'celebration',
      icon: Heart,
      color: '#F59E0B',
      location: 'Family Home'
    },
    {
      id: 2,
      year: '2022',
      month: 'July',
      title: "Grandson's Graduation",
      description: 'Watched Tommy graduate from college with honors',
      image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'family',
      icon: GraduationCap,
      color: '#8B5A9F',
      location: 'University Hall'
    },
    {
      id: 3,
      year: '2021',
      month: 'December',
      title: 'Christmas Family Reunion',
      description: 'All the grandchildren came home for the holidays',
      image: 'https://images.pexels.com/photos/1648375/pexels-photo-1648375.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'family',
      icon: Users,
      color: '#DC2626',
      location: 'Living Room'
    },
    {
      id: 4,
      year: '2019',
      month: 'September',
      title: 'Retirement Party',
      description: 'Retired after 40 years of dedicated service',
      image: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'career',
      icon: Briefcase,
      color: '#059669',
      location: 'Office Building'
    },
    {
      id: 5,
      year: '2015',
      month: 'June',
      title: 'Trip to Europe',
      description: 'Wonderful vacation visiting Paris, Rome, and London',
      image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'travel',
      icon: Camera,
      color: '#7C3AED',
      location: 'Europe'
    },
    {
      id: 6,
      year: '1995',
      month: 'April',
      title: 'First Grandchild Born',
      description: 'Sarah was born, bringing joy to the entire family',
      image: 'https://images.pexels.com/photos/1648375/pexels-photo-1648375.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'family',
      icon: Heart,
      color: '#EC4899',
      location: 'City Hospital'
    },
    {
      id: 7,
      year: '1985',
      month: 'June',
      title: 'Wedding Day',
      description: 'Married the love of my life at the countryside chapel',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
      type: 'celebration',
      icon: Heart,
      color: '#F59E0B',
      location: 'St. Mary\'s Chapel'
    }
  ];

  const getFilteredEvents = () => {
    let filtered = timelineEvents;
    
    if (selectedDecade !== 'All') {
      const decadeStart = parseInt(selectedDecade.substring(0, 4));
      filtered = filtered.filter(event => {
        const eventYear = parseInt(event.year);
        return eventYear >= decadeStart && eventYear < decadeStart + 10;
      });
    }
    
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Memory Timeline</Text>
        <Text style={styles.headerSubtitle}>Your life's beautiful journey</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search memories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#8B5A9F" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Decade Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.decadeFilter}
        contentContainerStyle={styles.decadeFilterContent}
      >
        {decades.map((decade) => (
          <TouchableOpacity
            key={decade}
            style={[
              styles.decadeButton,
              selectedDecade === decade && styles.decadeButtonActive
            ]}
            onPress={() => setSelectedDecade(decade)}
          >
            <Text style={[
              styles.decadeButtonText,
              selectedDecade === decade && styles.decadeButtonTextActive
            ]}>
              {decade}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Timeline */}
      <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
        {getFilteredEvents().map((event, index) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={styles.timelineDate}>
                <Text style={styles.timelineYear}>{event.year}</Text>
                <Text style={styles.timelineMonth}>{event.month}</Text>
              </View>
              <View style={styles.timelineLine}>
                <View style={[styles.timelineDot, { backgroundColor: event.color }]}>
                  <event.icon size={16} color="#FFFFFF" strokeWidth={2} />
                </View>
                {index < getFilteredEvents().length - 1 && (
                  <View style={styles.timelineConnector} />
                )}
              </View>
            </View>
            
            <TouchableOpacity style={styles.timelineContent}>
              <Image source={{ uri: event.image }} style={styles.timelineImage} />
              <View style={styles.timelineText}>
                <Text style={styles.timelineTitle}>{event.title}</Text>
                <Text style={styles.timelineDescription}>{event.description}</Text>
                <View style={styles.timelineLocation}>
                  <MapPin size={14} color="#6B7280" strokeWidth={2} />
                  <Text style={styles.timelineLocationText}>{event.location}</Text>
                </View>
                <View style={styles.timelineActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Share Story</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  decadeFilter: {
    marginBottom: 16,
  },
  decadeFilterContent: {
    paddingHorizontal: 20,
  },
  decadeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  decadeButtonActive: {
    backgroundColor: '#8B5A9F',
    borderColor: '#8B5A9F',
  },
  decadeButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  decadeButtonTextActive: {
    color: '#FFFFFF',
  },
  timeline: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDate: {
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  timelineMonth: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  timelineLine: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineConnector: {
    width: 2,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineImage: {
    width: '100%',
    height: 150,
  },
  timelineText: {
    padding: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  timelineLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineLocationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: 'Inter-Regular',
  },
  timelineActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F3E8FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#8B5A9F',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});