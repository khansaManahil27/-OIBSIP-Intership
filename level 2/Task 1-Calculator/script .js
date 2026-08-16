/* ======================================== */
/* GET HTML ELEMENTS */
/* ======================================== */

const currentDisplay =
    document.getElementById("current-display");

const previousDisplay =
    document.getElementById("previous-display");

const errorMessage =
    document.getElementById("error-message");


const numberButtons =
    document.querySelectorAll("[data-number]");

const operatorButtons =
    document.querySelectorAll("[data-operator]");

const clearButton =
    document.querySelector('[data-action="clear"]');

const backspaceButton =
    document.querySelector('[data-action="backspace"]');

const equalsButton =
    document.querySelector('[data-action="equals"]');


/* ======================================== */
/* CALCULATOR STATE */
/* ======================================== */

let currentInput = "0";

let previousInput = null;

let selectedOperator = null;

let waitingForNewNumber = false;

let calculationFinished = false;


/* ======================================== */
/* OPERATOR SYMBOLS */
/* ======================================== */

const operatorSymbols = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷"
};


/* ======================================== */
/* UPDATE DISPLAY */
/* ======================================== */

function updateDisplay() {

    currentDisplay.textContent =
        currentInput;


    if (
        previousInput !== null &&
        selectedOperator !== null
    ) {

        previousDisplay.textContent =
            `${previousInput} ${operatorSymbols[selectedOperator]}`;
    }

    else {

        previousDisplay.textContent = "";
    }
}


/* ======================================== */
/* INPUT NUMBER */
/* ======================================== */

function inputNumber(number) {

    hideError();


    /*
        If a previous calculation has just
        finished and the user enters a number,
        begin a completely new calculation.
    */

    if (calculationFinished) {

        clearCalculator();

        calculationFinished = false;
    }


    /*
        After an operator has been selected,
        start entering the second number.
    */

    if (waitingForNewNumber) {

        if (number === ".") {

            currentInput = "0.";
        }

        else {

            currentInput = number;
        }


        waitingForNewNumber = false;

        updateDisplay();

        return;
    }


    /*
        Prevent multiple decimal points.
    */

    if (
        number === "." &&
        currentInput.includes(".")
    ) {

        return;
    }


    /*
        Add decimal to zero.
    */

    if (number === ".") {

        currentInput += ".";

        updateDisplay();

        return;
    }


    /*
        Replace initial zero.
    */

    if (currentInput === "0") {

        currentInput = number;
    }

    else {

        currentInput += number;
    }


    updateDisplay();
}


/* ======================================== */
/* CHOOSE OPERATOR */
/* ======================================== */

function chooseOperator(operator) {

    hideError();


    const currentValue =
        parseFloat(currentInput);


    /*
        If the user presses operators one
        after another, simply replace the
        current operator.
    */

    if (
        selectedOperator !== null &&
        waitingForNewNumber
    ) {

        selectedOperator = operator;

        updateDisplay();

        return;
    }


    /*
        First operator selection.
    */

    if (previousInput === null) {

        previousInput =
            currentValue;
    }

    else if (selectedOperator !== null) {

        /*
            Operator chaining.

            Example:
            5 + 3 × 2

            First:
            5 + 3 = 8

            Then:
            8 × 2 = 16
        */

        const result =
            calculate(
                previousInput,
                currentValue,
                selectedOperator
            );


        if (result === null) {

            return;
        }


        previousInput =
            result;

        currentInput =
            formatResult(result);
    }


    selectedOperator =
        operator;

    waitingForNewNumber =
        true;

    calculationFinished =
        false;


    updateDisplay();
}


/* ======================================== */
/* CALCULATE */
/* ======================================== */

function calculate(
    firstNumber,
    secondNumber,
    operator
) {

    let result;


    switch (operator) {

        case "add":

            result =
                firstNumber + secondNumber;

            break;


        case "subtract":

            result =
                firstNumber - secondNumber;

            break;


        case "multiply":

            result =
                firstNumber * secondNumber;

            break;


        case "divide":

            /*
                Prevent division by zero.
            */

            if (secondNumber === 0) {

                showError(
                    "Error: Division by zero is not allowed."
                );

                currentInput = "Error";

                previousInput = null;

                selectedOperator = null;

                waitingForNewNumber = true;

                updateDisplay();

                return null;
            }


            result =
                firstNumber / secondNumber;

            break;


        default:

            return secondNumber;
    }


    return result;
}


/* ======================================== */
/* EQUALS BUTTON */
/* ======================================== */

function calculateResult() {

    hideError();


    /*
        There is nothing to calculate if
        no operator or previous number exists.
    */

    if (
        selectedOperator === null ||
        previousInput === null
    ) {

        return;
    }


    const currentValue =
        parseFloat(currentInput);


    const operatorUsed =
        selectedOperator;


    const firstNumber =
        previousInput;


    const result =
        calculate(
            firstNumber,
            currentValue,
            operatorUsed
        );


    if (result === null) {

        return;
    }


    previousDisplay.textContent =
        `${firstNumber} ${operatorSymbols[operatorUsed]} ${currentValue} =`;


    currentInput =
        formatResult(result);


    currentDisplay.textContent =
        currentInput;


    previousInput = null;

    selectedOperator = null;

    waitingForNewNumber = true;

    calculationFinished = true;
}


/* ======================================== */
/* FORMAT RESULT */
/* ======================================== */

function formatResult(number) {

    /*
        Avoid unnecessary floating-point
        decimal errors such as:

        0.1 + 0.2
        becoming
        0.30000000000000004
    */

    const roundedNumber =
        Math.round(
            (number + Number.EPSILON) *
            100000000
        ) / 100000000;


    return roundedNumber.toString();
}


/* ======================================== */
/* CLEAR CALCULATOR */
/* ======================================== */

function clearCalculator() {

    currentInput = "0";

    previousInput = null;

    selectedOperator = null;

    waitingForNewNumber = false;

    calculationFinished = false;

    hideError();

    updateDisplay();
}


/* ======================================== */
/* BACKSPACE */
/* ======================================== */

function backspace() {

    hideError();


    /*
        Do not edit the displayed result
        immediately after a calculation.
    */

    if (calculationFinished) {

        clearCalculator();

        return;
    }


    /*
        If waiting for a new operand,
        there is nothing to delete.
    */

    if (waitingForNewNumber) {

        return;
    }


    if (
        currentInput.length === 1 ||
        (
            currentInput.length === 2 &&
            currentInput.startsWith("-")
        )
    ) {

        currentInput = "0";
    }

    else {

        currentInput =
            currentInput.slice(0, -1);
    }


    updateDisplay();
}


/* ======================================== */
/* SHOW ERROR */
/* ======================================== */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


/* ======================================== */
/* HIDE ERROR */
/* ======================================== */

function hideError() {

    errorMessage.textContent = "";

    errorMessage.style.display =
        "none";
}


/* ======================================== */
/* NUMBER BUTTON EVENTS */
/* ======================================== */

numberButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                inputNumber(
                    button.dataset.number
                );
            }
        );

    }
);


/* ======================================== */
/* OPERATOR BUTTON EVENTS */
/* ======================================== */

operatorButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                chooseOperator(
                    button.dataset.operator
                );
            }
        );

    }
);


/* ======================================== */
/* CLEAR BUTTON EVENT */
/* ======================================== */

clearButton.addEventListener(
    "click",
    clearCalculator
);


/* ======================================== */
/* BACKSPACE BUTTON EVENT */
/* ======================================== */

backspaceButton.addEventListener(
    "click",
    backspace
);


/* ======================================== */
/* EQUALS BUTTON EVENT */
/* ======================================== */

equalsButton.addEventListener(
    "click",
    calculateResult
);


/* ======================================== */
/* OPTIONAL KEYBOARD SUPPORT */
/* ======================================== */

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            event.key;


        /*
            Number keys
        */

        if (
            key >= "0" &&
            key <= "9"
        ) {

            inputNumber(key);

            return;
        }


        /*
            Decimal
        */

        if (key === ".") {

            inputNumber(".");

            return;
        }


        /*
            Addition
        */

        if (key === "+") {

            chooseOperator("add");

            return;
        }


        /*
            Subtraction
        */

        if (key === "-") {

            chooseOperator("subtract");

            return;
        }


        /*
            Multiplication
        */

        if (key === "*") {

            chooseOperator("multiply");

            return;
        }


        /*
            Division
        */

        if (key === "/") {

            event.preventDefault();

            chooseOperator("divide");

            return;
        }


        /*
            Equals / Enter
        */

        if (
            key === "Enter" ||
            key === "="
        ) {

            calculateResult();

            return;
        }


        /*
            Backspace
        */

        if (key === "Backspace") {

            backspace();

            return;
        }


        /*
            Escape clears calculator
        */

        if (key === "Escape") {

            clearCalculator();
        }

    }
);


/* ======================================== */
/* INITIAL DISPLAY */
/* ======================================== */

updateDisplay();