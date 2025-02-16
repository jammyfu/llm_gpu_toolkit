import React from "react";
import LLMCalculatorPage from "./pages/LLMCalculatorPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LLMCalculatorPage />} />
        {/* 你可以添加更多的路由 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
