const ESPN_ENDPOINTS = {

NFL:
"https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",

NCAA:
"https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard",

NBA:
"https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",

MLB:
"https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",

EPL:
"https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",

LIGUE1:
"https://site.api.espn.com/apis/site/v2/sports/soccer/fra.1/scoreboard"

};







async function fetchSport(sport){


try{


const response =
await fetch(
ESPN_ENDPOINTS[sport]
);


const data =
await response.json();


return data.events || [];


}

catch(error){


console.error(
"ESPN ERROR",
sport,
error
);


return [];

}


}









async function fetchAllSports(){


let games=[];



for(const sport of CONFIG.sports){


const events =
await fetchSport(sport);



games.push(

...events.map(

event=>

normalizeEvent(
event,
sport
)

)

);



}



return filterGames(games);


}









function normalizeEvent(event,sport){



const competition =
event.competitions[0];



const competitors =
competition.competitors;



const home =
competitors.find(
c=>c.homeAway==="home"
);



const away =
competitors.find(
c=>c.homeAway==="away"
);






return {


id:event.id,


sport,



team1:
away?.team?.displayName
||
"TBD",



team2:
home?.team?.displayName
||
"TBD",




logo1:
away?.team?.logo
||
"",



logo2:
home?.team?.logo
||
"",





score1:
away?.score
||
"0",



score2:
home?.score
||
"0",




state:
event.status.type.state,



status:
event.status.type.shortDetail
||
event.status.type.description,



date:
new Date(event.date),




/*
Nouveaux éléments ESPN
*/


plays:
event.competitions[0].plays
||
[],



raw:event



};


}









function filterGames(games){



const now =
new Date();





return games

.filter(game=>{


const hours =
(game.date-now)/3600000;




if(game.state==="in"){

return true;

}




if(
game.state==="post"
&&
Math.abs(hours)<=12
){

return true;

}




if(
game.state==="pre"
&&
hours<=48
&&
hours>=-1
){

return true;

}



return false;



})



.sort((a,b)=>{


const priority={


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
