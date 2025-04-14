'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchRequests() {
      const response = await fetch('/api/video-kyc/requests');
      const data = await response.json();
      setRequests(data);
    }

    fetchRequests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Admin KYC Dashboard</h1>
      {requests.length === 0 ? (
        <p>No pending KYC requests.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.roomId}>
              <button
                onClick={() => router.push(`/video-kyc/admin/join/${req.roomId}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Join {req.roomId}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
