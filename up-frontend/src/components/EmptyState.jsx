export default function EmptyState({ title, text, action }) {
  return (
    <div className="glass card">
      <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
      <div className="muted" style={{ marginTop: 6 }}>{text}</div>
      {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
    </div>
  );
}
