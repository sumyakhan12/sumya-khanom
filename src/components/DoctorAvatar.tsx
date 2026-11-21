import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';

interface DoctorAvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
}

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({
  src,
  name,
  size = 'md',
  online,
}) => {
  const [errored, setErrored] = useState(false);

  const dims =
    size === 'sm'
      ? 'w-11 h-11 rounded-xl'
      : size === 'lg'
        ? 'w-[72px] h-[72px] rounded-2xl'
        : 'w-14 h-14 rounded-2xl';

  return (
    <div className={`relative shrink-0 overflow-visible ${dims}`}>
      <div className={`${dims} overflow-hidden border border-[#E7DFD2] bg-[#FBF8F2]`}>
        {!errored ? (
          <img
            src={src}
            alt={name}
            referrerPolicy="no-referrer"
            onError={() => setErrored(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full bg-[#E2EEE5] flex items-center justify-center text-[#245B52]"
            aria-label={name}
          >
            <Stethoscope className="w-5 h-5" />
          </div>
        )}
      </div>

      {online !== undefined && (
        <span
          title={online ? 'Video consultation available' : 'In-person chamber only'}
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#FFFDF8] ${
            online ? 'bg-[#397C70]' : 'bg-[#A9BDA8]'
          }`}
        />
      )}
    </div>
  );
};
