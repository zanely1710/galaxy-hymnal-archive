export default function SantaHat({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hat base */}
      <ellipse cx="50" cy="55" rx="48" ry="8" fill="#fff" />
      
      {/* Main hat */}
      <path
        d="M10 55 C15 20, 40 5, 85 25 C88 30, 90 40, 92 55 Z"
        fill="#dc2626"
      />
      
      {/* Hat shadow */}
      <path
        d="M15 55 C18 30, 42 15, 80 30 C82 35, 85 45, 88 55 Z"
        fill="#b91c1c"
        opacity="0.5"
      />
      
      {/* Pompom */}
      <circle cx="88" cy="22" r="10" fill="#fff" />
      
      {/* Fur trim detail */}
      <ellipse cx="50" cy="55" rx="45" ry="6" fill="#f5f5f5" />
    </svg>
  );
}
