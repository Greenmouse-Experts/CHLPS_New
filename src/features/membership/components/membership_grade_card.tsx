"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Assets } from "@/lib/assets";

type MembershipGradeCardProps = {
  badge: string;
  badgeAlt: string;
  title: string;
  body: string;
  cropLogo?: boolean;
  indicatorColor?: string;
};

export default function MembershipGradeCard({
  badge,
  badgeAlt,
  title,
  body,
  cropLogo = false,
  indicatorColor = "#E84028",
}: MembershipGradeCardProps) {
  const [imgSrc, setImgSrc] = useState(badge);

  useEffect(() => {
    setImgSrc(badge);
  }, [badge]);

  const isRemote =
    imgSrc.startsWith("http://") || imgSrc.startsWith("https://");

  return (
    <article
      className="relative w-full overflow-hidden rounded-tl-[35px] rounded-br-[35px] shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
      style={{ backgroundColor: indicatorColor }}
    >
      <div className="mt-[10px] flex w-full flex-col items-center rounded-tl-[25px] rounded-br-[35px] bg-[#EEEAF8] px-6 py-6 text-center sm:px-7 sm:py-7">
        <span className="relative flex h-[5.25rem] w-[5.25rem] items-center justify-center overflow-hidden rounded-full border-2 border-secondary bg-white">
          {cropLogo ? (
            <Image
              src={imgSrc}
              alt={badgeAlt}
              fill
              sizes="84px"
              unoptimized={isRemote}
              onError={() => setImgSrc(Assets.icons.logo)}
              className="object-cover object-left"
            />
          ) : (
            <Image
              src={imgSrc}
              alt={badgeAlt}
              width={120}
              height={124}
              unoptimized={isRemote}
              onError={() => setImgSrc(Assets.icons.logo)}
              className="h-[3.6rem] w-auto object-contain"
            />
          )}
        </span>
        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#221A7A] sm:text-[12px]">
          Membership Grade
        </p>
        <h2 className="mt-1.5 text-[1.35rem] font-bold leading-tight text-[#221A7A] sm:text-[32px]">
          {title}
        </h2>
        <p className="mt-2.5 text-[13px] leading-relaxed text-[#5F5878] sm:text-[15px]">
          {body}
        </p>
      </div>
    </article>
  );
}
