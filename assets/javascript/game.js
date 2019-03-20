// Game.js File contains the Javascript logic for the RPG Game

// load the HTML page first
$(document).ready(function () {

    // Create Variables for the Game
    // Need an array for the possible select characters
    var characterNames = [];
    var regulars = ["pikachu", "squirtle", "charmander", "bulbasaur"];
    // var characterPicLoc = ['../images/pikachu.png', '../images/.png', '../images/pikachu.png', '../images/pikachu.png'
    var legendaryNames = ["mewtwo", "mew", "ho-oh", "lugia"];
    var characterArray = [];
    var heroArray = [];
    var enemyArray = [];
    var defenderArray = [];
    var roundStart = false;
    var heroChosen = false;
    var heroName;
    var defenderChosen = false;
    var defenderName;
    var wins = 0;

    var characterHP = 100;
    // var ApArray = [10, 15, 20, 25];
    var apArray = [10, 15];
    var cApArray = [10, 10, 15, 25];
    var randAP;
    var randCAP;

    var characterObj = function (name, heroStatus, defenderStatus, hp, attackPower, counterAP) {
        this.name = name;                 // String: Name of Pokemon
        this.heroStatus = heroStatus;         // Boolean: Whether or not pokemon object is a hero or enemy
        this.defenderStatus = defenderStatus;   // Boolean: Whether or not the enemy is a Defender
        this.hp = hp;               // Number: Health points
        this.attackPower = attackPower;
        this.counterAP = counterAP;

        this.printStats = function () {
            console.log(this.name);
            console.log(this.heroStatus);
            console.log(this.defenderStatus);
            console.log(this.hp);
            console.log(this.attackPower);
            console.log(this.counterAP);
        };

        // Create functions for character object interactions: Selection noise, Attacking/growing Attack power, getting attacked
        this.attack = function (enemy) {
            // make noise

            // Run the enemy's function for when they are attacked
            enemy.getAttackedEnemy(this);
            // Hero gains attack power after attacking
            this.attackPower += 10;
        };

        // function for when hero character gets attacked
        this.getAttackedHero = function (enemy) {
            this.hp -= enemy.counterAP;
        };

        // function for enemies to attack hero character
        this.counterAttack = function (target) {
            // make noise

            // function to attack the hero (run after hero attacks, unless enemy is dead)
            target.getAttackedHero(this);
        };

        // function for when hero character gets attacked
        this.getAttackedEnemy = function (hero) {
            this.hp -= hero.attackPower;
        };
    };

    function createCharacters(divName, characterNames) {
        for (var i = 0; i < characterNames.length; i++) {
            // This is the case where we select a hero
            characterName = characterNames[i];
            console.log(characterNames[i] + " is being created as Object!");
            // roundStart = true;
            randAP = Math.floor(Math.random() * 2);
            randCAP = Math.floor(Math.random() * 4);

            var character = new characterObj(characterNames[i], false, false, characterHP, apArray[randAP], cApArray[randCAP]);

            characterArray.push(character);

            var charDiv = $("<div>", { id: character.name + "-div" });
            $(charDiv).addClass("character-div");
            $(charDiv).append("<p class='characterText'>" + character.name + "</p>");
            // debugger;

            var charaImage = $("<img class='character-icon' data-value='" + character.name + "' id='" + character.name + "' src='assets/images/characters/" + character.name + ".png'/>");

            console.log('created character div html element');

            $(charaImage).appendTo(charDiv);
            $(charDiv).append("<p class='characterText' id='" + character.name + "-hp'>" + character.hp + "</p>");
            $("#" + divName).append(charDiv);

            $(".characterText").attr("background-color", "white");
            $(".characterText").attr("color", "white");
        }

        // Bind event handlers
        $(".character-icon").on("click", function (event) {
            event.stopPropagation();
            event.stopImmediatePropagation();

            console.log("character-icon CLICKED!");

            if (roundStart === false && heroChosen === false) {
                // This is the case where we select a hero
                heroName = $(this).attr("data-value");
                console.log(heroName + " chosen as hero!");

                // announce your pokemon
                $("#announce").html("<p> Let's Go " + heroName[0].toUpperCase() + heroName.slice(1) + "! I choose you!!</p>");

                roundStart = true;
                heroChosen = true;

                var characterArraySize = characterArray.length;
                // iterate through the characterArray
                // put all other characters into the enemy array
                for (j = 0; j < characterArraySize; j++) {
                    if (characterArray[j].name === heroName) {
                        // Put hero into heroArray
                        heroArray.push(characterArray[j]);
                        console.log("Placed " + characterArray[j].name + " into Hero Array");
                    } else {
                        enemyArray.push(characterArray[j]);
                        console.log("Placed " + characterArray[j].name + " into Enemy Array");

                        // Re-append enemy divs into the enemy-list Div
                        $("#enemy-list").append($("#" + characterArray[j].name + "-div"));
                    }
                }
            } else if (defenderChosen === false) {
                defenderName = $(this).attr("data-value");
                console.log(defenderName + " chosen as defender!");

                $("#announce").html("<p>Opponent uses " + defenderName[0].toUpperCase() + defenderName.slice(1) + ".</p>");

                defenderChosen = true;

                var enemyArraySize = enemyArray.length;
                console.log(enemyArraySize + " is Enemy Array size!");
                // iterate through the characterArray
                // put all other characters into the enemy array
                for (k = 0; k < enemyArraySize; k++) {
                    if (enemyArray[k].name === defenderName) {
                        // Put hero into heroArray
                        defenderArray.push(enemyArray[k]);
                        console.log("Placed " + defenderArray[0].name + " into Defender Array");

                        $("#defender-list").append($("#" + defenderArray[0].name + "-div"));

                        // pop defender out of enemy array
                        enemyArray.splice(k, 1);
                        enemyArraySize--;
                    }
                }
            }
        });
    }

    function newRound() {
        console.log("Starting a new Round!");
        heroChosen = false;
        defenderChosen = false;
        roundStart = false;
        createCharacters("character-list", characterNames);
        // listCharacters("character-list", characterNames);
        console.log("A New Round has Begun!");
    }

    function characterSetPick() {
        var select = confirm("Starter Pokemon? ('Cancel' for Legendaries)");
        if (select) {
            characterNames = regulars;
        } else {
            characterNames = legendaryNames;
        }
    }


    // -----------------------------------------
    //      Event Handlers
    // -----------------------------------------    

    $("#actionBtn").on("click", function(actionEvent) {
        // Logic for when hero attacks a defender
        console.log("Attack button has been pressed!");

        if (heroArray[0] == undefined){
            alert("You have to select a Hero first!");
        } else if (defenderArray[0] == undefined) {
            alert("You have to select a Defender first!");
        } else {
            // Rest of the game logic here
            console.log("Hero has initiated an attack on the defender");

            // Announcer should report that Hero has attacked
            $("#announce").html("<p>" + heroArray[0].name[0].toUpperCase() + heroArray[0].name.slice(1) + " attacked " + defenderArray[0].name[0].toUpperCase() + defenderArray[0].name.slice(1) + "!</p>");

            // Initiate attack of Hero on Defender
            console.log("Hero's attack is: " + heroArray[0].attackPower);
            heroArray[0].attack(defenderArray[0]);
            console.log("Hero's NEW attack power is: " + heroArray[0].attackPower);

            // update the defender's HP on the HTML
            $("#" + defenderArray[0].name + "-hp").text(defenderArray[0].hp);

            // Check to see if defender is dead
            console.log("Defender's HP is: " + defenderArray[0].hp);

            if(defenderArray[0].hp <= 0) {
                // Case where Defender has died
                console.log("Defender has died!");

                // Remove defender from defender HTML element
                $("#defender-list").empty();

                // announce
                $("#announce").append("<p>It's super effective!</p>");
                $("#announce").append("<p>" + defenderArray[0].name[0].toUpperCase() + defenderArray[0].name.slice(1) + " has fainted!</p>");
                

                defenderArray.pop();
                console.log("Defender has been removed from Defender Array!");
                // console.log("defenderArray[0] = " + defenderArray[0].name);

                defenderChosen = false;

                wins++;
                console.log("Current win count: " + wins);

                //Check if User won!
                if (wins === (characterNames.length - 1)) {
                    console.log("User has won!");
                    // alert("You won!");
                    $("#announce").append("<p>You've beaten the Pokemon League!</p>");
                } else {
                    // alert('Choose a new Defender! (From Enemies List)');
                    $("#announce").append("<p>Choose a new defender.</p>");
                }

            } else {
                // Counter attack from the Defender against Hero!
                console.log("Defender attacks Hero!");

                // Announce counter attack
                $("#announce").append("<p>Not effective...</p> <p>" + defenderArray[0].name[0].toUpperCase() + defenderArray[0].name.slice(1) + " attacked " + heroArray[0].name[0].toUpperCase() + heroArray[0].name.slice(1) + "!</p>");

                // Initiate COUNTER attack of Defender on Hero
                console.log("Hero's HP is: " + heroArray[0].hp);
                heroArray[0].getAttackedHero(defenderArray[0]);
                console.log("Hero's NEW HP is: " + heroArray[0].hp);

                // update the hero's HP on the HTML
                $("#" + heroArray[0].name + "-hp").text(heroArray[0].hp);

                //Check to see if Hero has fallen 
                if (heroArray[0].hp <= 0) {
                    // alert("Game over! - Hero has fallen...");
                    $("#announce").append("<p>" + heroArray[0].name[0].toUpperCase() + heroArray[0].name.slice(1) + " has fainted</p>");
                    $("#announce").append("<p>Game over - Press 'PokeCenter' to restart...</p>");
                } else {
                    console.log("Attack again.");
                    $("#announce").append("<p>Not effective...</p>");
                }
            }
        }
    });

    

    //Logic for reset button
    $("#resetBtn").on("click", function (actionEvent) {
        // Clean out the arrays
        for (var j = 0; j < heroArray.length; j++) {
            heroArray.pop();
        }
        for (var k = 0; k < enemyArray.length; j++) {
            enemyArray.pop();
        }
        for (var l = 0; l < defenderArray.length; j++) {
            defenderArray.pop();
        }
        for (var l = 0; l < characterArray.length; j++) {
            characterArray.pop();
        }

        // Clean out the HTML
        $("#character-list").empty();
        // $("#character-list").append("<h1>Partner Pokemon:</h1>");
        $("#enemy-list").empty();
        // $("#enemy-list").append("<h1>Enemies:</h1>");
        $("#defender-list").empty();
        // $("#defender-list").append("<h1>Defender:</h1>");

        // reset wins counter
        wins = 0;

        // Call new Round method
        newRound();
    });

    // -----------------------------------------
    //      Start Game
    // -----------------------------------------

    characterSetPick();
    newRound();

    // document ready close brace
}); 
