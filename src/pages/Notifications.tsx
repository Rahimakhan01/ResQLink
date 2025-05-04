
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CheckCircle, AlertTriangle, Info, MailOpen, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Layout from '@/components/Layout';

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  user_id: string;
}

// Sample data for notifications while API is being set up
const sampleNotifications = [
  {
    id: '1',
    title: 'Emergency Alert',
    message: 'Flash flood warning issued for Kerala region. Please stay alert and follow safety protocols.',
    created_at: '2023-07-24T09:15:00Z',
    is_read: false,
    user_id: '1',
    type: 'alert'
  },
  {
    id: '2',
    title: 'Resource Update',
    message: 'New medical supplies have been delivered to Delhi Warehouse. Inventory updated.',
    created_at: '2023-07-23T14:30:00Z',
    is_read: true,
    user_id: '1',
    type: 'info'
  },
  {
    id: '3',
    title: 'Volunteer Opportunity',
    message: 'Volunteers needed for flood relief operation in Kerala. Sign up now to help.',
    created_at: '2023-07-22T11:45:00Z',
    is_read: false,
    user_id: '1',
    type: 'opportunity'
  },
  {
    id: '4',
    title: 'Report Acknowledgment',
    message: 'Your emergency report #E-1234 has been received and is being processed.',
    created_at: '2023-07-21T16:20:00Z',
    is_read: true,
    user_id: '1',
    type: 'success'
  },
  {
    id: '5',
    title: 'Training Session',
    message: 'Upcoming online training for emergency response on July 28th at 10:00 AM.',
    created_at: '2023-07-20T08:50:00Z',
    is_read: false,
    user_id: '1',
    type: 'info'
  },
  {
    id: '6',
    title: 'Emergency Response Update',
    message: 'Cyclone relief efforts successfully completed in Chennai area. Thank you for your support.',
    created_at: '2023-07-19T13:10:00Z',
    is_read: true,
    user_id: '1',
    type: 'success'
  },
  {
    id: '7',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on July 30th from 02:00 AM to 04:00 AM. Some features may be unavailable.',
    created_at: '2023-07-18T09:30:00Z',
    is_read: false,
    user_id: '1',
    type: 'info'
  },
];

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // In a real app, you would fetch from your backend
  const fetchNotifications = async (): Promise<Notification[]> => {
    if (!user) return [];
    
    try {
      // Uncomment this for real data once backend is implemented
      // const { data, error } = await supabase
      //   .from('notifications')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      // return data as Notification[];
      
      // For now, return sample data
      return sampleNotifications as Notification[];
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      throw new Error(error.message);
    }
  };

  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: fetchNotifications,
    enabled: !!user,
  });

  const markAsRead = async (id: string) => {
    try {
      // In a real app, you would update your backend
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ is_read: true })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      toast({
        title: "Notification marked as read",
        description: "This notification has been marked as read",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // In a real app, you would delete from your backend
      // const { error } = await supabase
      //   .from('notifications')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      toast({
        title: "Notification deleted",
        description: "The notification has been removed",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      // In a real app, you would update your backend
      // const { error } = await supabase
      //   .from('notifications')
      //   .update({ is_read: true })
      //   .eq('user_id', user?.id)
      //   .eq('is_read', false);
      
      // if (error) throw error;
      
      toast({
        title: "All notifications marked as read",
        description: "All unread notifications have been marked as read",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter notifications based on active tab and read status
  const filteredNotifications = notifications.filter(notification => {
    if (showUnreadOnly && notification.is_read) return false;
    
    if (activeTab === 'all') return true;
    if (activeTab === 'alerts' && (notification as any).type === 'alert') return true;
    if (activeTab === 'updates' && ['info', 'success'].includes((notification as any).type)) return true;
    if (activeTab === 'opportunities' && (notification as any).type === 'opportunity') return true;
    
    return false;
  });

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'opportunity':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'} ago`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <Bell className="h-6 w-6 mr-2 text-primary" />
                <CardTitle>Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-primary">{unreadCount} unread</Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-2 md:mt-0">
                <div className="flex items-center space-x-1">
                  <Switch 
                    id="unread-filter" 
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                  <label htmlFor="unread-filter" className="text-sm cursor-pointer">
                    Show unread only
                  </label>
                </div>
                
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <MailOpen className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setActiveTab('all')}>
                      All Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('alerts')}>
                      Alerts Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('updates')}>
                      Updates & Information
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('opportunities')}>
                      Opportunities
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-lg font-medium">No notifications</p>
                      <p className="text-sm">You're all caught up!</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border rounded-lg transition-colors ${
                          notification.is_read 
                            ? 'bg-white dark:bg-gray-800' 
                            : 'bg-blue-50 dark:bg-gray-750 border-blue-100 dark:border-blue-900'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            {getNotificationIcon((notification as any).type)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h3 className={`text-base font-medium ${!notification.is_read ? 'text-primary' : ''}`}>
                                {notification.title}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex-shrink-0 ml-3 flex space-x-1">
                            {!notification.is_read && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => markAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <MailOpen className="h-4 w-4 text-gray-500" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteNotification(notification.id)}
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;
