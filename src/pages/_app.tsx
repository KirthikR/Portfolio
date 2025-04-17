import React from 'react';
import type { AppProps } from 'next/app';
import { ScrollOptimizationProvider } from '../context/ScrollOptimizationContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ScrollOptimizationProvider>
      <Component {...pageProps} />
    </ScrollOptimizationProvider>
  );
}

export default MyApp;
