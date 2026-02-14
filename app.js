import {updateTable ,convertDigitsToLetter, getNumberOfPointsPerShip,checkPlacement } from './Modules.js';
import { listPlayers,register,login, sendInvite } from './server.js';

document.addEventListener("DOMContentLoaded", () => {
  //vobous way of creating a 12x12 2D array
  let grid = [];
  const size = 12;
  for (let countRow = 0; countRow < size; countRow++) {
    grid[countRow] = [];
    for (let countCol = 0; countCol < size; countCol++) {
      grid[countRow][countCol] = null;
    }
  }

  let objShips = { shipTypes: {}, shipOrientation: "Vertical" };
  const shipOrientation = document.getElementById("shipOrientation");
  const shipTypes = document.querySelectorAll(".ship_type");

  shipOrientation.addEventListener("change", (event) => {
    const chosenOrientation = event.target.value;
    objShips.shipOrientation = chosenOrientation;
    console.log(objShips);
  });

  shipTypes.forEach((ship) => {
    ship.addEventListener("click", (event) => {
      const clicked_Div = event.currentTarget;
      objShips.shipTypes = getNumberOfPointsPerShip(clicked_Div.textContent);
      console.log(objShips);
    });
  });

  //ship placement logic
  const playerTable = document.getElementById("left");
  const EnemyTable = document.getElementById("right");

  let hardcoded_Enemy_Grid = [
    ["X", "X", "X", "X", null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, "X", null, null],
    [null, null, null, null, null, null, null, null, null, "X", null, null],
    [null, null, null, null, "X", "X", "X", null, null, "X", null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null],
    ["X", null, null, null, null, null, null, null, null, null, null, "X"],
    ["X", null, null, null, null, null, null, null, null, null, null, "X"],
    ["X", null, null, null, null, null, null, null, null, null, null, null],
    ["X", null, null, null, null, null, null, null, null, null, null, null],
    ["X", null, null, null, null, null, null, null, null, null, null, null],
  ];

  updateTable(hardcoded_Enemy_Grid, EnemyTable, false);

  playerTable.addEventListener("click", (event) => {
    const cell = event.target;
    const row = cell.parentElement.rowIndex - 1;
    const col = cell.cellIndex - 1;

    if (checkPlacement(grid, objShips, col, row)) {
      if(objShips.shipOrientation === "Vertical"){
        for (
        let numberOfSquares = 0;
        numberOfSquares < objShips.shipTypes.value;
        numberOfSquares++
        ) {
          grid[row + numberOfSquares][col] = "X";
        }
      }else {
        for (
        let numberOfSquares = 0;
        numberOfSquares < objShips.shipTypes.value;
        numberOfSquares++
        ) {
          grid[row][col + numberOfSquares] = "X";
        }
      } 

      //The assumption is that once we are here the placement is done
      const AllShips = document.querySelectorAll(".ship-list .ship_type");
      AllShips.forEach((ship) =>{
        if(ship.textContent.includes(objShips.shipTypes.name)){
          ship.remove();
        }
      });

    }else{
      /*Gonna try and put red squares for a second to show that it doesnt work*/
      let tempCells = [];

      if(objShips.shipOrientation === "Vertical"){
        for (
        let numberOfSquares = 0;
        numberOfSquares < objShips.shipTypes.value;
        numberOfSquares++
        ) {
          if(row + numberOfSquares >= grid.length) break; 
          if(grid[row + numberOfSquares][col]!== "X"){
            grid[row + numberOfSquares][col] = "YYY";
            tempCells.push([row + numberOfSquares, col]);
          }  
        }
      }else {
        for (
        let numberOfSquares = 0;
        numberOfSquares < objShips.shipTypes.value;
        numberOfSquares++
        ) {
          if(col + numberOfSquares >= grid[0].length) break; 
          if(grid[row][col + numberOfSquares] !== "X"){
            grid[row][col + numberOfSquares] = "YYY";
            tempCells.push([row, col + numberOfSquares]);
          }
        }
      }

      updateTable(grid,playerTable,true);
      setTimeout(() =>{
        tempCells.forEach(([rowValue,colValue]) =>{
          grid[rowValue][colValue] = null;
        });
        updateTable(grid,playerTable,true);
      },1000)
    }

    updateTable(grid, playerTable, true);
    console.log(grid);
    console.log(convertDigitsToLetter(col) + " " + row);
  });

  //firing logic
  const btn_fire = document.querySelector(".container_btn_Fire button");
  btn_fire.addEventListener("click", () => {
    let rowFire, colFire;
    do {
      rowFire = Math.floor(Math.random() * 12);
      colFire = Math.floor(Math.random() * 12);
    } while (grid[rowFire][colFire] === "XX" || grid[rowFire][colFire] === "O");

    if (grid[rowFire][colFire] === "X") {
      grid[rowFire][colFire] = "XX";
    } else {
      grid[rowFire][colFire] = "O";
    }
    updateTable(grid, playerTable, true);
  });

  //player to enemy fire
  EnemyTable.addEventListener("click", (event) => {
    const cell = event.target;
    const row = cell.parentElement.rowIndex;
    const col = cell.cellIndex;
    console.log(row + " " + col);

    if (hardcoded_Enemy_Grid[row - 1][col - 1] === "X") {
      hardcoded_Enemy_Grid[row - 1][col - 1] = "XX";
    } else {
      hardcoded_Enemy_Grid[row - 1][col - 1] = "O";
    }
    console.log(hardcoded_Enemy_Grid);
    updateTable(hardcoded_Enemy_Grid, EnemyTable, false);
  });

  const frm = document.getElementById("loginform");
  frm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    register(name,password);
  });
});


  



