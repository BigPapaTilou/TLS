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


    const teams =
    ligue1.children[0]
    .standings
    .entries
    .slice(0,5);


    console.log(
        "LIGUE 1 TEAMS",
        teams
    );


    const container =
    document.getElementById(
        "ligue1-table-list"
    );


    if(!container){

        return;

    }


    container.innerHTML = "";


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


    });


}

async function updateDashboard(){
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




    const mlbContainer =
document.getElementById(
    "mlb-batting-list"
);


if(mlbContainer){


    const mlbBattingPlayers =
    await getMLBAvgLeaders();


    mlbContainer.innerHTML = "";


    mlbBattingPlayers
    .slice(0,5)
    .forEach((player,index)=>{


        mlbContainer.innerHTML +=

        `
        <div>
            ${index+1}. ${player.name}
            <span>${player.avg}</span>
        </div>
        `;


    });


}


}


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


    const teams =
    ligue1.children[0]
    .standings
    .entries
    .slice(0,5);


    console.log(
        "LIGUE 1 TEAMS",
        teams
    );


    const container =
    document.getElementById(
        "ligue1-table-list"
    );


    if(!container){

        return;

    }


    container.innerHTML = "";


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


    });


}

async function updateDashboard(){
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




    const mlbContainer =
document.getElementById(
    "mlb-batting-list"
);


if(mlbContainer){


    const mlbBattingPlayers =
    await getMLBAvgLeaders();


    mlbContainer.innerHTML = "";


    mlbBattingPlayers
.slice(0,5)
.forEach((player,index)=>{

    const logo = `https://www.mlbstatic.com/team-logos/${player.teamId}.svg`;

    mlbContainer.innerHTML +=

    `
    <div class="mlb-player-row">
        <img src="${logo}" class="team-logo">
        <span>${index+1}. ${player.name}</span>
        <span>${player.avg}</span>
    </div>
    `;

});


}


}


async function initDashboard(){

    await updateDashboard();

    await loadEPLTable();

    await loadLigue1Table();

}


initDashboard();

