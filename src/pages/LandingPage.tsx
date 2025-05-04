import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AlertTriangle, MapPin, Users, BrainCircuit, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AIChat from '@/components/AIChat';
import EmergencyFAB from '@/components/EmergencyFAB';

const LandingPage: React.FC = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <Navbar />
      
      {/* Parallax Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ scale }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.2))]" />
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="lg:w-1/2 space-y-8">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Next-Gen Disaster<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Response Platform
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Harnessing AI and real-time data to transform emergency management and save lives.
              </motion.p>

              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="/res.jpg"
                  alt="Disaster Response"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
                
                {/* Animated Status Dots */}
                {[
                  { x: '10%', y: '20%', color: 'bg-green-400' },
                  { x: '80%', y: '40%', color: 'bg-yellow-400' },
                  { x: '30%', y: '70%', color: 'bg-red-500' },
                ].map((dot, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-4 h-4 rounded-full ${dot.color} shadow-lg`}
                    style={{ left: dot.x, top: dot.y }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slant Divider */}
        <div className="absolute -bottom-24 left-0 w-full h-48 bg-white dark:bg-gray-900 transform skew-y-3 z-20" />
      </motion.section>

      {/* Features Section */}
      <section className="relative py-24 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Integrated solutions for comprehensive disaster management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <AlertTriangle />, title: 'Real-time Alerts', color: 'from-red-500 to-orange-500' },
              { icon: <MapPin />, title: 'Geo Mapping', color: 'from-green-500 to-cyan-500' },
              { icon: <Users />, title: 'Coordination', color: 'from-purple-500 to-pink-500' },
              { icon: <BrainCircuit />, title: 'AI Predictions', color: 'from-blue-500 to-indigo-500' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
                <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color}`}>
                  {React.cloneElement(feature.icon, { className: 'w-8 h-8 text-white' })}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                 <br/>
                 <br/>
                 <br/>
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Slant Divider */}
        <div className="absolute -bottom-24 left-0 w-full h-48 bg-gray-50 dark:bg-gray-800 transform -skew-y-3 z-20" />
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div 
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[40px] p-12 shadow-2xl relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Revolutionize Disaster Response?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of organizations already transforming their emergency management
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-transform"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            >
              Start Free Trial
              <Zap className="ml-2 h-5 w-5 fill-current" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Floating Elements */}
      <EmergencyFAB />
      <AIChat open={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default LandingPage;