import { ArrowLeft, Camera, X, MapPin, Clock, CheckCircle, AlertCircle, Image as ImageIcon, Upload, User, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { ContactDetailsSection } from "@/components/visit/ContactDetailsSection";
import { CollectionSection } from "@/components/visit/CollectionSection";
import { VisitDetailsSection } from "@/components/visit/VisitDetailsSection";

interface FormData {
  status: string;
  proofOfVisit: string;
  proofOfCollection: string;
  comments: string;
  assetVisible: string;
  employmentType: string;
  amountCollected: string;
}

interface FormErrors {
  [key: string]: string;
}

export function VisitScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [visitImages, setVisitImages] = useState<string[]>([]);
  const [collectionImages, setCollectionImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    status: "partially-recovered",
    proofOfVisit: "",
    proofOfCollection: "",
    comments: "",
    assetVisible: "",
    employmentType: "",
    amountCollected: "20"
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  const customerData = {
    name: "Mr. JASVINDR BUCHA SINGH",
    id: "Loan_id_1",
    address: "Sector 15, Chandigarh",
    phone: "+91 9876543210"
  };

  const visitDetailsData = {
    markedLocation: "",
    scheduledFor: "Spandan",
    scheduledBy: "Spandan",
    subDisposition2: "",
    subDisposition1: "",
    disposition: "",
    comment: "",
    committedAmount: 0,
    isCustomerMet: false,
    isVisitDone: false,
    visitPurpose: "Surprise Visit",
    visitId: "LLALrkShIzTE"
  };

  const totalSteps = 3;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.status) newErrors.status = "Status is required";
    if (visitImages.length === 0) newErrors.proofOfVisit = "At least one visit photo is required";
    if (formData.status !== "no-recovery" && collectionImages.length === 0) {
      newErrors.proofOfCollection = "Collection proof is required for recovery cases";
    }
    if (!formData.assetVisible) newErrors.assetVisible = "Asset visibility status is required";
    if (!formData.employmentType) newErrors.employmentType = "Employment type is required";
    if (formData.status !== "no-recovery" && !formData.amountCollected) {
      newErrors.amountCollected = "Amount collected is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const pickImage = async (type: 'visit' | 'collection') => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = false;
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            toast({
              title: "File too large",
              description: "Please select an image smaller than 5MB",
              variant: "destructive"
            });
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            if (type === 'visit') {
              setVisitImages(prev => [...prev, imageUrl]);
              if (errors.proofOfVisit) setErrors(prev => ({ ...prev, proofOfVisit: "" }));
            } else {
              setCollectionImages(prev => [...prev, imageUrl]);
              if (errors.proofOfCollection) setErrors(prev => ({ ...prev, proofOfCollection: "" }));
            }
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Error picking image:', error);
      toast({
        title: "Error",
        description: "Failed to select image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const takePicture = async (type: 'visit' | 'collection') => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            toast({
              title: "File too large",
              description: "Please select an image smaller than 5MB",
              variant: "destructive"
            });
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            if (type === 'visit') {
              setVisitImages(prev => [...prev, imageUrl]);
              if (errors.proofOfVisit) setErrors(prev => ({ ...prev, proofOfVisit: "" }));
            } else {
              setCollectionImages(prev => [...prev, imageUrl]);
              if (errors.proofOfCollection) setErrors(prev => ({ ...prev, proofOfCollection: "" }));
            }
          };
          reader.readAsDataURL(file);
        }
      };
      
      input.click();
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Error",
        description: "Failed to capture image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeImage = (index: number, type: 'visit' | 'collection') => {
    if (type === 'visit') {
      setVisitImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setCollectionImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Form incomplete",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Visit submitted successfully",
        description: "Your visit form has been recorded",
        variant: "default"
      });
      
      setShowConfirmDialog(false);
      // Navigate back or reset form
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fully-recovered": return "success";
      case "partially-recovered": return "warning";
      case "no-recovery": return "destructive";
      default: return "default";
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ContactDetailsSection customerData={customerData} />;
      case 2:
        return (
          <div className="space-y-6">
            <CollectionSection 
              totalAmount={Number(formData.amountCollected) || 0}
              onAmountChange={(amount) => handleInputChange('amountCollected', amount.toString())}
            />
            <VisitDetailsSection visitData={visitDetailsData} />
          </div>
        );
      case 3:
        return renderFormSection();
      default:
        return null;
    }
  };

  const renderFormSection = () => (
    <div className="space-y-6">
      {/* Status Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Visit Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger className={errors.status ? "border-destructive" : ""}>
              <SelectValue placeholder="Select visit status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fully-recovered">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Fully Recovered by Agent
                </div>
              </SelectItem>
              <SelectItem value="partially-recovered">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  Partially Recovered by Agent
                </div>
              </SelectItem>
              <SelectItem value="no-recovery">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-destructive" />
                  No Recovery
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-destructive mt-1">{errors.status}</p>}
        </CardContent>
      </Card>

      {/* Amount Collected */}
      {formData.status !== "no-recovery" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Amount Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.amountCollected}
                onChange={(e) => handleInputChange('amountCollected', e.target.value)}
                className={`pl-8 ${errors.amountCollected ? "border-destructive" : ""}`}
              />
            </div>
            {errors.amountCollected && <p className="text-sm text-destructive mt-1">{errors.amountCollected}</p>}
          </CardContent>
        </Card>
      )}

      {/* Proof of Visit */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            Proof of Visit
            <span className="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {visitImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img src={image} alt="Visit proof" className="w-full h-full object-cover" />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index, 'visit')}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
            
            {visitImages.length < 4 && (
              <>
                <div 
                  className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => takePicture('visit')}
                >
                  <Camera className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Camera</span>
                </div>
                
                <div 
                  className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => pickImage('visit')}
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Gallery</span>
                </div>
              </>
            )}
          </div>
          {errors.proofOfVisit && <p className="text-sm text-destructive mt-2">{errors.proofOfVisit}</p>}
        </CardContent>
      </Card>

      {/* Proof of Collection */}
      {formData.status !== "no-recovery" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Proof of Collection
              <span className="text-destructive">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {collectionImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img src={image} alt="Collection proof" className="w-full h-full object-cover" />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index, 'collection')}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              
              {collectionImages.length < 4 && (
                <>
                  <div 
                    className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => takePicture('collection')}
                  >
                    <Camera className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Camera</span>
                  </div>
                  
                  <div 
                    className="aspect-square border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => pickImage('collection')}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Gallery</span>
                  </div>
                </>
              )}
            </div>
            {errors.proofOfCollection && <p className="text-sm text-destructive mt-2">{errors.proofOfCollection}</p>}
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comments */}
          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea 
              id="comments"
              placeholder="Add any additional comments about the visit..."
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* Asset Visible */}
          <div>
            <Label htmlFor="asset-visible">Asset Visibility *</Label>
            <Select
              value={formData.assetVisible}
              onValueChange={(value) => handleInputChange('assetVisible', value)}
            >
              <SelectTrigger className={`mt-1 ${errors.assetVisible ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Is the asset visible?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Asset Visible</SelectItem>
                <SelectItem value="not-visible">Asset Not Visible</SelectItem>
                <SelectItem value="partially-visible">Partially Visible</SelectItem>
              </SelectContent>
            </Select>
            {errors.assetVisible && <p className="text-sm text-destructive mt-1">{errors.assetVisible}</p>}
          </div>

          {/* Employment Type */}
          <div>
            <Label htmlFor="employment-type">Employment Type *</Label>
            <Select
              value={formData.employmentType}
              onValueChange={(value) => handleInputChange('employmentType', value)}
            >
              <SelectTrigger className={`mt-1 ${errors.employmentType ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="self-employed">Self Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentType && <p className="text-sm text-destructive mt-1">{errors.employmentType}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-navy to-navy-light text-primary-foreground">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/10"
              onClick={() => navigate('/visits')}
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Visit Form</h1>
              <p className="text-sm text-primary-foreground/80">Step {currentStep} of {totalSteps}</p>
            </div>
          </div>
          
          {/* Customer Info Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{customerData.name}</h3>
                  <p className="text-sm text-white/80 mb-2">Loan ID: {customerData.id}</p>
                  <div className="flex items-center gap-4 text-xs text-white/70">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{customerData.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge 
                  status={formData.status.replace('-', ' ').toUpperCase()} 
                  variant={getStatusColor(formData.status) as any}
                />
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i + 1 <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 space-y-6">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 ? (
            <Button variant="outline" className="flex-1" size="lg" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          ) : (
            <Button variant="outline" className="flex-1" size="lg">
              Previous
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button 
              className="flex-1"
              size="lg"
              onClick={nextStep}
            >
              Next ({currentStep}/{totalSteps})
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              className="flex-1"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Visit"}
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-success" />
              Confirm Submission
            </DialogTitle>
            <DialogDescription className="text-center space-y-2">
              {formData.status !== "no-recovery" && (
                <div className="text-lg font-semibold text-foreground">
                  Amount Collected: ₹{formData.amountCollected}
                </div>
              )}
              <p>Are you sure you want to submit this visit form?</p>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}