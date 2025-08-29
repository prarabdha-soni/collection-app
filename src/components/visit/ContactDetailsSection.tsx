import { MapPin, Phone, ChevronUp, ChevronDown, Edit, Plus, Navigation } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactDetailsSectionProps {
  customerData: {
    name: string;
    id: string;
    address: string;
    phone?: string;
  };
}

export function ContactDetailsSection({ customerData }: ContactDetailsSectionProps) {
  const [loanDetailsOpen, setLoanDetailsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [visitStatus, setVisitStatus] = useState({
    visitDone: false,
    customerMet: false,
    amountCollected: false,
  });

  const [addressForm, setAddressForm] = useState({
    houseNumber: "",
    floor: "",
    blockName: "",
    addressType: "other",
    label: "",
    isPrimary: false,
  });

  return (
    <div className="space-y-4">
      {/* Contact Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{customerData.address}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-navy">
              Change
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Call Customer</span>
            </div>
            <Button variant="ghost" size="sm" className="text-navy">
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loan Details */}
      <Card>
        <Collapsible open={loanDetailsOpen} onOpenChange={setLoanDetailsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Loan Details</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-navy">
                    View More
                  </Button>
                  {loanDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                Loan details would be displayed here...
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* History */}
      <Card>
        <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">History</CardTitle>
                {historyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Visit</Button>
                <Button variant="default" size="sm">Calling</Button>
                <Button variant="outline" size="sm">Legal</Button>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                No recent data found
              </div>
              <Button variant="ghost" size="sm" className="text-navy w-full">
                View More
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Visit Status Quick Checks */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Visit Done</span>
            <div className="flex gap-2">
              <Button
                variant={visitStatus.visitDone ? "default" : "outline"}
                size="sm"
                onClick={() => setVisitStatus(prev => ({ ...prev, visitDone: true }))}
                className="w-12"
              >
                Yes
              </Button>
              <Button
                variant={!visitStatus.visitDone ? "default" : "outline"}
                size="sm"
                onClick={() => setVisitStatus(prev => ({ ...prev, visitDone: false }))}
                className="w-12"
              >
                No
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Customer Met</span>
            <div className="flex gap-2">
              <Button
                variant={visitStatus.customerMet ? "default" : "outline"}
                size="sm"
                onClick={() => setVisitStatus(prev => ({ ...prev, customerMet: true }))}
                className="w-12"
              >
                Yes
              </Button>
              <Button
                variant={!visitStatus.customerMet ? "default" : "outline"}
                size="sm"
                onClick={() => setVisitStatus(prev => ({ ...prev, customerMet: false }))}
                className="w-12"
              >
                No
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Amount Collected</span>
            <div className="flex gap-2">
              <Button
                variant={visitStatus.amountCollected ? "default" : "outline"}
                size="sm"
                onClick={() => setVisitStatus(prev => ({ ...prev, amountCollected: true }))}
                className="w-12"
              >
                Yes
              </Button>
              <Button
                variant={!visitStatus.amountCollected ? "default" : "outline"}
                size="sm"
                onClick={() => setVisitStatus(prev => ({ ...prev, amountCollected: false }))}
                className="w-12"
              >
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowAddressDialog(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Address
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowLocationDialog(true)}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Mark Location
        </Button>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Address Addition</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              Add address via form
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Navigation className="w-4 h-4 mr-2" />
              Using current location
            </Button>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Primary Address</h4>
              <p className="text-sm text-muted-foreground">{customerData.address}</p>
            </div>
            
            <div className="text-center text-muted-foreground">
              No Last Visit Data Found
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mark Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Mark Your Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Mock map area */}
            <div className="h-40 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Map View</span>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Noida</h4>
              <p className="text-sm text-muted-foreground mb-4">
                11th Floor, World Trade Tower, Block B, Sector 16, Noida, Uttar Pradesh 201301, India
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="house">House/Flat Number</Label>
                <Input
                  id="house"
                  placeholder="House/Flat Number"
                  value={addressForm.houseNumber}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, houseNumber: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  placeholder="Floor"
                  value={addressForm.floor}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, floor: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="block">Tower/Block/Street Name</Label>
                <Input
                  id="block"
                  placeholder="Tower/Block/Street Name"
                  value={addressForm.blockName}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, blockName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Select</Label>
                <Select value={addressForm.addressType} onValueChange={(value) => setAddressForm(prev => ({ ...prev, addressType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="label">Enter Label *</Label>
                <Input
                  id="label"
                  placeholder="Enter Label"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="primary"
                  checked={addressForm.isPrimary}
                  onCheckedChange={(checked) => setAddressForm(prev => ({ ...prev, isPrimary: checked as boolean }))}
                />
                <Label htmlFor="primary" className="text-sm">Mark as primary address</Label>
              </div>
            </div>
            
            <Button className="w-full">Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}