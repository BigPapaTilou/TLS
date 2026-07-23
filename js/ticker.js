const ticker = document.getElementById("ticker-track");



/*
=================================
 CREATION DES CARTES
=================================
*/


function createCard(game){


    let statusClass = game.state;


    let statusText = "";


    if(game.state === "in"){

        statusText = "🔴 LIVE";

    }


    else if(game.state === "post"){

        statusText = "FINAL";

    }


    else {

        statusText =
        formatUpcoming(game.date);

    }





    return `


    <div class="game-card ${statusClass}">


        <div class="game-info">


            <div class="team sport">

                ${getSportIcon(game.sport)}
                ${game.sport}

            </div>



            <div class="team">

                ${game.team1}

            </div>



            <div class="team">

                ${game.team2}

            </div>


        </div>



        <div class="score">

            ${game.score || "-"}

        </div>



        <div class="status">

            ${statusText}

        </div>


    </div>


    `;


}





/*
=================================
 ICONES SPORTS
=================================
*/


function getSportIcon(sport){


const icons={

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
=================================
 FORMAT DATE UPCOMING
=================================
*/


function formatUpcoming(date){


return new Date(date)
.toLocaleString(
"fr-FR",
{

day:"2-digit",

month:"2-digit",

hour:"2-digit",

minute:"2-digit"

}

);


}






/*
=================================
 UPDATE DU TICKER
=================================
*/


async function updateTicker(){


try{


const games =
await fetchAllSports();





if(!games.length){


ticker.innerHTML = `


<div class="game-card upcoming">


<div class="team">

TLS Sports

</div>


<div class="status">

Aucun événement en direct

</div>


</div>


`;


return;


}





let html="";





games.forEach(game=>{


html +=
createCard(game);


});






/*

Duplication obligatoire
pour défilement infini

*/


ticker.innerHTML =
html + html;





ticker.style.animationDuration =
CONFIG.tickerSpeed + "s";



console.log(
"Ticker updated",
games.length,
"events"
);



}

catch(error){


console.error(

"Ticker update error",

error

);


}


}








/*
=================================
 DEMARRAGE
=================================
*/


updateTicker();





/*
=================================
 AUTO REFRESH ESPN
=================================
*/


setInterval(

updateTicker,

CONFIG.refreshRate

);
