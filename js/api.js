console.log("API JS CHARGE");


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

if(!ESPN_ENDPOINTS[sport]){

return [];

}


const response = await fetch(
ESPN_ENDPOINTS[sport]
);


if(!response.ok){

console.error(
"ESPN HTTP ERROR",
sport,
response.status
);

return [];

}


const data = await response.json();


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


if(
typeof CONFIG==="undefined" ||
!CONFIG.sports
){

console.error(
"CONFIG SPORTS MISSING"
);

return [];

}



for(const sport of CONFIG.sports){


if(sport==="PGA"){

continue;

}


const events =
await fetchSport(sport);



games.push(

...events

.map(event=>

normalizeEvent(
event,
sport
)

)

.filter(Boolean)

);


}



console.log(
"ESPN RAW GAMES",
games.length
);



console.table(

games.map(game=>({

sport:game.sport,

state:game.state,

date:game.date,

hours:
(game.date.getTime()-new Date().getTime())/3600000,

team1:game.team1,

team2:game.team2

}))

);



const filtered =
filterGames(games);



console.log(
"FILTER RESULT",
filtered
);



return filtered;


}









async function fetchPGA(){

try{


const response = await fetch(

"https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard"

);



const data = await response.json();


return data.events || null;


}

catch(error){


console.error(
"ESPN PGA ERROR",
error
);


return null;


}

}









function normalizeEvent(event,sport){


const competition =
event.competitions?.[0];


if(!competition){

return null;

}



const competitors =
competition.competitors || [];



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
away?.team?.displayName || "TBD",


team2:
home?.team?.displayName || "TBD",


logo1:
away?.team?.logo || "",


logo2:
home?.team?.logo || "",


score1:
away?.score || "0",


score2:
home?.score || "0",


state:
event.status?.type?.state || "pre",


status:
event.status?.type?.shortDetail ||
event.status?.type?.description ||
"",


date:
new Date(event.date),


raw:event

};


}









function filterGames(games){


const now = new Date();



console.log("FILTER DEBUG START");



return games.filter(game=>{


if(
!game ||
!(game.date instanceof Date) ||
isNaN(game.date)
){

return false;

}



const hours =

(game.date.getTime()-now.getTime())
/3600000;



console.log(
game.sport,
"|",
game.state,
"|",
hours.toFixed(2),
"|",
game.team1,
"-",
game.team2
);





// LIVE toujours affiché

if(
game.state==="in"
){

return true;

}





// MATCHS A VENIR DANS LES 48H

if(
game.state==="pre" ||
game.state==="scheduled"
){

return (

hours >= 0 &&
hours <= 48

);

}





// MATCHS TERMINES RECENTS

if(
game.state==="post"
){

return (

hours >= -12 &&
hours <= 0

);

}





return false;



})



.sort((a,b)=>{


const priority={

in:0,

pre:1,

scheduled:1,

post:2

};



return (

(priority[a.state] ?? 3)

-

(priority[b.state] ?? 3)

);


});


}
