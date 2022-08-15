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
    const [rounds, setRounds] = useState("10");
    const [roundDuration, setRoundDuration] = useState("30");
    const [host, setHost] = useState("");
    const [playerUID, setPlayerUID] = useState("");
    const [roundNumber, setRoundNumber] = useState(1);
    const [imageURL, setImageURL] = useState("");
    const [scoreboardInfo, setScoreboardInfo] = useState([]);
    const [photosFromAPI, setPhotosFromAPI] = useState([])
    const [deckSelected, setDeckSelected] = useState("")



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
                scoreboardInfo,
                photosFromAPI,
                deckSelected,
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
                setScoreboardInfo,
                setPhotosFromAPI,
                setDeckSelected
            }}>
                <Nav/>
            </LandingContext.Provider>
            {/*  <ShareExample/>*/}
        </div>
    );
}
