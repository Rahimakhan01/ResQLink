import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import StatusCard from '@/components/StatusCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { AlertTriangle, Users, FileText, Package, Map, Eye, Filter, Download, ArrowUpDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useResourceData } from '@/hooks/useResourceData';

// Mock data for charts
const disasterData = [
  { name: 'Flood', count: 32 },
  { name: 'Fire', count: 18 },
  { name: 'Earthquake', count: 7 },
  { name: 'Landslide', count: 14 },
  { name: 'Storm', count: 26 },
  { name: 'Other', count: 9 },
];

const monthlyData = [
  { name: 'Jan', reports: 15, resolved: 12 },
  { name: 'Feb', reports: 18, resolved: 15 },
  { name: 'Mar', reports: 25, resolved: 22 },
  { name: 'Apr', reports: 30, resolved: 25 },
  { name: 'May', reports: 45, resolved: 40 },
  { name: 'Jun', reports: 55, resolved: 45 },
  { name: 'Jul', reports: 75, resolved: 60 },
];

const recentReports = [
  {
    id: 'R-1001',
    type: 'Flood',
    location: 'Kerala, India',
    status: 'Urgent',
    date: '2023-07-20',
    reporter: 'Rahima Khan',
  },
  {
    id: 'R-1002',
    type: 'Fire',
    location: 'Delhi, India',
    status: 'In Progress',
    date: '2023-07-19',
    reporter: 'Ajay Patel',
  },
  {
    id: 'R-1003',
    type: 'Landslide',
    location: 'Himachal Pradesh, India',
    status: 'Resolved',
    date: '2023-07-18',
    reporter: 'Priya Sharma',
  },
  {
    id: 'R-1004',
    type: 'Storm',
    location: 'Mumbai, India',
    status: 'Pending',
    date: '2023-07-18',
    reporter: 'Rajiv Kumar',
  },
  {
    id: 'R-1005',
    type: 'Earthquake',
    location: 'Gujarat, India',
    status: 'Urgent',
    date: '2023-07-17',
    reporter: 'Meera Singh',
  },
];

const volunteerData = [
  {
    id: 'V-1001',
    name: 'Amrita Patel',
    location: 'Mumbai, India',
    status: 'Active',
    skills: ['Medical', 'Rescue'],
    joinDate: '2023-01-15',
  },
  {
    id: 'V-1002',
    name: 'Rahul Sharma',
    location: 'Delhi, India',
    status: 'Active',
    skills: ['Driver', 'Logistics'],
    joinDate: '2023-02-10',
  },
  {
    id: 'V-1003',
    name: 'Priya Reddy',
    location: 'Hyderabad, India',
    status: 'On Leave',
    skills: ['Medical', 'Counseling'],
    joinDate: '2023-01-20',
  },
  {
    id: 'V-1004',
    name: 'Karthik Iyer',
    location: 'Chennai, India',
    status: 'Active',
    skills: ['Rescue', 'Communication'],
    joinDate: '2023-03-05',
  },
  {
    id: 'V-1005',
    name: 'Isha Khan',
    location: 'Kerala, India',
    status: 'Inactive',
    skills: ['Medical', 'Logistics'],
    joinDate: '2023-02-22',
  },
];

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#6B7280'];

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const { 
    volunteerCount, 
    activeEmergencies, 
    reportsSubmitted, 
    refreshData 
  } = useResourceData();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data, error } = await supabase
          .from('emergency_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        setRecentReports(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const filteredReports = recentReports.filter(report => 
    report.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm === ''
  );

  const filteredVolunteers = volunteerData.filter(volunteer => 
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Urgent':
      case 'urgent':
        return <Badge className="badge-emergency">Urgent</Badge>;
      case 'In Progress':
      case 'in_progress':
      case 'pending':
        return <Badge className="badge-warning">In Progress</Badge>;
      case 'Pending':
        return <Badge className="badge-info">Pending</Badge>;
      case 'Resolved':
      case 'resolved':
        return <Badge className="badge-success">Resolved</Badge>;
      case 'Active':
        return <Badge className="badge-success">Active</Badge>;
      case 'Inactive':
        return <Badge className="badge-emergency">Inactive</Badge>;
      case 'On Leave':
        return <Badge className="badge-warning">On Leave</Badge>;
      default:
        return <Badge>{status}</Badge>;
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
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage disaster relief operations and user data
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="outline" onClick={refreshData}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  <Download className="mr-2 h-4 w-4" />
                  Export Reports
                </Button>
              </div>
            </div>
            
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatusCard 
                title="Active Emergencies"
                value={activeEmergencies.toString()}
                icon={<AlertTriangle className="h-5 w-5" />}
                change={{ value: 12, isPositive: false }}
              />
              <StatusCard 
                title="Total Users"
                value={volunteerCount.toString()}
                icon={<Users className="h-5 w-5" />}
                change={{ value: 8, isPositive: true }}
              />
              <StatusCard 
                title="Reports Submitted"
                value={reportsSubmitted.toString()}
                icon={<FileText className="h-5 w-5" />}
                change={{ value: 3, isPositive: true }}
              />
              <StatusCard 
                title="Volunteers"
                value="523"
                icon={<Package className="h-5 w-5" />}
                change={{ value: 11, isPositive: false }}
              />
            </div>

            {/* Tabs */}
            <Tabs>
              <TabsList>
                <TabsTrigger value="reports">Recent Reports</TabsTrigger>
                <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
              </TabsList>
              <TabsContent value="reports">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.id}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="volunteers">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Join Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVolunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell>{volunteer.name}</TableCell>
                        <TableCell>{volunteer.location}</TableCell>
                        <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                        <TableCell>{volunteer.skills.join(', ')}</TableCell>
                        <TableCell>{new Date(volunteer.joinDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>

            {/* Emergency Data Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="col-span-1">
                <h3 className="text-xl font-bold mb-4">Emergency Report Types</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={disasterData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      label
                    >
                      {disasterData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="col-span-1">
                <h3 className="text-xl font-bold mb-4">Monthly Report Trends</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <Line type="monotone" dataKey="reports" stroke="#8884d8" />
                    <Line type="monotone" dataKey="resolved" stroke="#82ca9d" />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
