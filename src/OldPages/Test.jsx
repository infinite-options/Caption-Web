    
    
    const params = {
        limit : "20"
    }

    const record = [];
    const image_url=[];

    const clevelandURL = "https://openaccess-api.clevelandart.org/api/artworks"
    const chicagoURL = "https://api.artic.edu/api/v1/artworks?fields=id,title,image_id"
    const giphyURL = "https://api.giphy.com/v1/gifs/trending?api_key=Fo9QcAQLMFI8V6pdWWHWl9qmW91ZBjoK&"
    const harvardURL= "https://api.harvardartmuseums.org/image?apikey=c10d3ea9-27b1-45b4-853a-3872440d9782";


    //Get photo from API (each API has own response format)
    async function getApiImage(url){
        await axios.get(url, {params}).then((res)=>{
            console.log("res", res)
            //Cleveland
            if(url === clevelandURL){
                for(const image of res.data.data){
                    console.log(image)
                    if(image.images !== null && image.images.web !== null)
                        record.push(image.images.web.url);
                }
                // console.log("Cleveland Records After pushing",record)
            }
            //Chicago
            else if(url === chicagoURL){
                for(const chicagoImage of res.data.data){
                    record.push(chicagoImage.image_id)
                }
                console.log("Chicago record", record)
                for(var i=0;i<record.length;i++){
                    image_url.push(res.data.config.iiif_url + "/" + record[i] + "/full/843,/0/default.jpg")
                }
            }
            //Giphy
            else if(url === giphyURL){
                console.log("Giphy Response",res.data.data);
                for(const giphyImage of res.data.data){
                    record.push(giphyImage.images.original.url);
                }
            }
            //Harvard
            else if(url === harvardURL){
                console.log("Harvard Response",res.data);
                console.log("Harvard",res.data.records)
                for(const harvardImage of res.data.records){
                    record.push(harvardImage.baseimageurl)
                }
            }
        })
    }


    async function selectThisDeck() {
        if(props.googlePhotos === true){
            console.log("Google Photos API selected. Switching to Google Sign-in Page.")

            setUserData({
                ...userData,
                deckSelected: "500-000005"
            })

            putCookies(
                ["deckSelected"], 
                {"deckSelected": "500-000005"}
            )
            return
        }
        else if(props.cleveland){
            console.log("Cleveland API Selected") 
            getData(clevelandURL).then(() => {
                setUserData({
                    ...userData,
                    deckSelected: "500-000006",
                    photosFromAPI: record
                })

                setUserData({
                    ...userData,
                    deckSelected: "500-000006"
                })
    
                putCookies(
                    ["deckSelected"], 
                    {"deckSelected": "500-000006"}
                )
            })
            
        }
        //Chicago
        else if(props.chicago){
            console.log("Chicago API Selected") 
            getData(chicagoURL).then(() => {
                setUserData({
                    ...userData,
                    deckSelected: "500-000007",
                    photosFromAPI: image_url
                })

                console.log("imageurl", image_url)
    
                putCookies(
                    ["deckSelected", "photosFromAPI"], 
                    {"deckSelected": "500-000007", "photosFromAPI": image_url}
                )
            })
            
        }
        //Giphy
        else if(props.giphy){
            console.log("Giphy API selected")
            getData(giphyURL).then(() => {
                setUserData({
                    ...userData,
                    deckSelected: "500-000008",
                    photosFromAPI: record
                })

                console.log('record', record)
    
                putCookies(
                    ["deckSelected", "photosFromAPI"], 
                    {"deckSelected": "500-000008", "photosFromAPI": record}
                )
            })
            
        }
        //Harvard
        else if(props.harvard){
            console.log("Harvard API selected")
            getData(harvardURL).then(() => {

                setUserData({
                    ...userData,
                    photosFromAPI: record,
                    deckSelected: "500-000009"
                })

                putCookies(
                    ["photosFromAPI", "deckSelected"], 
                    {"photosFromAPI": record, "deckSelected": "500-000009"}
                )
            })
            
        }
        // Decks from Database
        else {
            payload = {
                game_code: userData.code,
                deck_uid: props.id,
                round_number: userData.roundNumber.toString(),
            };

            setUserData({
                ...userData,
                deckSelected: props.id,
                deckTitle: props.title
            })

            putCookies(
                ["deckSelected"],
                {"deckSelected": props.id}
            )
        }

        await axios.post(selectDeckURL, payload).then(res => console.log(res))

        putCookies(
            ["deckTitle"],
            {"deckTitle": props.title}
        )
    }