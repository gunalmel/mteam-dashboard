import {HTMLAttributes, ReactNode, useEffect, useRef} from 'react';
import styles from './StickyDiv.module.css';
import {supportsPictureInPictureApi} from '@/app/utils/browser.features';

export default function StickyDiv({videoElementId, stickyClassName = styles.sticky, children, ...rest}: {
  videoElementId: string,
  stickyClassName?: string,
  children: ReactNode,
  rest?: HTMLAttributes<HTMLDivElement>
}) {
  const markerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const intersected = useRef<boolean>(false);

  useEffect(() => {
    const cachedMarkerRef = markerRef.current;
    const cachedStickyRef = stickyRef.current;

    if (!cachedMarkerRef || !cachedStickyRef) return;

    const video = document.getElementById(videoElementId) as HTMLVideoElement;
    if (supportsPictureInPictureApi()) {
      video.addEventListener('enterpictureinpicture', () => {
        console.log('enterpictureinpicture');
        cachedStickyRef.classList.toggle(stickyClassName, false);
        observer.disconnect();
      });

      video.addEventListener('leavepictureinpicture', () => {
        console.log('enterpictureinpicture');
        if(!intersected.current) {
          cachedStickyRef.classList.toggle(stickyClassName, true);
        }
        observer.observe(cachedMarkerRef);
      });
    }

    const observer = new IntersectionObserver(
      ([e]) => {
        intersected.current = e.intersectionRatio >= 1;
        cachedStickyRef.classList.toggle(stickyClassName, !intersected.current);
        cachedStickyRef.classList.toggle('bg-white', !intersected.current);
      },
      {
        // rootMargin: '-1px 0px 0px 0px',
        threshold: [1],
      }
    );

    observer.observe(cachedMarkerRef);

    // unmount
    return () => {
      observer.unobserve(cachedMarkerRef);
    };
  }, []);

  return (
    <>
      <div ref={stickyRef} {...rest}>
        {children}
      </div>
      <div ref={markerRef} style={{visibility: 'hidden', maxHeight: 0}}/>
    </>
  );
}


