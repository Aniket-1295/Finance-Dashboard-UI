import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { CATEGORIES, MONTHLY_DATA } from '../../utils/constants';
import { getLastNMonthsData } from '../../utils/dataUtils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export function TrendChart({ theme, transactions = [] }) {
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#555870' : '#9a9ab0';

  const chartData = React.useMemo(() => {
    const months = getLastNMonthsData(transactions, 6);
    if (!months || months.length === 0) return null;

    return {
      labels: months.map(m => m.label),
      income: months.map(m => m.income),
      expense: months.map(m => m.expense)
    };
  }, [transactions]);


  if (!chartData) {
    return (
      <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-dashboard-border rounded-xl bg-dashboard-bg-tertiary/20">
        <div className="text-2xl mb-2 opacity-20">📊</div>
        <div className="text-xs text-dashboard-text-dim font-medium uppercase tracking-widest">No data available yet</div>
      </div>
    );
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Income',
        data: chartData.income,
        borderColor: '#4caf85',
        backgroundColor: 'rgba(76, 175, 133, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#4caf85',
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: chartData.expense,
        borderColor: '#e05c6a',
        backgroundColor: 'rgba(224, 92, 106, 0.06)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#e05c6a',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1a1d25' : '#ffffff',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        titleColor: isDark ? '#f0f0f5' : '#1a1a2e',
        bodyColor: isDark ? '#8a8fa8' : '#5a5a78',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: "'DM Mono', monospace", size: 10 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { 
          color: textColor, 
          font: { family: "'DM Mono', monospace", size: 10 },
          callback: (v) => '$' + (v / 1000).toFixed(0) + 'k'
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export function SpendingDonut({ transactions, theme }) {
  const isDark = theme === 'dark';
  
  const processedData = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const bycat = {};
    expenses.forEach(t => {
      bycat[t.category] = (bycat[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(bycat).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [transactions]);

  if (!processedData || processedData.length === 0) {
    return (
      <div className="h-[210px] flex flex-col items-center justify-center border-2 border-dashed border-dashboard-border rounded-xl bg-dashboard-bg-tertiary/20">
        <div className="text-2xl mb-2 opacity-20">🥧</div>
        <div className="text-[10px] text-dashboard-text-dim font-bold uppercase tracking-widest text-center px-4">No spending data recorded yet</div>
      </div>
    );
  }

  const data = {
// ... rest of the code ...
    labels: processedData.map(d => d[0]),
    datasets: [{
      data: processedData.map(d => d[1]),
      backgroundColor: processedData.map(d => CATEGORIES[d[0]]?.color || '#888'),
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1a1d25' : '#ffffff',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="h-[180px] w-full relative">
        <Doughnut data={data} options={options} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full">
        {processedData.slice(0, 4).map(([cat, val]) => (
          <div key={cat} className="flex items-center gap-2 text-[11px] text-dashboard-text-muted">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: CATEGORIES[cat]?.color }} />
            <span className="truncate">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
