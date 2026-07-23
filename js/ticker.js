const ticker = document.getElementById("ticker-track");


/*
====================================
 TLS ALERT MEMORY
====================================
*/


let activeAlerts = [];







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

function createSection(title, games){

if(!games || games.length === 0){

return "";

}


let html = `

<div class="broadcast-section">

<div class="section-title">

${title}

</div>

`;


games.forEach(game=>{

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


<div class="game-card ${game.state}">



<div class="card-header">


<span>

${getSportIcon(game.sport)}

${game.sport}

</span>


${createStatus(game)}


</div>






<div class="team-row">


<div class="team-name">


<img

src="${game.logo1 || 'assets/fallback.svg'}"

onerror="this.src='assets/fallback.svg'"

>


${game.team1}


</div>



<div class="score">


${game.score1}


</div>


</div>







<div class="team-row">


<div class="team-name">


<img

src="${game.logo2 || 'assets/fallback.svg'}"

onerror="this.src='assets/fallback.svg'"

>


${game.team2}


</div>



<div class="score">


${game.score2}


</div>


</div>







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


console.log(
"ALL GAMES BEFORE SPLIT",
games
);






let pga = null;





if(
typeof fetchPGA === "function"
){

pga = await fetchPGA();

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


alerts.forEach(alert=>{


content +=

addAlert(alert);


});









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


content +=

createPGACard(pga);


}









/*
==============================
 SPORTS SECTIONS
==============================
*/


const liveGames = games.filter(game =>
game.state === "in"
);


const finalGames = games.filter(game =>
game.state === "post"
);


const upcomingGames = games.filter(game => {

const now = new Date();

const hours =
(game.date - now) / 3600000;


return hours > 0 && hours <= 48;

});

console.log(
"UPCOMING DEBUG",
upcomingGames
);

 

content += createSection(
"🔴 LIVE",
liveGames
);



content += createSection(
"🏁 FINAL",
finalGames
);



content += createSection(
"📅 À VENIR",
upcomingGames
);









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


ticker.innerHTML =

content + content;








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
