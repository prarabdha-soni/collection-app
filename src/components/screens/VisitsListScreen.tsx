import { useState } from "react";
import { Search, MoreVertical, HelpCircle, CheckSquare, Square, MapPin, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface VisitCase {
  id: string;
  applicantName: string;
  caseId: string;
  status: "missed" | "open" | "scheduled";
  time?: string;
  location?: string;
  actionType: "repossession" | "collection";
  isSelected: boolean;
}

export function VisitsListScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("applicant-name");
  const [visits, setVisits] = useState<VisitCase[]>([
    {
      id: "1",
      applicantName: "Dheeresh",
      caseId: "UFaut3TW003493",
      status: "missed",
      time: "NA",
      location: "Sector 21, Gurgaon",
      actionType: "repossession",
      isSelected: false
    },
    {
      id: "2", 
      applicantName: "Mr.JASVINDR BUCHA SINGH",
      caseId: "Loan_DLT",
      status: "open",
      time: "7:2 PM",
      location: "Phase 2, Mohali",
      actionType: "repossession",
      isSelected: true
    },
    {
      id: "3",
      applicantName: "Himanshu", 
      caseId: "UFaut3TW003494",
      status: "missed",
      time: "7:10 LT",
      location: "Cyber City, Gurgaon",
      actionType: "collection",
      isSelected: true
    },
    {
      id: "4",
      applicantName: "Mr.JASVINDR BUCHA SINGH",
      caseId: "Loan_DLT", 
      status: "missed",
      time: "7:2 PM",
      location: "Phase 2, Mohali",
      actionType: "collection",
      isSelected: false
    },
    {
      id: "5",
      applicantName: "RANI",
      caseId: "UFaut3TW003495",
      status: "scheduled",
      time: "8:00 AM",
      location: "Sector 15, Chandigarh",
      actionType: "collection", 
      isSelected: false
    }
  ]);

  const toggleSelection = (id: string) => {
    setVisits(prev => prev.map(visit => 
      visit.id === id ? { ...visit, isSelected: !visit.isSelected } : visit
    ));
  };

  const handleVisitClick = (visit: VisitCase) => {
    navigate(`/visit/${visit.id}`, { state: { visitData: visit } });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "missed": return "destructive";
      case "open": return "success";
      case "scheduled": return "default";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "missed": return "text-destructive";
      case "open": return "text-success";
      case "scheduled": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const filteredVisits = visits.filter(visit =>
    visit.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visit.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = visits.filter(v => v.isSelected).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Visits</h1>
                <p className="text-primary-foreground/80 text-sm">Manage your scheduled visits</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
              <HelpCircle className="w-4 h-4 mr-2" />
              Need Help?
            </Button>
          </div>
          
          {selectedCount > 0 && (
            <div className="animate-fade-in bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-3 border border-primary-foreground/20">
              <p className="text-sm text-primary-foreground/90">
                {selectedCount} visit{selectedCount > 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="p-6 bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="flex gap-3 items-center">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-44 hover-scale">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applicant-name">Applicant Name</SelectItem>
              <SelectItem value="case-id">Case ID</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 hover-scale focus:scale-105 transition-all duration-200"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="hover-scale">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Visits List */}
      <div className="p-4 pb-24 space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No visits found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredVisits.map((visit, index) => (
            <Card 
              key={visit.id} 
              className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 animate-fade-in hover-scale cursor-pointer group",
                visit.status === "missed" && "border-l-destructive",
                visit.status === "open" && "border-l-success", 
                visit.status === "scheduled" && "border-l-primary",
                visit.isSelected && "ring-2 ring-primary/20 bg-primary/5"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleVisitClick(visit)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Enhanced Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(visit.id);
                    }}
                    className={cn(
                      "mt-1 p-1 rounded transition-all duration-200 hover:bg-muted",
                      visit.isSelected ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {visit.isSelected ? (
                      <CheckSquare className="w-5 h-5 animate-scale-in" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>

                  {/* Enhanced Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 story-link truncate">
                          {visit.applicantName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">ID: {visit.caseId}</span>
                          </div>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></span>
                          <span className="flex-shrink-0">Self Scheduled</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <StatusBadge 
                          status={visit.status} 
                          variant={getStatusVariant(visit.status)}
                          className="animate-scale-in whitespace-nowrap"
                        />
                        <Button
                          variant={visit.actionType === "collection" ? "default" : "secondary"}
                          size="sm"
                          className="text-xs px-3 hover-scale whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVisitClick(visit);
                          }}
                        >
                          {visit.actionType === "collection" ? "Collection" : "Repossession"}
                        </Button>
                      </div>
                    </div>

                    {/* Enhanced Location and Time */}
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className={cn("flex-shrink-0", getStatusColor(visit.status))}>{visit.time || "NA"}</span>
                      </div>
                      {visit.location && (
                        <>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0"></span>
                          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{visit.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}