"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <Link href={"https://cafe.naver.com/likeusstock"} className={cn(className)}>
      <Image alt={""} src={"/logo.png"} width={3500} height={500}
             priority={true} />
    </Link>
  );
};

export default Header;