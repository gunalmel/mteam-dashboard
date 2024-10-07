import React, { useRef, forwardRef } from 'react';
import 'tailwindcss/tailwind.css';

// uncomment if not using local video source
// const fireBaseVideoUrl = 'gs://mteam-dashboard.appspot.com/Data_Sample2/video/video.mp4';

// Set the local video path
const localVideoUrl = 'https://www.dropbox.com/scl/fi/gzpo2mer8tigrit3npjxv/timeline-multiplayer-09182024.mp4?rlkey=6sbj1ru1qze8mmf2xgww5q9tt&st=1iu18zj4&dl=1'; //

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    setCurrentTime: (time: number) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ setCurrentTime, ...props }, ref) => {
    // const [videoUrl, setVideoUrl] = useState<string>('');  // uncomment if not using local video source
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    // uncomment the block if not using local video source
    // useEffect(() => {
    //     const videoRef = firebaseRef(storage, fireBaseVideoUrl);

    //     getDownloadURL(videoRef).then((url) => {
    //         setVideoUrl(url);
    //     }).catch((error) => {
    //         console.error("Error fetching video URL: ", error);
    //     });
    // }, []);

    const handleTimeUpdate = () => {
        if (localVideoRef.current) {
            const currentTime = localVideoRef.current.currentTime;
            setCurrentTime(currentTime);
            // console.log('Current Video Time:', currentTime);
        }
    };

    // uncomment if not using local video source
    // return (
    //     <div className="flex flex-col items-center p-4">
    //         <div className="w-full max-w-2xl bg-gray-800 rounded-md overflow-hidden mb-4">
    //             {videoUrl && (
    //                 <video
    //                     ref={(el) => {
    //                         localVideoRef.current = el;
    //                         if (typeof ref === 'function') {
    //                             ref(el);
    //                         } else if (ref) {
    //                             (ref as React.MutableRefObject<HTMLVideoElement | null>).current = el;
    //                         }
    //                     }}
    //                     src={videoUrl}
    //                     controls
    //                     className="w-full"
    //                     onTimeUpdate={handleTimeUpdate}
    //                     {...props}
    //                 />
    //             )}
    //         </div>
    //     </div>
    // );

    // remove block if not using local video source
    return (
        <div className="flex flex-col items-center p-4">
          <div className="w-full max-w-2xl bg-gray-800 rounded-md overflow-hidden mb-4">
            <video
              ref={(el) => {
                localVideoRef.current = el;
                if (typeof ref === 'function') {
                  ref(el);
                } else if (ref) {
                  (ref as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                }
              }}
              src={localVideoUrl} // Use the local video URL here
              controls
              className="w-full"
              onTimeUpdate={handleTimeUpdate}
              {...props}
            >
              <track kind="captions" />
            </video>
          </div>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
