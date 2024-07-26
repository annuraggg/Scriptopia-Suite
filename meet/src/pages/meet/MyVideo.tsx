import { VideoPreview } from "@stream-io/video-react-sdk";

const MyVideo = () => {
  return (
    <div className="absolute bottom-10 left-3 h-[20vh] w-[20vw] rounded-xl bg-card border">
      <VideoPreview />
    </div>
  );
};

export default MyVideo;
