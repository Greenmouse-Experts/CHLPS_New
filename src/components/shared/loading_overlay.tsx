import Image from "next/image";
import { Assets } from "@/lib/assets";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60">
      <div className="relative flex flex-col items-center justify-center">
        <div className="h-24 w-24 animate-spin rounded-full border-4 border-white/20 border-t-secondary" />
        <Image
          src={Assets.icons.logo}
          alt="CHLPS"
          className="absolute h-14 w-14 object-contain"
          width={50}
          height={50}
          priority
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;
