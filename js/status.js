/*
====================================
 TLS LIVE STATUS ENGINE
====================================

Transforme les données ESPN
en informations live style TV.

====================================
*/





/*
====================================
 STATUS PRINCIPAL
====================================
*/


function getLiveStatus(game){



if(!game){

return "";

}






switch(game.sport){



/*
=========================
 NFL / NCAA
=========================
*/


case "NFL":

case "NCAA":


return getFootballStatus(game);







/*
=========================
 NBA
=========================
*/


case "NBA":


return getNBAStatus(game);







/*
=========================
 MLB
=========================
*/


case "MLB":


return getMLBStatus(game);







/*
=========================
 SOCCER
=========================
*/


case "EPL":

case "LIGUE1":


return getSoccerStatus(game);







/*
=========================
 PGA
=========================
*/


case "PGA":


return getPGAStatus(game);





default:


return game.status || "";



}



}









/*
====================================
 FOOTBALL STATUS
====================================
*/


function getFootballStatus(game){



let quarter =

game.period
||
game.periodText
||
"";



let clock =

game.clock
||
"";





if(

quarter

&&

clock

){


return `${quarter} • ${clock}`;


}





return game.status || "LIVE";



}









/*
====================================
 NBA STATUS
====================================
*/


function getNBAStatus(game){



let quarter =

game.period
||
"";



let clock =

game.clock
||
"";





if(

quarter

&&

clock

){


return `${quarter} • ${clock}`;


}





return game.status || "LIVE";



}









/*
====================================
 MLB STATUS
====================================
*/


function getMLBStatus(game){



let inning =

game.inning
||
"";



let half =

game.half
||
"";






if(

half

&&

inning

){


return `${half} ${inning}`;


}





return game.status || "LIVE";



}









/*
====================================
 SOCCER STATUS
====================================
*/


function getSoccerStatus(game){



let minute =

game.minute
||
"";





if(minute){


return `${minute}'`;


}





return game.status || "LIVE";



}









/*
====================================
 PGA STATUS
====================================
*/


function getPGAStatus(game){



let round =

game.round
||
"";



let hole =

game.hole
||
"";





if(

round

&&

hole

){


return `Round ${round} • Hole ${hole}`;


}





return game.status || "";



}
