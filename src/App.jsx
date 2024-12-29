// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MapView from "./pages/MapView";
import ChartView from "./pages/ChartView";
import DataCatalog from "./pages/DataCatalog";
import Settings from "./pages/Settings";
import Guide from "./pages/Guide";

const App = () => {
  return (
    <Router>
      <div style={appStyle}>
        <Sidebar />
        <div style={mainContentStyle}>
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/chart" element={<ChartView />} />
            <Route path="/data-catalog" element={<DataCatalog />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};


const appStyle = {
  display: "flex",
  height: "100vh",
  width: "100vw",
};

const mainContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
};

export default App;
