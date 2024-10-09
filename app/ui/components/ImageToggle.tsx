import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import {ImageToggleProps} from '@/types';

const ImageToggle: React.FC<ImageToggleProps> =  ({iconUrl, text, isChecked, onToggle}) => (
  <div className="flex items-center mb-4">
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" className="peer sr-only" checked={isChecked} onChange={onToggle} />
      <div
        className={clsx(`h-4 w-11 rounded-md relative peer-focus:ring-blue-300 flex items-center p-1`,
          {
            [`bg-blue-300`]: isChecked,
            'bg-gray-200': !isChecked,
          }
        )}
      >
        <div
          className={clsx(
            'absolute h-6 w-5 rounded-md bg-white shadow-md transition-transform duration-200 ease-in-out',
            {
              'translate-x-full': isChecked,
              'translate-x-0': !isChecked,
            }
          )}
        >
          <Image height={14} width={14} src={iconUrl} alt="On/Off"
                 className={clsx(
                   'w-full h-full object-contain transition-filter duration-200 ease-in-out',
                   {'grayscale': !isChecked}
                 )}
          />
        </div>
      </div>
      <span className="ml-5 text-sm text-gray-700">{text}</span>
    </label>
  </div>
);
export default ImageToggle;
