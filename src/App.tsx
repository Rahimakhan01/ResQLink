
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import Dashboard from "./pages/Dashboard";
import ReportEmergency from "./pages/ReportEmergency";
import SafetyTips from "./pages/SafetyTips";
import AdminDashboard from "./pages/AdminDashboard";
import ManageAdmins from "./pages/ManageAdmins";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminResources from "./pages/AdminResources";
import AdminInsights from "./pages/AdminInsights";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* User Routes - Protected */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/report" element={
            <PrivateRoute>
              <ReportEmergency />
            </PrivateRoute>
          } />
          <Route path="/safety" element={
            <PrivateRoute>
              <SafetyTips />
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          } />
          
          {/* Admin Routes - Protected with Role Check */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/admins" element={
            <PrivateRoute allowedRoles={['admin']}>
              <ManageAdmins />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminUsers />
            </PrivateRoute>
          } />
          <Route path="/admin/reports" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminReports />
            </PrivateRoute>
          } />
          <Route path="/admin/resources" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminResources />
            </PrivateRoute>
          } />
          <Route path="/admin/insights" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminInsights />
            </PrivateRoute>
          } />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
