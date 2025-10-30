import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider } from "@/contexts/ChatContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIEmpathyEngine from "./pages/AIEmpathyEngine";
import CrisisSupport from "./pages/CrisisSupport";
import MoodDashboard from "./pages/MoodDashboard";
import ResourceCenter from "./pages/ResourceCenter";
import { Login } from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ai-chat" element={<AIEmpathyEngine />} />
            <Route path="/crisis-support" element={<CrisisSupport />} />
            <Route path="/mood-dashboard" element={<MoodDashboard />} />
            <Route path="/resources" element={<ResourceCenter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
