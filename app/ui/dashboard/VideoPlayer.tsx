import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { storage, ref as firebaseRef, getDownloadURL } from '@/app/lib/firebase';
import 'tailwindcss/tailwind.css';

const fireBaseVideoUrl = 'gs://mteam-dashboard.appspot.com/Data_Sample2/video/video.mp4';

interface VideoPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    setCurrentTime: (time: number) => void;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ setCurrentTime, ...props }, ref) => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const videoRef = firebaseRef(storage, fireBaseVideoUrl);

        getDownloadURL(videoRef).then((url) => {
            setVideoUrl(url);
        }).catch((error) => {
            console.error("Error fetching video URL: ", error);
        });
    }, []);

    const handleTimeUpdate = () => {
        if (localVideoRef.current) {
            const currentTime = localVideoRef.current.currentTime;
            setCurrentTime(currentTime);
            console.log('Current Video Time:', currentTime);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-full max-w-2xl bg-gray-800 rounded-md overflow-hidden mb-4">
                {videoUrl && (
                    <video
                        ref={(el) => {
                            localVideoRef.current = el;
                            if (typeof ref === 'function') {
                                ref(el);
                            } else if (ref) {
                                (ref as React.MutableRefObject<HTMLVideoElement | null>).current = el;
                            }
                        }}
                        src={videoUrl}
                        controls
                        className="w-full"
                        onTimeUpdate={handleTimeUpdate}
                        {...props}
                    />
                )}
            </div>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
