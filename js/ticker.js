const ticker = document.getElementById("ticker-track");



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
 FORMAT DATE MATCH A VENIR
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
 BADGE STATUS
====================================
*/


function createStatus(game){



    if(game.state === "in"){


        return `

        <span class="badge live">

        🔴 LIVE

        </span>

        `;


    }




    if(game.state === "post"){


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
 CARTE MATCH
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
 UPDATE TICKER
====================================
*/


async function updateTicker(){



try{



const games =
await fetchAllSports();





if(!games.length){


ticker.innerHTML = `


<div class="game-card pre">


<div class="card-header">

TLS SPORTS

</div>



<div class="detail">

Aucun événement actuellement

</div>



</div>


`;


return;


}







let content = "";







games.forEach(game=>{





/*
Détection événement
*/

const alert =
detectEvent(game);





/*
Ajout Alert Card
*/

if(
alert
&&
CONFIG.enableAlerts
){


content +=
createAlertCard(alert);


}







/*
Ajout carte normale
*/


content +=
createCard(game);





});









/*
Duplication pour boucle infinie
*/


ticker.innerHTML =
content + content;







ticker.style.animationDuration =
CONFIG.tickerSpeed + "s";







console.log(

"TLS ticker",

games.length,

"événements"

);




}



catch(error){


console.error(

"Erreur TLS ticker",

error

);


}



}










/*
====================================
 INITIALISATION
====================================
*/


updateTicker();









/*
====================================
 REFRESH AUTOMATIQUE
====================================
*/


setInterval(

updateTicker,

CONFIG.refreshRate

);
