import {HTMLAttributes, ReactNode, useEffect, useRef} from 'react';
import styles from './StickyDiv.module.css';

export default function StickyDiv({stickyClassName = styles.sticky, children, ...rest}: {
  stickyClassName?: string,
  children: ReactNode,
  rest?: HTMLAttributes<HTMLDivElement>
}) {
  const markerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cachedMarkerRef = markerRef.current;
    const cachedStickyRef = stickyRef.current;

    if (!cachedMarkerRef || !cachedStickyRef) return;

    const observer = new IntersectionObserver(
      ([e]) => {
        cachedStickyRef.classList.toggle(stickyClassName, e.intersectionRatio < 1);
        cachedStickyRef.classList.toggle('bg-white', e.intersectionRatio < 1);
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


