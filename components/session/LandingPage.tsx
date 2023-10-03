/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import React from "react";
import LoginForm from "./Login";

import NextImage from "next/image";
import { signOut } from "next-auth/react";

const LandingPage = () => {
  return (
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 container border border-border p-20">
      <div className="flex flex-row">
        <LoginForm />
        <div className="relative flex justify-center items-center w-full basis-1/2">
          <NextImage
            width={300}
            height={200}
            quality={90}
            src="/Logo.png"
            alt="NextUI hero Image"
            onClick={() => signOut()}
            priority
            className="w-auto h-auto "
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
