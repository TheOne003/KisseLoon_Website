export function StatusState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="status-box card">
      <span className="demo-badge">Kisse Loon</span>
      <h2>{title}</h2>
      <p className="muted">{message}</p>
      {action}
    </div>
  );
}
