const ticker = document.getElementById("ticker-track");


/*
====================================
 TLS ALERT MEMORY
====================================
*/


let activeAlerts = [];
let previousScores = {};
let activeCardEvents = {};



/*
====================================
 ICONES SPORTS
====================================
*/


function getSportIcon(sport){


const icons = {


NFL:"🏈",

NCAA:"🏈",

NBA:"🏀",

MLB:"⚾",

PGA:"⛳",

EPL:"⚽",

LIGUE1:"⚽"


};


return icons[sport] || "🏆";


}









/*
====================================
 DATE UPCOMING
====================================
*/


function formatUpcoming(date){


return new Date(date)

.toLocaleString(
"fr-FR",
{

weekday:"short",

day:"2-digit",

month:"short",

hour:"2-digit",

minute:"2-digit"

}

);


}









/*
====================================
 STATUS
====================================
*/


function createStatus(game){



if(game.state==="in"){


return `

<span class="badge live">

🔴 LIVE

</span>

`;

}




if(game.state==="post"){


return `

<span class="badge final">

FINAL

</span>

`;

}




return `

<span class="badge upcoming">

${formatUpcoming(game.date)}

</span>

`;



}


/*
====================================
 BROADCAST SECTION
====================================
*/

function prioritizeAlerts(games){

return games.sort((a,b)=>{

if(a.alert && !b.alert){
return -1;
}

if(!a.alert && b.alert){
return 1;
}

return 0;

});

}



function createSection(title, games){

if(!games || games.length === 0){

return "";

}

const shouldAnimate = games.length >= 3;

let displayGames = [...games];

if(shouldAnimate){

while(displayGames.length < 8){

displayGames = [...displayGames, ...games];

}

}

let html = `

<div class="broadcast-section ${shouldAnimate ? "scroll-section" : "static-section"}">

`;





displayGames.forEach(game=>{

html += createCard(game);

});


html += `

</div>

`;


return html;

}






/*
====================================
 GAME CARD
====================================
*/


function createCard(game){

return `


<div class="game-card ${game.state} ${game.alert ? "event-active" : ""}">



<div class="card-header">


<span>

${getSportIcon(game.sport)}

${game.sport}

</span>


${createStatus(game)}


</div>






<div class="team-row">


<div class="team-name">

${
game.sport === "PGA"

?

""

:

`
<img
src="${game.logo1 || 'assets/fallback.svg'}"
onerror="this.src='assets/fallback.svg'"
>
`

}

${game.team1}

</div>



<div class="score">


${game.score1}


</div>


</div>







<div class="team-row">


<div class="team-name">

${
game.sport === "PGA"

?

""

:

`
<img
src="${game.logo2 || 'assets/fallback.svg'}"
onerror="this.src='assets/fallback.svg'"
>
`

}

${game.team2}

</div>



<div class="score">


${game.score2}


</div>


</div>





<div class="event-alert"></div>

<div class="detail">


${
typeof getLiveStatus === "function"

?

getLiveStatus(game)

:

(game.status || "")

}


</div>





</div>


`;



}









/*
====================================
 ALERT MANAGEMENT
====================================
*/


function addAlert(alert){



const id =

alert.type
+
alert.team;





if(
activeAlerts.includes(id)
){

return "";

}






activeAlerts.push(id);






if(
typeof activateBroadcastAlert === "function"
){

activateBroadcastAlert();

}






setTimeout(()=>{


activeAlerts =

activeAlerts.filter(

item=>item!==id

);


},5000);







return createAlertCard(alert);



}
/*
====================================
 BROADCAST SORT
====================================
*/


function sortBroadcast(events){



return events.sort((a,b)=>{



const priority = {


in:0,

post:1,

pre:2


};





return (

priority[a.state]

-

priority[b.state]

);



});


}









/*
====================================
 PGA LEADERBOARD CARD
====================================
*/


function createPGACard(pga){



if(
!pga
||
!Array.isArray(pga)
||
pga.length===0
){

return "";

}





let players = "";





pga
.slice(0,5)
.forEach((player,index)=>{



players += `



<div class="pga-player">



<span>

${index+1}

</span>



<strong>

${
player.athlete?.displayName
||
player.name
||
"Player"

}

</strong>



<span>

${
player.score
||
"-"

}

</span>



</div>



`;



});








return `



<div class="pga-card">



<div class="card-header">


<span>

⛳ PGA TOUR

</span>



<span class="badge live">

LEADERBOARD

</span>



</div>





${players}



</div>



`;



}









/*
====================================
 UPDATE TICKER
====================================
*/


async function updateTicker(){



try{



let games =

await fetchAllSports();


console.log("LIVE RAW DATA", games.find(game => game.state === "in"));
games.forEach(game => {

    if(game.state === "in"){

        const oldScore = previousScores[game.id];


        if(oldScore){

            if(
    oldScore.score1 !== game.score1 ||
    oldScore.score2 !== game.score2
){

    if(
        game.sport === "NFL"
    ){

        console.log(
    "NFL SCORE CHANGE",
    game.team1,
    oldScore,
    "→",
    game.score1,
    game.score2
);


console.log(
    "NFL RAW",
    game.raw
);

    }


    if(
    game.sport === "MLB"
){

    console.log(
        "MLB SCORE CHANGE",
        game.team1,
        oldScore,
        "→",
        game.score1,
        game.score2
    );


    const playText =
    game.raw
    ?.competitions?.[0]
    ?.situation
    ?.lastPlay
    ?.text
    ?.toLowerCase();


    console.log(
        "MLB LAST PLAY",
        playText
    );


    if(
        playText?.includes("home run") ||
        playText?.includes("homered")
    ){

        const alert = {

    type:"MLB_HR",

    text:"HOME RUN",

    gameId:game.id

};


activeAlerts.push(alert);


console.log(
    "ACTIVE ALERTS",
    activeAlerts
);

    }

}


        previousScores[game.id] = {
    score1: game.score1,
    score2: game.score2
};

    }

    }

}
});





let pga = null;

if (typeof fetchPGA === "function") {
  try {
    pga = await fetchPGA();

    console.log(
"PGA BROADCASTS",
pga[0]?.competitions?.[0]?.broadcasts
);

  } catch (err) {
    console.error("PGA ERROR", err);
  }
}







let content="";







/*
==============================
 DETECTION ALERTS
==============================
*/


let alerts=[];





games.forEach(game=>{


const alert =

detectEvent(game);




if(
alert
&&
typeof CONFIG !== "undefined"
&&
CONFIG.enableAlerts
){


alerts.push(alert);


}


});









/*
==============================
 TRI BROADCAST
==============================
*/


games =

sortBroadcast(games);









/*
==============================
 ALERT CARDS
==============================
*/


/*
alerts.forEach(alert=>{


content +=

addAlert(alert);


});
*/









/*
==============================
 PGA LEADERBOARD
==============================
*/


if(
pga
&&
typeof createPGACard === "function"
){

}









/*
==============================
 SPORTS SECTIONS
==============================
*/


const liveGames = games.filter(game =>
game.state === "in"
);

if(pga){
const pgaLeader =
pga[0]?.competitions?.[0]?.competitors?.find(player =>
    player.status?.position?.displayName === "1"
    ||
    player.status?.position?.displayName === "T1"
);
console.log("PGA POSITIONS",
pga[0]?.competitions?.[0]?.competitors?.map(player => ({
    name: player.athlete?.displayName,
    position: player.status?.position?.displayName
})));
const pgaRoundLive =
pga[0]?.competitions?.[0]?.status?.type?.state === "in";



 if(pgaRoundLive){

liveGames.push({

    sport:"PGA",
    state:"in",

    date:
    pga[0]?.date
    ?
    new Date(pga[0].date)
    :
    new Date(),

    team1:
    pga[0]?.eventName ||
    pga[0]?.name ||
    "PGA TOUR",

    team2:
    pgaLeader?.athlete?.displayName ||
    "Leader",

    score1:"",
    score2:
    pga[0]?.score ||
    "",

    logo1:"",
    logo2:"",

    raw:pga

});

}
}

const finalGames = games.filter(game =>
game.state === "post"
);


const upcomingGames = games.filter(game => {

const now = new Date();

const hours =
(game.date - now) / 3600000;


return (
(game.state === "pre" || game.state === "scheduled")
&&
hours > 0
&&
hours <= 48
);

});
 

content += createSection(null, prioritizeAlerts(liveGames));

content += createSection(null, finalGames);

content += createSection(null, upcomingGames);





if(content===""){


content = `


<div class="game-card pre">


<div class="card-header">

TLS SPORTS


</div>



<div class="detail">

Aucun événement

</div>



</div>


`;

}








/*
================================
 BOUCLE INFINIE
================================
*/

console.log("FINAL CONTENT CHECK", content);
 
ticker.innerHTML =
content;








if(
typeof CONFIG !== "undefined"
){

ticker.style.animationDuration =

CONFIG.tickerSpeed+"s";

}








console.log(

"TLS UPDATE",

games.length,

"matches",

pga ? "PGA OK" : "NO PGA"

);





}



catch(error){



console.error(

"TLS ERROR",

error

);





/*
Garde le ticker vivant
*/

if(ticker.innerHTML===""){


ticker.innerHTML = `


<div class="game-card pre">


<div class="card-header">

TLS SPORTS


</div>



<div class="detail">

Connexion aux données...

</div>



</div>



`;

}



}




}

function getLiveStatus(game){

    if(!game){
        return "";
    }


    switch(game.sport){

        case "MLB":
            return getMLBStatus(game);


        case "NFL":
        case "NCAA":
            return getNFLStatus(game);


        case "NBA":
            return getNBAStatus(game);


        case "EPL":
        case "LIGUE1":
            return getSoccerStatus(game);


        case "PGA":
            return getPGAStatus(game);


        default:
            return game.status || "";

    }

}





function getMLBStatus(game){

    const status = game.raw?.status;

    const situation =
        game.raw?.competitions?.[0]?.situation;


    if(!status){

        return game.status || "LIVE";

    }


    const inning = status.period || "";


    const inningLabel =
        inning
        ? `${inning}e manche`
        : "LIVE";


    const outs =
        situation?.outs !== undefined
        ? `${situation.outs} out${situation.outs > 1 ? "s" : ""}`
        : "";


    const display =
        status.displayValue ||
        status.type?.shortDetail ||
        "";


    let halfLabel = "";


    if(display.toLowerCase().includes("top")){

        halfLabel = "▲ Haut";

    }
    else if(display.toLowerCase().includes("bot")){

        halfLabel = "▼ Bas";

    }


    return `${halfLabel ? halfLabel + " " : ""}${inningLabel}${outs ? " • " + outs : ""}`;

}







function getNFLStatus(game){

    const status = game.raw?.status;

    if(!status){
        return game.status || "LIVE";
    }


    const quarter = status.period || "";

    const clock = status.displayClock || "";


    if(quarter && clock){

        return `${quarter}e QT • ${clock}`;

    }


    return game.status || "LIVE";

}







function getNBAStatus(game){

    const status = game.raw?.status;

    if(!status){
        return game.status || "LIVE";
    }


    const quarter = status.period || "";

    const clock = status.displayClock || "";


    if(quarter && clock){

        return `${quarter}e QT • ${clock}`;

    }


    return game.status || "LIVE";

}







function getSoccerStatus(game){

    const status = game.raw?.status;

    if(!status){
        return game.status || "LIVE";
    }


    const clock = status.displayClock || "";


    if(clock){

        return `${clock}'`;

    }


    return game.status || "LIVE";

}







function getPGAStatus(game){

    return "LEADERBOARD LIVE";

}



/*
====================================
 START
====================================
*/


updateTicker();






if(
typeof CONFIG !== "undefined"
){



setInterval(

updateTicker,

CONFIG.refreshRate

);



}
