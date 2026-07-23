/*
====================================
 TLS ALERT ENGINE
====================================

Détecte les changements de score
et prépare les Alert Cards.

====================================
*/


let previousGames = {};





/*
====================================
 DETECTION EVENEMENT
====================================
*/


function detectEvent(game){



    const previous =
    previousGames[game.id];




    /*
    Première apparition du match :
    on mémorise seulement
    */


    if(!previous){


        previousGames[game.id] = {

            score1:
            Number(game.score1),

            score2:
            Number(game.score2)

        };


        return null;


    }





    const oldScore1 =
    previous.score1;


    const oldScore2 =
    previous.score2;



    const newScore1 =
    Number(game.score1);


    const newScore2 =
    Number(game.score2);





    /*
    Mise à jour mémoire
    */


    previousGames[game.id] = {


        score1:newScore1,


        score2:newScore2


    };






    /*
    Aucun changement
    */


    if(
        oldScore1 === newScore1
        &&
        oldScore2 === newScore2
    ){


        return null;


    }





    /*
    =========================
    NFL
    =========================
    */


    if(game.sport === "NFL"){


        return {


            type:"TOUCHDOWN",


            icon:"🏈",


            team:
            getScoringTeam(
                game,
                oldScore1,
                oldScore2
            )


        };


    }





    /*
    =========================
    MLB
    =========================
    */


    if(game.sport === "MLB"){


        return {


            type:"HOME RUN",


            icon:"⚾",


            team:
            getScoringTeam(
                game,
                oldScore1,
                oldScore2
            )


        };


    }





    /*
    =========================
    FOOTBALL
    =========================
    */


    if(
        game.sport === "EPL"
        ||
        game.sport === "LIGUE1"
    ){


        return {


            type:"GOAL",


            icon:"⚽",


            team:
            getScoringTeam(
                game,
                oldScore1,
                oldScore2
            )


        };


    }





    /*
    NBA volontairement ignoré
    */


    if(game.sport === "NBA"){


        return null;


    }






    return null;



}









/*
====================================
 DETERMINE L'EQUIPE QUI A MARQUE
====================================
*/


function getScoringTeam(
    game,
    oldScore1,
    oldScore2
){



    if(
        Number(game.score1)
        >
        oldScore1
    ){


        return game.team1;


    }





    if(
        Number(game.score2)
        >
        oldScore2
    ){


        return game.team2;


    }



    return "";



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
