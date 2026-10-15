"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  accept: string;
  multiple?: boolean;
  label: string;
  hint?: string;
  onFiles: (files: File[]) => void;
}

export function Dropzone({ accept, multiple = true, label, hint, onFiles }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
        over ? "border-primary bg-primary/5" : "border-border bg-muted/30",
      )}
    >
      <UploadCloud className="h-10 w-10 text-primary" />
      <p className="mt-3 font-medium">{label}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      <button type="button" className="btn-primary mt-5" onClick={() => inputRef.current?.click()}>
        Choose {multiple ? "files" : "a file"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
