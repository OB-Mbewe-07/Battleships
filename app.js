document.addEventListener('DOMContentLoaded' , () => {
    let objShips = {shipTypes : {} , shipOrientation : "Vertical"};
    const shipOrientation = document.getElementById('shipOrientation');
    const shipTypes = document.querySelectorAll('.button-section div');
    let current_ShipType = null;

    shipOrientation.addEventListener('change' , (event) => {
        const chosenOrientation = event.target.value;
        objShips.shipOrientation = chosenOrientation;
        console.log(objShips)
    })

    shipTypes.forEach(ship => {
        ship.addEventListener('click', (event)=>{
            const clicked_Div = event.currentTarget;
            const getNumberOfPointsPerShip = (str) =>{
                const value = str.indexOf(" ") + 2;
                const nameOfShip = str.substring(0 , str.indexOf(" "));
                return {name : nameOfShip , value: Number(str[value])}
            }
            objShips.shipTypes = getNumberOfPointsPerShip(clicked_Div.textContent);
            console.log(objShips);   
        })
    })
})