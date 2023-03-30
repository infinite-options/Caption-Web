import { useState, useEffect,useRef } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { ably, getDecks, getCnnImageURLS,sendError } from "../util/Api.js"
import "../styles/CnnDeck.css"

export default function CnnDeck(){
    const navigate = useNavigate(), location = useLocation()
    const [userData, setUserData] = useState(location.state)
    const [cookies, setCookie] = useCookies(["userData"])
    const [CNNImageURL, setCNNImageURL] = useState([])
    const [loadingImg, setloadingImg] = useState(0)
    // const channel = ably.channels.get(`BizBuz/${userData.gameCode}`)
    const isMessageDisplayed = useRef(false)
    //loadingImg code : 0  not called service,
                    // 1:pending for API respoence, 
                    // 2: takeing more than 30 seconds to for responce
                    // 3: taking more than 60 seconds to for responce or status in invalid
                    // 4: success 
    
    useEffect(() => {
        async function getCnnURLS(){
            const CNNImageURLResponse = await getCnnImageURLS()
            if (CNNImageURLResponse.length == 0) {
                setloadingImg(3)
                isMessageDisplayed.current = true
                let code1 = "CNN Deck is not loading"
                let code2 = "loading for the user" + userData.alias
                // console.log("vote:err")
                alert("The CNN deck may not be available right now.  Please select another deck.");
                sendError(code1, code2)
            } else {
                setloadingImg(4)
                console.log(CNNImageURLResponse)
                setCNNImageURL(CNNImageURLResponse)
            }
        }
        if (loadingImg == 0) {
            setloadingImg(1)
            getCnnURLS()
        }
            
        
        const interval = setInterval(() => {
            if (!isMessageDisplayed.current) {
                if (loadingImg == 1) {
                    alert("Loading of the CNN deck is taking longer than expected.  Please be patient.");
                    setloadingImg(2)
                } else {
                    setloadingImg(3)
                    isMessageDisplayed.current = true
                    let code1 = "CNN Deck is not loading"
                    let code2 = "loading for the user" + userData.alias
                    // console.log("vote:err")
                    alert("The CNN deck may not be available right now.  Please select another deck.");
                    sendError(code1, code2)
                }
            }
        }, 30000);
      
        return () => clearInterval(interval); 
    }, [loadingImg])

    async function handleClick(Link_Url) {
        const updatedUserData = {
            ...userData,
            CNN_URL: Link_Url,
        }
        setUserData(updatedUserData)
        setCookie("userData", updatedUserData, {path: '/'})
        navigate("/Waiting", {state: updatedUserData})
    }

    return(
        <div className="CNNDeck">
            <img src={userData.deckThumbnail_url} alt={userData.deckTitle} className="CNNdeck-image" />
            <h4 className="oneSelectDeck">Select a CNN Image URL</h4>
            <br/>
            <br />
            {loadingImg !=4 &&
                 <div>
                 <img src="/Loading_icon.gif" alt="loading CNN images"  width="250" />
                 <br/> <h6> Please be patient.  It takes some time to load the CNN deck. </h6>
                 </div>
                // <img  href="" />

            }
            <ul className="CNNdeck-container">
                {CNNImageURL.map((CNNImages, index) => {
                    if(CNNImages.article_link !== "PRIVATE"){
                        return(
                            <div key={index} onClick={event => handleClick(CNNImages.article_link)} className="CNNWeekdeck">
                                    <div className="CNNdeck-background">
                                    <img src={CNNImages.thumbnail_link} alt={CNNImages.date} className="deck-image"/>
                                <div className="CNNdeckText">
                                        {CNNImages.date} 
                                    </div>
                                </div>
                                <br/>
                            </div>
                        )
                    }
                })}
            </ul>
        </div>
    )
}