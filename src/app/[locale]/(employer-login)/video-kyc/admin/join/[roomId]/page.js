// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import dynamic from "next/dynamic";

// const JitsiMeet = dynamic(() => import("@/components/JitsiMeet"), { ssr: false });

// export default function AdminJoinSession() {
//   const { roomId } = useParams();
//   const [jitsiLoaded, setJitsiLoaded] = useState(false);

//   useEffect(() => {
//     if (roomId) {
//       console.log("Admin joining room:", roomId);
//       setJitsiLoaded(true);
//     }
//   }, [roomId]);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-xl font-bold">Admin Video KYC Session</h1>
//       <p>Joining Room: {roomId}</p>
//       {jitsiLoaded && <JitsiMeet roomName={roomId} displayName="Admin" isAdmin={true} />}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const JitsiMeet = dynamic(() => import("@/components/JitsiMeet"), { ssr: false });

export default function AdminJoinSession() {
  const { roomId } = useParams();
  const [jitsiLoaded, setJitsiLoaded] = useState(false);

  useEffect(() => {
    if (roomId) {
      setJitsiLoaded(true);
    }
  }, [roomId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Admin Video KYC Session</h1>
      <p>Joining Room: {roomId}</p>
      {jitsiLoaded && <JitsiMeet roomName={roomId} displayName="Admin" isAdmin={true} />}
    </div>
  );
}
