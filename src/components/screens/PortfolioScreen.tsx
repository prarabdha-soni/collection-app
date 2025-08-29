import { Search, MoreVertical, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function PortfolioScreen() {
  const loans = [
    {
      id: "Demo25",
      name: "Demo25",
      loandId: "dummy45",
      dpd: "-",
      location: "NA",
      amount: "₹74,222",
      status: "Fos Collection Successful",
      statusVariant: "success" as const
    },
    {
      id: "Demo24", 
      name: "Demo24",
      loanId: "dummy",
      dpd: "-",
      location: "NA", 
      amount: "₹1,90,90,999",
      status: "Initiated",
      statusVariant: "default" as const
    },
    {
      id: "Demo22",
      name: "Demo22", 
      loanId: "dummy22",
      dpd: "-",
      location: "NA",
      amount: "₹0",
      status: "Initiated", 
      statusVariant: "default" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-glow pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Portfolio</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <MoreVertical size={20} />
            </Button>
            <div className="bg-warning text-warning-foreground rounded-full px-2 py-1 text-xs font-medium">
              187
            </div>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/80 text-sm">₹0</p>
            <p className="text-primary-foreground/80 text-xs">Monthly Collection</p>
          </div>
          <Select defaultValue="jul2025">
            <SelectTrigger className="w-32 bg-background/10 border-primary-foreground/20 text-primary-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jul2025">Jul, 2025</SelectItem>
              <SelectItem value="jun2025">Jun, 2025</SelectItem>
              <SelectItem value="may2025">May, 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="bg-background/95">
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">All Loans</p>
              <p className="text-xl font-bold">20</p>
            </CardContent>
          </Card>
          <Card className="bg-background/95">
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Attempted</p>
              <p className="text-xl font-bold">0</p>
            </CardContent>
          </Card>
          <Card className="bg-background/95">
            <CardContent className="p-3 text-center">
              <p className="text-sm text-muted-foreground">Unattempted</p>
              <p className="text-xl font-bold">20</p>
            </CardContent>
          </Card>
        </div>

        {/* Amount Summary */}
        <Card className="bg-background/95">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Allocated Amount</p>
                <p className="text-sm font-semibold">₹8.36 Cr</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recovered Amount</p>
                <p className="text-sm font-semibold">₹100</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Amount</p>
                <p className="text-sm font-semibold">₹8.36 Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <Select defaultValue="applicant">
            <SelectTrigger className="w-32 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applicant">Applicant Name</SelectItem>
              <SelectItem value="loan">Loan ID</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 relative">
            <Input 
              placeholder="Search here..." 
              className="pr-10 bg-background"
            />
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical size={20} />
          </Button>
        </div>

        {/* Loan List */}
        <div className="space-y-3">
          {loans.map((loan) => (
            <Card key={loan.id} className="bg-background">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox />
                    <div className="flex-1">
                      <h3 className="font-semibold">{loan.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {loan.loanId} | DPD: {loan.dpd}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        📍 {loan.location}
                      </p>
                      <div className="mt-2">
                        <StatusBadge 
                          status={loan.status} 
                          variant={loan.statusVariant}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{loan.amount}</p>
                    <Button variant="ghost" size="icon" className="mt-2">
                      <Phone size={16} className="text-success" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <Button variant="outline" size="sm" className="text-primary">
                    +3 Status ▼
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}