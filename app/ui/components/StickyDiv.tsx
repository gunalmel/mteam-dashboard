import {HTMLAttributes, ReactNode} from 'react';
import styles from './StickyDiv.module.css';

export default function StickyDiv({videoElementId, stickyClassName = styles.sticky, children, ...rest}: {
  videoElementId: string,
  stickyClassName?: string,
  children: ReactNode,
  rest?: HTMLAttributes<HTMLDivElement>
}) {
  return (
    <div className={stickyClassName} {...rest}>
      {children}
    </div>
  );
}