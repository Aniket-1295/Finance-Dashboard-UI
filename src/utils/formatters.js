export const fmt = (n) => {
  const abs = Math.abs(n);
  const str = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (n < 0 ? '-' : '+') + '$' + str;
};

export const fmtAbs = (n) => '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { 
  month: 'short', 
  day: 'numeric', 
  year: 'numeric' 
});
