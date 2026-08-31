"use client";

import { useEffect, useRef } from "react";

type VideoDialogProps = {
  youtubeId: string | null;
  src: string | null;
  title: string;
  onClose: () => void;
};

export default function VideoDialog({ youtubeId, src, title, onClose }: VideoDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = youtubeId !== null || src !== null;

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

          {youtubeId ? (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/15 bg-black">
              <iframe
                key={youtubeId}
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&cc_load_policy=1`}
                title={title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              key={src}
              className="max-h-[85vh] w-full rounded-lg border border-white/15 bg-black"
              src={src ?? undefined}
              title={title}
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
      )}
    </dialog>
  );
}
