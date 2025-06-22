let state = Array(9).fill('');
let cells
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
    cells.forEach((cell,index) =>{
        // Disable cell if played in tht cell
        if(state[index] !==''){
            cell.setAttribute('data-player', state[index]);
            cell.checked = true;
            cell.disabled = true;
        }
    })
}

// Check the boaerd state for winner
function checkWinner(){
    // checking if game is in terminal state  
    if(gameState === 0) return; // game over, do nothing 
    const winner = wincombo.find(([a,b,c]) => {
        return state[a] === state[b] && 
        state[a] === state[c] && 
        state[a] !== ''
    })

    if(winner || !state.includes('')){
        gameState = 0; // game over
        disableBoard();

        if (winner){
            announceMsg(`Player ${state[winner[0]]} wins!`);
            winner.forEach(index => {
                cells[index].classList.add('winner'); // highlight winning cells
            });
        }else{
            gameState = 0; // game over
            announceMsg("It's a Draw!");
            cells.forEach(cell => {
                cell.classList.add('draw');
            })
        }

        // reset the game after 2 s delay
        setTimeout(resetGame,2000);
    }
}

function resetGame(){
    // Reset the cell value and its state
    gameState = 1; // playable
    cells.forEach(cell => {
        cell.setAttribute('data-player','');
        cell.checked = false;
        cell.disabled = false;
        cell.classList.remove('winner','draw');
    });

    // Reet the game state
    state.fill(''); 
    currentPlayer = "X";
    announceMsg("Game Start")
}

function disableBoard(){
    // If game is over, disable all cells
    cells.forEach(cell => {
        cell.disabled = true;
    });
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

// initiate the game board
document.addEventListener('DOMContentLoaded',() =>{
    cells = document.querySelectorAll(".cell"); // load cell states
    cells.forEach((cell,index) => {
        cell.addEventListener('click',() => {

            // prevent overwriting a cell
            if(gameState ===0 || state[index] !== '') return
            
            // Update the cell state and current player
            state[index] = currentPlayer
            cell.setAttribute('data-player', currentPlayer);
            currentPlayer = currentPlayer === "X"? "O" : "X";
            cell.disabled = true;

            // Check th eboard state. update board if in non terminal state
            checkWinner();
            
        })
    });

    // bind reset button to function
    document.getElementById('reset-button').addEventListener('click',()=>{
        resetGame();
    });

    // Ensure fresh start for game
    resetGame();
});