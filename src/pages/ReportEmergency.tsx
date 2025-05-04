
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Upload, MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import AIChat from '@/components/AIChat';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const reportSchema = z.object({
  disasterType: z.string({
    required_error: 'Please select a disaster type',
  }),
  location: z.string().min(3, {
    message: 'Location must be at least 3 characters',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportEmergency: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      disasterType: '',
      location: '',
      description: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          
          // Set the form location field with coordinates
          const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          form.setValue('location', locationString);
          
          setIsGettingLocation(false);
          
          toast({
            title: 'Location detected',
            description: 'Your current coordinates have been added to the report',
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location error',
            description: 'Unable to get your current location. Please enter it manually.',
            variant: 'destructive',
          });
          setIsGettingLocation(false);
        }
      );
    } else {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation. Please enter your location manually.',
        variant: 'destructive',
      });
      setIsGettingLocation(false);
    }
  };

  const onSubmit = async (values: ReportFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to submit a report',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit report to database
      const { data, error } = await supabase
        .from('emergency_reports')
        .insert([
          {
            user_id: user.id,
            type: values.disasterType,
            location: values.location,
            description: values.description,
            coordinates: location ? `POINT(${location.lng} ${location.lat})` : null,
            status: 'pending'
          }
        ])
        .select();
        
      if (error) {
        throw error;
      }
      
      // Handle file uploads if needed
      // This would involve storage operations for the files
      
      toast({
        title: 'Emergency Report Submitted',
        description: 'Your report has been sent to the authorities. Stay safe!',
      });
      
      // Reset form and state
      form.reset();
      setFiles([]);
      setLocation(null);
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'An error occurred while submitting your report',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 pt-6 md:ml-64">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Report Emergency</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Submit details about an emergency situation for immediate assistance
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 neumorphic mb-8">
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-orange-800 dark:text-orange-300">Important Notice</h3>
                    <p className="mt-1 text-sm text-orange-700 dark:text-orange-300/80">
                      For life-threatening emergencies, please call the emergency services directly. 
                      This form is for reporting situations that require assistance but are not immediate life threats.
                    </p>
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="disasterType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disaster Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select disaster type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="flood">Flood</SelectItem>
                            <SelectItem value="fire">Fire</SelectItem>
                            <SelectItem value="earthquake">Earthquake</SelectItem>
                            <SelectItem value="landslide">Landslide</SelectItem>
                            <SelectItem value="storm">Storm/Cyclone</SelectItem>
                            <SelectItem value="drought">Drought</SelectItem>
                            <SelectItem value="medical">Medical Emergency</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input placeholder="Enter location or use current location" {...field} />
                          </FormControl>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={getCurrentLocation}
                            disabled={isGettingLocation}
                          >
                            {isGettingLocation ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <MapPin className="h-4 w-4 mr-2" />
                            )}
                            {isGettingLocation ? 'Getting...' : 'Current'}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the emergency situation in detail..." 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Media (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Drag and drop files, or <span className="text-primary">browse</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Upload photos or videos related to the emergency
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    {files.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="h-24 w-full rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                              {file.type.startsWith('image/') ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <span className="text-xs text-gray-500">
                                    {file.name}
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile(index)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting Report...
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Submit Emergency Report
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </main>
      </div>
      
      {/* AI Chat */}
      <Button 
        className="fixed bottom-4 right-4 rounded-full p-4 z-40"
        onClick={() => setIsAIChatOpen(true)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
          />
        </svg>
      </Button>
      
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default ReportEmergency;
