import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';
import { Search, Filter, Phone, MapPin, ChevronDown } from 'lucide-react-native';

export function PortfolioScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for loans
  const loans = [
    { id: "LN001", name: "Rajesh Kumar", amount: "₹25,000", status: "Overdue", location: "Mumbai", dpd: 15 },
    { id: "LN002", name: "Priya Sharma", amount: "₹18,500", status: "Current", location: "Delhi", dpd: 0 },
    { id: "LN003", name: "Amit Patel", amount: "₹32,000", status: "Overdue", location: "Ahmedabad", dpd: 8 },
    { id: "LN004", name: "Sunita Singh", amount: "₹15,750", status: "Current", location: "Kolkata", dpd: 0 },
  ];

  const getStatusStyle = (status: string) => {
    return status === 'Current' ? styles.currentBadge : styles.overdueBadge;
  };

  const getStatusTextStyle = (status: string) => {
    return status === 'Current' ? styles.currentText : styles.overdueText;
  };

  const filteredLoans = loans.filter(loan =>
    loan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLoanItem = ({ item }: { item: any }) => (
    <View style={styles.loanCard}>
      <View style={styles.loanHeader}>
        <View style={styles.checkbox} />
        <Text style={styles.loanId}>{item.id}</Text>
      </View>
      
      <View style={styles.loanContent}>
        <View style={styles.loanLeft}>
          <Text style={styles.loanName}>{item.name}</Text>
          <Text style={styles.loanDpd}>DPD: {item.dpd}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color="gray" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
        
        <View style={styles.loanRight}>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>{item.status}</Text>
          </View>
          <Text style={styles.amount}>{item.amount}</Text>
          <TouchableOpacity style={styles.phoneButton}>
            <Phone size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Portfolio</Text>
          <Text style={styles.itemCount}>{loans.length} items</Text>
        </View>
        
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, styles.blueBackground]}>
            <Text style={styles.summaryTitle}>All Loans</Text>
            <Text style={styles.summaryValue}>{loans.length}</Text>
          </View>
          <View style={[styles.summaryCard, styles.yellowBackground]}>
            <Text style={styles.summaryTitle}>Attempted</Text>
            <Text style={styles.summaryValue}>4</Text>
          </View>
          <View style={[styles.summaryCard, styles.grayBackground]}>
            <Text style={styles.summaryTitle}>Unattempted</Text>
            <Text style={styles.summaryValue}>2</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="gray" />
            <Text style={styles.filterText}>Filter</Text>
            <ChevronDown size={16} color="gray" />
          </TouchableOpacity>
          
          <View style={styles.searchInput}>
            <Search size={16} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Search loans..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      {/* Loan List */}
      <FlatList
        data={filteredLoans}
        keyExtractor={(item) => item.id}
        renderItem={renderLoanItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  itemCount: { fontSize: 14, color: '#6b7280' },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, borderRadius: 8, padding: 12, alignItems: 'center' },
  blueBackground: { backgroundColor: '#eff6ff' },
  yellowBackground: { backgroundColor: '#fefce8' },
  grayBackground: { backgroundColor: '#f9fafb' },
  summaryTitle: { fontSize: 12, color: '#6b7280' },
  summaryValue: { fontSize: 20, fontWeight: 'bold' },
  searchContainer: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 14, color: '#6b7280' },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  input: { flex: 1, marginLeft: 8, fontSize: 14 },
  listContent: { padding: 16 },
  loanCard: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  loanHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  checkbox: { width: 16, height: 16, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 4 },
  loanId: { fontSize: 12, color: '#6b7280' },
  loanContent: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  loanLeft: { flex: 1 },
  loanName: { fontWeight: '600', fontSize: 16, marginBottom: 4 },
  loanDpd: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 12, color: '#6b7280', marginLeft: 4 },
  loanRight: { alignItems: 'flex-end' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  currentBadge: { backgroundColor: '#dcfce7' },
  overdueBadge: { backgroundColor: '#fee2e2' },
  statusText: { fontSize: 12, fontWeight: '500' },
  currentText: { color: '#166534' },
  overdueText: { color: '#dc2626' },
  amount: { fontWeight: 'bold', fontSize: 18, marginTop: 8 },
  phoneButton: { marginTop: 8 },
});