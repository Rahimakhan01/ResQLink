
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, Trash2, RefreshCw } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { analyzeDataWithGemini } from '@/utils/geminiService';

interface Admin {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional, only for new admin creation
}

const ManageAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [adminInsights, setAdminInsights] = useState<string>('');
  const [adminRecommendations, setAdminRecommendations] = useState<string[]>([]);
  const { toast } = useToast();
  const { profile } = useAuth();

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Get AI insights when admins list changes
  useEffect(() => {
    if (admins.length > 0) {
      getAdminInsights();
    }
  }, [admins]);

  const getAdminInsights = async () => {
    try {
      const analysis = await analyzeDataWithGemini({
        data: {
          type: 'admins',
          total: admins.length,
          approvalRate: 22,
          avgApprovalTime: 4.2,
          admins: admins // Pass the actual admin data
        },
        prompt: "Analyze admin management data for Indian disaster management system and provide recommendations"
      });
      
      setAdminInsights(analysis.analysis);
      setAdminRecommendations(analysis.recommendations);
    } catch (error) {
      console.error("Failed to get admin insights:", error);
    }
  };

  const fetchAdmins = async () => {
    setIsRefreshing(true);
    try {
      // For demonstration, we'll simulate data from Supabase
      // In a real implementation, you would fetch from your database
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate some sample admin data if none exists yet
      if (profile) {
        const sampleAdmins: Admin[] = [
          {
            id: profile.id, // Current user's ID
            name: profile.name,
            email: 'pb6523@srmist.edu.in'
          }
        ];
        
        // Add some additional sample admins
        if (Math.random() > 0.5) {
          sampleAdmins.push({
            id: 'admin-' + Math.random().toString(36).substring(2, 11),
            name: 'Rahul Mehta',
            email: 'rahul.mehta@example.com'
          });
        }
        
        if (Math.random() > 0.3) {
          sampleAdmins.push({
            id: 'admin-' + Math.random().toString(36).substring(2, 11),
            name: 'Priya Sharma',
            email: 'priya.sharma@example.com'
          });
        }
        
        setAdmins(sampleAdmins);
      }

      toast({
        title: 'Admins loaded successfully',
        description: 'The administrator list has been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error fetching admins',
        description: error.message || 'Failed to fetch admin list',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail || !newAdminName || !newAdminPassword) {
      toast({
        title: 'Missing information',
        description: 'Please provide email, name, and password',
        variant: 'destructive',
      });
      return;
    }

    // Check if admin already exists
    if (admins.some(admin => admin.email.toLowerCase() === newAdminEmail.toLowerCase())) {
      toast({
        title: 'Admin already exists',
        description: 'An admin with this email already exists',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real implementation, you would call supabase auth to create a user
      // and then set their role to admin in the profiles table
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random ID for the new admin since we're not using a real backend
      const newAdminId = 'admin-' + Math.random().toString(36).substring(2, 11);
      
      // Add the new admin to our state
      const newAdmin: Admin = {
        id: newAdminId,
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword // In a real implementation, this would be handled securely
      };
      
      // Update state with new admin
      setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
      
      toast({
        title: 'Admin added successfully',
        description: `${newAdminName} has been added as an admin.`,
      });
      
      // Reset form fields
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');
    } catch (error: any) {
      toast({
        title: 'Error adding admin',
        description: error.message || 'Failed to add admin',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = async (adminId: string, adminName: string) => {
    // Prevent removing yourself
    if (profile && adminId === profile.id) {
      toast({
        title: 'Cannot remove yourself',
        description: 'You cannot remove your own admin access.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update the local state to remove this admin
      setAdmins(admins.filter(admin => admin.id !== adminId));
      
      toast({
        title: 'Admin removed',
        description: `${adminName} is no longer an admin.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error removing admin',
        description: error.message || 'Failed to remove admin',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Administrators</h1>
          <Button 
            variant="outline" 
            onClick={fetchAdmins}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {adminInsights && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <p className="text-blue-800 dark:text-blue-300">{adminInsights}</p>
              
              {adminRecommendations && adminRecommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Recommendations:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {adminRecommendations.map((recommendation, index) => (
                      <li key={index} className="text-blue-800 dark:text-blue-300">{recommendation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Add New Administrator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                placeholder="Admin Name"
                value={newAdminName}
                onChange={(e) => setNewAdminName(e.target.value)}
                className="md:w-1/4"
              />
              <Input
                placeholder="Admin Email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="md:w-1/4"
              />
              <Input
                placeholder="Admin Password"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="md:w-1/4"
              />
              <Button 
                onClick={addAdmin} 
                disabled={isLoading || !newAdminEmail || !newAdminName || !newAdminPassword}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Add Admin
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                      No administrators found
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAdmin(admin.id, admin.name)}
                          disabled={profile && admin.id === profile.id}
                          title={profile && admin.id === profile.id ? "Cannot remove yourself" : "Remove admin"}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ManageAdmins;
