// test/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../app/App';

describe('Carga inicial del componente App', () => {
  test('renderiza un texto esperado en pantalla', () => {
    render(<App />);
    const texto = screen.getByText(/bienvenido/i); 
    expect(texto).toBeInTheDocument();
  });
});
