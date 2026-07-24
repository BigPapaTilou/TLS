/*
==============================
 TLS SPORTS DASHBOARD
==============================
*/


function updateDashboard(){


    console.log("Dashboard update");



    const nflFantasyPlayers = [

        "Josh Allen",
        "Saquon Barkley",
        "Ja'Marr Chase",
        "Lamar Jackson",
        "Christian McCaffrey"

    ];




    const container = 
    document.getElementById(
        "nfl-fantasy-list"
    );



    if(!container){

        return;

    }




    container.innerHTML = "";



    nflFantasyPlayers.forEach(
        (player,index)=>{


            container.innerHTML +=

            `
            <div>
            ${index+1}. ${player}
            </div>
            `;


        }

    );


}
