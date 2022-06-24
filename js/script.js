const puzzle = document.querySelector(".puzzle"),
    colors = document.querySelectorAll(".colors"),
    input = document.querySelectorAll(".box"),
    theme = document.querySelector(".theme-container"),
    toggle = document.querySelector(".theme-toggle"),
    solve = document.querySelector("#solve"),
    reset = document.querySelector("#reset"),
    openTheme = document.querySelector("#open-theme"),
    closeTheme = document.querySelector("#close-theme"),
    gameLevel = document.querySelector("#level"),
    startGame = document.querySelector("#game-start"),
    minute = document.querySelector("#minute"),
    second = document.querySelector("#second"),
    pauseGame = document.querySelector("#pause"),
    GAME = {
        UNASSINGED: 0,
        GRID_SIZE: 9,
        BOX_SIZE: 3,
        NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        DIFFICULTY: ["easy", "medium", "hard"],
        LEVEL: [29, 47, 74]
    };
let i,
    levelIndex = 0,
    level = GAME.LEVEL[levelIndex],
    timer = -1,
    seconds = 0,
    pause = false,
    game = undefined,
    gameSolution = undefined;

// turn dark theme on or off
toggle.onclick = () => {
    toggle.classList.toggle("active");
    const isDarkMode = toggle.classList.contains("active");
    sessionStorage.setItem("darkMode", isDarkMode);
    darkTheme();
};

// open menu bar
openTheme.onclick = () => {
    theme.classList.add("active");
    document.body.classList.add("active");
};
closeTheme.onclick = () => {
    theme.classList.remove("active");
    document.body.classList.remove("active");
};

// user changes color
colors.forEach((color) => {
    color.onclick = () => {
        let background = color.style.background;
        document.querySelector(":root").style.setProperty("--board", background);
    };
});

// sudoku grid division
const puzzleGrid = () => {
    let index = 0;
    for (i = 0; i < Math.pow(GAME.GRID_SIZE, 2); i++) {
        const row = Math.floor(i / GAME.GRID_SIZE),
            column = i % GAME.GRID_SIZE;
        if (row === 2 || row === 5) {
            input[index].style.marginBottom = "10px";
        }
        if (column === 2 || column === 5) {
            input[index].style.marginRight = "10px";
        }
        index++;
    }
};

// clear old sudoku
const clearSudoku = () => {
    for (i = 0; i < Math.pow(GAME.GRID_SIZE, 2); i++) {
        input[i].innerHTML = "";
        input[i].classList.remove("filled");
        input[i].classList.remove("selected");
    }
};

// generate puzzle
const gamePuzzle = () => {
    clearSudoku();
    game = sudokuGame(level);
    gameSolution = [...game.question];
    for (i = 0; i < Math.pow(GAME.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / GAME.GRID_SIZE);
        let column = i % GAME.GRID_SIZE;
        input[i].setAttribute("data-value", game.question[row][column]);
        if (game.question[row][column] !== 0) {
            input[i].classList.add("filled");
            input[i].innerHTML = game.question[row][column];
        }
    }
};

const gameGrid = (size) => {
    let candidate = new Array(size);
    for (i = 0; i < size; i++) {
        candidate[i] = new Array(size);
    }
    for (i = 0; i < Math.pow(size, 2); i++) {
        candidate[Math.floor(i / size)][i % size] = GAME.UNASSINGED;
    }
    return candidate;
};

// check for duplicate
// in columns
const isColumnSafe = (grid, column, value) => {
    for (i = 0; i < GAME.GRID_SIZE; i++) {
        if (grid[i][column] === value) {
            return false;
        }
        return true;
    }
};
// in rows
const isRowSafe = (grid, row, value) => {
    for (i = 0; i < GAME.GRID_SIZE; i++) {
        if (grid[row][i] === value) {
            return false;
        }
        return true;
    }
};
// in 3x3 box
const isBoxSafe = (grid, boxRow, boxColumn, value) => {
    for (let row = 0; row < GAME.BOX_SIZE; row++) {
        for (let column = 0; column < GAME.BOX_SIZE; column++) {
            if (grid[row + boxRow][column + boxColumn] === value) {
                return false;
            }
        }
    }
    return true;
};
// check for duplicates in puzzle
const isSafe = (grid, row, column, value) => {
    return isColumnSafe(grid, column, value) && isRowSafe(grid, row, value) && isBoxSafe(grid, row - row % 3, column - column % 3, value) && value !== GAME.UNASSINGED;
};

// get unassinged cells in puzzle
const getUnassigned = (grid, position) => {
    for (let row = 0; row < GAME.GRID_SIZE; row++) {
        for (let column = 0; column < GAME.GRID_SIZE; column++) {
            if (grid[row][column] === GAME.UNASSINGED) {
                position.row = row;
                position.column = column;
                return true;
            }
        }
    }
    return false;
};

// shuffle candidates
const shuffleCandidate = (candidates) => {
    let currentIndex = candidates.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        let digit = candidates[currentIndex];
        candidates[currentIndex] = candidates[randomIndex];
        candidates[randomIndex] = digit;
    }
    return candidates;
};

// check if puzzle is complete
const isGameComplete = (grid) => {
    return grid.every((row, a) => {
        return row.every((value, b) => {
            return value !== GAME.UNASSINGED;
        });
    });
};

// generate sudoku
const generateSudoku = (grid) => {
    let unassingedPosition = {
        row: -1,
        column: -1
    };
    if (!getUnassigned(grid, unassingedPosition)) {
        return true;
    }
    let digits = shuffleCandidate([...GAME.NUMBERS]);
    let row = unassingedPosition.row;
    let column = unassingedPosition.column;
    digits.forEach((digit, i) => {
        if (isSafe(grid, row, column, digit)) {
            grid[row][column] = digit;
            if (isGameComplete(grid)) {
                return true;
            } else {
                if (generateSudoku(grid)) {
                    return true;
                }
            }
            grid[row][column] = GAME.UNASSINGED;
        }
    });
    return isGameComplete(grid);
};

// sudoku check
const sudokuCheck = (grid) => {
    let unassingedPosition = {
        row: -1,
        column: -1
    };
    if (!getUnassigned(grid, unassingedPosition)) {
        return true;
    }
    grid.forEach((row, a) => {
        row.forEach((digit, b) => {
            if (isSafe(grid, a, b, digit)) {
                if (isGameComplete(grid)) {
                    return true;
                } else {
                    if (generateSudoku(grid)) {
                        return true;
                    }
                }
            }
        });
    });
    return isGameComplete(grid);
};

// generate random numbers
const random = () =>
    Math.floor(Math.random() * GAME.GRID_SIZE);

const removeCells = (grid, level) => {
    let result = [...grid];
    let attempt = level;
    while (attempt > 0) {
        let row = random();
        let column = random();
        while (result[row][column] === 0) {
            row = random();
            column = random();
        }
        result[row][column] = GAME.UNASSINGED;
        attempt--;
    }
    return result;
};

// generate sudoku based on level change
const sudokuGame = (level) => {
    let sudoku = gameGrid(GAME.GRID_SIZE);
    let check = generateSudoku(sudoku);
    if (check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        };
    }
    return undefined;
};

// user selects game level
gameLevel.onclick = (selected) => {
    levelIndex = levelIndex + 1 > GAME.LEVEL.length - 1 ? 0 : levelIndex + 1;
    level = GAME.LEVEL[levelIndex];
    selected.target.innerHTML = GAME.DIFFICULTY[levelIndex];
};

// start game
startGame.onclick = () => {
    // game timer
    if (timer == -1) {
        timer = setInterval(() => {
            startGame.innerHTML = `<i class="uil uil-pause"></i>pause`;
            seconds++;
            min = parseInt(seconds / 60, 10);
            sec = parseInt(seconds % 60, 10);
            if (min <= 9) {
                minute.innerHTML = "0" + min;
            } else {
                minute.innerHTML = parseInt(seconds / 60, 10);
            }
            if (sec <= 9) {
                second.innerHTML = "0" + sec;
            } else {
                second.innerHTML = parseInt(seconds % 60, 10);
            }
        }, 1000);
    } else { //  pause game
        startGame.innerHTML = `<i class="uil uil-play"></i>resume`;
        clearInterval(timer);
        timer = -1;
    }
};
gamePuzzle();

// reset game
reset.onclick = () => {
    gamePuzzle();
    // reset timer
    startGame.innerHTML = `<i class="uil uil-play"></i>start`;
    minute.textContent = "00";
    second.textContent = "00";
    seconds = 0;
    clearInterval(timer);
    timer = -1;
};

// make dark mode persist on refresh with session storage
const darkTheme = () => {
    const darkMode = sessionStorage.getItem("darkMode");
    if (darkMode === "true") {
        toggle.classList.add("active");
        document.body.classList.add("dark");
    } else {
        toggle.classList.remove("active");
        document.body.classList.remove("dark");
    }
    puzzleGrid();
};
darkTheme();