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

    const convertDigitsToLetter = (value) => {
        return String.fromCharCode(64 + value);
    };

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
        console.log(grid);
        console.log(convertDigitsToLetter(col) + " " + row);
    });
});
