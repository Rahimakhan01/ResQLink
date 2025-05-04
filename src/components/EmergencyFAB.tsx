
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PhoneCall, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface EmergencyFABProps {
  className?: string;
}

const EmergencyFAB: React.FC<EmergencyFABProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleReportEmergency = () => {
    if (isAuthenticated) {
      navigate('/report');
    } else {
      toast({
        title: "Authentication Required",
        description: "Please login or register to report an emergency.",
        variant: "destructive",
      });
      navigate('/login');
    }
    setIsOpen(false);
  };
  
  const handleCallEmergency = () => {
    window.location.href = 'tel:911';
    setIsOpen(false);
  };
  
  return (
    <div className={`fixed bottom-4 left-4 z-40 ${className}`}>
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 left-0 space-y-2 mb-2 animate-fade-in">
            <Button
              className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-emergency shadow-lg border border-emergency/30"
              onClick={handleCallEmergency}
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Emergency</span>
            </Button>
            
            <Button
              className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-primary shadow-lg border border-primary/30"
              onClick={handleReportEmergency}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Report Emergency</span>
            </Button>
          </div>
        )}
        
        <Button
          size="lg"
          className={`rounded-full h-14 w-14 flex items-center justify-center p-0 bg-emergency hover:bg-emergency/90 animate-pulse-glow shadow-lg transition-all duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <AlertTriangle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default EmergencyFAB;
