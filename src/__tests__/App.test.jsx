import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { AppProvider } from '../context/AppContext';

// Mocking chart components as they rely on Canvas which can be tricky in JSDOM
vi.mock('../components/dashboard/Charts', () => ({
  TrendChart: () => <div data-testid="trend-chart">Trend Chart</div>,
  SpendingDonut: () => <div data-testid="spending-donut">Spending Donut</div>
}));

describe('App Home Page (Overview)', () => {
  const renderApp = () => render(
    <AppProvider>
      <App />
    </AppProvider>
  );

  it('renders the Financial Overview main heading', () => {
    renderApp();
    expect(screen.getByText(/Financial Overview/i)).toBeInTheDocument();
  });

  it('displays the breadcrumb navigation correctly', () => {
    renderApp();
    const homeBreadcrumb = screen.getByText('Home');
    const overviewBreadcrumb = screen.getByText('Overview');
    
    expect(homeBreadcrumb).toBeInTheDocument();
    expect(overviewBreadcrumb).toBeInTheDocument();
  });

  it('renders all four financial summary cards', () => {
    renderApp();
    const categories = ['Total Balance', 'Total Income', 'Total Expenses', 'Total Savings'];
    categories.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('shows the Activity manager section', () => {
    renderApp();
    expect(screen.getByText(/Activity manager/i)).toBeInTheDocument();
  });

  it('renders the sidebar navigation options', () => {
    renderApp();
    // Sidebar contains these main view triggers
    expect(screen.getByText(/Transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/Insights/i)).toBeInTheDocument();
  });
});
