import React from "react";
import LLMCalculatorPage from "./pages/LLMCalculatorPage";
import LLMCalculatorPageNew from "./pages/LLMCalculatorPageNew";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LLMCalculatorPage />} />
          {/* <Route path="/new" element={<LLMCalculatorPageNew />} /> */}
          {/* 你可以添加更多的路由 */}
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
