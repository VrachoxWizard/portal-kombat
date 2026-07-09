"use client";

import dynamic from "next/dynamic";
import React from "react";

const AmbientGrid3D = dynamic(() => import("./AmbientGrid3D"), {
  ssr: false,
});

interface AmbientGrid3DWrapperProps {
  color?: string;
}

export default function AmbientGrid3DWrapper(props: AmbientGrid3DWrapperProps) {
  return (
    <AmbientGrid3D {...props} />
  );
}
