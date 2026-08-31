import { Fragment } from "react";

// Renders a string with *marked* segments highlighted as accent-underlined words.
// e.g. "Construyo *soluciones B2B* de punta a punta"
export default function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.length > 1 && part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="kw">
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
