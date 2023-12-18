/*
    File: scrabble.js
    GUI Assignment: CSS HW5
    Shawn Jordan, UMass Lowell Computer Science, shawn_jordan@student.uml.edu
    Copyright (c) 2023 by Shawn. 
    All rights reserved.
    Modified Assignment by Shawn Jordan
    updated by SJ on Dec 14, 2023 at 7:59 PM 
*/

// create a global variable to hold the json data
var tiles; 
// create a global variable to hold the current word
var boardLetters = [];
// create global score variable
var score = 0;
// display the score
$('#scoreboard-number').text(score);
// get the json data
$.getJSON('./json/pieces.json', function(data) {
    // set the json data to the global variable
    tiles = data.pieces;
});
// console log the information from tiles
console.log(tiles);
/* doc ready function for jquery */
$(document).ready(function() {

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
            // generate the tile
            generateTile(getNewLetter());
        }

    }

    // handle the drop event for the board slots
    $('.cell-droppable').droppable({
        accept: '*', // accept any draggable item
        drop: function(event, ui) {
            // Handle the drop event to get information and determine word
            var droppedTile = ui.draggable;
            // get the letter of the tile dropped
            var letter = droppedTile.data('letter');
            // check to see if the tile was dropped in a valid slot
            console.log('Item dropped:', letter);
            // get the index of the dropped cell
            var index = $(this).index();
            // update the boardLetters array with the letter and index
            boardLetters[index] = letter;
            // send letter value to console for troubleshooting
            console.log('Letter value:', getValue(letter));
            // check to see if bonus square
            if (index == 2){
                // update score by getting the value of the tile
                score += getValue(letter);
                // double the entire score
                score *= 2;
            }else if (index == 6 || index == 8){
                // double the score of the letter and add it to the score
                score += getValue(letter) * 2;
            }else{
                // update score by getting the value of the tile
                score += getValue(letter);
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
        var tile = $(`<div class="tile" id="${letter}" data-letter"${letter}"><img src="${img}" width="57" height="55" alt="${letter}" position="absolute"></div>`);

        // make the tile draggable
        tile.draggable({
            revert: true, // revert to original position if not dropped in valid slot
            snap: '.cell-droppable', // snap to slot if dropped near it
            snapMode: 'inner', // snap to the inside of the slot
            snapTolerance: 15, // snap when within 30px of slot
            letter: letter,// save the letter of the tile
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

    // create on-click methods to handle the two buttons
    // new game button click handling
    $('#new-game-button').click(function() {
        newGame();
    });

    // refresh button click handling
    $('#refresh-button').click(function() {
        refreshRack();
    });

    // create a new game instance
    newGame();
    
});