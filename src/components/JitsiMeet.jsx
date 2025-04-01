// "use client"

// import { useEffect, useRef } from 'react'
// import { useRouter } from 'next/navigation'

// export default function JitsiMeet({ roomName, displayName, onApiReady }) {
//   const jitsiContainerRef = useRef(null)
//   const router = useRouter()
  
//   useEffect(() => {
//     // Load Jitsi Meet External API Script
//     const loadJitsiScript = () => {
//       const script = document.createElement("script")
//       script.src = "https://meet.jit.si/external_api.js"
//       script.async = true
//       document.body.appendChild(script)
      
//       return script
//     }

//     // Initialize Jitsi Meet
//     const initJitsi = () => {
//       if (!jitsiContainerRef.current) return

//       const domain = "meet.jit.si"
//       const options = {
//         roomName: roomName,
//         width: "100%",
//         height: "100%",
//         parentNode: jitsiContainerRef.current,
//         userInfo: {
//           displayName: displayName
//         },
//         configOverwrite: {
//           prejoinPageEnabled: false,
//           toolbarButtons: [
//             'camera',
//             'chat',
//             'closedcaptions',
//             'desktop',
//             'fullscreen',
//             'hangup',
//             'microphone',
//             'participants-pane',
//             'recording',
//             'settings',
//             'toggle-camera',
//           ],
//         },
//         interfaceConfigOverwrite: {
//           TOOLBAR_BUTTONS: [
//             'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
//             'fodeviceselection', 'hangup', 'profile', 'recording',
//             'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
//             'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
//             'tileview', 'select-background', 'download', 'help', 'mute-everyone',
//             'security'
//           ],
//           SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
//           SHOW_JITSI_WATERMARK: false,
//           SHOW_WATERMARK_FOR_GUESTS: false,
//           SHOW_BRAND_WATERMARK: false,
//           BRAND_WATERMARK_LINK: '',
//           SHOW_POWERED_BY: false,
//           SHOW_PROMOTIONAL_CLOSE_PAGE: false,
//           MOBILE_APP_PROMO: false,
//         },
//       }

//       const api = new window.JitsiMeetExternalAPI(domain, options)

//       // Handle events
//       api.addEventListeners({
//         readyToClose: () => {
//           router.push('/')
//         },
//         participantLeft: () => {
//           console.log('Participant left')
//         },
//         videoConferenceJoined: () => {
//           console.log('Local user joined')
//         },
//         videoConferenceLeft: () => {
//           console.log('Local user left')
//           router.push('/')
//         },
//       })

//       if (onApiReady) {
//         onApiReady(api)
//       }

//       return api
//     }

//     // Load script and initialize
//     const script = loadJitsiScript()
//     script.onload = () => {
//       initJitsi()
//     }

//     return () => {
//       script.remove()
//     }
//   }, [roomName, displayName, onApiReady, router])

//   return (
//     <div 
//       ref={jitsiContainerRef} 
//       className="w-full h-screen"
//     />
//   )
// }

"use client";
import { useEffect, useRef, useState } from "react";

export default function JitsiMeet({ roomName, displayName, isAdmin = false }) {
  const jitsiContainer = useRef(null);
  const [jitsiAPI, setJitsiAPI] = useState(null);
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    if (!roomName || typeof window === "undefined") return;

    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => resolve(window.JitsiMeetExternalAPI);
        script.onerror = reject;

        document.body.appendChild(script);
      });
    };

    loadJitsiScript()
      .then(() => {
        const domain = "meet.jit.si";
        const options = {
          roomName,
          parentNode: jitsiContainer.current,
          userInfo: { displayName },
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        setJitsiAPI(api);

        api.addEventListener("videoConferenceJoined", async (data) => {
          console.log(`${displayName} joined the room: ${roomName}`);

          // Admin should be the first participant
          api.getParticipantsInfo().then((participants) => {
            console.log("Participants count:", participants.length);

            if (isAdmin && participants.length === 1) {
              console.log("Admin is the first participant. Setting as moderator...");
              setTimeout(() => {
                api.executeCommand("password", "adminpass");
                setIsModerator(true);
                console.log("Admin set as moderator!");
              }, 2000);
            }
          });
        });

        // Detect if admin gets moderator rights
        api.addEventListener("participantRoleChanged", (event) => {
          if (event.role === "moderator") {
            console.log("Admin is now a moderator!");
            setIsModerator(true);
          }
        });
      })
      .catch((error) => console.error("Jitsi API load failed", error));

    return () => jitsiAPI?.dispose();
  }, [roomName, displayName, isAdmin]);

  return (
    <div>
      <div ref={jitsiContainer} style={{ height: "500px", width: "100%" }} />
      {isAdmin && !isModerator && <p>Waiting for moderator access...</p>}
    </div>
  );
}
