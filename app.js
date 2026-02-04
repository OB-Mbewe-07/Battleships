document.addEventListener("DOMContentLoaded", () => {
    const leftCells = document.querySelectorAll("#left th");
    const rightCells = document.querySelectorAll("#right th");
    const fireBtn = document.querySelector(".btn-click");

    const MAX_SHIPS = 17;
    const COMPUTER_SHOTS = 3;

    // -----------------------
    // LEFT TABLE (Player ships)
    // -----------------------
    let leftCount = 0;

    leftCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (cell.textContent === "" && leftCount < MAX_SHIPS) {
                cell.textContent = "X";
                cell.style.color = "black";
                leftCount++;
            }
        });
    });

    // -----------------------
    // RIGHT TABLE (Computer ships)
    // -----------------------
    const hiddenShips = new Set();

    while (hiddenShips.size < MAX_SHIPS) {
        const randomIndex = Math.floor(Math.random() * rightCells.length);
        hiddenShips.add(rightCells[randomIndex]);
    }

    // Player attacking right side (always allowed)
    rightCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (cell.dataset.clicked) return;
            cell.dataset.clicked = "true";

            if (hiddenShips.has(cell)) {
                cell.textContent = "X";
                cell.style.color = "red";
            } else {
                cell.textContent = "X";
                cell.style.color = "coral";
            }
        });
    });

    // -----------------------
    // FIRE BUTTON = COMPUTER TURN
    // -----------------------
    const computerShotsTaken = new Set();

    fireBtn.addEventListener("click", () => {
        let shots = 0;

        while (shots < COMPUTER_SHOTS) {
            const randomIndex = Math.floor(Math.random() * leftCells.length);
            const cell = leftCells[randomIndex];

            if (computerShotsTaken.has(cell)) continue;

            computerShotsTaken.add(cell);
            shots++;

            if (cell.textContent === "X") {
                // HIT
                cell.style.color = "red";
            } else if (cell.textContent === "") {
                // MISS
                cell.textContent = "O";
                cell.style.color = "coral";
            }
        }
    });
});
