import { Button } from "../Components/Button.jsx";
import background from "../Assets/landing.png";
import rectangle from '../Assets/rectangle.png';
import "../Styles/Error.css";

function Error() {
    return (
        // Background image
        <div class="backgroundimg"
        style={{
          maxWidth: "375px",
          height: "812px",
          backgroundImage: `url(${background})`,
        }}
      >
            <div
              className="testBlur"
              style={{
                backgroundImage: `url(${background})`,
              }}
            ></div>
        <div>
            <img src={rectangle} alt="" class="rectangle"/>
            <div class="message">
                <b>
                <h4>ERROR!!</h4>
                <br></br>
                <p> The room code you entered does not exist. Please check the game code and re-enter.
                </p> 
                </b>
            </div>
        </div>

        <Button className="landing2" destination="/">
            Back
        </Button>
      </div>
    )
}

export default Error