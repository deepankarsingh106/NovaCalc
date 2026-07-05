// basic functioning of the Calculator
const historyList = document.getElementById("history");

const display = document.getElementById("display");

// function to add history value to  current
function append(value){
    display.value += value;
}

// function to clear history
function clearDisplay(){
    display.value = "";
}

// function to delete the last input
function deleteLast(){
    display.value = display.value.slice(0,-1);
}
// function to save the history
function saveHistory() {
    localStorage.setItem("history", historyList.innerHTML);
}

// function to square 
function square(){
    display.value = Number(display.value) ** 2;
}

// function to square root 
function sqrt(){
    display.value = Math.sqrt(Number(display.value));
}

// function to reciprocal
function reciprocal(){
    display.value = 1 / Number(display.value);
}

// function to implement the sin function 
function sin(){
    //  mapping of 90 degree to 1
    display.value = 
        Math.sin(Number(display.value) * Math.PI / 180);
}


// function to implement the cos function 
function cos(){
    display.value =
        Math.cos(Number(display.value) * Math.PI / 180);
}


// function to implement the tan function 
function tan(){
    display.value =
        Math.tan(Number(display.value) * Math.PI / 180);

}

// function to implement the log function 
function log(){
    display.value = Math.log10(Number(display.value));
}

// function to implement the Natural Log
function ln(){
    display.value = Math.log(Number(display.value));
}

// function to implement the factorial 
function factorial(){
    let n = Number(display.value);
    let ans = 1;
    for(let i = 2; i <= n; i++){
        ans *= i;
    }
    display.value = ans;
}

//function to implement the clear History
function clearHistory(){
    historyList.innerHTML="";
    localStorage.removeItem("history");
}


//function to calculate 
function calculate(){
    try{
        //display.value = eval(display.value);
        const expression = display.value;
        const result = eval(expression);

        display.value = result;

        const li = document.createElement("li");

        li.textContent = `${expression} = ${result}`;

        historyList.prepend(li);
        saveHistory();
    }
    catch{
        display.value = "Error";
    }
}

// Connecting the Keyboard to my Calculator..
document.addEventListener("keydown", function (event) {
    const key = event.key;
    if ((key >= "0" && key <= "9") || "+-*/.%".includes(key)) {
        append(key);
    } 
    else if (key === "Enter") {
        event.preventDefault();
        calculate();
    } 
    else if (key === "Backspace") {
        deleteLast();
    } 
    else if (key === "Escape") {
        clearDisplay();
    }
});

// to load the history
window.onload = function () {

    const savedHistory = localStorage.getItem("history");

    if (savedHistory) {
        historyList.innerHTML = savedHistory;
    }

}

// to have Dark/Light Theme
const themeBtn = document.getElementById("theme-btn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){
        themeBtn.textContent = "☀️ Light Mode";
    }else{
        themeBtn.textContent = "🌙 Dark Mode";
    }
});
