import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { ArrowLeft, Phone, MapPin, Camera, Save } from 'lucide-react-native';

interface VisitScreenProps {
  navigation: any;
  route: any;
}

export function VisitScreen({ navigation, route }: VisitScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    customerMet: null as boolean | null,
    visitDone: null as boolean | null,
    amountCollected: '',
    comments: '',
    photos: [] as string[]
  });

  const customerData = {
    name: route?.params?.customerName || "Rajesh Kumar",
    id: route?.params?.customerId || "CUST001",
    address: "Andheri East, Mumbai - 400069",
    phone: "+91 98765 43210"
  };

  const steps = [
    "Customer Details",
    "Visit Information", 
    "Collection",
    "Summary"
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      "Submit Visit",
      "Are you sure you want to submit this visit report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            Alert.alert("Success", "Visit report submitted successfully!");
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Customer Information</Text>
            
            <View style={styles.customerCard}>
              <Text style={styles.customerName}>{customerData.name}</Text>
              <Text style={styles.customerId}>ID: {customerData.id}</Text>
              
              <View style={styles.addressContainer}>
                <MapPin size={16} color="gray" />
                <Text style={styles.addressText}>{customerData.address}</Text>
              </View>
              
              <TouchableOpacity style={styles.phoneContainer}>
                <Phone size={16} color="#3b82f6" />
                <Text style={styles.phoneText}>{customerData.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Visit Details</Text>
            
            <View style={styles.formSection}>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Was the customer met?</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setFormData({...formData, customerMet: true})}
                    style={[
                      styles.choiceButton,
                      formData.customerMet === true ? styles.yesButton : styles.defaultButton
                    ]}
                  >
                    <Text style={[
                      styles.choiceButtonText,
                      formData.customerMet === true ? styles.whiteText : styles.defaultText
                    ]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFormData({...formData, customerMet: false})}
                    style={[
                      styles.choiceButton,
                      formData.customerMet === false ? styles.noButton : styles.defaultButton
                    ]}
                  >
                    <Text style={[
                      styles.choiceButtonText,
                      formData.customerMet === false ? styles.whiteText : styles.defaultText
                    ]}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>Visit completed?</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={() => setFormData({...formData, visitDone: true})}
                    style={[
                      styles.choiceButton,
                      formData.visitDone === true ? styles.yesButton : styles.defaultButton
                    ]}
                  >
                    <Text style={[
                      styles.choiceButtonText,
                      formData.visitDone === true ? styles.whiteText : styles.defaultText
                    ]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFormData({...formData, visitDone: false})}
                    style={[
                      styles.choiceButton,
                      formData.visitDone === false ? styles.noButton : styles.defaultButton
                    ]}
                  >
                    <Text style={[
                      styles.choiceButtonText,
                      formData.visitDone === false ? styles.whiteText : styles.defaultText
                    ]}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Collection Details</Text>
            
            <View style={styles.formSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Amount Collected (₹)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter amount"
                  value={formData.amountCollected}
                  onChangeText={(text) => setFormData({...formData, amountCollected: text})}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Comments</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Enter any comments or notes..."
                  value={formData.comments}
                  onChangeText={(text) => setFormData({...formData, comments: text})}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity style={styles.photoButton}>
                <Camera size={20} color="gray" />
                <Text style={styles.photoButtonText}>Add Photos</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Visit Summary</Text>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Customer</Text>
                <Text style={styles.summaryValue}>{customerData.name}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Customer Met</Text>
                <Text style={styles.summaryValue}>{formData.customerMet ? 'Yes' : 'No'}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Visit Completed</Text>
                <Text style={styles.summaryValue}>{formData.visitDone ? 'Yes' : 'No'}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Amount Collected</Text>
                <Text style={styles.summaryValue}>₹{formData.amountCollected || '0'}</Text>
              </View>
              
              {formData.comments && (
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Comments</Text>
                  <Text style={styles.summaryValue}>{formData.comments}</Text>
                </View>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Visit Report</Text>
        </View>
        
        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepIndicator}>
              <View style={[
                styles.stepCircle,
                index <= currentStep ? styles.activeStepCircle : styles.inactiveStepCircle
              ]}>
                <Text style={[
                  styles.stepNumber,
                  index <= currentStep ? styles.activeStepText : styles.inactiveStepText
                ]}>{index + 1}</Text>
              </View>
              <Text style={styles.stepLabel}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={[styles.navButton, styles.previousButton]}
            >
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={currentStep === steps.length - 1 ? handleSubmit : handleNext}
            style={[styles.navButton, styles.nextButton]}
          >
            <View style={styles.nextButtonContent}>
              {currentStep === steps.length - 1 && <Save size={16} color="white" />}
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  stepIndicator: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStepCircle: {
    backgroundColor: '#3b82f6',
  },
  inactiveStepCircle: {
    backgroundColor: '#d1d5db',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeStepText: {
    color: 'white',
  },
  inactiveStepText: {
    color: '#6b7280',
  },
  stepLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    gap: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  customerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  customerId: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneText: {
    color: '#3b82f6',
    marginLeft: 8,
  },
  formSection: {
    gap: 16,
  },
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  defaultButton: {
    backgroundColor: 'white',
    borderColor: '#d1d5db',
  },
  yesButton: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  noButton: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  choiceButtonText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  whiteText: {
    color: 'white',
  },
  defaultText: {
    color: '#374151',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#111827',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  photoButtonText: {
    color: '#6b7280',
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  summaryItem: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryValue: {
    fontWeight: '500',
    color: '#111827',
  },
  navigationContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  previousButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  previousButtonText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#374151',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
  },
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    textAlign: 'center',
    fontWeight: '500',
    color: 'white',
    marginLeft: 4,
  },
});