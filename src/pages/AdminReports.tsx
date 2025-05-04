
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, MapPin, Filter } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Report {
  id: string;
  type: string;
  location: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_name?: string;
  user_phone?: string;
}

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { toast } = useToast();

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // First, get all emergency reports
      const { data: reportData, error: reportError } = await supabase
        .from('emergency_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportError) throw reportError;

      // Then get all profiles to match with user_id
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, phone');

      if (profilesError) throw profilesError;

      // Map profiles to reports
      const formattedReports = reportData.map(report => {
        const userProfile = profilesData.find(profile => profile.id === report.user_id);
        return {
          ...report,
          user_name: userProfile?.name || 'Unknown',
          user_phone: userProfile?.phone || 'None',
        };
      });

      setReports(formattedReports as Report[]);
      setFilteredReports(formattedReports as Report[]);
    } catch (error: any) {
      toast({
        title: 'Error fetching reports',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchTerm, statusFilter, typeFilter, reports]);

  const filterReports = () => {
    let filtered = [...reports];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.location.toLowerCase().includes(term) || 
        (report.description && report.description.toLowerCase().includes(term)) ||
        report.user_name?.toLowerCase().includes(term) ||
        report.type.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }
    
    setFilteredReports(filtered);
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('emergency_reports')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      // Update local state
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
      
      // If there's a selected report, update it too
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport({
          ...selectedReport,
          status: newStatus
        });
      }
      
      toast({
        title: 'Status updated',
        description: `Report status has been updated to ${newStatus}.`
      });
    } catch (error: any) {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500">Urgent</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getUniqueTypes = () => {
    const types = new Set(reports.map(report => report.type));
    return Array.from(types);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Emergency Reports</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by location, description or reporter..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {getUniqueTypes().map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={fetchReports} variant="outline">Refresh</Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        Loading reports...
                      </TableCell>
                    </TableRow>
                  ) : filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        No reports found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>{report.user_name}</TableCell>
                        <TableCell>{format(new Date(report.created_at), 'PPP')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[625px]">
                                <DialogHeader>
                                  <DialogTitle>Emergency Report Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information about the emergency report.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                {selectedReport && (
                                  <div className="py-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Type</h4>
                                        <p>{selectedReport.type}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                                        <p>{getStatusBadge(selectedReport.status)}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                                        <p className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" /> {selectedReport.location}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Reported On</h4>
                                        <p>{format(new Date(selectedReport.created_at), 'PPpp')}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Reporter</h4>
                                        <p>{selectedReport.user_name}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-medium text-gray-500">Contact</h4>
                                        <p>{selectedReport.user_phone}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                      <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                        <p>{selectedReport.description || 'No description provided.'}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="text-sm font-medium text-gray-500 mb-2">Update Status</h4>
                                      <div className="flex gap-2">
                                        <Button 
                                          variant={selectedReport.status === 'pending' ? 'default' : 'outline'}
                                          size="sm"
                                          onClick={() => updateReportStatus(selectedReport.id, 'pending')}
                                        >
                                          Pending
                                        </Button>
                                        <Button 
                                          variant={selectedReport.status === 'in_progress' ? 'default' : 'outline'}
                                          size="sm"
                                          onClick={() => updateReportStatus(selectedReport.id, 'in_progress')}
                                        >
                                          In Progress
                                        </Button>
                                        <Button 
                                          variant={selectedReport.status === 'resolved' ? 'default' : 'outline'}
                                          size="sm"
                                          onClick={() => updateReportStatus(selectedReport.id, 'resolved')}
                                        >
                                          Resolved
                                        </Button>
                                        <Button 
                                          variant={selectedReport.status === 'urgent' ? 'default' : 'outline'}
                                          className={selectedReport.status === 'urgent' ? 'bg-red-500 hover:bg-red-600' : 'text-red-500 border-red-200 hover:bg-red-50'}
                                          size="sm"
                                          onClick={() => updateReportStatus(selectedReport.id, 'urgent')}
                                        >
                                          Urgent
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <DialogFooter>
                                  <Button variant="outline" type="button">
                                    Close
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Select
                              value={report.status}
                              onValueChange={(newStatus) => updateReportStatus(report.id, newStatus)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
