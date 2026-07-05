// basic functioning of the Calculator
const historyList = document.getElementById("history");

const display = document.getElementById("display");
function append(value){
    display.value += value;
}
function clearDisplay(){
    display.value = "";
}
function deleteLast(){
    display.value = display.value.slice(0,-1);
}
function calculate(){
    try{
        //display.value = eval(display.value);
        const expression = display.value;
        const result = eval(expression);

        display.value = result;

        const li = document.createElement("li");

        li.textContent = `${expression} = ${result}`;

        historyList.prepend(li);

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

window.onload = function () {

    const savedHistory = localStorage.getItem("history");

    if (savedHistory) {
        historyList.innerHTML = savedHistory;
    }

}

