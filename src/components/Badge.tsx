"use client";

// Komponen badge yang dapat digunakan ulang dengan warna kustom
// Props: text untuk label, color untuk warna hex, size untuk ukuran badge

interface BadgeProps {
  text: string;
  color: string;
  size?: "sm" | "md";
}

export default function Badge({ text, color, size = "sm" }: BadgeProps) {
  // Ukuran padding dan font berdasarkan prop size
  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs" 
    : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {text}
    </span>
  );
}
