import GameRules from "./components/GameRules"
import Confirmation from "./components/Confirmation"
import Landing from "./components/Landing"
import RoundType from "./components/RoundType"
import Waiting from "./components/Waiting"
import SelectDeck from "./components/SelectDeck"
import Caption from "./components/Caption"
import Vote from "./components/Vote"
import ScoreBoard from "./components/ScoreBoard"
import EndGame from "./components/EndGame"
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
                    <Route path="/GameRules" element={<GameRules />} />
                    <Route path="/Confirmation" element={<Confirmation />} />
                    <Route path="/RoundType" element={<RoundType />} />
                    <Route path="/Waiting" element={<Waiting />} />
                    <Route path="/SelectDeck" element={<SelectDeck />} />
                    <Route path="/Caption" element={<Caption />} />
                    <Route path="/Vote" element={<Vote />} />
                    <Route path="/ScoreBoard" element={<ScoreBoard />} />
                    <Route path="/EndGame" element={<EndGame />} />
                </Routes>
            </Router>
        </CookiesProvider>
    </div>
    )
}
