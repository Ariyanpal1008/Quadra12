import {useState} from 'react';
import {BookOpen} from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#ECE6D9] dark:bg-[#24201C] text-[#575048] dark:text-[#CBC3B6] p-6 text-center border border-[#DDD6C7] dark:border-[#332E28] ${className}`}
      >
        <BookOpen className="w-7 h-7 mb-2.5 text-[#A64B33] dark:text-[#D4785E] stroke-[1.5]" aria-hidden="true" />
        <p className="text-sm font-semibold text-[#1E1B18] dark:text-[#F5F2EB]">{fallbackTitle || 'PCMB Study Visual'}</p>
        <p className="text-xs text-[#787066] dark:text-[#9C9387] mt-1 max-w-xs">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
