import { Tabs, useRouter } from 'expo-router';
import { Home, Clock, MessageCircle, Users, Plus } from 'lucide-react-native';
import { StyleSheet, ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { useEffect } from 'react';

function CustomTabBar({ state, descriptors, navigation }) {
  const router = useRouter();

  // Split routes for left and right of FAB
  const leftRoutes = state.routes.slice(0, 2); // index, timeline
  const rightRoutes = state.routes.slice(2);   // chat, patient

  return (
    <View style={styles.tabBar}>
      {leftRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        let icon;
        if (route.name === 'index') icon = <Home size={24} color={isFocused ? '#8B5A9F' : '#9CA3AF'} />;
        if (route.name === 'timeline') icon = <Clock size={24} color={isFocused ? '#8B5A9F' : '#9CA3AF'} />;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {icon}
            <Text style={[styles.tabBarLabel, { color: isFocused ? '#8B5A9F' : '#9CA3AF' }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Center FAB */}
      <TouchableOpacity
        key="add-memory-fab"
        style={styles.fabContainer}
        onPress={() => router.push('/add-memory')}
        activeOpacity={0.85}
      >
        <View style={styles.fab}>
          <Plus size={32} color="#fff" />
        </View>
      </TouchableOpacity>

      {rightRoutes.map((route, idx) => {
        // idx + 2 because rightRoutes starts from index 2
        const index = idx + 2;
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        let icon;
        if (route.name === 'chat') icon = <MessageCircle size={24} color={isFocused ? '#8B5A9F' : '#9CA3AF'} />;
        if (route.name === 'patient') icon = <Users size={24} color={isFocused ? '#8B5A9F' : '#9CA3AF'} />;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            {icon}
            <Text style={[styles.tabBarLabel, { color: isFocused ? '#8B5A9F' : '#9CA3AF' }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { token, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace('/login');
      } else if (user?.role === 'caregiver') {
        router.replace('/(tabs-caregiver)');
      }
    }
  }, [token, loading, user]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
        }}
      />
      {/* Center FAB will be here (index 2) */}
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Assistant',
        }}
      />
      <Tabs.Screen
        name="patient"
        options={{
          title: 'Patient',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 4,
  },
  fabContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 16,
    transform: [{ translateX: -32 }],
    zIndex: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5A9F',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#8B5A9F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});