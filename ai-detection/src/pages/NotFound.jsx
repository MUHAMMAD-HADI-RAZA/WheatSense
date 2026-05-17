export default function NotFound() {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2 style={{ color: "#e74c3c", fontSize: "3rem", marginBottom: "1rem" }}>404</h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <a href="/" className="btn">
        Return to Home
      </a>
    </div>
  );
}