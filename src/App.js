import GameRules from "./components/GameRules"
import Confirmation from "./components/Confirmation"
import Landing from "./components/Landing"
import RoundType from "./components/RoundType"
import ScoreType from "./components/ScoreType"
import Waiting from "./components/Waiting"
import SelectDeck from "./components/SelectDeck"
import GooglePhotos from "./components/GooglePhotos"
import Caption from "./components/Caption"
import Vote from "./components/Vote"
import ScoreBoard from "./components/ScoreBoard"
import EndGame from "./components/EndGame"
import CnnDeck from "./components/CnnDeck"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { CookiesProvider } from 'react-cookie'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'

export default function App() {
    return (
    <div className="app">
        <GoogleOAuthProvider clientId="336598290180-69pe1qeuqku450vnoi8v1ehhi19jhpmt.apps.googleusercontent.com">
            <CookiesProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/GameRules" element={<GameRules />} />
                        <Route path="/Confirmation" element={<Confirmation />} />
                        <Route path="/ScoreType" element={<ScoreType />} />
                        <Route path="/RoundType" element={<RoundType />} />
                        <Route path="/Waiting" element={<Waiting />} />
                        <Route path="/SelectDeck" element={<SelectDeck />} />
                        <Route path="/GooglePhotos" element={<GooglePhotos />} />
                        <Route path="/Caption" element={<Caption />} />
                        <Route path="/Vote" element={<Vote />} />
                        <Route path="/ScoreBoard" element={<ScoreBoard />} />
                        <Route path="/EndGame" element={<EndGame />} />
                        <Route path="/CnnDeck" element={<CnnDeck />} />
                    </Routes>
                </Router>
            </CookiesProvider>
        </GoogleOAuthProvider>
    </div>
    )
}
