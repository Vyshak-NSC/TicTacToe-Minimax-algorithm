let state = Array(9).fill('');
let cells;
let currentPlayer = 'X'
let message = document.getElementById('message')
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
        cell.classList.remove('winner-x','winner-o','draw');
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
            // announceMsg(`Player ${winner} wins!`);
            winner.forEach(index => {
                if(state[index] === 'X'){
                    cells[index].classList.add('winner-x'); // highlight winning cells
                }else{
                    cells[index].classList.add('winner-o'); // highlight winning cells
                }
            });
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
    let score = 0;

    for(let i=0;i<state.length; i++){
        if(state[i]===''){

            // add a simulated value, remove after minimax result for index has been obtained
            state[i] = 'O';
            score = minimax(state,false,0);
            state[i] = '';

            if(score>bestScore){
                bestScore = score;
                move = i;
            }
        }
    }
    state[move] = 'O';
    checkWinner()
    renderBoard();
    currentPlayer = 'X'
}

// track score assignement for minimax
let getScore = {
    'X':-1,
    'O':1,
    null:0
}

function minimax(state, ismaximising, depth){
    let win = getWinner(state), score;
    if(win !== null){
        score = getScore[state[win[0]]];
        return score;
    }
    // check for draw
    if(!state.includes('')){
        return 0;
    }

    // if it is AI's turn: maximise --> go fo highest score
    if(ismaximising){
        let bestScore = -Infinity;
        for(let i=0;i<state.length;i++){
            if(state[i]===''){
                state[i] = 'O'// ai
                let score = minimax(state,false,depth+1);
                state[i]='';

                bestScore = Math.max(score,bestScore)
            }
        }
        return bestScore;
    }
    
    // if it is player's turn: minimise -> go for lowest score
    else{
        let bestScore = Infinity;
        for(let i=0;i<state.length;i++){
            if(state[i]===''){
                state[i] = 'X'// ai
                let score = minimax(state,true,depth+1);
                state[i]='';
                
                bestScore = Math.min(score,bestScore)
            }
        }
        return bestScore;
    }
}

// initiate the game board
document.addEventListener('DOMContentLoaded',() =>{
    cells = document.querySelectorAll(".cell"); // load cell states
    cells.forEach((cell,index) => {
        cell.addEventListener('click',() => {
            // prevent overwriting a cell
            if(gameState ===0 || state[index] || currentPlayer === 'O') return
            
            // Update the cell state and current player
            state[index] = 'X'
            cell.setAttribute('data-player', 'X');
            cell.disabled = true;
            currentPlayer = 'X';
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