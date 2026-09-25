import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ className = '', onClick }: { className?: string; lightBg?: boolean; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className={`inline-flex items-center group ${className}`}>
      <Image
        src="/logo.png"
        alt="Sudonex — Software | Solutions | Success"
        width={200}
        height={200}
        priority
        className="h-14 w-auto object-contain group-hover:scale-105 transition-transform"
      />
    </Link>
  );
}
