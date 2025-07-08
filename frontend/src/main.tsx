// /frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";

// Import original application components
import App from "./App";
import EvalsPage from "./components/evals/EvalsPage";
import PairwiseEvalsPage from "./components/evals/PairwiseEvalsPage";
import RunEvalsPage from "./components/evals/RunEvalsPage";
import BestOfNEvalsPage from "./components/evals/BestOfNEvalsPage";
import AllEvalsPage from "./components/evals/AllEvalsPage";

// Import auth components
import AuthPage from "./components/auth/AuthPage";
import UserCreditsPage from "./components/auth/UserCreditsPage";
import PaymentSuccessPage from "./components/auth/PaymentSuccessPage";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreditProtectedRoute from "./components/auth/CreditProtectedRoute";

// Import marketing website components
import HomePage from "./components/marketing/HomePage";
import AboutPage from "./components/marketing/AboutPage";
import PricingPage from "./components/marketing/PricingPage";
import GalleryPage from "./components/marketing/GalleryPage";
import BlogListPage from "./components/marketing/BlogListPage";
import BlogPostPage from "./components/marketing/BlogPostPage";
import ContactPage from "./components/marketing/ContactPage";
import TermsOfServicePage from "./components/marketing/TermsOfServicePage";
import PrivacyPolicyPage from "./components/marketing/PrivacyPolicyPage";

// Import layout components
import MarketingLayout from "./components/layouts/MarketingLayout";

import { IS_RUNNING_ON_CLOUD } from "./config";

const MainApp = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Root route - Shows marketing homepage for non-authenticated users */}
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          
          {/* App route - ALWAYS requires authentication and credits */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute requireEmailVerification={true}>
                <CreditProtectedRoute>
                  <App />
                </CreditProtectedRoute>
              </ProtectedRoute>
            } 
          />
          
          {/* Marketing pages in a common layout */}
          <Route element={<MarketingLayout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:postSlug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
          </Route>
          
          {/* Authentication pages - not in marketing layout */}
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/reset-password" element={<AuthPage mode="reset" />} />
          
          {/* Account management - requires authentication */}
          <Route 
            path="/account" 
            element={
              <ProtectedRoute requireEmailVerification={true}>
                <UserCreditsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-success" 
            element={
              <ProtectedRoute requireEmailVerification={true}>
                <PaymentSuccessPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Evaluation pages - available in both modes but require authentication */}
          <Route 
            path="/all-evals" 
            element={
              <ProtectedRoute requireEmailVerification={false}>
                <AllEvalsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/evals" 
            element={
              <ProtectedRoute requireEmailVerification={false}>
                <EvalsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pairwise-evals" 
            element={
              <ProtectedRoute requireEmailVerification={false}>
                <PairwiseEvalsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/best-of-n-evals" 
            element={
              <ProtectedRoute requireEmailVerification={false}>
                <BestOfNEvalsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/run-evals" 
            element={
              <ProtectedRoute requireEmailVerification={false}>
                <RunEvalsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster toastOptions={{ className: "dark:bg-zinc-950 dark:text-white" }} />
      </AuthProvider>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);