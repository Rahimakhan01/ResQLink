
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MoreVertical, Download, Filter, MapPin, AlertTriangle, BarChart2, RefreshCw } from 'lucide-react';
import { useResourceData } from '@/hooks/useResourceData';
import { useToast } from '@/components/ui/use-toast';

const AdminResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const { toast } = useToast();
  
  const { 
    items: resourcesData, 
    allocations: allocationData, 
    locations: locationData, 
    analysis,
    isLoading, 
    error, 
    refreshData 
  } = useResourceData();

  // Handle any data loading errors
  if (error) {
    console.error("Resource data error:", error);
  }
  
  // Filter resources based on search term
  const filteredResources = resourcesData.filter(resource => 
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter allocations based on search term
  const filteredAllocations = allocationData.filter(allocation => 
    allocation.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.emergency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'Low Stock':
        return <Badge className="bg-yellow-500">Low Stock</Badge>;
      case 'Deployed':
        return <Badge className="bg-blue-500">Deployed</Badge>;
      case 'Maintenance':
        return <Badge className="bg-gray-500">Maintenance</Badge>;
      case 'In Transit':
        return <Badge className="bg-purple-500">In Transit</Badge>;
      case 'Delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleAddResource = () => {
    toast({
      title: "Feature in progress",
      description: "This feature is currently being implemented and will be available soon.",
    });
  };

  const handleAddAllocation = () => {
    toast({
      title: "Feature in progress",
      description: "This feature is currently being implemented and will be available soon.",
    });
  };

  const handleAddLocation = () => {
    toast({
      title: "Feature in progress",
      description: "This feature is currently being implemented and will be available soon.",
    });
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Resource Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and track disaster relief resources
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-60"
            />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Analysis Section */}
        {analysis && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Resource Analysis (Gemini AI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{analysis.analysis}</p>
              
              <div className="mt-3">
                <p className="font-medium text-sm mb-1">Recommendations:</p>
                <ul className="text-sm list-disc pl-6 space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 text-xs text-muted-foreground italic">
                {analysis.summary}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="locations">Storage Locations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="px-3 py-1">
                  Total: {resourcesData.length}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Low Stock: {resourcesData.filter(r => r.status === 'Low Stock').length}
                </Badge>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={handleAddResource}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Resource</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Name</label>
                      <Input className="col-span-3" placeholder="Resource name" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Type</label>
                      <Select defaultValue="medical">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="shelter">Shelter</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Quantity</label>
                      <Input className="col-span-3" type="number" placeholder="0" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Location</label>
                      <Select defaultValue="delhi">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delhi">Delhi Warehouse</SelectItem>
                          <SelectItem value="mumbai">Mumbai Storage</SelectItem>
                          <SelectItem value="chennai">Chennai Depot</SelectItem>
                          <SelectItem value="kolkata">Kolkata Center</SelectItem>
                          <SelectItem value="kerala">Kerala Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Save Resource</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResources.length > 0 ? (
                        filteredResources.map((resource) => (
                          <TableRow key={resource.id}>
                            <TableCell className="font-medium">{resource.id}</TableCell>
                            <TableCell>{resource.name}</TableCell>
                            <TableCell>{resource.type}</TableCell>
                            <TableCell>{resource.quantity}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3 text-gray-500" />
                                {resource.location}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(resource.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Edit Resource</DropdownMenuItem>
                                  <DropdownMenuItem>Allocate</DropdownMenuItem>
                                  <DropdownMenuItem>View History</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                            No resources found matching your search
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="allocation" className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="px-3 py-1">
                Total Allocations: {allocationData.length}
              </Badge>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={handleAddAllocation}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Allocation
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Allocate Resources</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Resource</label>
                      <Select defaultValue="r1001">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select resource" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="r1001">First Aid Kits</SelectItem>
                          <SelectItem value="r1002">Emergency Food Packages</SelectItem>
                          <SelectItem value="r1003">Portable Water Filters</SelectItem>
                          <SelectItem value="r1004">Emergency Tents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Quantity</label>
                      <Input className="col-span-3" type="number" placeholder="0" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Location</label>
                      <Input className="col-span-3" placeholder="Allocation destination" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Emergency</label>
                      <Input className="col-span-3" placeholder="Emergency operation name" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Allocate Resources</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Emergency</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAllocations.length > 0 ? (
                        filteredAllocations.map((allocation) => (
                          <TableRow key={allocation.id}>
                            <TableCell className="font-medium">{allocation.id}</TableCell>
                            <TableCell>{allocation.resourceName}</TableCell>
                            <TableCell>{allocation.quantity}</TableCell>
                            <TableCell>{allocation.location}</TableCell>
                            <TableCell>{allocation.emergency}</TableCell>
                            <TableCell>{allocation.date}</TableCell>
                            <TableCell>{getStatusBadge(allocation.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                                  <DropdownMenuItem>Track Delivery</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">Cancel Allocation</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                            No allocations found matching your search
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="px-3 py-1">
                Storage Locations: {locationData.length}
              </Badge>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={handleAddLocation}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Storage Location</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Name</label>
                      <Input className="col-span-3" placeholder="Location name" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Type</label>
                      <Select defaultValue="warehouse">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="storage">Storage</SelectItem>
                          <SelectItem value="depot">Depot</SelectItem>
                          <SelectItem value="center">Distribution Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Address</label>
                      <Input className="col-span-3" placeholder="Full address" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Capacity</label>
                      <Input className="col-span-3" placeholder="Storage capacity" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Add Location</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locationData.map((location) => (
                  <Card key={location.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-primary" />
                        {location.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className="text-sm font-medium">{location.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Capacity:</span>
                          <span className="text-sm font-medium">{location.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Resources:</span>
                          <span className="text-sm font-medium">
                            {resourcesData.filter(r => r.location === location.name).length} items
                          </span>
                        </div>
                        <div className="pt-2 flex justify-end space-x-2">
                          <Button variant="outline" size="sm">View Details</Button>
                          <Button variant="default" size="sm">Manage</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminResources;
