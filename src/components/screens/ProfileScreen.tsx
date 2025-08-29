import { ChevronDown, Home, Settings, Trophy, History, Users, HelpCircle, MessageCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

export function ProfileScreen() {
  const { profile, signOut } = useAuth();
  
  const menuItems = [
    { icon: Home, label: "Home", hasChevron: false },
    { icon: Settings, label: "Account Settings", hasChevron: false },
    { icon: Trophy, label: "My Performance", hasChevron: false },
    { icon: History, label: "History", hasChevron: true },
    { icon: Users, label: "Switch Accounts", hasChevron: false },
    { icon: HelpCircle, label: "Contact Support", hasChevron: false },
    { icon: MessageCircle, label: "FAQ's", hasChevron: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Header */}
      <div className="p-6 text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4 bg-navy text-primary-foreground">
          <AvatarFallback className="text-xl">👤</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold text-foreground">
          {profile?.display_name || "User"}
        </h2>
        <p className="text-muted-foreground">
          {profile?.department || "Department"} - {profile?.employee_id || "ID"}
        </p>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <Button
              variant="ghost"
              className="w-full justify-start h-14 px-4"
            >
              <item.icon size={20} className="text-navy mr-3" />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.hasChevron && <ChevronDown size={16} className="text-muted-foreground" />}
            </Button>
            {index < menuItems.length - 1 && <Separator className="my-1" />}
          </div>
        ))}
        
        {/* Sign Out Button */}
        <div className="mt-4">
          <Separator className="my-1" />
          <Button
            variant="ghost"
            className="w-full justify-start h-14 px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <LogOut size={20} className="mr-3" />
            <span className="flex-1 text-left font-medium">Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-24 right-4">
        <p className="text-xs text-muted-foreground">v3.1.7.3</p>
      </div>
    </div>
  );
}