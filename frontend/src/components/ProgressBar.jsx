export default function ProgressBar({ value }) {
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`progress-fill${value === 100 ? ' done' : ''}`} style={{ width: `${value}%` }} />
    </div>
  );
}
