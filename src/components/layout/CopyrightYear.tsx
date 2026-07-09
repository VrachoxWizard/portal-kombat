"use client";

import React, { useEffect, useState } from "react";

export default function CopyrightYear() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (currentYear !== 2026) {
      setTimeout(() => setYear(currentYear), 0);
    }
  }, []);

  return <>{year}</>;
}
