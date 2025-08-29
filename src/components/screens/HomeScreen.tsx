import { Bell, Menu, Clock, Search, Phone, Mail, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SyncStatusIndicator } from "@/components/sync/SyncStatusIndicator";
export function HomeScreen() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState<Date | null>(null);
  const [showClockOutDialog, setShowClockOutDialog] = useState(false);
  const [isMissedItemsOpen, setIsMissedItemsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isPlannedOpen, setIsPlannedOpen] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [isPendingOpen, setIsPendingOpen] = useState(false);
  const { toast } = useToast();

  const isWithinWorkingHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 9 && hours < 18; // 9 AM to 6 PM
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
      toast({
        title: "Clock-in restricted",
        description: "You can only clock-in between 9 AM and 6 PM.",
        variant: "destructive",
      });
      return;
    }
    setIsClockedIn(true);
    setClockTime(new Date());
    toast({
      title: "Clocked In",
      description: "You have successfully clocked in.",
    });
  };

  const handleClockOutConfirm = () => {
    setIsClockedIn(false);
    const duration = calculateDuration();
    setShowClockOutDialog(false);
    toast({
      title: "Clocked Out",
      description: `You worked for ${duration} today.`,
    });
  };

  const handleClockToggle = () => {
    if (isClockedIn) {
      if (!isWithinWorkingHours()) {
        toast({
          title: "Clock-out restricted",
          description: "You can only clock-out between 9 AM and 6 PM.",
          variant: "destructive",
        });
        return;
      }
      setShowClockOutDialog(true);
    } else {
      handleClockIn();
    }
  };

  // Mock data for unallocated loans
  const unallocatedLoans = [
    { id: "LN001", customerName: "Rajesh Kumar", amount: "₹25,000", status: "Pending", location: "Mumbai" },
    { id: "LN002", customerName: "Priya Sharma", amount: "₹18,500", status: "Overdue", location: "Delhi" },
    { id: "LN003", customerName: "Amit Patel", amount: "₹32,000", status: "Pending", location: "Ahmedabad" },
    { id: "LN004", customerName: "Sunita Singh", amount: "₹15,750", status: "Overdue", location: "Kolkata" },
  ];

  // Mock data for missed PTP/Visit/Call items
  const missedItems = [
    { id: "M001", customerName: "Rajesh Kumar", type: "PTP", scheduledDate: "2024-01-06", amount: "₹25,000", phone: "+91 98765 43210" },
    { id: "M002", customerName: "Priya Sharma", type: "Visit", scheduledDate: "2024-01-05", amount: "₹18,500", address: "Sector 15, Delhi" },
    { id: "M003", customerName: "Amit Patel", type: "Call", scheduledDate: "2024-01-04", amount: "₹32,000", phone: "+91 87654 32109" },
    { id: "M004", customerName: "Sunita Singh", type: "PTP", scheduledDate: "2024-01-03", amount: "₹15,750", phone: "+91 76543 21098" },
    { id: "M005", customerName: "Ravi Kumar", type: "Visit", scheduledDate: "2024-01-02", amount: "₹45,000", address: "Park Street, Kolkata" },
    { id: "M006", customerName: "Neha Gupta", type: "Call", scheduledDate: "2024-01-01", amount: "₹28,750", phone: "+91 65432 10987" },
    { id: "M007", customerName: "Suresh Reddy", type: "PTP", scheduledDate: "2023-12-31", amount: "₹19,500", phone: "+91 54321 09876" },
  ];

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

const upcomingTasks = tasksData as any[];

useEffect(() => {
  const seed = async () => {
    if (!user) return;
    const seededKey = `seeded-${user.id}-${startOfToday.toDateString()}`;
    if (localStorage.getItem(seededKey)) return;

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

      localStorage.setItem(seededKey, '1');
    }
  };
  seed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);

  const filteredLoans = unallocatedLoans.filter(loan =>
    loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-glow pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground">
            <Menu size={20} />
          </Button>
          <h1 className="text-lg font-semibold">Home</h1>
          <div className="flex items-center gap-2">
            <SyncStatusIndicator />
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <Bell size={20} />
            </Button>
            <div className="bg-warning text-warning-foreground rounded-full px-2 py-1 text-xs font-medium">
              187
            </div>
          </div>
        </div>

        {/* Agent Info Card */}
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 bg-primary text-primary-foreground">
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">Spandan</h3>
                  <p className="text-sm text-muted-foreground">Sales - demo</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Button 
                  variant={isClockedIn ? "destructive" : "default"} 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleClockToggle}
                >
                  <Clock size={16} />
                  {isClockedIn ? "Clock-Out" : "Clock-In"}
                </Button>
                {clockTime && (
                  <p className="text-xs text-muted-foreground">
                    {isClockedIn ? "In" : "Out"} at {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-4">
              <MetricCard title="Max. Limit" value="₹10.00" subtitle="Lac" />
              <MetricCard title="Collection in Hand" value="₹600" />
              <MetricCard title="Available Limit" value="₹9.99" subtitle="Lac" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Look Into Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Look into</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success-light rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                  <span className="text-success-foreground text-sm font-medium">📋</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Mark visit on unallocated loans</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsSearchOpen(true)}>
                <Search size={16} className="mr-1" />
                Search
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center">
                  <span className="text-destructive-foreground text-sm font-medium">⚠️</span>
                </div>
                <div>
                  <p className="font-medium text-sm">7 Missed PTP/Visit/Call</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsMissedItemsOpen(true)}>View</Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-navy/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">👤</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Facing an issue? Get support</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsSupportOpen(true)}>Support</Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div 
                onClick={() => setIsPlannedOpen(true)} 
                className="cursor-pointer" 
                role="button" 
                aria-label="View planned visits"
              >
                <MetricCard 
                  title="Planned Visits" 
                  value={plannedVisits.length} 
                  variant="default"
                />
              </div>
              <div 
                onClick={() => setIsCompletedOpen(true)} 
                className="cursor-pointer" 
                role="button" 
                aria-label="View completed visits"
              >
                <MetricCard 
                  title="Completed Visits" 
                  value={completedVisits.length} 
                  variant="success"
                />
              </div>
              <div 
                onClick={() => setIsPendingOpen(true)} 
                className="cursor-pointer" 
                role="button" 
                aria-label="View pending visits"
              >
                <MetricCard 
                  title="Pending Visits" 
                  value={pendingVisits.length} 
                  variant="warning"
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                Check your collection performance!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Planned Visits Dialog */}
        <Dialog open={isPlannedOpen} onOpenChange={setIsPlannedOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Today's Planned Visits</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {plannedVisits.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No planned visits for today.</div>
              ) : (
                plannedVisits.map((visit) => (
                  <Card key={visit.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{visit.customer_name}</p>
                        <p className="text-xs text-muted-foreground">Scheduled: {visit.scheduled_at ? new Date(visit.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                        {visit.address && (
                          <p className="text-xs text-muted-foreground">📍 {visit.address}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-6 text-xs">Details</Button>
                        <Button size="sm" variant="default" className="h-6 text-xs">Start</Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Completed Visits Dialog */}
        <Dialog open={isCompletedOpen} onOpenChange={setIsCompletedOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Today's Completed Visits</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {completedVisits.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No completed visits for today.</div>
              ) : (
                completedVisits.map((visit) => (
                  <Card key={visit.id} className="p-3 bg-success-light border-success/20">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{visit.customer_name}</p>
                          <StatusBadge status="Completed" variant="success" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Completed: {visit.completed_at ? new Date(visit.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled: {visit.scheduled_at ? new Date(visit.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </p>
                        {visit.address && (
                          <p className="text-xs text-muted-foreground">📍 {visit.address}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xs text-success-foreground bg-success/20 px-2 py-1 rounded">
                            ✓ Visit Completed
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-success/20">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                          View Report
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                          Contact Customer
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Pending Visits Dialog */}
        <Dialog open={isPendingOpen} onOpenChange={setIsPendingOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Today's Pending Visits</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {pendingVisits.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No pending visits for today.</div>
              ) : (
                pendingVisits.map((visit) => (
                  <Card key={visit.id} className="p-3 bg-warning-light border-warning/20">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{visit.customer_name}</p>
                          <StatusBadge status="Pending" variant="warning" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Scheduled: {visit.scheduled_at ? new Date(visit.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </p>
                        {visit.address && (
                          <p className="text-xs text-muted-foreground">📍 {visit.address}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-xs text-warning-foreground bg-warning/20 px-2 py-1 rounded">
                            ⏳ Awaiting Action
                          </div>
                          {visit.scheduled_at && new Date(visit.scheduled_at) < new Date() && (
                            <div className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                              ⚠️ Overdue
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-warning/20">
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" className="h-7 text-xs flex-1">
                          Start Visit
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Tasks ({upcomingTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">No upcoming tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <Card key={task.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{task.type}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Unallocated Loans</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, loan ID, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <Card key={loan.id} className="p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{loan.customerName}</span>
                          <Badge variant={loan.status === "Overdue" ? "destructive" : "secondary"} className="text-xs">
                            {loan.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">ID: {loan.id}</p>
                        <p className="text-xs text-muted-foreground">📍 {loan.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{loan.amount}</p>
                        <Button size="sm" variant="outline" className="mt-1 h-6 text-xs">
                          Visit
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">
                    {searchQuery ? "No loans found matching your search" : "No unallocated loans available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Missed Items Dialog */}
      <Dialog open={isMissedItemsOpen} onOpenChange={setIsMissedItemsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Missed PTP/Visit/Call Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-3">
              {missedItems.map((item) => (
                <Card key={item.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{item.customerName}</span>
                          <Badge 
                            variant={item.type === "PTP" ? "default" : item.type === "Visit" ? "secondary" : "outline"} 
                            className="text-xs"
                          >
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}</p>
                        {item.phone && (
                          <p className="text-xs text-muted-foreground">📞 {item.phone}</p>
                        )}
                        {item.address && (
                          <p className="text-xs text-muted-foreground">📍 {item.address}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{item.amount}</p>
                        <div className="flex gap-1 mt-1">
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="default" className="h-6 text-xs">
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={isSupportOpen} onOpenChange={setIsSupportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Support & Help</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">Contact Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>+91 80001 23456</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>support@company.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle size={16} className="text-muted-foreground" />
                    <span>Live Chat Available</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    toast({
                      title: "Support Ticket Created",
                      description: "Your support request has been submitted. We'll get back to you soon.",
                    });
                    setIsSupportOpen(false);
                  }}
                >
                  <MessageCircle size={16} className="mr-2" />
                  Create Support Ticket
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    window.open("tel:+918000123456");
                  }}
                >
                  <Phone size={16} className="mr-2" />
                  Call Support
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    window.open("mailto:support@company.com");
                  }}
                >
                  <Mail size={16} className="mr-2" />
                  Email Support
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Support Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM<br />
                  <strong>Emergency:</strong> 24/7 available
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clock-Out Confirmation Dialog */}
      <AlertDialog open={showClockOutDialog} onOpenChange={setShowClockOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Clock-Out</AlertDialogTitle>
            <AlertDialogDescription>
              You have been working for {calculateDuration()}. Are you sure you want to clock out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClockOutConfirm}>
              Clock-Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}