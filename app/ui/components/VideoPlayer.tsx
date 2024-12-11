import React, {useEffect, useRef} from 'react';
import 'tailwindcss/tailwind.css';

// Set the local video path
const localVideoUrl = 'https://www.dropbox.com/scl/fi/gzpo2mer8tigrit3npjxv/timeline-multiplayer-09182024.mp4?rlkey=6sbj1ru1qze8mmf2xgww5q9tt&st=1iu18zj4&dl=1'; //

const VideoPlayer = ({videoElementId, onTimeUpdate, seekTo}: {videoElementId:string, onTimeUpdate: (currentTime:number)=>void, seekTo: number|null}) => {
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
          src={localVideoUrl}
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
