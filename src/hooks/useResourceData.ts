
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { analyzeDataWithGemini, GeminiAnalysisResponse } from '@/utils/geminiService';

export interface ResourceItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
  location: string;
  status: string;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  resourceName: string;
  quantity: number;
  location: string;
  emergency: string;
  date: string;
  status: string;
}

export interface StorageLocation {
  id: string;
  name: string;
  type: string;
  capacity: string;
}

export interface RecentActivity {
  id: number;
  type: string;
  title: string;
  location: string;
  time: string;
}

export interface ResourceData {
  items: ResourceItem[];
  allocations: ResourceAllocation[];
  locations: StorageLocation[];
  recentActivities: RecentActivity[];
  volunteerCount: number;
  activeEmergencies: number;
  reportsSubmitted: number;
  aiPredictions: number;
  analysis: GeminiAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const useResourceData = () => {
  const [data, setData] = useState<ResourceData>({
    items: [],
    allocations: [],
    locations: [],
    recentActivities: [],
    volunteerCount: 0,
    activeEmergencies: 0,
    reportsSubmitted: 0,
    aiPredictions: 16, // Currently hardcoded as there's no AI predictions table
    analysis: null,
    isLoading: true,
    error: null,
  });

  const fetchResourceData = async () => {
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Fetch resources from the database
      const { data: resourceItems, error: resourcesError } = await supabase
        .from('resources')
        .select('*');
      
      if (resourcesError) throw resourcesError;

      // Fetch volunteer count (all users with role 'volunteer')
      const { count: volunteerCount, error: volunteersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'volunteer');
      
      if (volunteersError) throw volunteersError;

      // Fetch emergency reports count
      const { data: allReports, error: reportsError } = await supabase
        .from('emergency_reports')
        .select('*');
      
      if (reportsError) throw reportsError;

      // Count active emergencies (status is not 'resolved')
      const activeEmergencies = allReports.filter(report => 
        report.status !== 'resolved').length;
      
      // Convert resources to the expected format
      const formattedResources: ResourceItem[] = resourceItems.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
        quantity: item.quantity,
        location: item.location,
        status: item.status
      }));

      // Sample storage locations (in a real app, would come from database)
      const storageLocations = [
        { id: 'L-1001', name: 'Delhi Warehouse', type: 'Warehouse', capacity: '85%' },
        { id: 'L-1002', name: 'Mumbai Storage', type: 'Storage', capacity: '70%' },
        { id: 'L-1003', name: 'Chennai Depot', type: 'Depot', capacity: '45%' },
        { id: 'L-1004', name: 'Kolkata Center', type: 'Distribution Center', capacity: '60%' },
        { id: 'L-1005', name: 'Kerala Storage', type: 'Storage', capacity: '30%' },
      ];

      // Sample allocations (in a real app, would come from database)
      const resourceAllocations = [
        {
          id: 'A-1001',
          resourceId: 'R-1001',
          resourceName: 'First Aid Kits',
          quantity: 50,
          location: 'Kerala',
          emergency: 'Flood Relief',
          date: '2023-07-21',
          status: 'In Transit',
        },
        {
          id: 'A-1002',
          resourceId: 'R-1002',
          resourceName: 'Emergency Food Packages',
          quantity: 100,
          location: 'Maharashtra',
          emergency: 'Drought Relief',
          date: '2023-07-20',
          status: 'Delivered',
        },
        {
          id: 'A-1003',
          resourceId: 'R-1005',
          resourceName: 'Rescue Boats',
          quantity: 5,
          location: 'Kerala',
          emergency: 'Flood Relief',
          date: '2023-07-19',
          status: 'Deployed',
        },
        {
          id: 'A-1004',
          resourceId: 'R-1007',
          resourceName: 'Medical Oxygen Cylinders',
          quantity: 25,
          location: 'Delhi',
          emergency: 'Hospital Support',
          date: '2023-07-18',
          status: 'Delivered',
        },
      ];

      // Get real-time data for recent activities from emergency reports
      const recentActivities = allReports
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((report, index) => {
          const createdDate = new Date(report.created_at);
          const now = new Date();
          const diffHours = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
          
          return {
            id: index + 1,
            type: report.type.toLowerCase().includes('flood') ? 'emergency' : 
                  report.type.toLowerCase().includes('fire') ? 'alert' :
                  report.type.toLowerCase().includes('storm') ? 'prediction' :
                  'report',
            title: report.type,
            location: report.location,
            time: `${diffHours} hours ago`,
          };
        });

      // If there are fewer than 5 emergency reports, add some simulated activities
      if (recentActivities.length < 5) {
        const simulatedActivities = [
          {
            id: recentActivities.length + 1,
            type: 'emergency',
            title: 'Flash floods reported',
            location: 'Kerala, India',
            time: `${Math.floor(Math.random() * 4) + 1} hours ago`,
          },
          {
            id: recentActivities.length + 2,
            type: 'alert',
            title: 'Storm warning issued',
            location: 'Mumbai, India',
            time: `${Math.floor(Math.random() * 6) + 3} hours ago`,
          },
          {
            id: recentActivities.length + 3,
            type: 'update',
            title: 'Relief supplies deployed',
            location: 'Chennai, India',
            time: `${Math.floor(Math.random() * 5) + 6} hours ago`,
          },
          {
            id: recentActivities.length + 4,
            type: 'prediction',
            title: 'Landslide risk increasing',
            location: 'Himachal Pradesh, India',
            time: `${Math.floor(Math.random() * 4) + 8} hours ago`,
          },
          {
            id: recentActivities.length + 5,
            type: 'report',
            title: 'Fire incident contained',
            location: 'Delhi, India',
            time: `${Math.floor(Math.random() * 12) + 12} hours ago`,
          },
        ];
        
        // Add only as many activities as needed to reach 5
        for (let i = 0; i < 5 - recentActivities.length; i++) {
          recentActivities.push(simulatedActivities[i]);
        }
      }

      // Now get AI analysis of this data using Gemini
      const resourceAnalysis = await analyzeDataWithGemini({
        data: {
          type: 'resources',
          items: formattedResources,
          locations: storageLocations,
        },
        prompt: "Analyze resource distribution across India and provide recommendations",
      });

      // Get activity analysis
      const activityAnalysis = await analyzeDataWithGemini({
        data: {
          type: 'activities',
          totalActivities: recentActivities.length,
          regions: ['Kerala', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'Gujarat'],
          emergencyCount: activeEmergencies,
          mostActiveRegion: 'Kerala',
          responseImprovement: 15
        },
        prompt: "Analyze recent activity patterns across India and provide insights",
      });
      
      // Get volunteer analysis
      const volunteerAnalysis = await analyzeDataWithGemini({
        data: {
          type: 'volunteers',
          count: volunteerCount || 0,
          activeCount: Math.floor((volunteerCount || 0) * 0.75),
          topRegion: 'Kerala',
          coveragePercent: 68
        },
        prompt: "Analyze volunteer distribution across India and provide recommendations",
      });

      // Combine the analyses
      const combinedAnalysis = {
        analysis: resourceAnalysis.analysis + "\n\n" + activityAnalysis.analysis + "\n\n" + volunteerAnalysis.analysis,
        recommendations: [
          ...resourceAnalysis.recommendations, 
          ...activityAnalysis.recommendations,
          ...volunteerAnalysis.recommendations
        ],
        summary: resourceAnalysis.summary + " " + activityAnalysis.summary + " " + volunteerAnalysis.summary
      };

      setData({
        items: formattedResources,
        allocations: resourceAllocations,
        locations: storageLocations,
        recentActivities: recentActivities,
        volunteerCount: volunteerCount || 0,
        activeEmergencies: activeEmergencies,
        reportsSubmitted: allReports.length,
        aiPredictions: 16, // Currently hardcoded as there's no AI predictions table
        analysis: combinedAnalysis,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error fetching resource data:", error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to fetch resource data",
      }));
      toast.error("Failed to fetch resource data");
    }
  };

  useEffect(() => {
    fetchResourceData();
  }, []);

  const refreshData = () => {
    fetchResourceData();
  };

  return { ...data, refreshData };
};
