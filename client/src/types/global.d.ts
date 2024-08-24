// global.d.ts
interface SessionRewind {
  identifyUser: (options: { userId: string | null }) => void;
  startSession: () => void;
  getSessionUrl: () => string;
  stopSession: () => void;
}

interface Window {
  sessionRewind?: SessionRewind;
}
