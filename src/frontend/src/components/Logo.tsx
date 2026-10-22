import Image from "next/image";

/** Marka işareti: B ve S iç içe, pin ve dalga. Kaynak public/images/bs-mark.png (256px, saydam). */
export default function Logo({ size = 28, title = "Bandırma Senin" }: { size?: number; title?: string }) {
  return (
    <Image
      src="/images/bs-mark.png"
      alt={title}
      width={size}
      height={size}
      className="logo"
      priority
    />
  );
}
