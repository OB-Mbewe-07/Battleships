const obj_AllShips = [
  { shipName: "Carrier" , length:5, health: 5, placement : null , isVertical : null},
  { shipName: "Battleship" , length:4, health: 4 , placement : null, isVertical: null},
  { shipName: "Cruiser" , length:3 , health: 3 , placement : null, isVertical : null},
  { shipName: "Submarine" , length:3 , health: 3, placement : null, isVertical : null},
  { shipName: "Destroyer" , length:2, health: 2, placement : null, isVertical : null}
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

const initialiseShips = (shipName,col, row, orientation) =>{
  for(let i = 0; i < obj_AllShips.length; i++){
    if(obj_AllShips[i].shipName === shipName){
      obj_AllShips[i].placement = convertDigitsToLetter(col) + row;
      obj_AllShips[i].isVertical = (orientation === "Vertical");
    }
  }
}

const convertDigitsToLetter = (value) => {
    return String.fromCharCode(64 + value);
};

const convertCoordinateToIndexes = (coordinate) =>{
  const colLetter = coordinate[0].toUpperCase();
  const rowNumber = parseInt(coordinate.substring(1));

  const col = colLetter.charCodeAt(0) - 65;
  const row = rowNumber - 1;

  return {row, col};
}

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

const findShipByCoordinate = (row, col) =>{
  for(let ship of obj_AllShips){
    const startCol =  ship.placement.charCodeAt(0) - 65;
    const startRow = parseInt(ship.placement.substring(1)) - 1;
    for(let i = 0; i < ship.length; i++){
      const shipsRow = ship.isVertical ? startRow + i : startRow;
      const shipsCol = ship.isVertical ? startCol : startCol + i;
      if(shipsRow === row && shipsCol === col) return ship;
    }  
  }
  return null;
}

const detectSunk = (grid, shipObj) =>{
  const startValue = shipObj.placement;
  const length = ship.length;
  const isVertical = ship.isVertical;

  const startCol = startValue.charCodeAt(0) - 65;
  const startRow = parseInt(startValue.substring(1)) - 1; //This is because the values technically start from 0

  for(let i = 0; i < length; i++){
    const row = isVertical ? startRow + i: startRow;
    const col = isVertical ? startCol : startCol + i;

    if(grid[row][col] !== "XX"){
      return false;
    }
  }
  console.log(ship.shipName + " has been sunk");
  return true; 
};

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

export {updateTable,convertDigitsToLetter,getNumberOfPointsPerShip,checkPlacement,convertCoordinateToIndexes, initialiseShips, detectSunk , findShipByCoordinate};

