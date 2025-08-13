"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useEditorStore } from "@/store";
import { getUserDesigns } from "@/services/design-service";
import { getUserSubscription } from "@/services/subscription-service";
import { fetchWithAuth } from "@/services/base-service";

import AiFeatures from "@/components/home/ai-features";
import Banner from "@/components/home/banner";
import DesignTypes from "@/components/home/design-types";
import DesignModal from "@/components/home/designs-modal";
import Header from "@/components/home/header";
import RecentDesigns from "@/components/home/recent-designs";
import SideBar from "@/components/home/sidebar";
import SubscriptionModal from "@/components/subscription/premium-modal";

function Home() {
  const { data: session, status } = useSession();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const {
    setUserSubscription,
    setUserDesigns,
    showPremiumModal,
    setShowPremiumModal,
    showDesignsModal,
    setShowDesignsModal,
    userDesigns,
    setUserDesignsLoading,
    userDesignsLoading,
  } = useEditorStore();

  const fetchUserSubscription = useCallback(async () => {
    // Only proceed if user is properly authenticated
    if (status !== "authenticated" || !session?.idToken) {
      console.log("Skipping subscription fetch - not authenticated or no idToken");
      return;
    }

    try {
      console.log("Fetching user subscription...");
      const response = await getUserSubscription();
      if (response?.success) {
        setUserSubscription(response.data);
        console.log("Subscription fetched successfully");
      }
    } catch (error) {
      console.log("Failed to fetch user subscription:", error.message);
    }
  }, [status, session?.idToken, setUserSubscription]);

  const fetchUserDesigns = useCallback(async () => {
    // Only proceed if user is properly authenticated
    if (status !== "authenticated" || !session?.idToken) {
      console.log("Skipping designs fetch - not authenticated or no idToken");
      setUserDesignsLoading(false);
      return;
    }

    try {
      console.log("Fetching user designs...");
      setUserDesignsLoading(true);
      const result = await getUserDesigns();

      if (result?.success) {
        setUserDesigns(result?.data);
        console.log("Designs fetched successfully:", result.data.length);
      }
    } catch (error) {
      console.log("Failed to fetch user designs:", error.message);
    } finally {
      setUserDesignsLoading(false);
    }
  }, [status, session?.idToken, setUserDesigns, setUserDesignsLoading]);

  // Effect to handle authentication state changes
  useEffect(() => {
    console.log("Auth state changed - Status:", status, "Session:", !!session, "idToken:", !!session?.idToken);
    
    // Debug: Log the actual idToken if it exists
    if (session?.idToken) {
      console.log("IdToken sample:", session.idToken.substring(0, 50) + "...");
    }
    
    const handleAuthenticatedUser = async () => {
      if (status === "authenticated" && session?.idToken) {
        console.log("User authenticated, loading data...");
        fetchUserSubscription();
        fetchUserDesigns();
      } else if (status === "unauthenticated") {
        // Clear data when user logs out
        setUserDesigns([]);
        setUserDesignsLoading(false);
        setIsDataLoaded(false);
      }
    };

    handleAuthenticatedUser();
  }, [status, session?.idToken, fetchUserSubscription, fetchUserDesigns, setUserDesigns, setUserDesignsLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px'
        }}>
          <div><strong>Auth Debug:</strong></div>
          <div>Status: {status}</div>
          <div>Session: {session ? 'Yes' : 'No'}</div>
          <div>ID Token: {session?.idToken ? 'Yes' : 'No'}</div>
          <div>User: {session?.user?.email || 'None'}</div>
          <div>Data Loaded: {isDataLoaded ? 'Yes' : 'No'}</div>
        </div>
      )}
      
      <SideBar />
      <div className="flex-1 flex flex-col ml-[72px]">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto pt-20">
          <Banner />
          <DesignTypes />
          <AiFeatures />
          <RecentDesigns />
        </main>
      </div>
      <SubscriptionModal
        isOpen={showPremiumModal}
        onClose={setShowPremiumModal}
      />
      <DesignModal
        isOpen={showDesignsModal}
        onClose={setShowDesignsModal}
        userDesigns={userDesigns}
        setShowDesignsModal={setShowDesignsModal}
        userDesignsLoading={userDesignsLoading}
      />
    </div>
  );
}

export default Home;
