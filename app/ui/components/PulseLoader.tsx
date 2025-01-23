import clsx from 'clsx';

export default function PulseLoader({isLoading, text}: {isLoading: boolean, text?: string}) {
  return (
    <div
      className={clsx(
        'absolute inset-0 bg-gray-700/50 flex items-center justify-center z-10',
        !isLoading && 'collapse'
      )}>
      <div className="flex flex-col items-center space-y-2">
        <div className="relative w-12 h-12">
          <span className="absolute w-12 h-12 rounded-full bg-white animate-animloader27"></span>
          <span className="absolute w-12 h-12 rounded-full bg-white animate-animloader27 [animation-delay:1s]"></span>
        </div>
        {text && <span className="text-white text-sm">{text}</span>}
      </div>
    </div>);
};
