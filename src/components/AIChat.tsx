
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockResponses = [
  {
    query: "What's the best precaution for floods?",
    response: `
    ## Flood Precautions

    1. **Move to higher ground** immediately if flash floods are likely
    2. **Avoid walking or driving** through flood waters
    3. **Prepare an emergency kit** with essentials
    4. **Follow evacuation orders** from local authorities
    5. **Turn off utilities** at main switches if instructed

    Would you like more detailed information on any of these points?
    `
  },
  {
    query: "What should I do in an earthquake?",
    response: `
    ## Earthquake Safety

    1. **Drop, Cover, and Hold On**:
       - Drop to the ground
       - Take cover under sturdy furniture
       - Hold on until shaking stops

    2. **Stay indoors** until shaking stops and it's safe to exit
    3. **Stay away from windows** and exterior walls
    4. **If outdoors**, move to a clear area away from buildings, trees, and power lines
    5. **If in a vehicle**, pull over and stop - stay inside the vehicle
    
    Remember to have an emergency plan and kit prepared beforehand.
    `
  },
  {
    query: "How to prepare for a hurricane?",
    response: `
    ## Hurricane Preparation

    1. **Create an emergency plan**:
       - Evacuation routes
       - Meeting locations
       - Communication strategy

    2. **Build an emergency kit** with:
       - Water (1 gallon per person per day)
       - Non-perishable food
       - Medications
       - Flashlights and batteries
       
    3. **Secure your home**:
       - Install storm shutters or board up windows
       - Secure outdoor objects
       - Trim trees and shrubs
       
    4. **Stay informed** via weather updates
    5. **Evacuate if ordered** by local authorities
    
    When would you like to start your preparations?
    `
  }
];

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<{query: string; response: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendQuery = () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let foundResponse = mockResponses.find(item => 
        item.query.toLowerCase().includes(lowerQuery) || 
        lowerQuery.includes(item.query.toLowerCase().split(' ')[1])
      );
      
      if (!foundResponse) {
        foundResponse = {
          query,
          response: "I don't have specific information on that topic yet. For emergency assistance, please contact local authorities or call the emergency helpline."
        };
      }
      
      setConversation([...conversation, { query, response: foundResponse.response }]);
      setQuery('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={cn(
      "fixed bottom-4 right-4 w-80 z-50 transition-all duration-300 ease-in-out",
      isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
    )}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-[400px]">
        <div className="p-3 bg-primary text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span className="font-medium">ResQ AI Assistant</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-primary/50">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="h-12 w-12 text-primary mb-2" />
              <h3 className="font-medium">How can I help you?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Ask me about safety tips, emergency procedures, or disaster preparedness.
              </p>
            </div>
          ) : (
            conversation.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-end">
                  <div className="bg-primary text-white px-3 py-2 rounded-lg max-w-[80%]">
                    <p>{item.query}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg max-w-[80%]">
                    <div dangerouslySetInnerHTML={{ 
                      __html: item.response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^##\s(.*?)$/gm, '<h3 class="font-bold text-sm">$1</h3>')
                        .replace(/\n/g, '<br />')
                    }} />
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <form 
            className="flex space-x-2" 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
          >
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about safety tips..." 
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !query.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
