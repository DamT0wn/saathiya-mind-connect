import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "@/contexts/ChatContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIEmpathyEngine from "./pages/AIEmpathyEngine";
import CrisisSupport from "./pages/CrisisSupport";
import MoodDashboard from "./pages/MoodDashboard";
import ResourceCenter from "./pages/ResourceCenter";
import { Login } from "./pages/Login";
import { FinishSignUp } from "./pages/FinishSignUp";
import Settings from "./pages/Settings";
import { Pricing } from "./pages/Pricing";
import { Profile } from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <ChatProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/finishSignUp" element={<FinishSignUp />} />
                <Route path="/ai-chat" element={<AIEmpathyEngine />} />
                <Route path="/crisis-support" element={<CrisisSupport />} />
                <Route path="/mood-dashboard" element={<MoodDashboard />} />
                <Route path="/resources" element={<ResourceCenter />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
