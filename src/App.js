import Landing from "./components/Landing"
import RoundType from "./components/RoundType"
import Waiting from "./components/Waiting"
import SelectDeck from "./components/SelectDeck"
import Caption from "./components/Caption"
import Vote from "./components/Vote"
import ScoreBoard from "./components/ScoreBoard"
import { CookiesProvider } from 'react-cookie'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'

export default function App() {
    return (
    <div className="app">
        <CookiesProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/RoundType" element={<RoundType />} />
                    <Route path="/Waiting" element={<Waiting />} />
                    <Route path="/SelectDeck" element={<SelectDeck />} />
                    <Route path="/Caption" element={<Caption />} />
                    <Route path="/Vote" element={<Vote />} />
                    <Route path="/ScoreBoard" element={<ScoreBoard />} />
                </Routes>
            </Router>
        </CookiesProvider>
    </div>
    )
}
