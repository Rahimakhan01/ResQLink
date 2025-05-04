
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatusCard from '@/components/StatusCard';
import AIChat from '@/components/AIChat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Users, FileText, BrainCircuit, Flag, MapPin, ArrowUp, ArrowDown, ChevronRight, Loader2 } from 'lucide-react';
import EmergencyFAB from '@/components/EmergencyFAB';
import { useResourceData } from '@/hooks/useResourceData';

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#6B7280'];

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { profile } = useAuth();
  const { 
    isLoading, 
    recentActivities, 
    analysis, 
    refreshData, 
    volunteerCount, 
    activeEmergencies, 
    reportsSubmitted, 
    aiPredictions 
  } = useResourceData();

  // Adjust disasterData from analysis if available
  const disasterData = [
    { name: 'Flood', count: 12 },
    { name: 'Fire', count: 8 },
    { name: 'Earthquake', count: 5 },
    { name: 'Landslide', count: 7 },
    { name: 'Storm', count: 15 },
    { name: 'Other', count: 3 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-emergency" />;
      case 'alert':
        return <Flag className="h-5 w-5 text-warning" />;
      case 'update':
        return <FileText className="h-5 w-5 text-info" />;
      case 'prediction':
        return <BrainCircuit className="h-5 w-5 text-primary" />;
      case 'report':
        return <MapPin className="h-5 w-5 text-success" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 pt-6 md:ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Welcome, {profile?.name || 'User'}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Here's what's happening with disaster management
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <Button variant="outline" onClick={refreshData} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshIcon className="h-4 w-4" />}
                  {isLoading ? 'Loading...' : 'Refresh Data'}
                </Button>
                <Button onClick={() => setIsAIChatOpen(true)}>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Ask AI Assistant
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatusCard 
                title="Active Emergencies"
                value={activeEmergencies.toString()}
                icon={<AlertTriangle className="h-5 w-5" />}
                change={{ value: 12, isPositive: false }}
              />
              <StatusCard 
                title="Volunteers Available"
                value={volunteerCount.toString()}
                icon={<Users className="h-5 w-5" />}
                change={{ value: 8, isPositive: true }}
              />
              <StatusCard 
                title="Reports Submitted"
                value={reportsSubmitted.toString()}
                icon={<FileText className="h-5 w-5" />}
                change={{ value: 5, isPositive: true }}
              />
              <StatusCard 
                title="AI Predictions"
                value={aiPredictions.toString()}
                icon={<BrainCircuit className="h-5 w-5" />}
                change={{ value: 3, isPositive: true }}
              />
            </div>
            
            <div className="mb-8">
              <Tabs defaultValue="disasters">
                <TabsList>
                  <TabsTrigger value="disasters">Disaster Types</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>
                <TabsContent value="disasters" className="mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 neumorphic">
                    <h3 className="text-lg font-medium mb-4">Disaster Type Distribution</h3>
                    {isLoading ? (
                      <div className="h-80 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="h-80">
                        <div className="flex flex-col md:flex-row h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={disasterData}
                              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#8B5CF6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="trends" className="mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 neumorphic">
                    <h3 className="text-lg font-medium mb-4">Disaster Type Distribution</h3>
                    {isLoading ? (
                      <div className="h-80 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="h-80">
                        <div className="flex flex-col md:flex-row h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={disasterData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                                dataKey="count"
                                nameKey="name"
                              >
                                {disasterData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden neumorphic">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentActivities && recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex items-start">
                            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-4">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">{activity.title}</h4>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {activity.time}
                                </span>
                              </div>
                              <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                {activity.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        No recent activities found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">AI Predictions</h3>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 neumorphic">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-900/50 rounded-lg">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/30 mr-4">
                          <BrainCircuit className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Storm Warning</h4>
                          <p className="mt-1 text-sm">High probability of severe storms in the coastal regions of Kerala within the next 24-48 hours.</p>
                          <div className="mt-2 flex items-center text-sm text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>75% probability</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/50 rounded-lg">
                      <div className="flex items-start">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                          <BrainCircuit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">Flood Risk Analysis</h4>
                          <p className="mt-1 text-sm">Increased risk of flash floods in Karnataka due to continuous rainfall and saturated ground conditions.</p>
                          <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>62% probability</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      
      <EmergencyFAB />
    </div>
  );
};

// Simple refresh icon component
const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 2v6h-6"></path>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
    <path d="M3 22v-6h6"></path>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
  </svg>
);

export default Dashboard;
