export default function AuthShell({ title, sub, children }) {
  return (
    <main className="auth">
      <div className="auth-box">
        <div className="brand big">TaskFlow</div>
        <h1>{title}</h1>
        <p className="sub">{sub}</p>
        {children}
      </div>
    </main>
  );
}
