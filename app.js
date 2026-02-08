document.addEventListener('DOMContentLoaded' , () => {
    let objShips = {shipTypes : {} , shipOrientation : "Vertical"};
    const shipOrientation = document.getElementById('shipOrientation');
    const shipTypes = document.querySelectorAll('.button-section div');

    shipOrientation.addEventListener('change' , (event) => {
        const chosenOrientation = event.target.value;
        objShips.shipOrientation = chosenOrientation;
        console.log(objShips)
    })

    const getNumberOfPointsPerShip = (str) =>{
        const value = str.indexOf(" ") + 2;
        const nameOfShip = str.substring(0 , str.indexOf(" "));
        return {name : nameOfShip , value: Number(str[value])}
    }

    shipTypes.forEach(ship => {
        ship.addEventListener('click', (event)=>{
            const clicked_Div = event.currentTarget;
            objShips.shipTypes = getNumberOfPointsPerShip(clicked_Div.textContent);
            console.log(objShips);   
        })
    })

    //ship placement logic
    const playerTable = document.getElementById('left');

    const convertDigitsToLetter = (value) =>{
        return String.fromCharCode(64 + value);
    }

    

    playerTable.addEventListener("click" , (event) => {
        const cell = event.target;
        
        const row = cell.parentElement.rowIndex;
        const col = cell.cellIndex;

        console.log(convertDigitsToLetter(col)+ " "+ row );
    })

    const shipPlacement = (row, col, lengthOfShip, VerticalOrHorizontal) => {
        for(let count = 0; count < lengthOfShip; count++){
            let valueRow = row;
            let valueCol = col;

            if( VerticalOrHorizontal === "Vertical"){
                valueRow = row + count;
            }else{
                valueCol = col + count; 
            }
        }
    }

})