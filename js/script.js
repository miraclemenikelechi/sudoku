const puzzle = document.querySelector(".puzzle"),
    input = document.querySelectorAll(".box"),
    solve = document.querySelector(".solve"),
    reset = document.querySelector(".reset"),
    theme = document.querySelector(".theme-container"),
    openTheme = document.querySelector("#open-theme"),
    closeTheme = document.querySelector("#close-theme"),
    gameLevel = document.querySelector("#level"),
    toggle = document.querySelector(".theme-toggle"),
    GAME = {
        UNASSINGED: 0,
        GRID_SIZE: 9,
        BOX_SIZE: 3,
        NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        DIFFICULTY: ["easy", "medium", "hard"]
    };
let levelIndex = 0,
    level = GAME.DIFFICULTY[levelIndex];

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

// game grid division
const gameGrid = () => {
    let index = 0, i;
    for (i = 0; i < Math.pow(GAME.GRID_SIZE, 2); i++) {
        const row = Math.floor(i / GAME.GRID_SIZE),
            column = i % GAME.GRID_SIZE;
        if (row === 2 || row === 5) {
            input[index].style.marginBottom = "5px";
        }
        if (column === 2 || column === 5) {
            input[index].style.marginRight = "5px";
        }
        index++;
    }
};

// user selects game level
gameLevel.onchange = (selected) => {
    selected.preventDefault();
    levelIndex = gameLevel.selectedIndex;
    level = GAME.DIFFICULTY[levelIndex];
    console.log(level, levelIndex);
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
    gameGrid();
};
darkTheme();