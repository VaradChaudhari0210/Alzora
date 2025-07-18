import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Send, 
  Mic, 
  Bot, 
  User, 
  Heart,
  Camera,
  Calendar,
  MapPin
} from 'lucide-react-native';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: "Hello Margaret! I'm here to help you explore your beautiful memories. What would you like to talk about today?",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'user',
      text: "I've been thinking about my wedding day lately",
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      type: 'assistant',
      text: "What a wonderful memory to cherish! I remember you got married on June 15th, 1985 at the countryside chapel. You wore your grandmother's beautiful pearl necklace. What part of that special day brings you the most joy?",
      timestamp: new Date(Date.now() - 180000),
      memoryCard: {
        title: "Wedding Day",
        date: "June 15, 1985",
        location: "St. Mary's Chapel"
      }
    },
    {
      id: 4,
      type: 'user',
      text: "The moment when John first saw me walking down the aisle. His smile was so bright.",
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: 5,
      type: 'assistant',
      text: "That sounds absolutely magical! The way you describe John's reaction shows how much love filled that moment. Those are the memories that warm the heart forever. Would you like to add any photos from that day to your memory vault?",
      timestamp: new Date(Date.now() - 60000)
    }
  ]);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: message,
        timestamp: new Date()
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'assistant',
          text: generateAIResponse(message),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  // Hardcoded keyword-based responses
  const responseMap = [
    {
      keywords: ["wedding", "married", "marriage", "aisle"],
      response: "Your wedding day was truly special! Would you like to share more about that beautiful moment?"
    },
    {
      keywords: ["birthday", "born"],
      response: "Happy birthday memories are always wonderful! Do you remember your favorite birthday celebration?"
    },
    {
      keywords: ["children", "grandchildren", "kids", "family"],
      response: "Family is so important. Would you like to talk about your children or grandchildren?"
    },
    {
      keywords: ["music", "song", "sing", "playlist"],
      response: "Music can bring back wonderful memories. Do you have a favorite song you'd like to listen to?"
    },
    {
      keywords: ["photo", "picture", "image", "vault"],
      response: "Would you like to look at some photos together or add a new one to your memory vault?"
    },
    {
      keywords: ["home", "house", "childhood"],
      response: "Tell me about your childhood home. What made it special for you?"
    },
    {
      keywords: ["work", "job", "career", "office"],
      response: "Your career journey is inspiring! What was your first day of work like?"
    },
    {
      keywords: ["favorite", "like", "love"],
      response: "It's wonderful to have favorites. What do you love the most these days?"
    },
    {
      keywords: ["help", "support", "assist"],
      response: "I'm always here to help. Is there something specific you'd like assistance with?"
    },
    {
      keywords: ["memory", "remember", "forget"],
      response: "It's okay if you forget some details. I'm here to help you remember and cherish your memories."
    }
  ];

  const defaultResponse = "I'm here to listen. Please tell me more or ask me anything about your memories.";

  const generateAIResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    for (const entry of responseMap) {
      if (entry.keywords.some(keyword => lowerMsg.includes(keyword))) {
        return entry.response;
      }
    }
    return defaultResponse;
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const suggestedPrompts = [
    "Tell me about my childhood home",
    "What happened on my first day of work?",
    "Remind me about my family traditions",
    "Share a story about my grandchildren"
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.assistantIcon}>
            <Bot size={20} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Memory Assistant</Text>
            <Text style={styles.headerSubtitle}>Always here to help remember</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[
            styles.messageWrapper,
            msg.type === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper
          ]}>
            <View style={[
              styles.messageBubble,
              msg.type === 'user' ? styles.userMessage : styles.assistantMessage
            ]}>
              <Text style={[
                styles.messageText,
                msg.type === 'user' ? styles.userMessageText : styles.assistantMessageText
              ]}>
                {msg.text}
              </Text>
              
              {msg.memoryCard && (
                <TouchableOpacity style={styles.memoryCard}>
                  <View style={styles.memoryCardHeader}>
                    <Calendar size={16} color="#8B5A9F" strokeWidth={2} />
                    <Text style={styles.memoryCardTitle}>{msg.memoryCard.title}</Text>
                  </View>
                  <Text style={styles.memoryCardDate}>{msg.memoryCard.date}</Text>
                  <View style={styles.memoryCardLocation}>
                    <MapPin size={12} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.memoryCardLocationText}>{msg.memoryCard.location}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={[
              styles.messageInfo,
              msg.type === 'user' ? styles.userMessageInfo : styles.assistantMessageInfo
            ]}>
              <Text style={styles.messageTime}>{formatTimestamp(msg.timestamp)}</Text>
            </View>
          </View>
        ))}
        
        {/* Suggested Prompts */}
        {messages.length <= 5 && (
          <View style={styles.suggestedPrompts}>
            <Text style={styles.suggestedTitle}>Try asking me about:</Text>
            {suggestedPrompts.map((prompt, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.promptButton}
                onPress={() => setMessage(prompt)}
              >
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Share a memory or ask me anything..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <View style={styles.inputActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Mic size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Camera size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Send size={18} color={message.trim() ? "#FFFFFF" : "#9CA3AF"} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assistantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5A9F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageWrapper: {
    marginBottom: 16,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  assistantMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#8B5A9F',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#111827',
  },
  messageInfo: {
    marginTop: 4,
  },
  userMessageInfo: {
    alignItems: 'flex-end',
  },
  assistantMessageInfo: {
    alignItems: 'flex-start',
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  memoryCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memoryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  memoryCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5A9F',
    marginLeft: 6,
    fontFamily: 'Inter-SemiBold',
  },
  memoryCardDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  memoryCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryCardLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  suggestedPrompts: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  promptButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#374737',
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
    fontFamily: 'Inter-Regular',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginRight: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendButtonActive: {
    backgroundColor: '#8B5A9F',
  },
});