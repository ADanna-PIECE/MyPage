"use client";

import { useEffect, useRef } from "react";

type VideoDialogProps = {
  youtubeId: string | null;
  title: string;
  onClose: () => void;
};

export default function VideoDialog({ youtubeId, title, onClose }: VideoDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = youtubeId !== null;

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
      className="fixed inset-0 m-auto w-[min(92vw,1100px)]"
    >
      {open && (
        <div className="relative aspect-video w-full bg-black">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 font-mono text-xs uppercase tracking-wide text-white"
            aria-label="Cerrar"
          >
            Cerrar ✕
          </button>
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </dialog>
  );
}
