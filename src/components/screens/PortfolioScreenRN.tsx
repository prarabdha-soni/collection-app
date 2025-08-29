import React, { useState } from 'react';
import { Search, Filter, Phone, MapPin, ChevronDown } from 'lucide-react';

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
    return status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredLoans = loans.filter(loan =>
    loan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Portfolio</h1>
          <span className="text-sm text-gray-500">{loans.length} items</span>
        </div>
        
        {/* Summary Cards */}
        <div className="flex gap-3">
          <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">All Loans</p>
            <p className="text-xl font-bold">{loans.length}</p>
          </div>
          <div className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Attempted</p>
            <p className="text-xl font-bold">4</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Unattempted</p>
            <p className="text-xl font-bold">2</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-500">Filter</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          
          <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              className="flex-1 ml-2 text-sm outline-none"
              placeholder="Search loans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loan List */}
      <div className="p-4 space-y-3">
        {filteredLoans.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-4 h-4 border border-gray-300 rounded"></div>
              <span className="text-xs text-gray-500">{item.id}</span>
            </div>
            
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-1">DPD: {item.dpd}</p>
                <div className="flex items-center">
                  <MapPin size={12} className="text-gray-500" />
                  <span className="text-xs text-gray-500 ml-1">{item.location}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                  {item.status}
                </div>
                <p className="font-bold text-lg mt-2">{item.amount}</p>
                <button className="mt-2">
                  <Phone size={20} className="text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}