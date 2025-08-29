import React, { useState, useEffect } from 'react';
import { Bell, Menu, Clock, Search, Phone } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function HomeScreen() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState<Date | null>(null);
  const { user } = useAuth();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const queryClient = useQueryClient();

  const { data: visitsData = [] } = useQuery({
    queryKey: ['visits', user?.id, startOfToday.toDateString()],
    queryFn: async () => {
      if (!user) return [] as any[];
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_at', startOfToday.toISOString())
        .lte('scheduled_at', endOfToday.toISOString());
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: tasksData = [] } = useQuery({
    queryKey: ['tasks', user?.id, startOfToday.toDateString()],
    queryFn: async () => {
      if (!user) return [] as any[];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .gte('due_at', startOfToday.toISOString())
        .lte('due_at', endOfToday.toISOString());
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  const plannedVisits = (visitsData as any[]).filter(v => v.status === 'planned');
  const completedVisits = (visitsData as any[]).filter(v => v.status === 'completed');
  const pendingVisits = (visitsData as any[]).filter(v => v.status === 'pending');

  const isWithinWorkingHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 9 && hours < 18;
  };

  const calculateDuration = () => {
    if (!clockTime) return "";
    const now = new Date();
    const diff = now.getTime() - clockTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleClockIn = () => {
    if (!isWithinWorkingHours()) {
      alert("Clock-in restricted: You can only clock-in between 9 AM and 6 PM.");
      return;
    }
    setIsClockedIn(true);
    setClockTime(new Date());
    alert("Clocked In: You have successfully clocked in.");
  };

  const handleClockOut = () => {
    if (!isWithinWorkingHours()) {
      alert("Clock-out restricted: You can only clock-out between 9 AM and 6 PM.");
      return;
    }
    if (confirm("Are you sure you want to clock out?")) {
      setIsClockedIn(false);
      const duration = calculateDuration();
      alert(`Clocked Out: You worked for ${duration} today.`);
    }
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      handleClockOut();
    } else {
      handleClockIn();
    }
  };

  useEffect(() => {
    const seed = async () => {
      if (!user) return;
      const seededKey = `seeded-${user.id}-${startOfToday.toDateString()}`;
      if (global.localStorage?.getItem(seededKey)) return;

      if ((visitsData as any[]).length === 0 && (tasksData as any[]).length === 0) {
        const visitPayload = [
          { user_id: user.id, customer_name: 'Anita Desai', status: 'planned', scheduled_at: new Date(new Date().setHours(10,30,0,0)).toISOString(), address: 'Andheri East, Mumbai' },
          { user_id: user.id, customer_name: 'Rajesh Kumar', status: 'completed', scheduled_at: new Date(new Date().setHours(9,45,0,0)).toISOString(), completed_at: new Date(new Date().setHours(9,45,0,0)).toISOString() },
          { user_id: user.id, customer_name: 'Neha Gupta', status: 'pending', scheduled_at: new Date(new Date().setHours(12,0,0,0)).toISOString() },
        ];

        const taskPayload = [
          { user_id: user.id, title: 'Follow-up call - Rajesh Kumar', type: 'Call', status: 'pending', due_at: new Date(new Date().setHours(11,0,0,0)).toISOString() },
          { user_id: user.id, title: 'Verify documents - Priya Sharma', type: 'Verification', status: 'pending', due_at: new Date(new Date().setHours(14,30,0,0)).toISOString() },
          { user_id: user.id, title: 'Reminder SMS - Amit Patel', type: 'SMS', status: 'pending', due_at: new Date(new Date().setHours(17,0,0,0)).toISOString() },
        ];

        await supabase.from('visits').insert(visitPayload as any[]);
        await supabase.from('tasks').insert(taskPayload as any[]);

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['visits', user.id, startOfToday.toDateString()] }),
          queryClient.invalidateQueries({ queryKey: ['tasks', user.id, startOfToday.toDateString()] }),
        ]);

        global.localStorage?.setItem(seededKey, '1');
      }
    };
    seed();
  }, [user]);

  return (
    <div className="flex-1 bg-gray-100">
      {/* Header */}
      <div className="bg-blue-500 p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2">
            <Menu size={20} className="text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white">Home</h1>
          <div className="flex items-center gap-2">
            <button className="p-2">
              <Bell size={20} className="text-white" />
            </button>
            <div className="bg-amber-500 rounded-full px-2 py-1">
              <span className="text-white text-xs font-medium">187</span>
            </div>
          </div>
        </div>

        {/* Agent Info Card */}
        <div className="bg-white/95 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-900">Spandan</h2>
                <p className="text-sm text-gray-500">Sales - demo</p>
              </div>
            </div>
            <div className="text-right">
              <button 
                onClick={handleClockToggle}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-white text-sm font-medium ${
                  isClockedIn ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                <Clock size={16} />
                {isClockedIn ? "Clock-Out" : "Clock-In"}
              </button>
              {clockTime && (
                <p className="text-xs text-gray-500 mt-1">
                  {isClockedIn ? "In" : "Out"} at {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <div className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 font-medium">Max. Limit</p>
              <p className="text-xl font-bold text-gray-900">₹10.00</p>
              <p className="text-xs text-gray-500">Lac</p>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 font-medium">Collection in Hand</p>
              <p className="text-xl font-bold text-gray-900">₹600</p>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 font-medium">Available Limit</p>
              <p className="text-xl font-bold text-gray-900">₹9.99</p>
              <p className="text-xs text-gray-500">Lac</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Look Into Section */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Look into</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📋</span>
                </div>
                <span className="font-medium text-sm text-gray-900">Mark visit on unallocated loans</span>
              </div>
              <button className="flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-lg">
                <Search size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Search</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⚠️</span>
                </div>
                <span className="font-medium text-sm text-gray-900">7 Missed PTP/Visit/Call</span>
              </div>
              <button className="border border-gray-300 px-3 py-1.5 rounded-lg">
                <span className="text-sm text-gray-700">View</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👤</span>
                </div>
                <span className="font-medium text-sm text-gray-900">Facing an issue? Get support</span>
              </div>
              <button className="border border-gray-300 px-3 py-1.5 rounded-lg">
                <span className="text-sm text-gray-700">Support</span>
              </button>
            </div>
          </div>
        </div>

        {/* Today's Calendar */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900">Today's Calendar</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-3">
              <button className="flex-1 bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-medium">Planned Visits</p>
                <p className="text-xl font-bold text-gray-900">{plannedVisits.length}</p>
              </button>
              <button className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-medium">Completed Visits</p>
                <p className="text-xl font-bold text-gray-900">{completedVisits.length}</p>
              </button>
              <button className="flex-1 bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-medium">Pending Visits</p>
                <p className="text-xl font-bold text-gray-900">{pendingVisits.length}</p>
              </button>
            </div>
            
            <div className="p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-center text-gray-500">
                Check your collection performance!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}