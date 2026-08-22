export default function ComingSoon({ title }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-2">Up next</p>
      <h1 className="font-display text-2xl text-text">{title}</h1>
      <p className="max-w-sm text-sm text-muted">
        This screen isn't built yet — it's next on the list.
      </p>
    </div>
  );
}
