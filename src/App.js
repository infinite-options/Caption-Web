import React, {useState} from "react";
import "./App.css";
import Nav from "./Nav";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider, useCookies } from "react-cookie";

export const LandingContext = React.createContext();

export default function App() {

    const [userData, setUserData] = useState({
        code: "",
        name: "",
        email: "",
        zipCode: "",
        alias: "",
        gameUID: "",
        rounds: "10",
        roundDuration: "30",
        host: "",
        playerUID: "",
        roundNumber: "",
        imageURL: "",
        scoreboardInfo: [],
        deckSelected: "",
        deckTitle: "",
        isApi: false,
        googlePhotos: {
            albumId: "",
            accessToken: ""
        },
    })

    const [cookies, setCookie, removeCookie] = useCookies(['userData'])

    return (
        <div className="App">
            <CookiesProvider>
                <LandingContext.Provider value={{
                    
                    userData,
                    setUserData,

                    cookies,
                    setCookie,
                    removeCookie
                }}>
                    <Nav/>
                </LandingContext.Provider>
            </CookiesProvider>
            
            {/*  <ShareExample/>*/}
        </div>
    );
}
