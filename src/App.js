import React, {useState} from "react";
import "./App.css";
import Nav from "./Nav";
import ShareExample from "./Components/Share";

export const LandingContext = React.createContext();

export default function App() {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [alias, setAlias] = useState("");
    const [gameUID, setGameUID] = useState("");
    const [rounds, setRounds] = useState("");
    const [roundDuration, setRoundDuration] = useState("");
    const [host, setHost] = useState("");
    const [playerUID, setPlayerUID] = useState("");
    const [roundNumber, setRoundNumber] = useState(1);
    const [imageURL, setImageURL] = useState("");
    const [scoreboardInfo, setScoreboardInfo] = useState([]);


    return (
        <div className="App">
            <LandingContext.Provider value={{
                code,
                name,
                email,
                zipCode,
                alias,
                gameUID,
                rounds,
                roundDuration,
                host,
                roundNumber,
                playerUID,
                imageURL,
                setCode,
                setName,
                setEmail,
                setZipCode,
                setAlias,
                setGameUID,
                setRounds,
                setRoundDuration,
                setHost,
                setRoundNumber,
                setPlayerUID,
                setImageURL,
                scoreboardInfo,
                setScoreboardInfo,
            }}>
                <Nav/>
            </LandingContext.Provider>
            {/*  <ShareExample/>*/}
        </div>
    );
}
