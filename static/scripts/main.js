// Variables
let canvas = null;
let hasWon = false
let turn = 1
let boardLength = 9;
let board = [];
let players = 2;
let winner = null;


// Classes
class Player {
    constructor(arrayPos, value, isDead) {
        this.arrayPos = arrayPos;
        this.value = value
        this.isDead = isDead
    }
}

class Banner {
    constructor(x, y, width, height, velX) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velX = velX;
    }
}

let buttons = document.getElementsByClassName('button1');
let resetButton = document.getElementById('resetButton')
let title = document.getElementById("title")

let player1 = new Player(0, 1, false)
let player2 = new Player(40, 2, false)
let Banner1 = new Banner(0, 200, 250, 100, 12);
let Banner2 = new Banner(0, 200, 250, 100, -12);

let playersAlive = []

function init() {
    canvas = document.getElementById('ballpen')
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    canvas.style.display = 'none'


    Banner2.x = canvas.width - 250;
    // let player1 = new Player(0, 1, false)
    // let player2 = new Player(40, 2, false)
    // let Banner1 = new Banner(0, 200, 250, 100, 7); 
    // let Banner2 = new Banner(canvas.width - 250, 200, 250, 100, -7);
    // Makes every other piece on the board a button
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].innerHTML = '&nbsp;';
        buttons[i].id = i;
        buttons[i].addEventListener('click', handleClick);
        board.push(0);
    }
    resetButton.addEventListener('click', reset)

    movePlayer(player1, 0);
    movePlayer(player2, 40);
    updateBoard();
    
    // requestAnimationFrame(nextFrame);
}

function nextFrame(time) {
    console.log("reached next frame!")
    let pen = canvas.getContext('2d');
    pen.font = "80px Georgia";
    pen.clearRect(0, 0, canvas.width, canvas.height)
   
    pen.fillStyle = '#2bff72';
    if(Banner1.x + Banner1.width < canvas.width/2) {
        Banner1.x += Banner1.velX;
    }
    if(Banner2.x > canvas.width/2) {
        Banner2.x += Banner2.velX;
    }
  
    pen.fillRect(Banner1.x,Banner1.y,Banner1.width, Banner1.height)
    pen.fillRect(Banner2.x,Banner2.y,Banner2.width, Banner2.height)
    pen.fillStyle = "black ";
    pen.fillText('Wins', Banner2.x + 30,Banner2.y  + Banner2.height - 20)
    pen.fillText(winner, Banner1.x + 100,Banner2.y  + Banner1.height - 20)
    if( canvas.style.display === 'block') {
        requestAnimationFrame(nextFrame);
    }
}

function reset() {
    canvas.style.display = 'none';
    Banner1.x = 0;
    Banner1.y = 200;
    Banner2.x = canvas.width - 250;
    Banner1.y = 200;
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
    player1.isDead = false
    player2.isDead = false
    movePlayer(player1, 0)
    movePlayer(player2, 40)
    updateBoard()

    console.log( "RESET:", canvas.style.display)
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function handleClick(event) {
    
    let target = event.target;

    if (board[target.id] == 0) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] == turn) {
                board[i] = 0;
            }
        }

        if (turn == 1) {
            if (checkValidPos(player1, target.id)) {
                title.innerHTML = "X's turn"
                board[target.id] = turn;
                movePlayer(player1, target.id);
                turnHandling();
                updateBoard()
            } else if (checkValidJump(player1, target.id, player2)) {
                title.innerHTML = "X's turn"
                board[target.id] = turn;
                board[player2.arrayPos] = 0
                movePlayer(player1, target.id);
                title.innerHTML = "Player O Won!"
                hasWon = true
                turnHandling();
                updateBoard()
            }

        } else if (turn == 2) {

            if (checkValidPos(player2, target.id)) {
                title.innerHTML = "O's turn"
                board[target.id] = turn;
                movePlayer(player2, target.id);
                turnHandling();
                updateBoard()
            } else if (checkValidJump(player2, target.id, player1)) {
                title.innerHTML = "O's turn"
                board[target.id] = turn;
                board[player1.arrayPos] = 0
                movePlayer(player2, target.id);
                title.innerHTML = "Player X Won!"
                hasWon = true
                turnHandling();
                updateBoard()
            }
        
        }
        console.log("hello",player1.arrayPos, player2.arrayPos)
        post_cord([player1.arrayPos, player2.arrayPos])
    
    
    }
}

function killEnemy(enemy) {
    //kills enemy - only works in checkValidJump()

    enemy.isDead = true
    board[enemy.arrayPos] = 0
    enemy.arrayPos = -1
    canvas.style.display = 'block';

    if(enemy == player1) {
        winner = 'X'
    }
    else if(enemy == player2) {
        winner = 'O'
    }
    requestAnimationFrame(nextFrame);
}

function turnHandling() {
    //switches turn
    if (turn == players) {
        turn = 1;
    } else {
        turn += 1;
    }


}

function doesInclude(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == value) {
            return true
        }
    }
    return false
}

function checkValidJump(player, destination, enemy) {
    let goodSpaces = []

    let topLeft = parseInt(player.arrayPos) - 10;
    let topRight = parseInt(player.arrayPos) - 8;
    let bottomLeft = parseInt(player.arrayPos) + 8;
    let bottomRight = parseInt(player.arrayPos) + 10;


    let oppTopLeft = parseInt(player.arrayPos) - 5;
    let oppTopRight = parseInt(player.arrayPos) - 4;
    let oppBottomLeft = parseInt(player.arrayPos) + 4;
    let oppBottomRight = parseInt(player.arrayPos) + 5;

    goodSpaces = [topLeft, topRight, bottomLeft, bottomRight]

    enemySpaces = [oppBottomLeft, oppBottomRight, oppTopLeft, oppTopRight]

    if (destination == topLeft && enemy.arrayPos == oppTopLeft) {
        killEnemy(enemy)
        updateBoard()
        return true
    } else if (destination == topRight && enemy.arrayPos == oppTopRight) {
        killEnemy(enemy)
        updateBoard()
        return true
    } else if (destination == bottomLeft && enemy.arrayPos == oppBottomLeft) {
        killEnemy(enemy)
        updateBoard()
        return true
    } else if (destination == bottomRight && enemy.arrayPos == oppBottomRight) {
        killEnemy(enemy)
        updateBoard()
        return true
    }
    return false
}

function checkValidPos(player, destination) {
    let goodSpaces = [];

    let topEdges = [1, 2, 3];
    let bottomEdges = [37, 38, 39];
    let leftEdges = [9, 18, 27];
    let rightEdges = [13, 22, 31];

    let topLeft = parseInt(player.arrayPos) - 5;
    let topRight = parseInt(player.arrayPos) - 4;
    let bottomLeft = parseInt(player.arrayPos) + 4;
    let bottomRight = parseInt(player.arrayPos) + 5;

    //Top Left
    if (player.arrayPos == 0) {
        goodSpaces = [bottomRight];
    }
    // Top Right
    else if (player.arrayPos == 4) {
        goodSpaces = [bottomLeft];
    }
    //bottom left
    else if (player.arrayPos == 36) {
        goodSpaces = [topRight];
    }
    //botton right
    else if (player.arrayPos == 40) {
        goodSpaces = [topLeft]
    }


    // Top Edge
    else if (doesInclude(topEdges, player.arrayPos)) {
        goodSpaces = [bottomRight, bottomLeft];
    }
    // Bottom Edge
    else if (doesInclude(bottomEdges, player.arrayPos)) {
        goodSpaces = [topRight, topLeft];
    }
    // Left Edge
    else if (doesInclude(leftEdges, player.arrayPos)) {
        goodSpaces = [topRight, bottomRight];
    }
    // Right Edge
    else if (doesInclude(rightEdges, player.arrayPos)) {
        goodSpaces = [topLeft, bottomLeft];
    }

    // Other possibilities
    else {
        goodSpaces = [topLeft, topRight, bottomLeft, bottomRight];
    }

    for (let i = 0; i < goodSpaces.length; i++) {
        if (destination == goodSpaces[i]) {
            return true
        }
    }
    return false

}

function movePlayer(player, destination) {
    if (!(player.isDead)) {
        player.arrayPos = destination
        board[player.arrayPos] = player.value;
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
    var data = JSON.stringify({"o": cord[0], "x": cord[1]});
    xhr.send(data);
    console.log(data)
}


window.onload = init();