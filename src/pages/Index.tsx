import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { PortfolioScreen } from "@/components/screens/PortfolioScreen";
import { VisitsListScreen } from "@/components/screens/VisitsListScreen";
import { TasksScreen } from "@/components/screens/TasksScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    // Check for guest mode
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuestMode(guestMode);
    
    // Only redirect to auth if not authenticated AND not in guest mode
    if (!loading && !isAuthenticated && !guestMode) {
      navigate('/auth');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-glow flex items-center justify-center">
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="text-lg font-medium">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated && !isGuestMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-glow flex items-center justify-center p-4">
        <Card className="bg-background/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Welcome to FOS App</h2>
            <p className="text-muted-foreground">Please sign in to continue</p>
            <Button onClick={() => navigate('/auth')}>
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "portfolio":
        return <PortfolioScreen />;
      case "visits":
        return <VisitsListScreen />;
      case "tasks":
        return <TasksScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
