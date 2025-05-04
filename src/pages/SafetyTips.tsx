
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AIChat from '@/components/AIChat';
import { BrainCircuit } from 'lucide-react';

const safetyData = {
  flood: [
    {
      id: 'flood-1',
      title: 'Before a Flood',
      items: [
        'Know your area\'s flood risk',
        'Prepare an emergency kit with essentials',
        'Create an evacuation plan for your family',
        'Keep important documents in a waterproof container',
        'Install check valves in plumbing to prevent backflow',
        'Consider flood insurance for your property'
      ]
    },
    {
      id: 'flood-2',
      title: 'During a Flood',
      items: [
        'Move to higher ground immediately',
        'Do not walk, swim, or drive through flood waters',
        'Stay off bridges over fast-moving water',
        'Evacuate if told to do so by authorities',
        'Disconnect utilities if instructed by authorities',
        'Avoid contact with floodwater - it may be contaminated'
      ]
    },
    {
      id: 'flood-3',
      title: 'After a Flood',
      items: [
        'Return home only when authorities say it is safe',
        'Be aware of areas where floodwaters have receded',
        'Clean and disinfect everything that got wet',
        'Stay clear of damaged power lines and report them',
        'Document property damage with photographs',
        'Contact your insurance company to file claims'
      ]
    }
  ],
  earthquake: [
    {
      id: 'earthquake-1',
      title: 'Before an Earthquake',
      items: [
        'Secure heavy furniture and appliances to walls',
        'Know where and how to shut off utilities',
        'Identify safe spots in each room (under sturdy furniture)',
        'Practice "Drop, Cover, and Hold On" drills',
        'Keep an emergency kit ready',
        'Have a communication plan with family members'
      ]
    },
    {
      id: 'earthquake-2',
      title: 'During an Earthquake',
      items: [
        'Drop to the ground, take Cover under sturdy furniture, and Hold On',
        'If indoors, stay there until shaking stops',
        'If in bed, protect your head with a pillow',
        'If outdoors, move to a clear area away from buildings',
        'If in a vehicle, pull over and stay inside',
        'Avoid doorways, windows, and exterior walls'
      ]
    },
    {
      id: 'earthquake-3',
      title: 'After an Earthquake',
      items: [
        'Check yourself and others for injuries',
        'Expect aftershocks and be prepared to "Drop, Cover, and Hold On"',
        'Inspect your home for damage carefully',
        'Check for gas leaks, water line breaks, or electrical damage',
        'Listen to local alerts and authorities for information',
        'Use phones only for emergency calls'
      ]
    }
  ],
  fire: [
    {
      id: 'fire-1',
      title: 'Fire Prevention',
      items: [
        'Install smoke alarms on every level of your home',
        'Test smoke alarms monthly and replace batteries annually',
        'Keep flammable items away from heat sources',
        'Don\'t overload electrical outlets',
        'Never leave cooking unattended',
        'Develop and practice a fire escape plan'
      ]
    },
    {
      id: 'fire-2',
      title: 'During a Fire',
      items: [
        'Get out immediately and stay out',
        'Crawl low under smoke',
        'Feel doors before opening - if hot, use another escape route',
        'If clothes catch fire: Stop, Drop, and Roll',
        'Call emergency services once safely outside',
        'Never re-enter a burning building'
      ]
    },
    {
      id: 'fire-3',
      title: 'Wildfire Safety',
      items: [
        'Create a 30-foot safety zone around your home',
        'Clear leaves and debris from gutters and roof',
        'Keep emergency supplies in your vehicle',
        'Follow evacuation orders immediately',
        'Close all windows, vents, and doors if unable to evacuate',
        'Monitor local news and alerts for updates'
      ]
    }
  ],
  cyclone: [
    {
      id: 'cyclone-1',
      title: 'Before a Cyclone',
      items: [
        'Know your evacuation zone and route',
        'Prepare an emergency kit with 3-day supplies',
        'Secure or bring inside outdoor furniture and items',
        'Cover windows with storm shutters or plywood',
        'Fill clean water containers and your vehicle\'s fuel tank',
        'Charge phones and backup batteries'
      ]
    },
    {
      id: 'cyclone-2',
      title: 'During a Cyclone',
      items: [
        'Stay indoors and away from windows, skylights, and glass doors',
        'Close all interior doors and secure external doors',
        'Take refuge in a small interior room, closet, or hallway',
        'Lie on the floor under a table if danger is imminent',
        'Do not go outside during the eye of the storm',
        'Listen to battery-powered radio for updates'
      ]
    },
    {
      id: 'cyclone-3',
      title: 'After a Cyclone',
      items: [
        'Stay inside until official word that it\'s safe',
        'Watch for downed power lines and report them',
        'Avoid flooded roads and washed-out bridges',
        'Document property damage with photographs',
        'Be careful with generators - never use indoors',
        'Check on neighbors, especially elderly or disabled'
      ]
    }
  ]
};

const hotlineData = [
  {
    name: 'National Emergency Number',
    number: '112',
    description: 'For all types of emergencies across India'
  },
  {
    name: 'National Disaster Response Force',
    number: '011-24363260',
    description: 'Specialized force for disaster response situations'
  },
  {
    name: 'Police',
    number: '100',
    description: 'Law enforcement and emergency assistance'
  },
  {
    name: 'Fire',
    number: '101',
    description: 'Fire brigade and rescue services'
  },
  {
    name: 'Ambulance',
    number: '108',
    description: 'Medical emergencies and ambulance services'
  },
  {
    name: 'Disaster Management Services',
    number: '108',
    description: 'Integrated emergency services, including disaster management'
  }
];

const SafetyTips: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 pt-6 md:ml-64">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Safety Recommendations</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Learn how to stay safe before, during, and after disasters
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={() => setIsAIChatOpen(true)}>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Ask for Safety Tips
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="flood" className="mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="flood">Floods</TabsTrigger>
                <TabsTrigger value="earthquake">Earthquakes</TabsTrigger>
                <TabsTrigger value="fire">Fires</TabsTrigger>
                <TabsTrigger value="cyclone">Cyclones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="flood">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800/50">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">About Floods</h3>
                  <p className="text-blue-700 dark:text-blue-200">
                    Floods are among the most common natural disasters in India, especially during monsoon season. 
                    They can develop slowly or occur suddenly without warning. Being prepared can help you stay safe.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {safetyData.flood.map((section) => (
                    <Card key={section.id}>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="earthquake">
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-6 border border-orange-200 dark:border-orange-800/50">
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-2">About Earthquakes</h3>
                  <p className="text-orange-700 dark:text-orange-200">
                    Earthquakes occur without warning and can cause significant damage. India lies in one of the 
                    world's most earthquake-prone regions. Learning what to do before, during, and after can save lives.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {safetyData.earthquake.map((section) => (
                    <Card key={section.id}>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="fire">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6 border border-red-200 dark:border-red-800/50">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">About Fires</h3>
                  <p className="text-red-700 dark:text-red-200">
                    Fires can spread rapidly and cause devastating damage. Whether it's a home fire or wildfire, 
                    knowing prevention strategies and how to respond can protect your family and property.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {safetyData.fire.map((section) => (
                    <Card key={section.id}>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="cyclone">
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 mb-6 border border-teal-200 dark:border-teal-800/50">
                  <h3 className="text-lg font-semibold text-teal-800 dark:text-teal-300 mb-2">About Cyclones</h3>
                  <p className="text-teal-700 dark:text-teal-200">
                    Cyclones (also called hurricanes or typhoons) are powerful storms that form over warm ocean waters. 
                    Coastal regions of India are particularly vulnerable. Preparation is key to survival.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {safetyData.cyclone.map((section) => (
                    <Card key={section.id}>
                      <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.items.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Emergency Hotlines</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden neumorphic">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
                  {hotlineData.map((hotline, index) => (
                    <div key={index} className="p-4">
                      <h3 className="font-semibold">{hotline.name}</h3>
                      <div className="flex items-center mt-2">
                        <div className="bg-primary/10 text-primary font-bold rounded-lg px-3 py-1 text-lg">
                          {hotline.number}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {hotline.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
              <Card>
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What should I include in my emergency kit?</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 ml-6 list-disc">
                          <li>Water - one gallon per person per day for at least three days</li>
                          <li>Food - non-perishable food for at least three days</li>
                          <li>Battery-powered or hand-crank radio</li>
                          <li>Flashlight and extra batteries</li>
                          <li>First aid kit</li>
                          <li>Whistle to signal for help</li>
                          <li>Dust mask, plastic sheeting, and duct tape</li>
                          <li>Moist towelettes, garbage bags, and plastic ties for sanitation</li>
                          <li>Wrench or pliers to turn off utilities</li>
                          <li>Manual can opener for food</li>
                          <li>Local maps</li>
                          <li>Cell phone with chargers and a backup battery</li>
                          <li>Prescription medications and glasses</li>
                          <li>Important family documents in a waterproof container</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How can I prepare my family for a disaster?</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 ml-6 list-disc">
                          <li>Create a family emergency communication plan</li>
                          <li>Designate emergency meeting places both within and outside your neighborhood</li>
                          <li>Identify evacuation routes from your home and neighborhood</li>
                          <li>Practice your evacuation plan regularly</li>
                          <li>Keep an emergency kit ready and accessible</li>
                          <li>Learn basic first aid and CPR</li>
                          <li>Store important documents in a waterproof, portable container</li>
                          <li>Make sure everyone knows how to turn off utilities</li>
                          <li>Sign up for local emergency alerts and warnings</li>
                          <li>Know your area's risk for different types of disasters</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>What should I do after a disaster has occurred?</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 ml-6 list-disc">
                          <li>Check yourself and those around you for injuries</li>
                          <li>Call for help if needed and help others if you can safely do so</li>
                          <li>Monitor local news for emergency information and instructions</li>
                          <li>Only return home when authorities say it's safe</li>
                          <li>Document property damage with photographs for insurance purposes</li>
                          <li>Be cautious about entering damaged buildings</li>
                          <li>Check utilities (gas, electrical, water) for damage</li>
                          <li>Avoid using phones except for emergencies</li>
                          <li>Begin cleanup safely - wear protective clothing and work with someone if possible</li>
                          <li>Take care of your emotional health and seek help if needed</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>How can I help my community during a disaster?</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 ml-6 list-disc">
                          <li>Get trained in disaster preparedness through certified programs</li>
                          <li>Volunteer with established organizations that provide disaster relief</li>
                          <li>Check on neighbors, especially the elderly, disabled, or those with young children</li>
                          <li>Share accurate information from official sources</li>
                          <li>Donate cash to reputable relief organizations rather than goods</li>
                          <li>Offer shelter to evacuees if it's safe to do so</li>
                          <li>Help distribute food, water, and supplies if authorized to do so</li>
                          <li>Assist with cleanup efforts when it's safe</li>
                          <li>Provide emotional support to those affected</li>
                          <li>Participate in community recovery planning</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* AI Chat */}
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default SafetyTips;
