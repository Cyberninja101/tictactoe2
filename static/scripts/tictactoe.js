let canvas = null;
let hasWon = false
let turn = 1
let boardLength = 3;
let board = [];
let players = 2;
let winner = null;

// not doing banner yet
class Player {
    constructor(value) {
        this.value = value
    }
}
let player1 = new Player(1)
let player2 = new Player(2)

let buttons = document.getElementsByClassName('button');
let resetButton = document.getElementById('resetButton')
let title = document.getElementById("title")

let id = String(window.location.href).substring(27)
id = parseInt(id.substring(0, (id.length - 2)))

function init() {
    console.log("init")
    // getting id of current game
    
    console.log(id)
    canvas = document.getElementById('ballpen')
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    canvas.style.display = 'none'


    for (let i = 0; i < buttons.length; i++) {
        buttons[i].innerHTML = '&nbsp;';
        buttons[i].id = i;
        buttons[i].addEventListener('click', handleClick);
        board.push(0);
    }
    resetButton.addEventListener('click', reset)

    // movePlayer(player1, 0);
    // movePlayer(player2, 40);
    updateBoard();
    
    // requestAnimationFrame(nextFrame);
}


function reset() {
    canvas.style.display = 'none';
    for (let i = 0; i < buttons.length; i++) {
        board[i] = 0
    }
    title.innerHTML = "Checkers Royale"
    if (turn = 1){
        turn = 2
        title.innerHTML = "X's turn"
    }
    else if (turn = 2){
        turn = 1
        title.innerHTML = "O's turn"
    }
    updateBoard()

    console.log( "RESET:", canvas.style.display)
}

function handleClick(event) {
    
    let target = event.target;
    let x_or_o = "";
    if (board[target.id] == 0) {
        // for (let i = 0; i < board.length; i++) {
        //     if (board[i] == turn) {
        //         board[i] = 0;
        //     }
        // }

        if (turn == 1) {
            if (checkValidPos(player1, target.id)) {
                x_or_o = "o"
                title.innerHTML = "X's turn"
                board[target.id] = turn;
                insert(player1, target.id);
                turnHandling();
                updateBoard()
            }
        } else if (turn == 2) {

            if (checkValidPos(player2, target.id)) {
                x_or_o = "x"
                title.innerHTML = "O's turn"
                board[target.id] = turn;
                insert(player2, target.id);
                turnHandling();
                updateBoard()
            }
        }
        console.log("hello",id, target.id, x_or_o)
        post_cord([id, target.id, x_or_o])
    
    
    }
}

function checkValidPos(player, destination) {
    if (board[destination] == 0) {
        return true
    }
    return false
}

function insert(player, destination) {
    // putting it on the board
    board[destination] = player.value;
}
function turnHandling() {
    //switches turn
    if (turn == players) {
        turn = 1;
    } else {
        turn += 1;
    }


}

function updateBoard() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] == 0) {
            buttons[i].innerHTML = '&nbsp;';
        } else if (board[i] == 1) {
            buttons[i].innerHTML = 'O';
        } else if (board[i] == 2) {
            buttons[i].innerHTML = 'X';
        }
    }
}

function post_cord(cord) {
    // Sending and receiving data in JSON format using POST method
    //
    var xhr = new XMLHttpRequest();
    var url = "/receive_cord";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log("Got it.");
        }
    };
    var data = JSON.stringify({"id": cord[0], "pos":cord[1], "player":cord[2]});
    // var data = cord
    xhr.send(data);
    console.log(data)
}


window.onload = init();
