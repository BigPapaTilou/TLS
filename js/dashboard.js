/*
==============================
 TLS SPORTS DASHBOARD
==============================
*/

async function loadEPLTable(){


    const epl = await fetchEPLStandings();


    const container =
    document.getElementById(
        "epl-table-list"
    );


    if(!container){

        return;

    }

 
    container.innerHTML = "";


    const teams =
    epl.children[0]
    .standings
    .entries
    .slice(0,5);



    teams.forEach(
(team,index)=>{


    const points =
    team.stats.find(
        stat => stat.name === "points"
    )?.value;


    container.innerHTML +=

`
<div class="epl-team-row">

    <img 
    src="${team.team.logos[0].href}"
    class="team-logo"
    >

    <span>
    ${team.team.name}
    </span>

    <strong>
    ${points}
    </strong>

</div>
`;


}
);


}
async function loadLigue1Table(){

    const ligue1 = await fetchLigue1Standings();

    console.log(
        "LIGUE 1 DASHBOARD TEST",
        ligue1
    );

}

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




    const mlbBattingPlayers = [

        "Aaron Judge",
        "Shohei Ohtani",
        "Juan Soto",
        "Mookie Betts",
        "Ronald Acuña Jr."

    ];




    const mlbContainer =
    document.getElementById(
        "mlb-batting-list"
    );



        if(mlbContainer){


        mlbContainer.innerHTML = "";



        mlbBattingPlayers.forEach(
            (player,index)=>{


                mlbContainer.innerHTML +=

                `
                <div>
                ${index+1}. ${player}
                </div>
                `;


            }

        );


    }


}


updateDashboard();
loadEPLTable();
loadLigue1Table();
