import React from "react";
import LLMCalculatorPage from "./pages/LLMCalculatorPage";
import LunarConverterPage from "./pages/LunarConverterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import BaziPage from "./pages/BaziPage";
import DaYunPage from "./pages/DaYunPage";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LLMCalculatorPage />} />
          <Route path="/lunar" element={<LunarConverterPage />} />
          <Route path="/bazi" element={<BaziPage />} />
          <Route 
            path="/dayun" 
            element={<DaYunPage />} 
          />
          {/* <Route path="/new" element={<LLMCalculatorPageNew />} /> */}
          {/* 你可以添加更多的路由 */}
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
