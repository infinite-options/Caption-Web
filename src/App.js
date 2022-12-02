import Landing from "./components/Landing"
import RoundType from "./components/RoundType"
import Waiting from "./components/Waiting"
import { CookiesProvider } from 'react-cookie'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

export default function App() {
  return (
    <div className="app">
        <CookiesProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/RoundType' element={<RoundType />} />
                    <Route path='/Waiting' element={<Waiting />} />
                </Routes>
            </Router>
        </CookiesProvider>
    </div>
  )
}
