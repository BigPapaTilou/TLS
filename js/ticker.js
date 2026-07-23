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


${game.status || ""}


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






setTimeout(()=>{


activeAlerts =

activeAlerts.filter(

item => item !== id

);


},5000);







return createAlertCard(alert);



}









/*
====================================
 UPDATE TICKER
====================================
*/


async function updateTicker(){



try{



const games =
await fetchAllSports();





if(!games.length){


ticker.innerHTML=`

<div class="game-card pre">


<div class="card-header">

TLS SPORTS

</div>


<div class="detail">

Aucun événement

</div>


</div>

`;

return;


}







let content="";






games.forEach(game=>{





const alert =
detectEvent(game);







if(
alert
&&
CONFIG.enableAlerts
){


content +=

addAlert(alert);


}







content +=

createCard(game);





});









/*
Boucle infinie
*/


ticker.innerHTML =

content + content;







ticker.style.animationDuration =

CONFIG.tickerSpeed + "s";





console.log(

"TLS UPDATE",

games.length,

"events"

);




}



catch(error){



console.error(

"TLS ERROR",

error

);



}




}









/*
====================================
 START
====================================
*/


updateTicker();







setInterval(

updateTicker,

CONFIG.refreshRate

);
