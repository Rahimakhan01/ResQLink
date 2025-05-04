import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast as sonnerToast } from 'sonner';

type UserRole = 'user' | 'volunteer' | 'ngo' | 'authority' | 'admin';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      if (userId === 'admin-special-id') {
        setProfile({
          id: userId,
          name: 'Admin User',
          phone: '0000000000',
          role: 'admin',
        });
        return;
      }

      // Simulated profile
      setProfile({
        id: userId,
        name: 'User ' + userId.slice(0, 6),
        phone: '1234567890',
        role: 'user',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const setupAuthListener = async () => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      });

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      }

      setIsLoading(false);
      return () => subscription.unsubscribe();
    };

    setupAuthListener();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const isAdmin = email === 'pb6523@srmist.edu.in' && password === '9118604416@pP';
      if (isAdmin) {
        const mockUser = {
          id: 'admin-special-id',
          email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;

        const mockSession: Session = {
          access_token: 'mock-token',
          token_type: 'bearer',
          user: mockUser,
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        };

        setUser(mockUser);
        setSession(mockSession);
        await fetchProfile(mockUser.id);

        sonnerToast.success('Login Successful', {
          description: 'Welcome back, Admin!',
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      sonnerToast.success('Login Successful', {
        description: 'Welcome back to ResQLInk!',
      });
    } catch (error: any) {
      console.error('Login error:', error);
      sonnerToast.error('Login Failed', {
        description: error.message || 'Login failed. Please try again.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const isAdmin = userData.email === 'pb6523@srmist.edu.in' && userData.password === '9118604416@pP';
      if (isAdmin) {
        const mockUser = {
          id: 'admin-special-id',
          email: userData.email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;

        const mockSession: Session = {
          access_token: 'mock-token',
          token_type: 'bearer',
          user: mockUser,
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        };

        setUser(mockUser);
        setSession(mockSession);
        await fetchProfile(mockUser.id);

        sonnerToast.success('Registered as Admin', {
          description: 'Welcome to ResQLInk!',
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
          },
        },
      });

      if (error) throw error;

      // Directly log in after registration (no email verification)
      sonnerToast.success('Registration Successful', {
        description: 'You are now logged in.',
      });

      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id);

    } catch (error: any) {
      console.error('Register error:', error);
      sonnerToast.error('Registration Failed', {
        description: error.message || 'An error occurred during registration',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      sonnerToast.success('Logged Out', {
        description: 'You have been logged out successfully.',
      });
    } catch (error: any) {
      sonnerToast.error('Logout Failed', {
        description: error.message || 'An error occurred during logout',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
