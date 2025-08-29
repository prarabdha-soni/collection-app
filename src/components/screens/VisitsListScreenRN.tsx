import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import { Search, Filter, HelpCircle, MapPin, Clock } from 'lucide-react-native';

export function VisitsListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const visits = [
    { id: "V001", applicantName: "Rajesh Kumar", caseId: "LN001", status: "Scheduled", time: "10:30 AM", location: "Andheri East, Mumbai" },
    { id: "V002", applicantName: "Priya Sharma", caseId: "LN002", status: "Completed", time: "09:45 AM", location: "Sector 15, Delhi" },
    { id: "V003", applicantName: "Amit Patel", caseId: "LN003", status: "Pending", time: "12:00 PM", location: "Satellite, Ahmedabad" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return styles.completedBadge;
      case 'Scheduled': return styles.scheduledBadge;
      case 'Pending': return styles.pendingBadge;
      default: return styles.defaultBadge;
    }
  };

  const filteredVisits = visits.filter(visit =>
    visit.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderVisitItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.visitCard}>
      <View style={styles.visitHeader}>
        <View style={styles.checkbox} />
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.applicantName}>{item.applicantName}</Text>
      <Text style={styles.caseId}>Case ID: {item.caseId}</Text>
      
      <View style={styles.infoRow}>
        <Clock size={14} color="gray" />
        <Text style={styles.infoText}>{item.time}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <MapPin size={14} color="gray" />
        <Text style={styles.infoText}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Visits</Text>
          <TouchableOpacity><HelpCircle size={24} color="gray" /></TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="gray" />
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          
          <View style={styles.searchInput}>
            <Search size={16} color="gray" />
            <TextInput style={styles.input} placeholder="Search visits..." value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        </View>
      </View>

      <FlatList data={filteredVisits} keyExtractor={(item) => item.id} renderItem={renderVisitItem} contentContainerStyle={styles.listContent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: 'bold' },
  searchContainer: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 14, color: '#6b7280' },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  input: { flex: 1, marginLeft: 8, fontSize: 14 },
  listContent: { padding: 16 },
  visitCard: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  visitHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  checkbox: { width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  completedBadge: { backgroundColor: '#dcfce7' },
  scheduledBadge: { backgroundColor: '#dbeafe' },
  pendingBadge: { backgroundColor: '#fef3c7' },
  defaultBadge: { backgroundColor: '#f3f4f6' },
  statusText: { fontSize: 12, fontWeight: '500' },
  applicantName: { fontWeight: '600', fontSize: 18, marginBottom: 4 },
  caseId: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#6b7280', marginLeft: 8 },
});