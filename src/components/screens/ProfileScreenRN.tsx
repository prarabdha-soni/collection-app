import React from 'react';
import { User, Settings, HelpCircle, FileText, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function ProfileScreen() {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      signOut();
    }
  };

  const menuItems = [
    { icon: Settings, label: "Settings", onPress: () => console.log('Settings') },
    { icon: HelpCircle, label: "Help & Support", onPress: () => console.log('Help') },
    { icon: FileText, label: "Terms & Conditions", onPress: () => console.log('Terms') },
    { icon: Shield, label: "Privacy Policy", onPress: () => console.log('Privacy') },
  ];

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 text-center border-b border-gray-200">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-white" />
        </div>
        <h1 className="text-xl font-bold mb-1 text-gray-900">
          {profile?.display_name || user?.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-gray-500 mb-1">
          {profile?.department || 'Sales Department'}
        </p>
        <p className="text-xs text-gray-400">
          Employee ID: {profile?.employee_id || 'EMP001'}
        </p>
      </div>

      {/* Menu Items */}
      <div className="bg-white mx-4 mt-4 rounded-lg">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.onPress}
              className={`flex items-center justify-between w-full p-4 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon size={20} className="text-gray-500" />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          );
        })}
      </div>

      {/* Sign Out Button */}
      <div className="mx-4 mt-6">
        <button 
          onClick={handleSignOut} 
          className="w-full bg-red-500 rounded-lg p-4 flex items-center justify-center"
        >
          <LogOut size={20} className="text-white" />
          <span className="text-white font-semibold ml-2">Sign Out</span>
        </button>
      </div>

      {/* App Version */}
      <div className="text-center py-8">
        <p className="text-xs text-gray-400">Version 1.0.0</p>
      </div>
    </div>
  );
}