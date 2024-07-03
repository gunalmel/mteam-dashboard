import React, { useEffect, useState, useRef, forwardRef } from 'react';
import 'tailwindcss/tailwind.css';

// Replace with your Dropbox URL
const dropboxVideoUrl = 'https://www.dropbox.com/scl/fi/jtxtgoy24ac05bchi4r7f/edited_w_sound_June10_2024_team_lead_unich4.mov?rlkey=gyzoccf1cgr3k7lppwp1ws7ez&raw=1';

const VideoPlayer = forwardRef<HTMLVideoElement, React.VideoHTMLAttributes<HTMLVideoElement>>((props, ref) => {
    const [videoUrl, setVideoUrl] = useState<string>(dropboxVideoUrl);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    const seekToTime = (time: number) => {
        const videoElement = (ref as React.RefObject<HTMLVideoElement>).current || localVideoRef.current;
        if (videoElement) {
            videoElement.currentTime = time;
        }
    };

    const buttons = [
        { label: "Start", time: 0 },
        { label: "10s", time: 10 },
        { label: "30s", time: 30 },
        { label: "1m", time: 60 },
    ];

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
                        {...props}
                    />
                )}
            </div>
            <div className="flex space-x-2">
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        onClick={() => seekToTime(button.time)}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        {button.label}
                    </button>
                ))}
            </div>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
