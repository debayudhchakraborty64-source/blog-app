export default function Loader({ label = "Loading…" }) {
  return (
    <div className="loader" role="status">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
      <span className="loader-label">{label}</span>
    </div>
  );
}
