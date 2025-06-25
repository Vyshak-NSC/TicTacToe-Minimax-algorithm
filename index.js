let state = Array(9).fill('');
let cells;
let message = document.getElementById('message')
const PLAYER = 'X';
const COMPUTER = 'O';

let currentPlayer = PLAYER
gameState = 1; // playable

const wincombo =[
    [0,1,2], [3,4,5], [6,7,8], // horiozontal sets
    [0,3,6], [1,4,7],[2,5,8],  // vertical sets
    [0,4,8],[2,4,6]            //diagonal sets
]

// Diplay board
function renderBoard(){
    // console.log('State:',state);
    cells.forEach((cell,index) =>{
        // Disable cell if played in tht cell
        if(state[index] !== ''){
            cell.setAttribute('data-player', state[index]);
            cell.checked = true;
            cell.disabled = true;
        }
    })
}

function disableBoard(){
    // If game is over, disable all cells
    cells.forEach(cell => {
        cell.disabled = true;
    });
}

function resetGame(){
    // Reset the cell value and its state
    gameState = 1; // playable
    cells.forEach(cell => {
        cell.setAttribute('data-player','');
        cell.checked = false;
        cell.disabled = false;
        cell.classList.remove('winner-player','winner-computer','draw');
    });

    // Reet the game state
    state.fill(''); 
    currentPlayer = "X";
    announceMsg("Game Start")
}

function getWinner(board){
    let win = wincombo.find(([a,b,c]) => {
        return board[a] === board[b] && board[a] === board[c] && board[a] !== ''
    })
    return win ? win : null;
}

// Check the boaerd state for winner
function checkWinner(){
    // checking if game is in terminal state  
    if(gameState === 0) return; // game over, do nothing 
    const winner = getWinner(state);
    if(winner || !state.includes('')){
        gameState = 0; // game over
        disableBoard();

        if (winner){
            announceMsg(`Player ${state[winner[0]]} wins!`);
            winner.forEach(index => {
                // add appropriate highlight for win case of X or O
                cells[index].classList.add(state[index] === PLAYER ? 'winner-player' : 'winner-computer');
            })
        }else{
            announceMsg("It's a Draw!");
            cells.forEach(cell => {
                cell.classList.add('draw');
            })
        }

        // reset the game after 2 s delay
        setTimeout(resetGame,2000);
    }
}


function announceMsg(msg){
    // Game messages
    // Delay the messaeg by 0.1s after reset. Then display the msg for 2s
    setTimeout(() => {
        message.textContent = msg;
        setTimeout(function() {
            message.textContent = '';
        }, 2000);
    }, 500);
}

function bestMove(){
    if (gameState === 0) return;
    
    // declared locally to prevent scope errors
    let bestScore = -Infinity;
    let move;
    // let score = 0;

    for(let i=0;i<state.length; i++){
        if(state[i]===''){
            // add a simulated value, remove after minimax result for index has been obtained
            state[i] = COMPUTER;
            let score = -negamax(state,0, -Infinity, Infinity,-1);
            state[i] = '';

            if(score>bestScore){
                bestScore = score;
                move = i;
            }
        }
    }

    // add a delay to give feeling of thinking
    setTimeout(() => {
        state[move] = COMPUTER;
        checkWinner()
        renderBoard();
        currentPlayer = PLAYER
    },400)
}

// track score assignement for minimax
let getScore = {
    [PLAYER]:-1,
    [COMPUTER]:1,
    null:0
}

function negamax(state, depth, alpha, beta, color){
    let win = getWinner(state);
    
    // check for terminal state
    if(win!==null){
        // use depth to adjust score, ensuring early win priority
        return color * (getScore[state[win[0]]] * (10 - depth));
    }
    // check for draw
    if(!state.includes('')) return 0;

    // Notes:
    // color ==  1: Computer's turn
    // color == -1: player's turn
    // color == 0 : draw
    
    // alpha beta pruning
    // alpha tracks computer's best score
    // beta tracks player's best score
    let bestScore = -Infinity;

    for(let i = 0;i < state.length; i++){
        if(state[i] === ''){
            // assign a simulated value to the cell
            state[i] = color === 1 ? COMPUTER : PLAYER;
            // inverse the maximising function to obtain opponent's score
            // swap alpha beta value, inverse alpha, beta and color
            let score = -negamax(state, depth+1, -beta, -alpha, -color);
            state[i] = '';
            bestScore = Math.max(score, bestScore);

            // alpha beta pruning
            alpha = Math.max(alpha,score);
            if(beta <= alpha) break;
        }
    }
    return bestScore;
}

// initiate the game board
document.addEventListener('DOMContentLoaded',() =>{
    cells = document.querySelectorAll(".cell"); // load cell states
    cells.forEach((cell,index) => {
        cell.addEventListener('click',() => {
            // prevent overwriting a cell
            if(gameState ===0 || state[index] || currentPlayer === COMPUTER){
                cell.checked = false;
                return
            }
            
            // Update the cell state and current player
            state[index] = PLAYER
            cell.setAttribute('data-player', PLAYER);
            cell.disabled = true;
            currentPlayer = COMPUTER;
            // Check th eboard state. update board if in non terminal state
            checkWinner();
            setTimeout(bestMove,0);
        })
    });
    // bind reset button to function
    document.getElementById('reset-button').addEventListener('click',resetGame);

    // Ensure fresh start for game
    resetGame();
});