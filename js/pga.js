/*
====================================
 TLS PGA MODULE
====================================

Gestion du leaderboard PGA

====================================
*/



const PGA_ENDPOINT =

"https://site.api.espn.com/apis/site/v2/sports/golf/pga/leaderboard";







async function fetchPGA(){


try{


const response =

await fetch(
PGA_ENDPOINT
);



const data =

await response.json();




return normalizePGA(data);



}

catch(error){


console.error(
"PGA ERROR",
error
);


return null;


}



}









function normalizePGA(data){



if(
!data
||
!data.events
||
!data.events.length
){

return null;

}



const event =
data.events[0];





const competitors =

event.competitions[0]
.competitors;






return {


name:

event.name,



status:

event.status?.type?.description
||
"",




leaders:

competitors

.slice(0,5)

.map(player=>{


return {


position:

player.position,



name:

player.athlete.displayName,



score:

player.score || "-",



country:

player.athlete.flag?.href || ""


};


})



};


}









function createPGACard(pga){



if(!pga){

return "";

}





let players="";




pga.leaders.forEach(player=>{


players += `


<div class="pga-player">


<span>

${player.position}

</span>


${player.name}


<strong>

${player.score}

</strong>


</div>


`;



});







return `



<div class="game-card pga-card">


<div class="card-header">


⛳ PGA TOUR


<span class="badge upcoming">

LEADERBOARD

</span>


</div>



<div class="detail">


${pga.status}

</div>



${players}



</div>


`;



}
