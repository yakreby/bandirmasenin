"use client";

import { useEffect, useState } from "react";

/** Footer yılı: sabit yazılmaz, istemcide hesaplanır (prerender'da tarih kullanılamaz). */
export default function Year() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year ?? ""}</>;
}
