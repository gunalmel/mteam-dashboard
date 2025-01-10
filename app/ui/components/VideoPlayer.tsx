import React, {useEffect, useRef} from 'react';
import 'tailwindcss/tailwind.css';

interface VideoPlayerProps {
  videoElementId: string;
  onTimeUpdate: (currentTime: number) => void;
  seekTo: number | null;
  videoUrl: string;
}

const VideoPlayer = ({
  videoElementId,
  onTimeUpdate,
  seekTo,
  videoUrl
}: VideoPlayerProps) => {
  const videoRef = useRef({currentTime: 0} as HTMLVideoElement);

  const handleSeek = () => {
    if (seekTo !== null && videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  };

  useEffect(() => {
    handleSeek();
  }, [seekTo]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-md overflow-hidden mb-4">
        <video id={videoElementId}
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full"
          onTimeUpdate={handleTimeUpdate}
        >
          <track kind="captions" />
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
