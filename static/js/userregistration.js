//constants
const passwordMin = 8;
const passwordMax = 72;
const passwordSymbols = "!@#$%^&#x26;*-_+=";

//form functions
function initializeForm() {
    //user type
    const buttons = $("#usertype button");
    buttons.removeClass().addClass("btn");
    $("#explorer").addClass("btn-outline-success");
    $("#leader").addClass("btn-outline-secondary");
    $("#generaluser").addClass("btn-outline-primary");
    $("#registration-form").removeData();

    //hide sections
    $(".section").hide();

    //
    $("#troop").val(-1);
}

function showTroopAlert() {
    generateAlert($("#troopalert"), "alert-info", `To add your troop, first register as a <strong>Troop Leader</strong> (set troop as <strong>"Unlisted"</strong>). Once logged in, you may access the <strong>Troop Registration </strong> form.`);
}

function showPatrolAlert() {
    generateAlert($("#patrolalert"), "alert-info", `Ask your <strong>troop leader</strong> to add your patrol.`);
}

function initializePasswordRequirements() {
    $(".password-minimum").html(passwordMin);
    $(".password-maximum").html(passwordMax);
    $("#password-symbols").html(passwordSymbols);
    $(".req-blank").show();
    $(".req-check").hide();
}

function loadTroopData() {
    const select = $("#troop");

    return $.ajax({
        method: "get",
        url: "/api/troops",
        contentType: "application/json",
        data: {},
        beforeSend: function(){
            //initialize dropdown
            select.empty().append(`
                <option value="-1" disabled selected>Loading...</option>
            `);
        }
    }).done(function(data){
        //populate dropdown
        select.empty().append(`
            <option value="-1" disabled selected>Choose</option>
        `);
        
        data.forEach(function(troop){
            select.append(`
                <option value="${troop.name}">${troop.name}</option>
            `);
        })

        select.append(`
            <option value="0">Unlisted</option>
        `);
    }).fail(function(data){
        const msg = JSON.parse(data).message;

        select.empty().append(`
            <option value="-1" disabled selected>Failed to load</option>
        `);
        console.log(msg);
        alert("An unexpected error occured.");
    });
}

function loadPatrolData() {
    const troop = $("#troop").val();
    const select = $("#patrol");

    return $.ajax({
        method: "get",
        url: "/api/patrols/" + troop,
        contentType: "application/json",
        data: {},
        beforeSend: function(){
            //initialize dropdown
            select.empty().append(`
                <option value="-1" disabled selected>Loading...</option>
            `);
        }
    }).done(function(data){
        //populate dropdown
        select.empty().append(`
            <option value="-1" disabled selected>Choose</option>
        `);
        
        data.forEach(function(patrol){
            select.append(`
                <option value="${patrol.name}">${patrol.name}</option>
            `);
        })

        select.append(`
            <option value="0">Unlisted</option>
        `);
    }).fail(function(data){
        const msg = JSON.parse(data).message;

        select.empty().append(`
            <option value="-1" disabled selected>Failed to load</option>
        `);
        console.log(msg);
        alert("An unexpected error occured.");
    });
}

$(function() {
    //intialize page
    initializeForm();
    initializePasswordRequirements();

    //load data
    loadTroopData();

    //event handlers
    $("#explorer").click(function(){
        initializeForm();
        $("#registration-form").data("type", "explorer");
        $(this).removeClass("btn-outline-success").addClass("btn-success");

        $(".section-troop").show();
    });

    $("#leader").click(function(){
        initializeForm();
        $("#registration-form").data("type", "leader");
        $(this).removeClass("btn-outline-secondary").addClass("btn-secondary");

        $(".section-troop").show();
    });

    $("#generaluser").click(function(){
        initializeForm();
        $("#registration-form").data("type", "generaluser");
        $(this).removeClass("btn-outline-primary").addClass("btn-primary");

        $(".section-user").show();
    });

    $("#troop").on("change", function(){
        const troop = $(this).val();
        const formType = $("#registration-form").data("type");

        if (troop) {
            switch (formType) {
                case "explorer":
                    $(".section-explorer").show();
                    $(".section-user").show();
                    loadPatrolData();
                    break;
                case "leader":
                    $(".section-leader").show();
                    $(".section-user").show();
                    break;
            }
        }
    });

    $("#password, #password2").on("change keyup paste", function(){
        const password = $("#password").val();
        const password2 = $("#password2").val();

        $("#password-requirements").show();

        const counts = {
            upper: (password.match(/[A-Z]/g) || []).length,
            lower: (password.match(/[a-z]/g) || []).length,
            number: (password.match(/[0-9]/g) || []).length,
            symbol: (password.match(/[!@#\$%\^&\*\-_=\+]/g) || []).length,
            total: password.length
        }

        if (counts.lower > 0 && counts.upper > 0) {
            $(".rule-lower-upper > .req-blank").hide();
            $(".rule-lower-upper > .req-check").show();
        } else {
            $(".rule-lower-upper > .req-blank").show();
            $(".rule-lower-upper > .req-check").hide();
        }
        
        if (counts.number > 0) {
            $(".rule-number > .req-blank").hide();
            $(".rule-number > .req-check").show();
        } else {
            $(".rule-number > .req-blank").show();
            $(".rule-number > .req-check").hide();
        }
        
        if (counts.symbol > 0) {
            $(".rule-symbol > .req-blank").hide();
            $(".rule-symbol > .req-check").show();
        } else {
            $(".rule-symbol > .req-blank").show();
            $(".rule-symbol > .req-check").hide();
        }
        
        if (counts.total >= passwordMin && counts.total <= passwordMax) {
            $(".rule-charlimit > .req-blank").hide();
            $(".rule-charlimit > .req-check").show();
        } else {
            $(".rule-charlimit > .req-blank").show();
            $(".rule-charlimit > .req-check").hide();
        }
        
        if (counts.total > 0 && password === password2) {
            $(".rule-match > .req-blank").hide();
            $(".rule-match > .req-check").show();
        } else {
            $(".rule-match > .req-blank").show();
            $(".rule-match > .req-check").hide();
        }
    });

    $("#registration-form").on("submit", function(e){
        e.preventDefault();

        const userData = {
            fneData: {
                troop: $("#troop").val(),
                leader: {
                    totem: $("#leader-totem").val()
                },
                explorer: {
                    patrol: $("#patrol").val(),
                    patrolRole: $("#patrol-role").val()
                }
            },
            firstName: $("#first-name").val(),
            lastName: $("#last-name").val(),
            email: $("#email").val(),
            password: $("#password").val()
        };

        //validate form data
        const issues = [];

        switch($("#registration-form").data("type")) {
            case "explorer":
                userData.fneData.leader = null;

                if (!userData.fneData.troop) {
                    issues.push("Please select a troop.");
                }

                if (!userData.fneData.explorer.patrol) {
                    issues.push("Please select a patrol.");
                }

                if (!userData.fneData.explorer.patrolRole) {
                    issues.push("Please set your patrol role.");
                }
                break;
            case "leader":
                userData.fneData.explorer = null;

                if (!userData.fneData.troop) {
                    issues.push("Please select a troop.");
                }

                if (userData.fneData.leader.totem === "") {
                    issues.push("Please enter your totem.");
                }
                break;
            case "generaluser":
                userData.fneData.leader = null;
                userData.fneData.explorer = null;
                break;
        }

        if ($("#password-requirements .req-blank:visible").length != 0) {
            issues.push("Your password does not meet the complexity requirements.");
        }

        //display alert
        $("#formalert").empty();
        if (issues.length > 0) {
            let msg = "";
            issues.forEach(function(line, index){
                if (index > 0) {
                    msg += "<br>";
                }
                msg += line;
            });
            generateAlert($("#formalert"), "alert-danger", msg);
            return;
        }

        $.ajax({
            method: "post",
            url: "/registeruser",
            contentType: "application/json",
            data: JSON.stringify(userData),
            beforeSend: function(){
                generateAlert($("#formalert"), "alert-info", "Working...");
                $("#registration-form-submit").prop("disabled", true);
            }
        }).done(function(response){
            if (response.success) {
                generateAlert($("#formalert"), "alert-success", "Account created! Redirecting...");

                //automatically login to new created user
                $.ajax({
                    method: "post",
                    url: "/login",
                    contentType: "application/json",
                    data: JSON.stringify({
                        email: userData.email,
                        password: userData.password
                    })
                }).done(function(response){        
                    login(response.token, "/"); //redirect to home
                });

            } else {
                generateAlert($("#formalert"), "alert-danger", response.message);
                $("#registration-form-submit").prop("disabled", false);
            }
        }).fail(function(response){
            generateAlert($("#formalert"), "alert-danger", response.message);
            $("#registration-form-submit").prop("disabled", false);
        });
    });

});