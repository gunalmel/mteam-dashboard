import {HTMLAttributes, ReactNode} from 'react';
import styles from './StickyDiv.module.css';

export default function StickyDiv({stickyClassName = styles.sticky, children, ...rest}: {
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
