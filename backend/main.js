let token = {}

async function ClaimToken() {
    await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&client_id=1af8984bd992458e94869d5454ce3824&client_secret=9c96a98f643d4130920114040f9b7731"

    }).then(reponse => {
        return reponse.json()
    })
        .then(data => {
            token.access_token = data["access_token"]
            token.type_token = data["token_type"]
        })
        .catch(error => console.log("erreur =" + error));
    console.log(token)
    SearchRequest();
}

ClaimToken();


async function SearchRequest() {
    await fetch("https://api.spotify.com/v1/search?q=queen&type=artist&limit=4", {
        method: "GET",
        headers: {
            "Authorization": `${token.type_token} ${token.access_token}`
        }
    })
        .then(reponse => {
            return reponse.json()
        })
        .then(data => {
            console.log(data["artists"])
        })

}