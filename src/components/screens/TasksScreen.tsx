import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";

export function TasksScreen() {
  const tasks = [
    {
      id: 1,
      type: "Repossession",
      name: "Dheeresh",
      loanId: "UP3033TW0037432",
      category: "Self Scheduled",
      date: "11/10/2024, 4:20 Pm",
      status: "pending"
    },
    {
      id: 2,
      type: "Collection", 
      name: "Himanshu",
      loanId: "UP3033TW0037441B",
      category: "Surprise | Self Scheduled",
      date: "22/02/2025, 10:00 Am",
      status: "pending"
    },
    {
      id: 3,
      type: "Collection",
      name: "RANI", 
      loanId: "Loan_id_12",
      category: "Surprise | Self Scheduled",
      date: "19/03/2025, 10:00 Am",
      status: "pending"
    },
    {
      id: 4,
      type: "Collection",
      name: "Ritu",
      loanId: "UP3033TW0037431",
      category: "Surprise | Self Scheduled", 
      date: "04/04/2025, 2:27 Pm",
      status: "pending"
    },
    {
      id: 5,
      type: "Repossession",
      name: "RAJNI DEVI",
      loanId: "Loan_id_13", 
      category: "Repossession | Self Scheduled",
      date: "25/06/2025, 4:36 Pm",
      status: "pending"
    },
    {
      id: 6,
      type: "Repossession",
      name: "Laxman",
      loanId: "UP3033TW0037442I",
      category: "Repossession | Self Scheduled",
      date: "18/07/2025, 11:48 Am", 
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">To-Do List</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Pending Task</span>
            <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold">6</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-background/20 text-primary-foreground border-primary-foreground/30"
          >
            Visits
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary-foreground/70"
          >
            Call
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4 space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={task.type === "Collection" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {task.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{task.category}</span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground">{task.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Id: {task.loanId}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {task.date}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-8 h-8"
                  >
                    📋
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No more tasks message */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No more tasks to display</p>
      </div>
    </div>
  );
}