
function refreshTable() {
    const gameID = $("#scores-game-type").val();
    const tbody = $("#scoretable > tbody");
    tbody.empty();

    getScores(gameID).then(scores=>{
        //rename label
        let label;
        switch (gameID) {
            case "cryptograms":
                label = "Puzzles Completed";
                break;
            case "morse_reception":
                label = "Highest Level Passed";
                break;
            default:
                label = "Scores";
        }
        $("#score-label").html(label);

        //generate table
        scores.forEach(row=>{
          tbody.append(`
              <tr data-user-id='${row.userID}'>
              <th scope="row">${row.rank}</th>
              <td>${row.score}</td>
              <td>${row.patrol}</td>
              <td>${row.player}</td>
              </tr>
            `);
        });

        //highlight current user
        loginProcess.then(() => {
            if (user) {
                $(`#scoretable tbody tr[data-user-id='${user._id}']`).addClass("table-success");
            }
        })
    });
}


$(function() {
    refreshTable();
    $("#scores-game-type").on("change", refreshTable);
});
