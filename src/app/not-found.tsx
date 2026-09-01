export default function NotFound() {
  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "4rem 1.5rem",
          background: "#0a0a0b",
          color: "#ededed",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
        <p style={{ marginTop: "1rem" }}>
          <a href="/es" style={{ color: "#8b5cf6" }}>
            Volver al inicio
          </a>
        </p>
      </body>
    </html>
  );
}
