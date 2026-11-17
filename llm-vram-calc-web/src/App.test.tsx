import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders LLM VRAM calculator heading', () => {
  render(<App />);
  expect(screen.getByText(/LLM 模型显存计算器/)).toBeInTheDocument();
});
