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
import { CATEGORIES } from '../../utils/constants';
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

const PREM_PIE_COLORS = ['#f56795', '#45dfd7', '#ffb067', '#8db1fb', '#caa1f8', '#a1a1aa'];

import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export function TrendChart() {
  const { theme, transactions } = useAppContext();
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  const textColor = isDark ? '#8186a1' : '#8186a1';

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

  const maxVal = React.useMemo(() => {
    if (!chartData) return 1000;
    const all = [...chartData.income, ...chartData.expense];
    return Math.max(...all, 1000);
  }, [chartData]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Income',
        data: chartData.income,
        borderColor: '#5b8def',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(91, 141, 239, 0.25)');
          gradient.addColorStop(1, 'rgba(91, 141, 239, 0.01)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#5b8def',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
      {
        label: 'Expenses',
        data: chartData.expense,
        borderColor: '#f56795',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(245, 103, 149, 0.15)');
          gradient.addColorStop(1, 'rgba(245, 103, 149, 0.01)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#f56795',
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 0,
        left: 0,
        right: 10
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#2a2b40' : '#ffffff',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        titleColor: isDark ? '#f0f0f5' : '#2a2b40',
        bodyColor: isDark ? '#8186a1' : '#8186a1',
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        ticks: { 
          color: textColor, 
          font: { family: "'DM Mono', monospace", size: 10 }, 
          padding: 8,
          maxRotation: 0,
          autoSkip: true
        },
      },
      y: {
        suggestedMax: maxVal * 1.15,
        grid: { color: gridColor, drawBorder: false, borderDash: [5, 5] },
        ticks: { 
          color: textColor, 
          font: { family: "'DM Mono', monospace", size: 10 },
          padding: 10,
          callback: (v) => v === 0 ? '₹0' : '₹' + (v / 1000).toFixed(0) + 'k'
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export function SpendingDonut() {
  const { transactions, theme } = useAppContext();
  const isDark = theme === 'dark';
  const [activeItem, setActiveItem] = React.useState(null);
  
  const processedData = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const bycat = {};
    expenses.forEach(t => {
      bycat[t.category] = (bycat[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(bycat).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [transactions]);

  if (!processedData || processedData.length === 0) {
    return (
      <div className="h-[210px] flex flex-col items-center justify-center border-2 border-dashed border-dashboard-border rounded-xl bg-dashboard-bg-tertiary/20">
        <div className="text-2xl mb-2 opacity-20">🥧</div>
        <div className="text-[10px] text-dashboard-text-dim font-bold uppercase tracking-widest text-center px-4">No spending data recorded yet</div>
      </div>
    );
  }

  const totalAmount = React.useMemo(() => {
    return processedData.reduce((acc, curr) => acc + curr[1], 0);
  }, [processedData]);

  const data = {
    labels: processedData.map(d => d[0]),
    datasets: [{
      data: processedData.map(d => d[1]),
      backgroundColor: processedData.map((d, i) => PREM_PIE_COLORS[i % PREM_PIE_COLORS.length]),
      borderWidth: 0,
      borderRadius: 16,
      spacing: 6,
      hoverOffset: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    onHover: (event, elements) => {
      if (elements && elements.length > 0) {
        setActiveItem(elements[0].index);
      } else {
        setActiveItem(null);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? 'rgba(17, 18, 31, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        titleColor: isDark ? '#ffffff' : '#11121f',
        bodyColor: isDark ? '#a1a1aa' : '#71717a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        displayColors: true,
        boxPadding: 6,
      },
    },
  };

  return (
    <div className="flex items-center justify-between gap-3 h-[200px] w-full">
      <div className="h-[140px] w-[140px] shrink-0 relative flex items-center justify-center">
        {/* Central text (Behind the canvas) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
           <div className="font-sora text-[17px] font-extrabold mt-0.5 tracking-tight text-dashboard-text">
             ₹{totalAmount >= 1000 ? (totalAmount/1000).toFixed(1) + 'k' : totalAmount}
           </div>
           <div className="text-[9px] text-[#8186a1] font-semibold mt-1 uppercase tracking-wider">Spent</div>
        </div>
        
        {/* Chart Canvas (On top of the text) */}
        <div className="relative z-10 w-full h-full">
          <Doughnut data={data} options={{...options, maintainAspectRatio: false}} />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-y-3 flex-1 px-2">
        {processedData.map(([cat, val], i) => (
          <div key={cat} className="flex justify-between items-center text-[11px] 2xl:text-[12px] w-full">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: PREM_PIE_COLORS[i % PREM_PIE_COLORS.length] }} />
               <span className="text-[#8186a1] whitespace-nowrap">{cat}</span>
             </div>
             <span className="font-bold text-dashboard-text ml-3">
                {((val / totalAmount) * 100).toFixed(0)}%
             </span>
          </div>
        ))}
      </div>
    </div>
  );
}
