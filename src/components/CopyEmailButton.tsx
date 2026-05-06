import { useState } from 'react';
import { MdContentCopy, MdCheck } from 'react-icons/md';

interface CopyEmailButtonProps {
  email: string;
}

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-1.5 text-gb-fg4 hover:text-gb-green transition-all duration-200"
      aria-label={copied ? 'Copied!' : `Copy ${email}`}
    >
      <span className="relative">
        {copied ? (
          <MdCheck size={16} className="text-gb-green" />
        ) : (
          <MdContentCopy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        )}
      </span>
      <span
        className={`text-xs font-montserrat transition-all duration-200 ${
          copied
            ? 'opacity-100 text-gb-green translate-x-0'
            : 'opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0'
        }`}
      >
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}
