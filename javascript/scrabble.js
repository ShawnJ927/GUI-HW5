/*
    File: scrabble.js
    GUI Assignment: CSS HW5
    Shawn Jordan, UMass Lowell Computer Science, shawn_jordan@student.uml.edu
    Copyright (c) 2023 by Shawn. 
    All rights reserved.
    Modified Assignment by Shawn Jordan
    updated by SJ on Dec 14, 2023 at 7:59 PM 
*/

/* doc ready function for jquery */
$(document).ready(function() {
    // create a global variable to hold the json data
    var tiles; 
    // create a global variable to hold the current word values and start with all nulls
    var boardLetters = Array.from({ length: 15 }, () => null);
    // array to store tile id's
    var tileIds = [];
    // array to store tile letters
    var tileLetters = [];
    // create global score variable
    var score = 0;
    var highscore = 0;
    var counter = 0; // for appending to tile id
    // create global variable to hold number of tiles on tile rack
    var tilesOnRack = 7;
    // display the score
    $('#scoreboard-number').text(score);
    // display the high score
    $('#high-score-number').text(highscore);
    // get the json data
    $.getJSON('./json/pieces.json', function(data) {
        // set the json data to the global variable
        tiles = data.pieces;

        // once the game tiles are loaded, start game
        newGame();
        // console log the information from tiles
        console.log(tiles);
    });

    // function to create a new instance of the game
    // refreshes the board and the rack
    function newGame() {
        // reset the json data
        resetJson();
        // clear the board
        clearBoard();
        // refresh the rack
        refreshRack();
    }
    function clearBoard() {
        // clear the board by emptying each table cell
        var cells = document.querySelectorAll('#cell-droppable td');
        cells.forEach(function(cell) {
            cell.innerHTML = '';
        });
        boardLetters = Array.from({ length: 15 }, () => null); // reset board letters
    }

    // function to refresh the tile rack
    // called when the refresh button is clicked
    function refreshRack() {
        // create rack var to manipulate
        var rackSlots = $('#tile-rack-slots');

        // clear the rack
        rackSlots.empty();

        // create 7 new tiles and add them to the rack
        for (var i = 0; i < 7; i++) {
            var letter = getNewLetter();
            tileLetters.push(letter); // push tile letter to the rack
            // generate the tile
            generateTile(letter);
        }

    }

    // handle the drop event for the board slots
    $('.cell-droppable').droppable({
        accept: '*', // accept any draggable item
        drop: function(event, ui) {
            // reset the score 
            score = 0;
            // Handle the drop event to get information and determine word
            var droppedTile = ui.draggable;
            // add tile id to array
            tileIds.push(droppedTile.attr('id'));
            // get the letter of the tile dropped
            var letter = droppedTile.data('letter');
            // check to see if the tile was dropped in a valid slot
            console.log(letter);
            // get the index of the dropped cell
            var index = $(this).index();
            // check to see if the tile has been dropped in another slot
            if (droppedTile.data('slotId') == null) {
                // store slot index so that it can be used to check if it was in another slot before
                droppedTile.data('slotId', index);
                tilesOnRack--;
                // find letter in tileLetters array and remove it
                var index = tileLetters.indexOf(droppedTile.data('letter'));
                // remove the letter from the array
                tileLetters.splice(index, 1);
            } else{
                // if it was in another slot, remove the letter from the boardLetters array
                boardLetters[droppedTile.data('slotId')] = null;
                // store new slot index
                droppedTile.data('slotId', index);
            }
            
            // update the boardLetters array with the letter and index
            boardLetters[index] = letter;
            // send letter value to console for troubleshooting
            console.log('Letter value:', getValue(letter));
            var doubleWord = false; // bool to check for double word
            var doubleWord2 = false; // bool to check for double word
            // get boardletters values for calculating score
            for (var i = 0; i < boardLetters.length; i++){
                // check to see if the value is null
                if (boardLetters[i] != null){
                    // if not, get the value of the letter
                    var tempscore = getValue(boardLetters[i]);
                    if (i == 6 || i == 8){
                        // check to see if bonus square
                        // if so, double the score
                        tempscore *= 2;
                    }
                    // add it to the score
                    score += tempscore;
                }
                if (i == 2){
                    // check to see if bonus square
                    if (boardLetters[i] != null){
                        // set double word to true
                        doubleWord = true;
                    }
                }
                if (i == 12){
                    // check to see if bonus square
                    if (boardLetters[i] != null){
                        // set double word to true
                        doubleWord2 = true;
                    }
                }
            }

            // if double word is true, double the score
            if (doubleWord){
                score *= 2;
            }
            if (doubleWord2){
                score *= 2;
            }
            
            // send score to console for troubleshooting
            console.log('Score:', score);
            // update the score display
            $('#scoreboard-number').text(score);
        }
    });
    
    // function to get the value of a tile
    function getValue(letter) {
        // get the value of the tile
        var value = tiles.find(tiles => tiles.letter == letter).value;
        // return the value
        return value;
    }

    // function to grab a new tile
    function getNewLetter() {
        // check to see if there are any tiles left
        // filter tiles to only those with amount > 0
        var tilesLeft = tiles.filter(tiles => tiles.amount > 0);
        // check to see what tiles are left in console
        console.log(tilesLeft);

        if (tilesLeft.length == 0) {
            // if not, alert the user
            alert("No more tiles left!");
            return;
        }
        // if there are tiles left, get a random tile
        // create a random number which will correspond to a letter
        var rand = Math.floor(Math.random() * 25);
        // get random tile from json data
        if (tiles[rand].amount > 0){
            var letter = tiles[rand].letter;
            // decrement the amount of the tile
            tiles[rand].amount--;
        } else{
            // if the tile has no amount left, get another tile recursively
            letter = getNewLetter();
        }
        // log letter chosen to console
        console.log(letter);
        // return the letter of the tile
        return letter;
    }

    // function to generate draggable tile
    function generateTile(letter) {
        // get the image using selected letter
        var img = './images/Scrabble_Tile_' + letter + '.jpg';

        // create new draggable tile
        var tile = $(`<div class="tile" id="${letter}+${counter}"><img src="${img}" width="57" height="55" alt="${letter}" position="absolute"></div>`);
        tile.data('letter', letter); // save the letter of the tile
        // make the tile draggable
        tile.draggable({
            revert: 'invalid', // revert to original position if not dropped in valid slot
            snap: '.cell-droppable', // snap to slot if dropped near it
            snapMode: 'inner', // snap to the inside of the slot
            snapTolerance: 15, // snap when within 30px of slot
        });

        // add it to the rack div
        $('#tile-rack-slots').append(tile);
    }

    function resetJson() {
        // reset the json data
        $.getJSON('./json/pieces.json', function(data) {
            // set the json data to the global variable
            tiles = data.pieces;
        });
    }
    // checks to see how many tiles are in the rack and replenishes them back to 7
    function refillRack(){
        // create rack var to manipulate
        var rackSlots = $('#tile-rack-slots');
        // clear the rack
        rackSlots.empty();

        // check to see how many tiles are in the rack
        if (tilesOnRack < 7){
            // iterate through the tile array and get the letters
            for (var i = 0; i < tileLetters.length; i++){
                // get the letter of the tile
                var letter = tileLetters[i];
                // generate a new tile
                generateTile(letter);
            }
            // iterate through tileId array and generate replacement tiles
            for (var i = 0; i < (7-tilesOnRack); i++){
                var letter = getNewLetter();
                tileLetters.push(letter); // push tile letter to the rack
                generateTile(letter);
            }
            // remove all tileIds from array
            tileIds = [];
        }
        
    }
    // create on-click methods to handle the two buttons
    // new game button click handling
    $('#new-game-button').click(function() {
        // reset the score
        score = 0;
        highscore = 0; // reset high score
        // display score
        $('#scoreboard-number').text(score);
        // display high score
        $('#high-score-number').text(highscore);
        newGame();
    });

    // refresh button click handling
    $('#refresh-button').click(function() {
        if (score > highscore){
            highscore = score;
            // display high score
            $('#high-score-number').text(highscore);
        }
        refreshRack();
    });

    // next button click handling
    $('#next-button').click(function() {
        if (score > highscore){
            highscore = score;
            // display high score
            $('#high-score-number').text(highscore);
        }
        refillRack();
        tilesOnRack = 7;
    });
    
});