import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Overview from "./pages/Overview";
import ExploreContext from "./pages/ExploreContext";
import AskAgent from "./pages/AskAgent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/explore" element={<ExploreContext />} />
        <Route path="/ask" element={<AskAgent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;