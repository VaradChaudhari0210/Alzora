import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList
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
  Leaf
} from 'lucide-react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

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
    month: 3,
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
    month: 3,
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
    month: 3,
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
    month: 3,
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
    month: 2,
    day: 12,
    title: 'Birthday Celebration',
    description: 'My 75th birthday. Everyone sang happy birthday and we had my favorite chocolate cake.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
    type: 'Special',
    location: 'Living Room',
    time: '6:00 PM'
  },
  {
    id: 6,
    year: 2024,
    month: 2,
    day: 12,
    title: 'Birthday Celebration',
    description: 'My 75th birthday. Everyone sang happy birthday and we had my favorite chocolate cake.',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
    type: 'Special',
    location: 'Living Room',
    time: '6:00 PM'
  },
  {
    id: 7,
    year: 2024,
    month: 3,
    day: 8,
    title: 'First Spring Flowers',
    description: 'The tulips I planted last fall are blooming beautifully in the front garden.',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
    type: 'Garden',
    location: 'Front Garden',
    time: '10:00 AM'
  },
  {
    id: 8,
    year: 2024,
    month: 3,
    day: 15,
    title: 'Easter with Family',
    description: 'A wonderful day with everyone together. The children found all the eggs in the garden.',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop',
    type: 'Family',
    location: 'Home',
    time: '2:00 PM'
  },
  {
    id: 9,
    year: 2024,
    month: 4,
    day: 1,
    title: 'April Fools Day Fun',
    description: 'The grandkids tried to prank me with salt in the sugar bowl. We all had a good laugh.',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop',
    type: 'Family',
    location: 'Kitchen',
    time: '9:00 AM'
  },
  {
    id: 10,
    year: 2024,
    month: 4,
    day: 10,
    title: 'Family Picnic Video',
    description: 'A sunny day at the park with family. Watch the picnic highlights!',
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
    type: 'Video',
    location: 'Central Park',
    time: '12:00 PM'
  },
  {
    id: 11,
    year: 2024,
    month: 5,
    day: 20,
    title: 'Grandchildren Visit Video',
    description: 'Sarah and Tommy came over. We made chocolate chip cookies and recorded a fun video.',
    video: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop',
    type: 'Video',
    location: 'Home',
    time: '3:00 PM'
  }
];

// ... [IMPORTS AND MONTH/EVENT DATA REMAIN UNCHANGED]

export default function PersonalMemoryCalendar() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [view, setView] = useState('calendar');

  const getMonthMemories = (monthIndex) =>
    timelineEvents.filter((e) => e.month === monthIndex && e.year === selectedYear);

  const getCurrentMonthMemories = () =>
    timelineEvents
      .filter((e) => e.month === selectedMonth && e.year === selectedYear)
      .sort((a, b) => a.day - b.day);

  const CalendarView = () => {
    const renderMonth = ({ item, index }) => {
      const memories = getMonthMemories(index);
      const MonthIcon = item.icon;

      return (
        <TouchableOpacity
          onPress={() => {
            setSelectedMonth(index);
            setView('timeline');
          }}
          style={styles.card}
        >
          <Star size={6} color="#d1d5db" style={styles.starIcon} />
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <MonthIcon size={20} color={item.accent} />
          </View>
          <Text style={styles.monthText}>{item.name.slice(0, 3)}</Text>
          <View style={styles.memoryCountBadge}>
            <Text style={styles.memoryCountText}>
              {memories.length}
            </Text>
          </View>
          <Text style={styles.memoryLabel}>
            {memories.length === 1 ? 'memory' : 'memories'}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fdf2f8" />
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Your Memory Calendar</Text>
            <View style={styles.yearNav}>
              <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)}>
                <ChevronLeft size={20} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.yearText}>{selectedYear}</Text>
              <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)}>
                <ChevronRight size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          data={months}
          renderItem={renderMonth}
          keyExtractor={(_, i) => i.toString()}
          numColumns={3}
          contentContainerStyle={styles.grid}
        />
      </SafeAreaView>
    );
  };

  const TimelineView = () => {
    const memories = getCurrentMonthMemories();
    const currentMonth = months[selectedMonth];
    const MonthIcon = currentMonth.icon;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fdf2f8" />
        <ScrollView>
          <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={() => setView('calendar')} style={{ marginBottom: 20 }}>
              <ArrowLeft size={24} color="#6b7280" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ backgroundColor: currentMonth.color, padding: 10, borderRadius: 12, marginRight: 12 }}>
                <MonthIcon size={24} color={currentMonth.accent} />
              </View>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '600', color: '#1f2937' }}>
                  {currentMonth.name} {selectedYear}
                </Text>
                <Text style={{ color: '#6b7280' }}>
                  {memories.length > 0
                    ? `${memories.length} ${memories.length === 1 ? 'memory' : 'memories'}`
                    : 'No memories this month'}
                </Text>
              </View>
            </View>
            {memories.map((m) => (
              <View key={m.id} style={{ marginBottom: 24 }}>
                {m.video ? (
                  <>
                    <Image source={{ uri: m.thumbnail }} style={{ width: '100%', height: 180, borderRadius: 12 }} />
                    <Video
                      source={{ uri: m.video }}
                      style={{ width: '100%', height: 180, borderRadius: 12, marginTop: 8 }}
                      useNativeControls
                      resizeMode="contain"
                    />
                  </>
                ) : (
                  <Image source={{ uri: m.image }} style={{ width: '100%', height: 180, borderRadius: 12 }} />
                )}
                <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 8 }}>{m.title}</Text>
                <Text style={{ color: '#6b7280', marginBottom: 4 }}>{m.time} · {m.location}</Text>
                <Text style={{ color: '#374151' }}>{m.description}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return view === 'calendar' ? <CalendarView /> : <TimelineView />;
}

// 💡 STYLES FIXED
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf2f8'
  },
  header: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937'
  },
  yearNav: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  yearText: {
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937'
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    justifyContent: 'center'
  },
  card: {
    flex: 1,
    margin: 6,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '30%' // Enforces 3 per row consistently
  },
  starIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    opacity: 0.3
  },
  iconContainer: {
    padding: 8,
    borderRadius: 50,
    marginBottom: 4
  },
  monthText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2
  },
  memoryCountBadge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2
  },
  memoryCountText: {
    color: '#e11d48',
    fontWeight: '600',
    fontSize: 11
  },
  memoryLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2
  }
});
