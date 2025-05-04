
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, LineChart, PieChart } from 'recharts';
import StatusCard from '@/components/StatusCard';
import { useResourceData } from '@/hooks/useResourceData';
import { 
  BarChart2, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  DownloadCloud,
  Brain
} from 'lucide-react';

const AdminInsights: React.FC = () => {
  const [insightType, setInsightType] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  const { toast } = useToast();
  
  const {
    items: resources,
    allocations,
    locations,
    analysis,
    isLoading,
    refreshData
  } = useResourceData();
  
  // Sample resource usage data for charts
  const resourceUsageData = [
    { name: 'Jan', medical: 40, food: 24, water: 14, shelter: 22 },
    { name: 'Feb', medical: 30, food: 13, water: 25, shelter: 38 },
    { name: 'Mar', medical: 20, food: 30, water: 22, shelter: 40 },
    { name: 'Apr', medical: 27, food: 20, water: 15, shelter: 28 },
    { name: 'May', medical: 18, food: 38, water: 30, shelter: 35 },
    { name: 'Jun', medical: 23, food: 45, water: 35, shelter: 40 },
  ];
  
  const resourceTypeDistribution = [
    { name: 'Medical', value: resources.filter(r => r.type === 'Medical').length },
    { name: 'Food', value: resources.filter(r => r.type === 'Food').length },
    { name: 'Water', value: resources.filter(r => r.type === 'Water').length },
    { name: 'Shelter', value: resources.filter(r => r.type === 'Shelter').length },
    { name: 'Equipment', value: resources.filter(r => r.type === 'Equipment').length },
  ];
  
  const downloadReport = () => {
    toast({
      title: "Report downloaded",
      description: "The insights report has been generated and downloaded.",
    });
  };

  const renderAnalysisInsights = () => {
    if (!analysis) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
          <Brain className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">No AI Analysis Available</h3>
          <p className="text-sm text-gray-500 text-center mt-2 max-w-md">
            Refresh the data to generate AI insights about your resources and operations.
          </p>
          <Button variant="outline" className="mt-4" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Insights
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <h3 className="text-lg font-medium flex items-center">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Resource Optimization Analysis
          </h3>
          <p className="mt-2 text-gray-600">{analysis.analysis}</p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-green-500 flex-shrink-0">
                        <Check className="h-4 w-4" />
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Critical Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-amber-500 flex-shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <span className="text-sm">
                      Water filtration equipment is in critically low supply which could pose challenges during flood response operations.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-amber-500 flex-shrink-0">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <span className="text-sm">
                      Delhi Warehouse is approaching maximum capacity (85%) which may impact future resource allocation.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-500 flex-shrink-0">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                    <span className="text-sm">
                      Medical supplies distribution has increased by 27% over the previous month.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">AI Insights & Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              AI-powered analysis of resource utilization and emergency response
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={refreshData} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button variant="outline" onClick={downloadReport} className="flex items-center gap-1">
              <DownloadCloud className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard
                title="Total Resources"
                value={resources.length.toString()}
                icon={<BarChart2 className="h-6 w-6" />}
                change={{ value: 12, isPositive: true }}
              />
              
              <StatusCard
                title="Low Stock Items"
                value={resources.filter(r => r.status === 'Low Stock').length.toString()}
                icon={<AlertTriangle className="h-6 w-6" />}
                change={{ value: 5, isPositive: false }}
              />
              
              <StatusCard
                title="Active Allocations"
                value={allocations.filter(a => a.status !== 'Delivered').length.toString()}
                icon={<TrendingUp className="h-6 w-6" />}
                change={{ value: 8, isPositive: true }}
              />
              
              <StatusCard
                title="Storage Utilization"
                value={`${Math.round(locations.reduce((sum, loc) => sum + parseInt(loc.capacity), 0) / locations.length)}%`}
                icon={<PieChartIcon className="h-6 w-6" />}
                change={{ value: 3, isPositive: false }}
              />
            </div>
            
            <Tabs defaultValue={insightType} onValueChange={setInsightType} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Resource Overview</TabsTrigger>
                <TabsTrigger value="trends">Usage Trends</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resource Distribution by Type</CardTitle>
                      <CardDescription>
                        Current inventory breakdown by resource category
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <PieChart 
                        width={500} 
                        height={300} 
                        data={resourceTypeDistribution}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Storage Location Utilization</CardTitle>
                      <CardDescription>
                        Storage capacity utilization across locations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      <BarChart
                        width={500}
                        height={300}
                        data={locations.map(loc => ({
                          name: loc.name.split(' ')[0],
                          capacity: parseInt(loc.capacity),
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resource Usage Trends</CardTitle>
                    <CardDescription>
                      {timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Quarterly'} resource allocation by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                    <LineChart
                      width={800}
                      height={350}
                      data={resourceUsageData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis">
                {renderAnalysisInsights()}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInsights;
