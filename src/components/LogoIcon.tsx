import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}
const LogoIcon: React.FC<LogoProps> = ({
  className = "h-12 w-12",
  size = 48,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/LogoIcon.png"
        alt="EaterIQ Logo"
        width={size}
        height={size}
        className="object-contain"
        loading="lazy"
        unoptimized
      />
    </div>
  );
};

export default LogoIcon;
