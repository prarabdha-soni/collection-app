import { FileText, Calendar, User, MapPin, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface VisitDetailsData {
  markedLocation: string;
  scheduledFor: string;
  scheduledBy: string;
  subDisposition2: string;
  subDisposition1: string;
  disposition: string;
  comment: string;
  committedAmount: number;
  isCustomerMet: boolean;
  isVisitDone: boolean;
  visitPurpose: string;
  visitId: string;
}

interface VisitDetailsSectionProps {
  visitData: VisitDetailsData;
}

export function VisitDetailsSection({ visitData }: VisitDetailsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Visit Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Scheduled For:</span>
            <div className="flex items-center gap-1 mt-1">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium">{visitData.scheduledFor}</span>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Scheduled By:</span>
            <div className="flex items-center gap-1 mt-1">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium">{visitData.scheduledBy}</span>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Visit Purpose:</span>
            <div className="flex items-center gap-1 mt-1">
              <Target className="w-3 h-3 text-muted-foreground" />
              <Badge variant="outline">{visitData.visitPurpose}</Badge>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Committed Amount:</span>
            <div className="font-semibold text-success">₹ {visitData.committedAmount}</div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Is Customer Met:</span>
            <Badge variant={visitData.isCustomerMet ? "default" : "destructive"} className={visitData.isCustomerMet ? "bg-success text-success-foreground" : ""}>
              {visitData.isCustomerMet ? "Yes" : "No"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Is Visit Done:</span>
            <Badge variant={visitData.isVisitDone ? "default" : "destructive"} className={visitData.isVisitDone ? "bg-success text-success-foreground" : ""}>
              {visitData.isVisitDone ? "Yes" : "No"}
            </Badge>
          </div>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="text-navy w-full mt-2">
              {isExpanded ? "Less" : "View More"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Marked Location:</span>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span>{visitData.markedLocation || "-"}</span>
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Sub Disposition 2:</span>
                <div className="mt-1">{visitData.subDisposition2 || "-"}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Sub Disposition 1:</span>
                <div className="mt-1">{visitData.subDisposition1 || "-"}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Disposition:</span>
                <div className="mt-1">{visitData.disposition || "-"}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Comment:</span>
                <div className="mt-1">{visitData.comment || "-"}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Visit ID:</span>
                <div className="mt-1 font-mono text-xs">{visitData.visitId}</div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}