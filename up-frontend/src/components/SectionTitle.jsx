export default function SectionTitle({ title, subtitle, right }) {
  return (
    <div className="row wrap" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 26 }}>{title}</h1>
        {subtitle ? <div className="muted" style={{ marginTop: 6 }}>{subtitle}</div> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}
