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



    return (
    <div className="App">
        <LandingContext.Provider value = {{code, name, email, zipCode, setCode, setName, setEmail, setZipCode}}>
            <Nav />
        </LandingContext.Provider>
      {/*  <ShareExample/>*/}
    </div>
  );
}
