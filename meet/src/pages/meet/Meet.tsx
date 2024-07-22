import { useState } from "react";
import ActionButtons from "./ActionButtons";
import User from "./User";
import Chatbox from "./Chatbox";
import Settings from "./Settings";

const Meet = () => {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [chat, setChat] = useState(true);
  const [present, setPresent] = useState(true);
  const [recording, setRecording] = useState(true);
  const [settings, setSettings] = useState(false);

  return (
    <div className="w-[100vw]  h-screen flex flex-col items-center justify-center px-5 py-5 overflow-x-hidden relative">
      <div className="flex gap-5 w-[100vw] h-full overflow-x-hidden relative">
        <User isOpen={chat || settings} />
        <Chatbox isOpen={chat} />
        <Settings isOpen={settings} />
      </div>

      <ActionButtons
        mic={mic}
        camera={camera}
        chat={chat}
        present={present}
        recording={recording}
        setMic={setMic}
        setCamera={setCamera}
        setChat={setChat}
        setPresent={setPresent}
        setRecording={setRecording}
        setSettings={setSettings}
      />
    </div>
  );
};

export default Meet;
