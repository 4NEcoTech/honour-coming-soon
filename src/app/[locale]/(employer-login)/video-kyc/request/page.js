"use client"
import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSession } from 'next-auth/react';

export default function RequestKYC() {
  const { data: session, status } = useSession(); // Get user session
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Session Data:", session); // Debugging session
    console.log("Auth Status:", status);
  }, [session, status]);

  const handleRequest = async () => {
    if (!session?.user?.id) {
      alert("You need to be logged in to request a KYC session.");
      return;
    }
  
    setLoading(true);
    const response = await fetch('/api/video-kyc/request', {
      method: 'POST',
      body: JSON.stringify({ userId: session.user.id }),  // Use session.user.id instead of email
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await response.json();
    if (data.roomId) {
      router.push(`/video-kyc/join/${data.roomId}`);
    } else {
      alert('Error creating KYC session');
    }
    setLoading(false);
  };
  

  return (
    <div className="flex flex-col items-center">
      <h1>Request Video KYC</h1>
      {status === "loading" ? (
        <p>Checking authentication...</p>
      ) : (
        <button onClick={handleRequest} disabled={loading}>
          {loading ? 'Requesting...' : 'Start Video KYC'}
        </button>
      )}
    </div>
  );
}
