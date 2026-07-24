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


const today = new Date();

const date =
today.getFullYear()
+
String(today.getMonth()+1).padStart(2,"0")
+
String(today.getDate()).padStart(2,"0");


const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 2);

const startDate = yesterday.toISOString().split("T")[0];
const endDate = tomorrow.toISOString().split("T")[0];

const response = await fetch(
`${ESPN_ENDPOINTS[sport]}?dates=${startDate.replaceAll("-","")}-${endDate.replaceAll("-","")}`
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




const filtered =
filterGames(games);




return filtered;


}









async function fetchPGA(){

try{


const response = await fetch(

"https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard"

);



const data = await response.json();

console.log("PGA PLAYER", data.events[0].competitions[0].competitors[0]);    

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

async function fetchEPLStandings(){

try{


const response = await fetch(

"https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings"

);


if(!response.ok){

console.error(
"EPL STANDINGS ERROR",
response.status
);

return [];

}



const data = await response.json();


console.log(
"EPL STANDINGS KEYS",
Object.keys(data)
);

console.log("EPL STATUS", response.status);
console.log("EPL HEADERS", response.headers);
console.log("EPL DATA TYPE", typeof data);
console.log("EPL RAW DATA", data);
console.log(
"EPL TABLE",
data.children[0].standings
);

return data;


}

catch(error){


console.error(
"EPL STANDINGS ERROR",
error
);


return [];


}

}

async function fetchLigue1Standings(){

try{

const response = await fetch(

"https://site.api.espn.com/apis/v2/sports/soccer/fra.1/standings"

);


const data = await response.json();


console.log(
"LIGUE 1 RAW DATA",
data
);


return data;


}

catch(error){

console.error(
"LIGUE 1 ERROR",
error
);

return null;

}

}

async function testMLB(){ 

const response = await fetch(
"https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard"
);

const data = await response.json();

console.log(
"MLB RAW DATA",
data
);

}
async function fetchMLBBatting(){

try{

const response = await fetch(

"https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/statistics"

);


const data = await response.json();


const avgLeaders =
data.stats.categories
.find(
category => category.name === "avg"
)
.leaders;


console.log(
"PLAYER STATS DETAIL",
avgLeaders[36].statistics.splits.categories
);



return data;


}

catch(error){

console.error(
"MLB BATTING ERROR",
error
);

return null;

}

}
fetchMLBBatting();
console.log("fetchEPLStandings CHARGÉ");




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



games.forEach(game=>{


const hours =
(game.date.getTime() - now.getTime())
/3600000;





});





const filtered = games.filter(game=>{


if(
!game ||
!(game.date instanceof Date) ||
isNaN(game.date)
){

return false;

}



const hours =
(game.date.getTime() - now.getTime())
/3600000;



// 🔴 LIVE
if(
game.state === "in"
){

return true;

}



// 🏁 MATCHS TERMINÉS
if(
game.state === "post" ||
game.status?.toLowerCase().includes("final")
){
    return true;
}



// 📅 MATCHS À VENIR DANS LES 48H
// Peu importe la catégorie ESPN
if(
hours >= -12 &&
hours <= 48
){

return true;

}



return false;


});





return filtered.sort((a,b)=>{


const priority = {


in:0,


post:1,


pre:2,


scheduled:2


};



const stateDiff =
(priority[a.state] ?? 99)
-
(priority[b.state] ?? 99);



if(stateDiff !== 0){

return stateDiff;

}



return a.date - b.date;



});


}
