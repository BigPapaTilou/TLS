const ticker = document.getElementById("ticker-track");


const games=[

{
sport:"🏈 NFL",
team1:"Chiefs",
team2:"Bills",
score:"24 - 21",
status:"LIVE Q4 03:12",
type:"live"
},


{
sport:"⚾ MLB",
team1:"Yankees",
team2:"Dodgers",
score:"5 - 3",
status:"BOT 8",
type:"live"
},


{
sport:"⚽ Premier League",
team1:"Liverpool",
team2:"Arsenal",
score:"2 - 1",
status:"FINAL",
type:"final"
},


{
sport:"🏀 NBA",
team1:"Lakers",
team2:"Warriors",
score:"",
status:"Tomorrow 21:30",
type:"upcoming"
}


];



function createCard(game){


return `

<div class="game-card ${game.type}">


<div>

<div class="team">
${game.sport}
</div>


<div class="team">
${game.team1}
vs
${game.team2}
</div>

</div>


<div class="score">

${game.score}

</div>


<div class="status">

${game.status}

</div>


</div>

`;

}



function renderTicker(){


let html="";


games.forEach(game=>{

html+=createCard(game);

});


/*
duplication pour boucle infinie
*/

ticker.innerHTML=html+html;



ticker.style.animationDuration =
CONFIG.tickerSpeed+"s";


}



renderTicker();
