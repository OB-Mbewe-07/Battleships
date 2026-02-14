const obj_AllShips = [
  { shipName: "Carrier" , length:5},
  { shipName: "Battleship" , length:4},
  { shipName: "Cruiser" , length:3},
  { shipName: "Submarine" , length:3},
  { shipName: "Destroyer" , length:2}
];

const getNumberOfPointsPerShip = (str) => {
  /*Function is giving battleship [5] */
  const space = str.indexOf(" ");
  const shortenedStr = str.substring(0,space);
  for(let element of obj_AllShips){
    if(shortenedStr === element.shipName){
      return { name: element.shipName, value: element.length };
    }else{
      console.error("Error");
    }
  }
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

/*const detectSunk = (grid, gridRow , gridCol) =>{
  //horizontal movement
  for(let row = 0; row < grid.length; row++){
    
  }

  //Column movement
  for(let col = 0; col <grid[0].length; col++){
    for(let row = 0; row < grid.length; row++){

    }
  }
}*/

const updateTable = (grid, table, isHiddenDisplay) => {
  for (let iterateThroughRows = 0; iterateThroughRows < grid.length; iterateThroughRows++) {
    for (let iterateThroughCols = 0;iterateThroughCols < grid[iterateThroughRows].length;iterateThroughCols++) {

      const cellValue = grid[iterateThroughRows][iterateThroughCols];
      const tableRow = table.rows[iterateThroughRows + 1];
      const tableCell = tableRow.cells[iterateThroughCols + 1];

      tableCell.className = "";
      tableCell.textContent = "";

      if (cellValue === "XX") { // this means you have hit
        tableCell.classList.add("hit");
      } else if (cellValue === "O") { // O means the user has missed
        tableCell.textContent = "X";
      }else if (cellValue === "YYY"){ //means that you have improper placement of ships and should place again
        tableCell.classList.add("hit");  
      } else if (cellValue !== null && isHiddenDisplay) {
        tableCell.classList.add("ship");
      }
    }
  }
};

export {updateTable,convertDigitsToLetter,getNumberOfPointsPerShip,checkPlacement};

