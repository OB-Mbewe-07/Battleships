const getNumberOfPointsPerShip = (str) => {
    const value = str.indexOf(" ") + 2;
    const nameOfShip = str.substring(0, str.indexOf(" "));
    return { name: nameOfShip, value: Number(str[value]) };
};

const convertDigitsToLetter = (value) => {
    return String.fromCharCode(64 + value);
};

const checkPlacement = (grid , obj , col, row) => {
    const shipLength = obj.shipTypes.value;
    if(obj.shipOrientation === "Vertical"){
        if(row + shipLength > grid.length) return false;
        for(let vert = 0; vert < shipLength; vert++){
            if(grid[row + vert][col] === "X"){
                return false;
            }
        }
    }else{
        if(col + shipLength > grid[0].length) return false;
        for(let horizontal = 0; horizontal < shipLength; horizontal++){
            if(grid[row][col + horizontal] === "X"){
                return false;
            }
        }
    }
    return true;
}

const updateTable = (grid, table, isHiddenDisplay) => {
    for (
      let iterateThroughRows = 0;
      iterateThroughRows < grid.length;
      iterateThroughRows++
    ) {
      for (
        let iterateThroughCols = 0;
        iterateThroughCols < grid[iterateThroughRows].length;
        iterateThroughCols++
      ) {
        const cellValue = grid[iterateThroughRows][iterateThroughCols];
        const tableRow = table.rows[iterateThroughRows + 1];
        const tableCell = tableRow.cells[iterateThroughCols + 1];

        tableCell.className = "";
        tableCell.textContent = "";

        if (cellValue === "XX") {
          tableCell.classList.add("hit");
        } else if (cellValue === "O") {
          tableCell.textContent = "X";
        }else if (cellValue === "YYY"){
          tableCell.classList.add("hit");  
        } else if (cellValue !== null && isHiddenDisplay) {
          tableCell.classList.add("ship");
        }
      }
    }
};

export {updateTable,convertDigitsToLetter,getNumberOfPointsPerShip,checkPlacement};

