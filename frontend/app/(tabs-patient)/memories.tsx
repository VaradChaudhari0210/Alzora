import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Camera, 
  Mic, 
  FileText, 
  Upload,
  Grid3X3,
  List,
  Heart,
  Share2,
  Play,
  X
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function MemoriesScreen() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const memoryTypes = [
    { id: 'photo', icon: Camera, title: 'Photo', color: '#6B9BD8', bgColor: '#EBF4FF' },
    { id: 'voice', icon: Mic, title: 'Voice Note', color: '#E17B47', bgColor: '#FFF7ED' },
    { id: 'text', icon: FileText, title: 'Story', color: '#7BB686', bgColor: '#F0F9F4' },
    { id: 'upload', icon: Upload, title: 'Upload', color: '#8B5A9F', bgColor: '#F3E8FF' },
  ];

  const memories = [
    {
      id: 1,
      type: 'photo',
      title: 'Family Picnic',
      date: '2023-07-15',
      thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A beautiful sunny day at the park with all the grandchildren',
      tags: ['family', 'outdoor', 'happiness'],
      likes: 12,
      duration: null
    },
    {
      id: 2,
      type: 'voice',
      title: 'Wedding Day Story',
      date: '2023-06-20',
      thumbnail: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Telling the story of our special day at the chapel',
      tags: ['wedding', 'love', 'story'],
      likes: 18,
      duration: '3:24'
    },
    {
      id: 3,
      type: 'photo',
      title: 'Christmas Morning',
      date: '2022-12-25',
      thumbnail: 'https://images.pexels.com/photos/1648375/pexels-photo-1648375.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'The joy on everyone\'s faces opening presents',
      tags: ['christmas', 'family', 'joy'],
      likes: 25,
      duration: null
    },
    {
      id: 4,
      type: 'text',
      title: 'My First Job',
      date: '2023-05-10',
      thumbnail: 'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'The excitement and nervousness of starting my career',
      tags: ['career', 'milestone', 'achievement'],
      likes: 8,
      duration: null
    },
    {
      id: 5,
      type: 'photo',
      title: 'Garden Blooms',
      date: '2023-04-22',
      thumbnail: 'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'The roses I planted finally bloomed beautifully',
      tags: ['garden', 'nature', 'accomplishment'],
      likes: 15,
      duration: null
    },
    {
      id: 6,
      type: 'voice',
      title: 'Grandma\'s Recipe',
      date: '2023-03-18',
      thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Sharing the secret family recipe for apple pie',
      tags: ['family', 'cooking', 'tradition'],
      likes: 22,
      duration: '5:12'
    }
  ];

  const openMemoryDetail = (memory) => {
    setSelectedMemory(memory);
    setModalVisible(true);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'photo': return Camera;
      case 'voice': return Mic;
      case 'text': return FileText;
      default: return Camera;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'photo': return '#6B9BD8';
      case 'voice': return '#E17B47';
      case 'text': return '#7BB686';
      default: return '#6B9BD8';
    }
  };

  const renderGridView = () => (
    <View style={styles.gridContainer}>
      {memories.map((memory) => {
        const TypeIcon = getTypeIcon(memory.type);
        return (
          <TouchableOpacity 
            key={memory.id} 
            style={styles.gridItem}
            onPress={() => openMemoryDetail(memory)}
          >
            <Image source={{ uri: memory.thumbnail }} style={styles.gridImage} />
            <View style={styles.gridOverlay}>
              <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(memory.type) }]}>
                <TypeIcon size={12} color="#FFFFFF" strokeWidth={2} />
              </View>
              {memory.duration && (
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{memory.duration}</Text>
                </View>
              )}
            </View>
            <View style={styles.gridInfo}>
              <Text style={styles.gridTitle} numberOfLines={1}>{memory.title}</Text>
              <View style={styles.gridMeta}>
                <Heart size={12} color="#EF4444" fill="#EF4444" />
                <Text style={styles.gridLikes}>{memory.likes}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderListView = () => (
    <View style={styles.listContainer}>
      {memories.map((memory) => {
        const TypeIcon = getTypeIcon(memory.type);
        return (
          <TouchableOpacity 
            key={memory.id} 
            style={styles.listItem}
            onPress={() => openMemoryDetail(memory)}
          >
            <Image source={{ uri: memory.thumbnail }} style={styles.listImage} />
            <View style={styles.listContent}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>{memory.title}</Text>
                <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(memory.type) }]}>
                  <TypeIcon size={14} color="#FFFFFF" strokeWidth={2} />
                </View>
              </View>
              <Text style={styles.listDescription} numberOfLines={2}>
                {memory.description}
              </Text>
              <View style={styles.listMeta}>
                <Text style={styles.listDate}>{memory.date}</Text>
                <View style={styles.listLikes}>
                  <Heart size={14} color="#EF4444" fill="#EF4444" />
                  <Text style={styles.listLikesText}>{memory.likes}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Memory Vault</Text>
          <Text style={styles.headerSubtitle}>Your precious moments</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.viewToggle, viewMode === 'grid' && styles.viewToggleActive]}
            onPress={() => setViewMode('grid')}
          >
            <Grid3X3 size={20} color={viewMode === 'grid' ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewToggle, viewMode === 'list' && styles.viewToggleActive]}
            onPress={() => setViewMode('list')}
          >
            <List size={20} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Memory Actions */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.actionsScroll}
        contentContainerStyle={styles.actionsContent}
      >
        {memoryTypes.map((type) => (
          <TouchableOpacity key={type.id} style={[styles.actionButton, { backgroundColor: type.bgColor }]}>
            <View style={[styles.actionIcon, { backgroundColor: type.color }]}>
              <type.icon size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.actionText}>{type.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Memories Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'grid' ? renderGridView() : renderListView()}
      </ScrollView>

      {/* Memory Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMemory && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedMemory.title}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <X size={24} color="#6B7280" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                
                <Image source={{ uri: selectedMemory.thumbnail }} style={styles.modalImage} />
                
                <View style={styles.modalBody}>
                  <Text style={styles.modalDescription}>{selectedMemory.description}</Text>
                  
                  <View style={styles.modalMeta}>
                    <Text style={styles.modalDate}>{selectedMemory.date}</Text>
                    <View style={styles.modalLikes}>
                      <Heart size={16} color="#EF4444" fill="#EF4444" />
                      <Text style={styles.modalLikesText}>{selectedMemory.likes} likes</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalTags}>
                    {selectedMemory.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.modalActions}>
                    {selectedMemory.type === 'voice' && (
                      <TouchableOpacity style={styles.playButton}>
                        <Play size={16} color="#FFFFFF" strokeWidth={2} />
                        <Text style={styles.playButtonText}>Play Recording</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.shareButton}>
                      <Share2 size={16} color="#8B5A9F" strokeWidth={2} />
                      <Text style={styles.shareButtonText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
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
  headerActions: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 6,
  },
  viewToggleActive: {
    backgroundColor: '#8B5A9F',
  },
  actionsScroll: {
    marginBottom: 16,
  },
  actionsContent: {
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 52) / 2,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  gridOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  durationBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  gridInfo: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  gridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLikes: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  listContainer: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listImage: {
    width: 80,
    height: 80,
  },
  listContent: {
    flex: 1,
    padding: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  listDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  listMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  listLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listLikesText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
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
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: '#374737',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  modalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  modalLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalLikesText: {
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#8B5A9F',
    fontFamily: 'Inter-Medium',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E17B47',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  shareButtonText: {
    color: '#8B5A9F',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
});