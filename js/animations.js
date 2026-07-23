/*
====================================
 TLS ALERT ENGINE v2
====================================

Analyse les événements sportifs
et génère les TLS Alert Cards.

====================================
*/


let previousGames = {};







/*
====================================
 DETECTION PRINCIPALE
====================================
*/


function detectEvent(game){



    const previous =
    previousGames[game.id];





    /*
    Première apparition
    On initialise seulement
    */


    if(!previous){


        previousGames[game.id]={


            score1:
            Number(game.score1),


            score2:
            Number(game.score2),


            lastPlay:
            getLastPlayId(game)


        };


        return null;


    }






    const alert =
    detectSportEvent(
        game,
        previous
    );







    /*
    Mise à jour mémoire
    */


    previousGames[game.id]={


        score1:
        Number(game.score1),


        score2:
        Number(game.score2),


        lastPlay:
        getLastPlayId(game)


    };





    return alert;



}










/*
====================================
 ANALYSE PAR SPORT
====================================
*/


function detectSportEvent(
game,
previous
){






/*
=========================
 NFL
=========================
*/


if(game.sport==="NFL"
||
game.sport==="NCAA"){


    const play =
    getNewPlay(
        game,
        previous
    );



    if(play){


        const text =
        play.text
        ||
        "";



        if(
            text.includes("Touchdown")
            ||
            text.includes("TOUCHDOWN")
        ){


            return {

                type:"TOUCHDOWN",

                icon:"🏈",

                team:
                extractTeam(
                    play,
                    game
                )

            };


        }





        if(
            text.includes("Field Goal")
            ||
            text.includes("FIELD GOAL")
        ){


            return {


                type:"FIELD GOAL",

                icon:"🦵",

                team:
                extractTeam(
                    play,
                    game
                )


            };


        }




    }



}









/*
=========================
 MLB
=========================
*/


if(game.sport==="MLB"){



    const changed =
    scoreChanged(
        game,
        previous
    );



    if(changed){


        return {


            type:"RUN SCORED",

            icon:"⚾",

            team:
            getScoringTeam(
                game,
                previous
            )


        };


    }


}









/*
=========================
 SOCCER
=========================
*/


if(
game.sport==="EPL"
||
game.sport==="LIGUE1"
){



const changed =
scoreChanged(
game,
previous
);



if(changed){



return {


type:"GOAL",

icon:"⚽",

team:
getScoringTeam(
game,
previous
)


};


}


}









/*
=========================
 NBA
=========================

Pas d'alertes
comme demandé

*/


if(game.sport==="NBA"){


return null;


}






return null;



}









/*
====================================
 OUTILS
====================================
*/



function scoreChanged(
game,
previous
){


return (

Number(game.score1)
>
previous.score1

||

Number(game.score2)
>
previous.score2

);


}









function getScoringTeam(
game,
previous
){


if(
Number(game.score1)
>
previous.score1
){


return game.team1;


}



if(
Number(game.score2)
>
previous.score2
){


return game.team2;


}



return "";

}









function getLastPlayId(game){


if(!game.plays.length){

return null;

}


return game.plays[
game.plays.length-1
]
.id;


}









function getNewPlay(
game,
previous
){


if(!game.plays.length){

return null;

}



const last =
game.plays[
game.plays.length-1
];



if(
last.id
===
previous.lastPlay
){

return null;

}



return last;



}








function extractTeam(
play,
game
){



if(play.team){

return play.team.displayName;

}



return getScoringTeam(
game,
previousGames[game.id]
);



}









/*
====================================
 CREATION ALERT CARD
====================================
*/


function createAlertCard(alert){



return `



<div class="alert-card">


<div class="alert-title">


${alert.icon}

${alert.type}


</div>



<div class="alert-team">


${alert.team}


</div>



<div class="alert-brand">


TLS ALERT


</div>



</div>



`;


}
