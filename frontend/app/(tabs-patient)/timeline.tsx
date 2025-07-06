import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Flower,
  Sun,
  Cloud,
  Snowflake,
  Star,
  Leaf,
  Smile
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function PersonalMemoryCalendar() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [view, setView] = useState('calendar');

  const months = [
    { name: 'January', icon: Snowflake, color: '#dbeafe', accent: '#3b82f6', border: '#bfdbfe' },
    { name: 'February', icon: Heart, color: '#fce7f3', accent: '#ec4899', border: '#f9a8d4' },
    { name: 'March', icon: Flower, color: '#dcfce7', accent: '#22c55e', border: '#bbf7d0' },
    { name: 'April', icon: Flower, color: '#d1fae5', accent: '#10b981', border: '#a7f3d0' },
    { name: 'May', icon: Leaf, color: '#ecfccb', accent: '#84cc16', border: '#d9f99d' },
    { name: 'June', icon: Sun, color: '#fefce8', accent: '#eab308', border: '#fef08a' },
    { name: 'July', icon: Sun, color: '#fff7ed', accent: '#f97316', border: '#fed7aa' },
    { name: 'August', icon: Sun, color: '#fffbeb', accent: '#f59e0b', border: '#fde68a' },
    { name: 'September', icon: Leaf, color: '#f0fdfa', accent: '#14b8a6', border: '#99f6e4' },
    { name: 'October', icon: Leaf, color: '#fff7ed', accent: '#f97316', border: '#fed7aa' },
    { name: 'November', icon: Cloud, color: '#f9fafb', accent: '#6b7280', border: '#e5e7eb' },
    { name: 'December', icon: Snowflake, color: '#eef2ff', accent: '#6366f1', border: '#c7d2fe' }
  ];

  const timelineEvents = [
    {
      id: 1,
      year: 2024,
      month: 3, // April (0-indexed)
      day: 1,
      title: 'April Fools Day Fun',
      description: 'The grandkids tried to prank me with salt in the sugar bowl. We all had a good laugh.',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop',
      type: 'Family',
      location: 'Kitchen',
      time: '9:00 AM'
    },
    {
      id: 2,
      year: 2024,
      month: 3, // April
      day: 8,
      title: 'First Spring Flowers',
      description: 'The tulips I planted last fall are blooming beautifully in the front garden.',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
      type: 'Garden',
      location: 'Front Garden',
      time: '10:00 AM'
    },
    {
      id: 3,
      year: 2024,
      month: 3, // April
      day: 15,
      title: 'Easter with Family',
      description: 'A wonderful day with everyone together. The children found all the eggs in the garden.',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop',
      type: 'Family',
      location: 'Home',
      time: '2:00 PM'
    },
    {
      id: 4,
      year: 2024,
      month: 3, // April
      day: 23,
      title: 'Grandchildren Visit',
      description: 'Sarah and Tommy came over. We made chocolate chip cookies and they helped with the mixing.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      type: 'Family',
      location: 'Kitchen',
      time: '3:30 PM'
    },
    {
      id: 5,
      year: 2024,
      month: 2, // March
      day: 12,
      title: 'Birthday Celebration',
      description: 'My 75th birthday. Everyone sang happy birthday and we had my favorite chocolate cake.',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
      type: 'Special',
      location: 'Living Room',
      time: '6:00 PM'
    }
  ];

  const getMonthMemories = (monthIndex) => {
    return timelineEvents.filter(event => 
      event.month === monthIndex && event.year === selectedYear
    );
  };

  const getCurrentMonthMemories = () => {
    return timelineEvents.filter(event => 
      event.month === selectedMonth && event.year === selectedYear
    ).sort((a, b) => a.day - b.day); // Sort chronologically by day
  };

  const CalendarView = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fdf2f8" />
      {/* Compact Header */}
      <View style={styles.compactHeader}>
        <View style={styles.compactHeaderContent}>
          <View style={styles.compactHeaderLeft}>
            <View style={styles.compactIconContainer}>
              <Calendar size={20} color="#e11d48" />
            </View>
            <View>
              <Text style={styles.compactHeaderTitle}>Hello, Sarah</Text>
              <Text style={styles.compactHeaderSubtitle}>Your Memory Calendar</Text>
            </View>
          </View>
          
          <View style={styles.compactDateContainer}>
            <Text style={styles.compactDateValue}>
              {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Compact Year Navigation */}
      <View style={styles.compactYearNavigation}>
        <TouchableOpacity
          onPress={() => setSelectedYear(selectedYear - 1)}
          style={styles.compactYearButton}
        >
          <ChevronLeft size={18} color="#6b7280" />
        </TouchableOpacity>
        
        <Text style={styles.compactYearText}>
          {selectedYear}
        </Text>
        
        <TouchableOpacity
          onPress={() => setSelectedYear(selectedYear + 1)}
          style={styles.compactYearButton}
        >
          <ChevronRight size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Month Grid - 4 columns x 3 rows like traditional calendar */}
      <View style={styles.monthGrid}>
        {[0, 1, 2].map((rowIndex) => (
          <View key={rowIndex} style={styles.monthRow}>
            {[0, 1, 2, 3].map((colIndex) => {
              const monthIndex = rowIndex * 4 + colIndex;
              const month = months[monthIndex];
              const memories = getMonthMemories(monthIndex);
              const MonthIcon = month.icon;
              
              return (
                <TouchableOpacity
                  key={monthIndex}
                  onPress={() => {
                    setSelectedMonth(monthIndex);
                    setView('timeline');
                  }}
                  style={[styles.monthCard, { borderLeftColor: month.border }]}
                >
                  <View style={styles.monthCardContent}>
                    <View style={styles.monthStarContainer}>
                      <Star size={6} color="#d1d5db" />
                    </View>
                    
                    <View style={[styles.monthIconContainer, { backgroundColor: month.color }]}>
                      <MonthIcon size={16} color={month.accent} />
                    </View>
                    
                    <Text style={styles.monthName}>
                      {month.name.slice(0, 3)}
                    </Text>
                    
                    <View style={styles.memoryCounter}>
                      <View style={styles.memoryCounterBadge}>
                        <Text style={styles.memoryCounterText}>{memories.length}</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.memoryCounterLabel}>
                      {memories.length === 1 ? 'memory' : 'memories'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );

  const TimelineView = () => {
    const memories = getCurrentMonthMemories();
    const currentMonth = months[selectedMonth];
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fdf2f8" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.timelineHeader}>
              <TouchableOpacity
                onPress={() => setView('calendar')}
                style={styles.backButton}
              >
                <ArrowLeft size={24} color="#6b7280" />
              </TouchableOpacity>
              
              <View style={styles.timelineHeaderContent}>
                <View style={[styles.timelineMonthIcon, { backgroundColor: currentMonth.color }]}>
                  <currentMonth.icon size={24} color={currentMonth.accent} />
                </View>
                <View style={styles.timelineHeaderText}>
                  <Text style={styles.timelineTitle}>
                    {currentMonth.name} {selectedYear}
                  </Text>
                  <Text style={styles.timelineSubtitle}>
                    {memories.length > 0 ? 
                      `${memories.length} beautiful ${memories.length === 1 ? 'memory' : 'memories'} to revisit` :
                      'A month full of possibilities'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.timelineContainer}>
            {memories.length > 0 ? (
              <View style={styles.timeline}>
                {memories.map((memory, index) => (
                  <View key={memory.id} style={styles.timelineItem}>
                    {/* Timeline dot */}
                    <View style={styles.timelineDot}>
                      <View style={styles.timelineDotInner} />
                    </View>
                    
                    {/* Memory card */}
                    <View style={styles.memoryCard}>
                      {/* Date badge */}
                      <View style={styles.memoryDateBadge}>
                        <View style={styles.memoryDateLeft}>
                          <Star size={12} color="#be185d" />
                          <Text style={styles.memoryDateText}>Day {memory.day}</Text>
                        </View>
                        <View style={styles.memoryTypeBadge}>
                          <Text style={styles.memoryTypeText}>{memory.type}</Text>
                        </View>
                      </View>
                      
                      {/* Memory image */}
                      <Image 
                        source={{ uri: memory.image }}
                        style={styles.memoryImage}
                      />
                      
                      {/* Memory content */}
                      <View style={styles.memoryContent}>
                        <Text style={styles.memoryTitle}>
                          {memory.title}
                        </Text>
                        
                        <View style={styles.memoryMeta}>
                          <View style={styles.memoryMetaItem}>
                            <Clock size={16} color="#f43f5e" />
                            <Text style={styles.memoryMetaText}>{memory.time}</Text>
                          </View>
                          <View style={styles.memoryMetaItem}>
                            <MapPin size={16} color="#f43f5e" />
                            <Text style={styles.memoryMetaText}>{memory.location}</Text>
                          </View>
                        </View>
                        
                        <Text style={styles.memoryDescription}>
                          {memory.description}
                        </Text>
                        
                        <View style={styles.memoryFooter}>
                          <View style={styles.memoryFooterLeft}>
                            <Heart size={16} color="#f43f5e" />
                            <Text style={styles.memoryFooterText}>Memory #{index + 1}</Text>
                          </View>
                          <Text style={styles.memoryFooterDate}>
                            {new Date(selectedYear, selectedMonth, memory.day).toLocaleDateString('en-US', { 
                              weekday: 'long'
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Calendar size={40} color="#f43f5e" />
                </View>
                <Text style={styles.emptyStateTitle}>
                  This month awaits new memories
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  Every day brings new opportunities for beautiful moments
                </Text>
                <View style={styles.emptyStateIcons}>
                  <Heart size={16} color="#fb7185" />
                  <Flower size={16} color="#fb7185" />
                  <Star size={16} color="#fb7185" />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return view === 'calendar' ? <CalendarView /> : <TimelineView />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf2f8',
  },
  compactHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  compactHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#fce7f3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  compactHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  compactHeaderSubtitle: {
    color: '#6b7280',
    fontSize: 12,
  },
  compactDateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#fce7f3',
  },
  compactDateValue: {
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 14,
  },
  compactYearNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  compactYearButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  compactYearText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  monthGrid: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  monthRow: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 8,
  },
  monthCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 8,
    marginHorizontal: 4,
    borderLeftWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  monthCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  monthStarContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    opacity: 0.3,
  },
  monthIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  memoryCounter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
  },
  memoryCounterBadge: {
    width: 18,
    height: 18,
    backgroundColor: '#fce7f3',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryCounterText: {
    color: '#e11d48',
    fontWeight: '600',
    fontSize: 10,
  },
  memoryCounterLabel: {
    color: '#6b7280',
    fontSize: 9,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timelineMonthIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineHeaderText: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1f2937',
  },
  timelineSubtitle: {
    color: '#6b7280',
    marginTop: 4,
  },
  timelineContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  timeline: {
    position: 'relative',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    position: 'relative',
  },
  timelineDot: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#f9a8d4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 20,
  },
  timelineDotInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fb7185',
    borderRadius: 6,
  },
  memoryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#f9a8d4',
    overflow: 'hidden',
  },
  memoryDateBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fdf2f8',
    borderBottomWidth: 1,
    borderBottomColor: '#f9a8d4',
  },
  memoryDateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryDateText: {
    color: '#be185d',
    fontWeight: '500',
    fontSize: 12,
    marginLeft: 8,
  },
  memoryTypeBadge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memoryTypeText: {
    color: '#be185d',
    fontWeight: '500',
    fontSize: 10,
  },
  memoryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  memoryContent: {
    padding: 16,
  },
  memoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  memoryMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  memoryMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  memoryMetaText: {
    color: '#6b7280',
    fontSize: 12,
    marginLeft: 4,
  },
  memoryDescription: {
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  memoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f9a8d4',
  },
  memoryFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryFooterText: {
    color: '#e11d48',
    fontSize: 12,
    marginLeft: 8,
  },
  memoryFooterDate: {
    color: '#6b7280',
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#fce7f3',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    color: '#6b7280',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
});