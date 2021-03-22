const tileCount = 20;

$(function(){
    warnUserLogin();

    $("#card-area").on("click", ".card-puzzle" , function(){
        const puzzleId = $(this).attr("data-puzzleid");
        window.location.href = `/cryptogram?puzzle=${puzzleId}`;
    });

    //generate puzzle tiles
    for (let i = 1; i <= tileCount; i++) {
        const tile = $("#card-puzzle-template").children().clone();

        tile.attr("data-puzzleid", i).find(".puzzle-number").html(i);
        $("#card-area").append(tile);
    };

    //check for user progress
    loginProcess.then(() => {
        if (user) {
            getGameData(user._id, "cryptograms").done(gameData => {
                let completed = [];

                if (gameData) {
                    completed = gameData.completed;
                }

                completed.forEach(puzzleIndex => {
                    //show checked icon
                    $(`#card-area > .card-puzzle[data-puzzleid='${puzzleIndex}']`).find(".icon").show();
                });

                //progress bar
                $("#cryptograms-progress").show();

                $("#cryptograms-progress .card-title").html(`Progress - ${completed.length}/${tileCount}`);

                const percentage = Math.ceil(completed.length * 100 / tileCount);
                $("#cryptograms-progress .progress-bar").css({
                    width: `${percentage}%`
                }).attr("aria-valuenow", percentage).html(`${percentage}%`);
            });
        }
    });
});
