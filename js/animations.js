let previousGames = {};



function detectEvent(game){


    const oldGame =
    previousGames[game.id];



    previousGames[game.id] = {

        score1:game.score1,

        score2:game.score2

    };



    if(!oldGame){

        return null;

    }





    if(
        oldGame.score1 === game.score1 &&
        oldGame.score2 === game.score2
    ){

        return null;

    }





    /*
    =========================
    NFL
    =========================
    */


    if(game.sport==="NFL"){

        return {

            type:"TOUCHDOWN",

            icon:"🏈",

            team:
            getScoringTeam(oldGame,game)

        };


    }





    /*
    =========================
    MLB
    =========================
    */


    if(game.sport==="MLB"){


        return {

            type:"HOME RUN",

            icon:"⚾",

            team:
            getScoringTeam(oldGame,game)

        };


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


        return {


            type:"GOAL",

            icon:"⚽",

            team:
            getScoringTeam(oldGame,game)


        };


    }





    return null;


}







function getScoringTeam(oldGame,newGame){


    if(
        Number(newGame.score1)
        >
        Number(oldGame.score1)
    ){

        return newGame.team1;

    }



    if(
        Number(newGame.score2)
        >
        Number(oldGame.score2)
    ){

        return newGame.team2;

    }


    return "";

}








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



<div class="alert-tls">

TLS ALERT

</div>



</div>


`;

}
