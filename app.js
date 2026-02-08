document.addEventListener("DOMContentLoaded", () => {
    //vobous way of creating a 12x12 2D array
    let grid = [];
    const size = 12;
    for(let countRow = 0; countRow < size; countRow++){
        grid[countRow] = []
        for(let countCol = 0; countCol < size; countCol++){
            grid[countRow][countCol] = null;
        }
    }

    let objShips = { shipTypes: {}, shipOrientation: "Vertical" };
    const shipOrientation = document.getElementById("shipOrientation");
    const shipTypes = document.querySelectorAll(".button-section div");

    shipOrientation.addEventListener("change", (event) => {
        const chosenOrientation = event.target.value;
        objShips.shipOrientation = chosenOrientation;
        console.log(objShips);
    });

    const getNumberOfPointsPerShip = (str) => {
        const value = str.indexOf(" ") + 2;
        const nameOfShip = str.substring(0, str.indexOf(" "));
        return { name: nameOfShip, value: Number(str[value]) };
    };

    shipTypes.forEach((ship) => {
        ship.addEventListener("click", (event) => {
        const clicked_Div = event.currentTarget;
        objShips.shipTypes = getNumberOfPointsPerShip(clicked_Div.textContent);
        console.log(objShips);
        });
    });

    //ship placement logic
    const playerTable = document.getElementById("left");
    const EnemyTable = document.getElementById("right")

    const convertDigitsToLetter = (value) => {
        return String.fromCharCode(64 + value);
    };

    const updateTable = (grid, table, isHiddenDisplay) =>{
        for(let iterateThroughRows = 0; iterateThroughRows < grid.length; iterateThroughRows++){
            for(let iterateThroughCols = 0; iterateThroughCols < grid[iterateThroughRows].length; iterateThroughCols++){
                const cellValue = grid[iterateThroughRows][iterateThroughCols];
                const tableRow = table.rows[iterateThroughRows + 1];
                const tableCell = tableRow.cells[iterateThroughCols + 1];

                tableCell.className = "";
                tableCell.textContent = "";

                if (cellValue === "XX"){
                    tableCell.classList.add("hit");
                }else if (cellValue === "O"){
                    tableCell.textContent = "X";
                }else if (cellValue !== null && isHiddenDisplay){
                    tableCell.classList.add("ship");
                }
                
            }
        }
    }

    let hardcoded_Enemy_Grid = [
        ['X', 'X', 'X', 'X', null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, 'X', null, null],
        [null, null, null, null, null, null, null, null, null, 'X', null, null],
        [null, null, null, null, 'X', 'X', 'X', null, null, 'X', null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null, null, null],
        ['X', null, null, null, null, null, null, null, null, null, null, 'X'],
        ['X', null, null, null, null, null, null, null, null, null, null, 'X'],
        ['X', null, null, null, null, null, null, null, null, null, null, null],
        ['X', null, null, null, null, null, null, null, null, null, null, null],
        ['X', null, null, null, null, null, null, null, null, null, null, null]
    ];

    updateTable(hardcoded_Enemy_Grid,EnemyTable,false);

    playerTable.addEventListener("click", (event) => {
        const cell = event.target;
        const row = cell.parentElement.rowIndex;
        const col = cell.cellIndex;

        if(objShips.shipOrientation === "Vertical"){
            for(let numberOfSquares = 0; numberOfSquares < objShips.shipTypes.value; numberOfSquares++){
                grid[row + numberOfSquares - 1][col - 1] = "X";
            }
        }else{
            for(let numberOfSquares = 0; numberOfSquares < objShips.shipTypes.value; numberOfSquares++){
                grid[row - 1][col + numberOfSquares - 1] = "X";
            }
        }

        updateTable(grid, playerTable, true);
        console.log(grid);
        console.log(convertDigitsToLetter(col) + " " + row);
    });

    //firing logic
    const btn_fire = document.querySelector(".Container_btn_Fire button")
    btn_fire.addEventListener("click", () => {
        let rowFire , colFire ;
        do {
            rowFire = Math.floor(Math.random() * 12);
            colFire = Math.floor(Math.random() * 12);
        } while(grid[rowFire][colFire] === "XX" || grid[rowFire][colFire] === "O" );

        if(grid[rowFire][colFire] === 'X'){
            grid[rowFire][colFire] = "XX";
        }else{
            grid[rowFire][colFire] = "O";
        }
        updateTable(grid,playerTable,true);
    })
});
