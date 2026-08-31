"use client";

import { useEffect, useRef } from "react";

type VideoDialogProps = {
  src: string | null;
  title: string;
  onClose: () => void;
};

export default function VideoDialog({ src, title, onClose }: VideoDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = src !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="fixed inset-0 m-auto w-[min(94vw,1200px)] bg-transparent"
    >
      {open && (
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-9 right-0 font-mono text-xs uppercase tracking-wide text-white/80 hover:text-white"
          >
            Cerrar ✕
          </button>
          {/* key forces a fresh element per video so it autoplays from the start */}
          <video
            key={src}
            className="max-h-[85vh] w-full rounded-lg border border-white/15 bg-black"
            src={src ?? undefined}
            title={title}
            controls
            autoPlay
            playsInline
          />
        </div>
      )}
    </dialog>
  );
}
