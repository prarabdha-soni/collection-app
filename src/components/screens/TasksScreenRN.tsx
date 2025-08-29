import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ClipboardList, Phone, MapPin } from 'lucide-react-native';

export function TasksScreen() {
  const tasks = [
    { id: "T001", type: "Call", name: "Follow-up call - Rajesh Kumar", loanId: "LN001", category: "Follow-up", date: "Today, 11:00 AM", priority: "High" },
    { id: "T002", type: "Visit", name: "Field verification - Priya Sharma", loanId: "LN002", category: "Verification", date: "Today, 2:30 PM", priority: "Medium" },
    { id: "T003", type: "SMS", name: "Payment reminder - Amit Patel", loanId: "LN003", category: "Reminder", date: "Today, 5:00 PM", priority: "Low" },
  ];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return styles.highPriority;
      case 'Medium': return styles.mediumPriority;
      case 'Low': return styles.lowPriority;
      default: return styles.defaultPriority;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call': return <Phone size={16} color="#3b82f6" />;
      case 'Visit': return <MapPin size={16} color="#10b981" />;
      case 'SMS': return <Text style={styles.smsIcon}>📱</Text>;
      default: return <ClipboardList size={16} color="gray" />;
    }
  };

  const renderTaskItem = ({ item }: { item: any }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskRow}>
        <View style={styles.taskLeft}>
          <View style={styles.iconContainer}>{getTypeIcon(item.type)}</View>
          <View style={styles.taskInfo}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.loanId}>Loan ID: {item.loanId}</Text>
          </View>
        </View>
        <TouchableOpacity><ClipboardList size={20} color="gray" /></TouchableOpacity>
      </View>
      
      <View style={styles.taskFooter}>
        <View>
          <Text style={styles.category}>Category: {item.category}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={[styles.priorityBadge, getPriorityStyle(item.priority)]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Tasks</Text>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>3 Pending</Text>
          </View>
        </View>
      </View>

      <FlatList data={tasks} keyExtractor={(item) => item.id} renderItem={renderTaskItem} contentContainerStyle={styles.listContent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: 'bold' },
  pendingBadge: { backgroundColor: '#fee2e2', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  pendingText: { color: '#dc2626', fontSize: 14, fontWeight: '500' },
  listContent: { padding: 16 },
  taskCard: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  taskLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconContainer: { width: 40, height: 40, backgroundColor: '#f3f4f6', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  smsIcon: { color: '#8b5cf6', fontSize: 16 },
  taskInfo: { flex: 1 },
  taskName: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
  loanId: { fontSize: 14, color: '#6b7280' },
  taskFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  category: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  date: { fontSize: 14, color: '#374151' },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  highPriority: { backgroundColor: '#fee2e2' },
  mediumPriority: { backgroundColor: '#fef3c7' },
  lowPriority: { backgroundColor: '#dcfce7' },
  defaultPriority: { backgroundColor: '#f3f4f6' },
  priorityText: { fontSize: 12, fontWeight: '500' },
});