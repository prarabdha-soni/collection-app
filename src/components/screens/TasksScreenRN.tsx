import React from 'react';
import { ClipboardList, Phone, MapPin } from 'lucide-react';

export function TasksScreen() {
  const tasks = [
    { id: "T001", type: "Call", name: "Follow-up call - Rajesh Kumar", loanId: "LN001", category: "Follow-up", date: "Today, 11:00 AM", priority: "High" },
    { id: "T002", type: "Visit", name: "Field verification - Priya Sharma", loanId: "LN002", category: "Verification", date: "Today, 2:30 PM", priority: "Medium" },
    { id: "T003", type: "SMS", name: "Payment reminder - Amit Patel", loanId: "LN003", category: "Reminder", date: "Today, 5:00 PM", priority: "Low" },
  ];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Call': return <Phone size={16} className="text-blue-500" />;
      case 'Visit': return <MapPin size={16} className="text-green-500" />;
      case 'SMS': return <span className="text-purple-500 text-base">📱</span>;
      default: return <ClipboardList size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Tasks</h1>
          <div className="bg-red-100 rounded-full px-3 py-1">
            <span className="text-red-700 text-sm font-medium">3 Pending</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {tasks.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500">Loan ID: {item.loanId}</p>
                </div>
              </div>
              <button>
                <ClipboardList size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Category: {item.category}</p>
                <p className="text-sm text-gray-700">{item.date}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(item.priority)}`}>
                {item.priority}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}