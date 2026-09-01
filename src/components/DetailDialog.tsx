"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/content/dictionary";
import type { ProjectDetail } from "@/content/projects";

type DetailDialogProps = {
  detail: ProjectDetail | null;
  title: string;
  locale: Locale;
  onClose: () => void;
};

export default function DetailDialog({ detail, title, locale, onClose }: DetailDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const t = getDictionary(locale);
  const open = detail !== null;

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
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="fixed inset-0 m-auto w-[min(92vw,640px)] bg-transparent"
    >
      {detail && (
        <div className="rounded-lg border border-line bg-surface p-8 md:p-10">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-medium tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="font-mono text-xs uppercase tracking-wide text-muted hover:text-foreground"
            >
              {t.nav.close} ✕
            </button>
          </div>
          <dl className="mt-8 space-y-6 border-l border-line pl-5">
            {(["brief", "approach", "solution", "extra"] as const).map((k) => (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-wide text-accent">
                  {t.work.detail[k]}
                </dt>
                <dd className="mt-1.5 text-sm text-muted">{detail[k][locale]}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </dialog>
  );
}
