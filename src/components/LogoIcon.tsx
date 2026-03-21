import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const LogoIcon: React.FC<LogoProps> = ({ className = "h-12 w-12" }) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/LogoIcon.png"
        alt="EaterIQ Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
};

export default LogoIcon;
