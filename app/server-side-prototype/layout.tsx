import {ReactNode} from 'react';

export default function Layout({
                                 children,
                                 actions,
                                 cognitive,
                                 gaze
                               }: {
  children: ReactNode,
  actions: ReactNode,
  cognitive: ReactNode,
  gaze: ReactNode
}) {

  return (
    <>
      {children}
      {actions}
      {cognitive}
      {gaze}
    </>
  );
}
