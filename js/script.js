const puzzle = document.querySelector(".puzzle"),
    input = document.querySelectorAll(".box"),
    solve = document.querySelector(".solve"),
    reset = document.querySelector(".clear"),
    theme = document.querySelector(".theme-container"),
    openTheme = document.querySelector("#open-theme"),
    closeTheme = document.querySelector("#close-theme"),
    toggle = document.querySelector(".theme-toggle");

toggle.onclick = () => {
    toggle.classList.toggle("active");
    if (toggle.classList.contains("active")) {

    }
};

openTheme.onclick = () => {
    theme.classList.add("active");
    document.body.style.paddingRight("350px");
};
closeTheme.onclick = () => {
    theme.classList.remove("active");
    document.body.style.paddingRight("0px");
};


console.log(input);