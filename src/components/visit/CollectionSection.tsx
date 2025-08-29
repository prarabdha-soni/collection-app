import { DollarSign, Edit, QrCode, Share2, MessageSquare, Mail } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface CollectionData {
  otherPenalty: { due: number; collected: number };
  lateFee: { due: number; collected: number };
  convenienceCharges: { due: number; collected: number };
  principalOutstanding: { due: number; collected: number };
}

interface CollectionSectionProps {
  totalAmount: number;
  onAmountChange: (amount: number) => void;
}

export function CollectionSection({ totalAmount, onAmountChange }: CollectionSectionProps) {
  const [collectionMethod, setCollectionMethod] = useState<"cash" | "cheque" | "online">("cash");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendMethod, setSendMethod] = useState<"sms" | "email">("sms");
  const [saveForFuture, setSaveForFuture] = useState(false);
  
  const [collectionData, setCollectionData] = useState<CollectionData>({
    otherPenalty: { due: 0, collected: 0 },
    lateFee: { due: 0, collected: 0 },
    convenienceCharges: { due: 0, collected: 0 },
    principalOutstanding: { due: 0, collected: 0 },
  });

  const updateCollectedAmount = (component: keyof CollectionData, amount: number) => {
    setCollectionData(prev => ({
      ...prev,
      [component]: { ...prev[component], collected: amount }
    }));
    
    // Calculate total collected
    const total = Object.values({
      ...collectionData,
      [component]: { ...collectionData[component], collected: amount }
    }).reduce((sum, item) => sum + item.collected, 0);
    
    onAmountChange(total);
  };

  const generateQRCode = () => {
    setShowQRDialog(true);
  };

  const sendPaymentLink = () => {
    setShowPaymentDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Collection Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Collection Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2 text-xs font-medium text-muted-foreground mb-3">
            <div>Components</div>
            <div className="text-center">Due Amount</div>
            <div className="text-center">Collected Amount</div>
          </div>

          {/* Other Penalty */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <Label className="text-sm">Other penalty</Label>
            <div className="bg-muted px-3 py-2 rounded text-sm text-center">
              ₹ {collectionData.otherPenalty.due}
            </div>
            <Input
              type="number"
              placeholder="0"
              value={collectionData.otherPenalty.collected || ""}
              onChange={(e) => updateCollectedAmount("otherPenalty", Number(e.target.value) || 0)}
              className="text-center"
            />
          </div>

          {/* Late Fee */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <Label className="text-sm">Late fee</Label>
            <div className="bg-muted px-3 py-2 rounded text-sm text-center">
              ₹ {collectionData.lateFee.due}
            </div>
            <Input
              type="number"
              placeholder="0"
              value={collectionData.lateFee.collected || ""}
              onChange={(e) => updateCollectedAmount("lateFee", Number(e.target.value) || 0)}
              className="text-center"
            />
          </div>

          {/* Convenience Charges */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <Label className="text-sm">Convenience charges</Label>
            <div className="bg-muted px-3 py-2 rounded text-sm text-center">
              ₹ {collectionData.convenienceCharges.due}
            </div>
            <Input
              type="number"
              placeholder="0"
              value={collectionData.convenienceCharges.collected || ""}
              onChange={(e) => updateCollectedAmount("convenienceCharges", Number(e.target.value) || 0)}
              className="text-center"
            />
          </div>

          {/* Principal Outstanding */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <Label className="text-sm">Principal outstanding amount</Label>
            <div className="bg-muted px-3 py-2 rounded text-sm text-center">
              ₹ {collectionData.principalOutstanding.due}
            </div>
            <Input
              type="number"
              placeholder="0"
              value={collectionData.principalOutstanding.collected || ""}
              onChange={(e) => updateCollectedAmount("principalOutstanding", Number(e.target.value) || 0)}
              className="text-center"
            />
          </div>
        </CardContent>
      </Card>

      {/* Collection Method */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Collection Method:</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={collectionMethod} 
            onValueChange={(value) => setCollectionMethod(value as typeof collectionMethod)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash">Cash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cheque" id="cheque" />
              <Label htmlFor="cheque">Cheque</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online">Online</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Share Link Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Share Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button variant="outline" onClick={generateQRCode} className="flex-1">
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Collected Amount: ₹ {totalAmount}</span>
            <Button variant="ghost" size="sm" className="text-navy">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
          
          <Button onClick={sendPaymentLink} className="w-full">
            Send Payment Link
          </Button>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-semibold">Collected Amount: ₹ {totalAmount}</div>
              <Button variant="ghost" size="sm" className="text-navy">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            
            {/* Mock QR Code */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-muted-foreground" />
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Generate QR
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Link Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>Send Payment Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-semibold">Collected Amount: ₹ {totalAmount}</div>
            </div>
            
            <RadioGroup value={sendMethod} onValueChange={(value) => setSendMethod(value as typeof sendMethod)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms-option" />
                <Label htmlFor="sms-option" className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email-option" />
                <Label htmlFor="email-option" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
              </div>
            </RadioGroup>
            
            <div className="flex gap-2">
              <div className="bg-muted px-3 py-2 rounded text-sm">+91</div>
              <Input
                placeholder="Add Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button size="sm">Add</Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-future"
                checked={saveForFuture}
                onCheckedChange={(checked) => setSaveForFuture(checked as boolean)}
              />
              <Label htmlFor="save-future" className="text-sm">Save for Future</Label>
            </div>
            
            <Button className="w-full">
              Send Payment Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
