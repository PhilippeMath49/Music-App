let token = {}
let track;
let Artiste;
let track_inpt = document.querySelector("#title-input")
let arts_inpt = document.querySelector("#artist-input")
let data;
let len;

//request
async function ArtistRequest() {
    let artiste = arts_inpt.value
    let TokenRequest = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&client_id=1af8984bd992458e94869d5454ce3824&client_secret=9c96a98f643d4130920114040f9b7731"

    })
    let reponse = await TokenRequest.json()
    token.access_token = await reponse["access_token"]
    token.type_token = await reponse["token_type"]
    await fetch(`https://api.spotify.com/v1/search?q=${artiste}&type=artist&limit=5`, {
        method: "GET",
        headers: {
            "Authorization": `${token.type_token} ${token.access_token}`
        }
    })
        .then(reponse => {
            return reponse.json()
        })
        .then(Data => {
            data = Data
            console.log(data.artists.items)
        })

    DisplayArtistList()
}

async function TrackRequest() {
    let TokenRequest = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&client_id=1af8984bd992458e94869d5454ce3824&client_secret=9c96a98f643d4130920114040f9b7731"

    })
    let reponse = await TokenRequest.json()
    token.access_token = await reponse["access_token"]
    token.type_token = await reponse["token_type"]

    track = track_inpt.value.replace(" ", `%20`)

    console.log(track)
    if (track !== "") {
        await fetch(`https://api.spotify.com/v1/search?q=${track}&type=track&limit=50`, {
            method: "GET",
            headers: {
                "Authorization": `${token.type_token} ${token.access_token}`
            }
        })
            .then(reponse => {
                return reponse.json()
            })
            .then(Data => {
                data = Data
                console.log(data.tracks.items)
                DisplayPagination();
            })
    }


}


//pagination
let nbr_elem = 10;
let index = 0;

async function DisplayPagination() {
    console.log(data)
    len = data.tracks.items.length
    let tablelist = '';
    for (let i = index; i < nbr_elem + index; i++) {
        tablelist += `
        <tr>
            <td>
                <img src="${data.tracks.items[i].album.images["2"].url} height='${data.tracks.items[i].album.images["2"].url.height}'width='${data.tracks.items[i].album.images["2"].url.width}' ">
                ${data.tracks.items[i].name}
                ${data.tracks.items[i].album.artists["0"].name}
            </td>
        </tr>
        `

    }
    document.querySelector(".track-list").innerHTML = tablelist;
}

function NextPage() {
    console.log(len)

    if (index < len - nbr_elem) {
        index += 10;
        document.querySelector(".track-list").innerHTML = "";
    }
    console.log(index)
    document.querySelector(".track-list").innerHTML = "";
    DisplayPagination();
}

function PreviousPage() {
    console.log(len)

    if (index > 0) {
        index -= 10;
        document.querySelector(".track-list").innerHTML = "";
    }
    console.log(index)
    document.querySelector(".track-list").innerHTML = "";
    DisplayPagination();
}

//Liste artsite
async function DisplayArtistList() {
    len = data.artists.items.length
    console.log(len)
    let artlist = ''
    for (let i = 0; i < len; i++) {
        let nbr = (Number(`${data.artists.items[i].images.length}`) - 1)
        if (nbr > 0) {
            artlist += `
        <li>
        <button>
            <img src="${data.artists.items[i].images[`${nbr}`].url}"> 
            ${data.artists.items[i].name}
        </li>
        </button>
        `
        }
    }
    document.querySelector(".list-artist").innerHTML = artlist
}


//event listener
document.querySelector(".next_page").addEventListener("click", NextPage)
document.querySelector(".prev-page").addEventListener("click", PreviousPage)
track_inpt.addEventListener("input", TrackRequest)
arts_inpt.addEventListener("input", ArtistRequest)