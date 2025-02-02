import {useEffect, useRef} from 'react';

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
    <div className="flex flex-col items-center">
        <video id={videoElementId}
          ref={videoRef}
          src={videoUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="w-full max-w-lg rounded-md overflow-hidden"
          >
          <track kind="captions" />
        </video>
      </div>
  );
};

export default VideoPlayer;
