import React, { useEffect, useRef, useState } from 'react';
import { storage, ref, getDownloadURL } from '@/app/lib/firebase';
import 'tailwindcss/tailwind.css';

const fireBaseVideoUrl = 'gs://mteam-dashboard.appspot.com/Data_Sample2/video/video.mp4';

const VideoPlayer: React.FC = () => {
    const [videoUrl, setVideoUrl] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Replace 'your-video-file.mp4' with your actual file path in Firebase storage
        const videoRef = ref(storage, fireBaseVideoUrl);

        getDownloadURL(videoRef).then((url) => {
            setVideoUrl(url);
        }).catch((error) => {
            console.error("Error fetching video URL: ", error);
        });
    }, []);

    const seekToTime = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
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
                        ref={videoRef}
                        src={videoUrl}
                        controls
                        className="w-full"
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
};

export default VideoPlayer;
