"use client";

import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Istaknuta slika",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/cms/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="featuredImage" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="url"
          id="featuredImage"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-slate-900/60 border border-white/5 rounded-lg p-3 text-xs text-slate-200 outline-none"
          placeholder="URL ili upload"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:border-primary/30"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
