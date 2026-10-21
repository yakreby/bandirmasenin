/** Marka işareti: haritadaki nokta halkası + kıyı çizgisi. currentColor ile boyanır. */
export default function Logo({ size = 28, title = "Bandırma Senin" }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label={title}
      className="logo"
    >
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M7 19.5c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.3-2 4.5-2 2.3 2 4.5 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="16" cy="11.5" r="2.6" fill="currentColor" />
    </svg>
  );
}
