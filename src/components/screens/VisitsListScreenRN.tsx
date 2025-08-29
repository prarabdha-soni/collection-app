import React, { useState } from 'react';
import { Search, Filter, HelpCircle, MapPin, Clock } from 'lucide-react';

export function VisitsListScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const visits = [
    { id: "V001", applicantName: "Rajesh Kumar", caseId: "LN001", status: "Scheduled", time: "10:30 AM", location: "Andheri East, Mumbai" },
    { id: "V002", applicantName: "Priya Sharma", caseId: "LN002", status: "Completed", time: "09:45 AM", location: "Sector 15, Delhi" },
    { id: "V003", applicantName: "Amit Patel", caseId: "LN003", status: "Pending", time: "12:00 PM", location: "Satellite, Ahmedabad" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVisits = visits.filter(visit =>
    visit.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Visits</h1>
          <button>
            <HelpCircle size={24} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-500">All</span>
          </button>
          
          <div className="flex-1 flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input 
              className="flex-1 ml-2 text-sm outline-none" 
              placeholder="Search visits..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredVisits.map((item) => (
          <button key={item.id} className="w-full bg-white rounded-lg p-4 border border-gray-200 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="w-4 h-4 border border-gray-300 rounded"></div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                {item.status}
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{item.applicantName}</h3>
            <p className="text-sm text-gray-500 mb-2">Case ID: {item.caseId}</p>
            
            <div className="flex items-center mb-1">
              <Clock size={14} className="text-gray-500" />
              <span className="text-sm text-gray-500 ml-2">{item.time}</span>
            </div>
            
            <div className="flex items-center">
              <MapPin size={14} className="text-gray-500" />
              <span className="text-sm text-gray-500 ml-2">{item.location}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}