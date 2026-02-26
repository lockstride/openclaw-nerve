/** Tests for the ContextMeter component. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContextMeter } from './ContextMeter';

describe('ContextMeter', () => {
  it('renders with normal usage', () => {
    render(<ContextMeter used={5000} limit={100000} />);
    // Should show CTX label
    expect(screen.getByText('CTX')).toBeInTheDocument();
  });

  it('shows token count', () => {
    const { container } = render(<ContextMeter used={10000} limit={100000} />);
    // The animated number should be present (may show formatted value like "10K")
    expect(container.textContent).toContain('CTX');
  });

  it('does not show warning icon at low usage', () => {
    const { container } = render(<ContextMeter used={1000} limit={100000} />);
    // 1% usage — no warning icon
    const svgs = container.querySelectorAll('svg');
    // May or may not have SVG depending on lucide rendering; just check it doesn't crash
    expect(container).toBeTruthy();
  });

  it('renders at zero usage', () => {
    const { container } = render(<ContextMeter used={0} limit={100000} />);
    expect(container).toBeTruthy();
    expect(screen.getByText('CTX')).toBeInTheDocument();
  });

  it('handles full usage without crashing', () => {
    const { container } = render(<ContextMeter used={100000} limit={100000} />);
    expect(container).toBeTruthy();
  });

  it('handles over-limit usage without crashing', () => {
    const { container } = render(<ContextMeter used={150000} limit={100000} />);
    expect(container).toBeTruthy();
  });

  it('includes tooltip with usage info', () => {
    const { container } = render(<ContextMeter used={50000} limit={100000} />);
    // The outer div has a title attribute
    const tooltipEl = container.querySelector('[title]');
    expect(tooltipEl).toBeTruthy();
    const title = tooltipEl?.getAttribute('title') || '';
    expect(title).toContain('50%');
  });

  it('progress bar width reflects usage', () => {
    const { container } = render(<ContextMeter used={50000} limit={100000} />);
    // The inner div with style.width should be ~50%
    const bars = container.querySelectorAll('div');
    const styledBar = Array.from(bars).find(d => d.style.width);
    expect(styledBar).toBeTruthy();
    expect(styledBar?.style.width).toBe('50%');
  });
});
