interface BrandLogoProps {
  className?: string;
  iconClassName?: string;
  nameClassName?: string;
  alt?: string;
}

export function BrandLogo({
  className = '',
  iconClassName = 'h-8 w-8 rounded-lg',
  nameClassName = 'text-xl font-bold text-slate-900',
  alt = 'Logo SellFlow',
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <img
        src="/brand/sellflow-mark.png"
        alt={alt}
        className={`w-auto object-contain ${iconClassName}`.trim()}
        loading="eager"
        decoding="async"
      />
      <span className={nameClassName}>SellFlow</span>
    </div>
  );
}
