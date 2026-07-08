(() => {
    "use strict";

    const display = document.getElementById("display");
    const historyEl = document.getElementById("history");
    const keypad = document.getElementById("calc-keys");

    let currentValue = "0";
    let previousValue = "";
    let operator = null;
    let shouldResetDisplay = false;

    const formatDisplay = (value) => {
        if (value === "Error") return value;
        const num = parseFloat(value);
        if (Number.isNaN(num)) return "0";
        if (!Number.isFinite(num)) return "Error";

    const str = String(value);
    if (str.includes(".") && !str.endsWith(".")) {
        const [int, dec] = str.split(".");
        const formatted = parseFloat(int).toLocaleString("en-US");
        return dec !== undefined ? `${formatted}.${dec}` : formatted;
    }

    if (str.endsWith(".")) {
        return `${parseFloat(str.slice(0, -1)).toLocaleString("en-US")}.`;
    }

    return num.toLocaleString("en-US", { maximumFractionDigits: 10 });
    };

    const updateDisplay = (flash = false) => {
    if (flash) {
        display.classList.add("updating");
        requestAnimationFrame(() => {
        display.textContent = formatDisplay(currentValue);
        display.classList.toggle("error", currentValue === "Error");
        setTimeout(() => display.classList.remove("updating"), 80);
        });
    } else {
        display.textContent = formatDisplay(currentValue);
        display.classList.toggle("error", currentValue === "Error");
    }
    };

    const updateHistory = () => {
    if (previousValue && operator) {
        const opSymbol = { "+": "+", "-": "−", "*": "×", "/": "÷" }[operator] || operator;
        historyEl.textContent = `${formatDisplay(previousValue)} ${opSymbol}`;
    } else {
        historyEl.textContent = "";
        }
    };

    const clearAll = () => {
        currentValue = "0";
        previousValue = "";
        operator = null;
        shouldResetDisplay = false;
        document.querySelectorAll(".key-op.active").forEach((k) => k.classList.remove("active"));
        updateHistory();
        updateDisplay();
    };

    const inputDigit = (digit) => {
        if (currentValue === "Error") clearAll();
        if (shouldResetDisplay) {
            currentValue = digit;
            shouldResetDisplay = false;
        } else {
            currentValue = currentValue === "0" ? digit : currentValue + digit;
        }
        if (currentValue.replace(".", "").length > 15) {
            currentValue = currentValue.slice(0, -1);
            return;
        }
        updateDisplay(true);
    };

    const inputDecimal = () => {
    if (currentValue === "Error") clearAll();
    if (shouldResetDisplay) {
        currentValue = "0.";
        shouldResetDisplay = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay(true);
    };

    const toggleSign = () => {
    if (currentValue === "Error" || currentValue === "0") return;
    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;
    updateDisplay(true);
    };

    const inputPercent = () => {
        if (currentValue === "Error") return;
        const num = parseFloat(currentValue) / 100;
        currentValue = String(num);
        updateDisplay(true);
    };

    const calculate = (a, b, op) => {
        const x = parseFloat(a);
        const y = parseFloat(b);
        switch (op) {
            case "+": return x + y;
            case "-": return x - y;
            case "*": return x * y;
            case "/": return y === 0 ? NaN : x / y;
            default: return y;
        }
    };

    const setOperator = (op) => {
        if (currentValue === "Error") return;

        document.querySelectorAll(".key-op.active").forEach((k) => k.classList.remove("active"));

        if (operator && !shouldResetDisplay) {
            const result = calculate(previousValue, currentValue, operator);
            if (!Number.isFinite(result)) {
                currentValue = "Error";
                previousValue = "";
                operator = null;
                updateHistory();
                updateDisplay();
                return;
        }
        currentValue = String(result);
    }

        previousValue = currentValue;
        operator = op;
        shouldResetDisplay = true;
        updateHistory();

        const opBtn = keypad.querySelector(`[data-action="operator"][data-value="${op}"]`);
        opBtn?.classList.add("active");
        updateDisplay(true);
    };

    const equals = () => {
        if (!operator || currentValue === "Error") return;

        const result = calculate(previousValue, currentValue, operator);
        if (!Number.isFinite(result)) {
        currentValue = "Error";
        previousValue = "";
        operator = null;
        updateHistory();
        updateDisplay();
        return;
        }

        historyEl.textContent = `${formatDisplay(previousValue)} ${
        { "+": "+", "-": "−", "*": "×", "/": "÷" }[operator]
        } ${formatDisplay(currentValue)} =`;

        currentValue = String(result);
        previousValue = "";
        operator = null;
        shouldResetDisplay = true;
        document.querySelectorAll(".key-op.active").forEach((k) => k.classList.remove("active"));
        updateDisplay(true);
    };

    const ripple = (btn, e) => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (e?.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (e?.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

        const el = document.createElement("span");
        el.className = "ripple";
        el.style.width = el.style.height = `${size}px`;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        btn.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
    };

    const flashKey = (btn) => {
        btn.classList.add("pressed");
        setTimeout(() => btn.classList.remove("pressed"), 120);
    };

    const handleAction = (action, value, btn, e) => {
        ripple(btn, e);
        flashKey(btn);

        switch (action) {
        case "clear": clearAll(); break;
        case "toggle-sign": toggleSign(); break;
        case "percent": inputPercent(); break;
        case "digit": inputDigit(value); break;
        case "decimal": inputDecimal(); break;
        case "operator": setOperator(value); break;
        case "equals": equals(); break;
        }
    };

    const backspace = () => {
    if (shouldResetDisplay || currentValue === "Error") return;

    currentValue =
        currentValue.length === 1
        ? "0"
        : currentValue.slice(0, -1);

    if (currentValue === "-" || currentValue === "")
        currentValue = "0";

    updateDisplay();
    };


    keypad.addEventListener("click", (e) => {
        const btn = e.target.closest(".key");
        if (!btn) return;
        const { action, value } = btn.dataset;
        handleAction(action, value, btn, e);
    });

    document.addEventListener("keydown", (e) => {
        const map = {
        "0": ["digit", "0"], "1": ["digit", "1"], "2": ["digit", "2"],
        "3": ["digit", "3"], "4": ["digit", "4"], "5": ["digit", "5"],
        "6": ["digit", "6"], "7": ["digit", "7"], "8": ["digit", "8"],
        "9": ["digit", "9"], ".": ["decimal"], ",": ["decimal"],
        "+": ["operator", "+"], "-": ["operator", "-"],
        "*": ["operator", "*"], "/": ["operator", "/"],
        "Enter": ["equals"], "=": ["equals"],
        "Escape": ["clear"], "Backspace": ["backspace"],
        "%": ["percent"],
        };

        const entry = map[e.key];
        if (!entry) return;
        e.preventDefault();

        const [action, value] = entry;
        let selector = `[data-action="${action}"]`;
        if (value) selector += `[data-value="${value}"]`;
        const btn = keypad.querySelector(selector);
        if (btn) handleAction(action, value, btn, null);
    });

    updateDisplay();
    })();
