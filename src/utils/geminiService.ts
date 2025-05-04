
import { toast } from "sonner";

// Gemini API integration for data analysis
export interface GeminiAnalysisRequest {
  data: any;
  prompt: string;
}

export interface GeminiAnalysisResponse {
  analysis: string;
  recommendations: string[];
  summary: string;
}

// Function to analyze data using Gemini API
export const analyzeDataWithGemini = async (
  request: GeminiAnalysisRequest
): Promise<GeminiAnalysisResponse> => {
  try {
    // For demonstration purposes, we'll simulate a Gemini API response
    // In a real implementation, this would make an actual API call
    console.log("Analyzing data with Gemini:", request);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a simulated response based on the input data
    const analysisText = generateAnalysisText(request.data, request.prompt);
    
    return {
      analysis: analysisText,
      recommendations: generateRecommendations(request.data),
      summary: generateSummary(request.data),
    };
  } catch (error) {
    console.error("Error analyzing data with Gemini:", error);
    toast.error("Failed to analyze data. Please try again later.");
    throw error;
  }
};

// Helper function to generate sample analysis text
const generateAnalysisText = (data: any, prompt: string): string => {
  if (data.type === 'resources') {
    // Use the actual resource data if available
    const medicalCount = data.items ? countItemsByType(data.items, 'Medical') : 24;
    const foodCount = data.items ? countItemsByType(data.items, 'Food') : 36;
    const waterCount = data.items ? countItemsByType(data.items, 'Water') : 12;
    const delCapacity = data.locations ? getLocationCapacity('Delhi Warehouse', data.locations) : 75;
    
    return `Analysis of resource distribution across India shows that medical supplies (${medicalCount} items) and food supplies (${foodCount} items) are the most abundant. However, water filtration equipment is in critically low supply (${waterCount} items) which could pose challenges during monsoon flood response operations in Kerala and Mumbai. The Delhi Warehouse is currently at ${delCapacity}% capacity, making it the most utilized storage facility in Northern India.`;
  } else if (data.type === 'activities') {
    // Use actual activity data if available
    const activeRegion = data.mostActiveRegion || (data.regions && data.regions.length > 0 ? data.regions[0] : 'Kerala');
    const emergencyCount = data.emergencyCount || (data.totalActivities ? Math.floor(data.totalActivities * 0.48) : 24);
    const responseImprovement = data.responseImprovement || 15;
    
    return `Recent activity analysis indicates highest engagement in ${activeRegion}, India with ${emergencyCount} active emergencies. Response time has improved by ${responseImprovement}% in the last week across Maharashtra and Gujarat, but resource allocation efficiency needs attention in northern regions of Uttar Pradesh and Bihar.`;
  } else if (data.type === 'admins') {
    // Use actual admin data if available
    const adminCount = data.total || (data.admins ? data.admins.length : 5);
    const approvalRate = data.approvalRate || 22;
    
    return `Admin management analysis shows ${adminCount} active administrators with varying levels of system access across Indian disaster management centers. User approval workflows have improved by ${approvalRate}% since implementing the new verification system.`;
  } else if (data.type === 'volunteers') {
    // Use actual volunteer data if available
    const volunteerCount = data.count || 158;
    const activeCount = data.activeCount || Math.floor(volunteerCount * 0.75);
    const topRegion = data.topRegion || 'Kerala';
    
    return `Currently tracking ${volunteerCount} registered volunteers across India with ${activeCount} actively participating in relief operations. The highest concentration of volunteers is in ${topRegion} (${Math.floor(volunteerCount * 0.3)} volunteers), followed by Maharashtra and Tamil Nadu. There's a critical need for more trained volunteers in northeastern states.`;
  }
  return "Data analysis complete for Indian disaster management. See recommendations for suggested actions.";
};

// Helper function to generate sample recommendations
const generateRecommendations = (data: any): string[] => {
  if (data.type === 'resources') {
    // Generate resource-specific recommendations
    const waterShortage = data.items ? (countItemsByType(data.items, 'Water') < 15) : true;
    const medicalSurplus = data.items ? (countItemsByType(data.items, 'Medical') > 30) : true;
    
    let recommendations = [
      "Accelerate deployment of rescue equipment to Kerala for upcoming monsoon season.",
      "Consider preventative maintenance schedule for power generators to avoid outages during storm season in Mumbai and Chennai."
    ];
    
    if (waterShortage) {
      recommendations.unshift("Increase water filtration equipment inventory by 30% to address the critical shortage in flood-prone regions of India.");
    }
    
    if (medicalSurplus) {
      recommendations.push("Redistribute 15% of medical supplies from Delhi Warehouse to Chennai Depot to balance storage utilization across northern and southern India.");
    }
    
    return recommendations;
  } else if (data.type === 'activities') {
    // Generate activity-specific recommendations
    const lowEngagement = data.regions && data.regions.includes('Maharashtra');
    
    let recommendations = [
      "Implement the response time optimization protocol in Delhi to reduce emergency resolution time.",
      "Increase public awareness campaigns in rural areas of Bihar and Uttar Pradesh where reporting rates are below average.",
      "Consider implementing a mobile emergency reporting system to improve accessibility in remote Indian villages."
    ];
    
    if (lowEngagement) {
      recommendations.unshift("Deploy additional volunteer teams to Maharashtra where engagement is lowest compared to emergency frequency.");
    }
    
    return recommendations;
  } else if (data.type === 'admins') {
    // Generate admin-specific recommendations
    const securityFocus = data.admins && data.admins.length > 3;
    
    let recommendations = [
      "Create specialized admin roles based on regional disaster types across different Indian states.",
      "Schedule quarterly security training for all administrators managing critical Indian disaster response systems.",
      "Consider implementing audit logs for sensitive operations affecting resource allocation to high-risk zones."
    ];
    
    if (securityFocus) {
      recommendations.unshift("Implement two-factor authentication for all admin accounts to enhance security of the Indian disaster management system.");
    }
    
    return recommendations;
  } else if (data.type === 'volunteers') {
    return [
      "Launch recruitment drive for volunteers in northeastern states of India where coverage is currently low.",
      "Implement advanced training program for flood rescue operations in Kerala and West Bengal.",
      "Develop volunteer retention strategy with recognition program for long-term participants.",
      "Create specialized volunteer teams for different disaster types based on regional risk profiles."
    ];
  }
  return ["No specific recommendations for Indian disaster management at this time."];
};

// Helper function to generate a summary
const generateSummary = (data: any): string => {
  if (data.type === 'resources') {
    // Use actual resource data if available
    const itemCount = data.items ? data.items.length : 76;
    const locationCount = data.locations ? data.locations.length : 4;
    const avgUtilization = data.locations ? calculateAverageUtilization(data.locations) : 68;
    
    return `Total of ${itemCount} resource items across ${locationCount} storage locations in India with an average utilization of ${avgUtilization}%.`;
  } else if (data.type === 'activities') {
    // Use actual activity data if available
    const totalActivities = data.totalActivities || 50;
    const regionCount = data.regions ? data.regions.length : 8;
    const emergencyCount = data.emergencyCount || Math.floor(totalActivities * 0.48);
    
    return `${totalActivities} activities recorded in the past week across ${regionCount} Indian regions with ${emergencyCount} active emergencies.`;
  } else if (data.type === 'admins') {
    // Use actual admin data if available
    const adminCount = data.total || (data.admins ? data.admins.length : 5);
    const avgApprovalTime = data.avgApprovalTime || 4.2;
    
    return `${adminCount} administrators managing disaster response platform operations across India with an average approval time of ${avgApprovalTime} hours.`;
  } else if (data.type === 'volunteers') {
    const volunteerCount = data.count || 158;
    const coveragePercent = data.coveragePercent || 68;
    
    return `${volunteerCount} registered volunteers providing ${coveragePercent}% coverage across disaster-prone regions of India.`;
  }
  return "Summary not available for this data type related to Indian disaster management.";
};

// Helper function to count items by type
const countItemsByType = (items: any[], type: string): number => {
  return items.filter(item => item.type === type).length;
};

// Helper function to get location capacity
const getLocationCapacity = (locationName: string, locations: any[]): string => {
  const location = locations.find(loc => loc.name === locationName);
  if (location) {
    return location.capacity.replace('%', '');
  }
  return "0";
};

// Helper function to calculate average utilization
const calculateAverageUtilization = (locations: any[]): number => {
  if (!locations || locations.length === 0) return 0;
  
  const total = locations.reduce((sum, location) => {
    const capacityValue = parseInt(location.capacity.replace('%', ''));
    return isNaN(capacityValue) ? sum : sum + capacityValue;
  }, 0);
  
  return Math.round(total / locations.length);
};
