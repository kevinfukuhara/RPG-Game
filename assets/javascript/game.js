// Game.js File contains the Javascript logic for the RPG Game

// load the HTML page first
$(document).ready(function () {

    // Create Variables for the Game
    // Need an array for the possible select characters
    var characterNames = ["pikachu", "squirtle", "charmander", "bulbasaur"];
    // var characterPicLoc = ['../images/pikachu.png', '../images/.png', '../images/pikachu.png', '../images/pikachu.png'
    var legendaryNames = ["mewtwo", "mew", "ho-oh", "lugia"];
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
    var apArray = [10, 10, 10];
    var cApArray = [5, 10, 15, 20];

    var characterObj = function (name, heroStatus, defenderStatus, hp, attackPower, counterAP, alive) {
        this.name = name;                 // String: Name of Pokemon
        this.heroStatus = heroStatus;         // Boolean: Whether or not pokemon object is a hero or enemy
        this.defenderStatus = defenderStatus;   // Boolean: Whether or not the enemy is a Defender
        this.hp = hp;               // Number: Health points
        this.attackPower = attackPower;
        this.counterAP = counterAP;  
        this.alive = alive;         // Boolean: mark if the character is dead

        this.printStats = function(){
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

    // Create Characters
    function createCharacters () {
        for (var i = 0; i < characterNames.length; i++) {
            // var charaIcon = $("<div class='character-icon'>" + characterNames[i] + "</div>");
            // charaIcon.attr("background-image", "url('assets/images/characters/" + characterNames[i] + ".png')");
            // // charaIcon.text(characterNames[i]);//
    
            // $("#character-list").append(charaIcon);
    
            var charaImage = $("<img class='character-icon' data-value='" + characterNames[i] + "' id='"  + characterNames[i] + "' src='assets/images/characters/" + characterNames[i] + ".png'/>");
    
            console.log('created character div html element');
            
            $("#character-list").append(charaImage);
        } 
    }

    function listObjCharacters (divName, characterArray) {
        for (var i = 0; i < characterArray.length; i++) {
            var charaImage = $("<img class='character-icon' data-value='" + characterArray[i].name + "' id='"  + characterArray[i].name+ "' src='assets/images/characters/" + characterArray[i].name + ".png'/>");
    
            console.log('created character div html element');
            
            $("#" + divName).append(charaImage);
        }
    }

    function newRound() {
        console.log("Starting a new Round!");
        createCharacters();
        // listCharacters("character-list", characterNames);
        console.log("A New Round has Begun!");
    }

    function newGame() {
        console.log("Starting a new Game!");
        newRound();
        console.log("New Game has Begun!");
    }

    // -----------------------------------------
    //      Start Game
    // -----------------------------------------

    newGame();

    // -----------------------------------------
    //      Event Handlers
    // -----------------------------------------

    $(".character-icon").on("click", function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        console.log("character-icon CLICKED!");
        
        if(roundStart === false && heroChosen === false) {
            // This is the case where we select a hero
            heroName = $(this).attr("data-value");
            console.log(heroName + " chosen as hero!");
            roundStart = true;
            var hero = new characterObj(heroName, true, false, characterHP, apArray[0], cApArray[0], true);

            heroArray.push(hero);
            heroChosen = true;
            console.log(heroArray[0].name);

            // put all other characters into the enemy array
            for (i = 0; i < characterNames.length; i++){
                if(characterNames[i] != heroName) {
                    var enemy = new characterObj(characterNames[i], false, false, characterHP, apArray[0], cApArray[0], true);
                    enemyArray.push(enemy);
                    console.log("Pushed " + characterNames[i] + " into the Enemy Array");
                } else {
                    console.log("Passed the 'Hero' when making Enemy Array");
                }

                // hide all characters that are enemies from the Character select row
                // if ($("#" + characterNames[i]).attr("data-value") != heroName) {
                //     console.log("Trying to hide " + ($("#"+characterNames[i]).attr("data-value")));
                //     // $("#" + characterNames[i]).attr("display", "none");
                //     $("#" + characterNames[i]).hide();
                // }
                // OR 
                // Hide all and then create new img object made from the new character objects
                $("#" + characterNames[i]).remove();
            }
            // Make only the hero pokemon object be a img in the list of partner pokemon div:
            listObjCharacters("character-list", heroArray);

            // Add all characters in the enemy array into the enemy display box in HTML
            listObjCharacters("enemy-list", enemyArray);

        } 
        // else if (defenderChosen === false) {
        //     // Select a defender from the list of enemies
        //     defenderName = $(this).attr("data-value");
        //     console.log(defenderName + " chosen as defender!");
        //     var defender = new characterObj(defenderName, false, true, characterHP, apArray[0], cApArray[0], true);

        //     defenderArray.push(defender);
        //     defenderChosen = true;
        //     console.log(defenderArray[0].name);
        // }
        console.log("ended one button click");

        $(".character-icon").on("click", function(secEvent) {
            console.log("entered the SECOND CLICK EVENT HANDLER");
            if (defenderChosen === false) {
                // Select a defender from the list of enemies
                defenderName = $(this).attr("data-value");
                console.log(defenderName + " chosen as defender!");
                var defender = new characterObj(defenderName, false, true, characterHP, apArray[0], cApArray[0], true);
    
                defenderArray.push(defender);
                defenderChosen = true;
                console.log(defenderArray[0].name + " pushed into defender array");

                $("#" + defenderName).remove();

                listObjCharacters("defender-list", defenderArray);
            }
        });
    });

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

            // Initiate attack of Hero on Defender
            console.log("Hero's attack is: " + heroArray[0].attackPower);
            heroArray[0].attack(defenderArray[0]);
            console.log("Hero's NEW attack power is: " + heroArray[0].attackPower);


            // Check to see if defender is dead
            console.log("Defender's HP is: " + defenderArray[0].hp);
            if(defenderArray[0].hp <= 0) {
                // Case where Defender has died
                console.log("Defender has died!");

                // Remove defender from defender HTML element
                $("#" + defenderArray[0].name).remove();

                defenderArray.pop();
                console.log("Defender has been removed from Defender Array!");
                // console.log("defenderArray[0] = " + defenderArray[0].name);

                defenderChosen = false;

                console.log("Current win count: " + wins);
                wins++;

                //Check if User won!
                if (wins === (characterNames.length - 1)) {
                    console.log("User has won!");
                    alert("You won!");
                } else {
                    alert('Choose a new Defender! (From Enemies List)');
                }

            } else {
                // Counter attack from the Defender against Hero!
                console.log("Defender attacks Hero!");

                // Initiate COUNTER attack of Defender on Hero
                console.log("Hero's HP is: " + heroArray[0].hp);
                heroArray[0].getAttackedHero(defenderArray[0]);
                console.log("Hero's NEW HP is: " + heroArray[0].hp);

                //Check to see if Hero has fallen 
                if (heroArray[0].hp <= 0) {
                    alert("Game over! - Hero has fallen...");
                } else {
                    console.log("Attack again.");
                }
            }

        }

    });

// document ready close brace
}); 
