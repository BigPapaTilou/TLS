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
"ESPN error",
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
...
events.map(
event =>
normalizeEvent(event,sport)
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


sport,


id:event.id,


team1:
away?.team.displayName || "",


team2:
home?.team.displayName || "",



score:

away?.score +
" - " +
home?.score,



status:
event.status.type.description,



state:
event.status.type.state,


date:
new Date(event.date),



raw:event


};



}







function filterGames(games){


const now =
new Date();


return games

.filter(game=>{


const diff =
(game.date-now)/3600000;



// live

if(game.state==="in"){

return true;

}


// final moins de 12h

if(
game.state==="post"
&&
Math.abs(diff)<12
){

return true;

}


// à venir 48h

if(
game.state==="pre"
&&
diff<48
&&
diff>-1
){

return true;

}


return false;


})


.sort((a,b)=>{


const order={

"in":0,

"post":1,

"pre":2

};


return (
order[a.state]
-
order[b.state]
);


});

}
