
/* ============================== */
/* GET HTML ELEMENTS */
/* ============================== */

const temperatureInput =
    document.getElementById("temperature");

const unitSelector =
    document.getElementById("unit");

const convertButton =
    document.getElementById("convert-button");

const resetButton =
    document.getElementById("reset-button");

const errorMessage =
    document.getElementById("error-message");

const celsiusResult =
    document.getElementById("celsius-result");

const fahrenheitResult =
    document.getElementById("fahrenheit-result");

const kelvinResult =
    document.getElementById("kelvin-result");


/* ============================== */
/* CONVERT FUNCTION */
/* ============================== */

function convertTemperature() {

    /*
        First remove any old error message.
    */

    hideError();


    /*
        Get the value entered by the user.
    */

    const inputValue =
        temperatureInput.value.trim();


    /*
        Check if the input field is empty.
    */

    if (inputValue === "") {

        showError(
            "Please enter a temperature value."
        );

        clearResults();

        return;
    }


    /*
        Convert input from text to number.
    */

    const temperature =
        Number(inputValue);


    /*
        Check for invalid numeric input.
    */

    if (!Number.isFinite(temperature)) {

        showError(
            "Please enter a valid numeric temperature."
        );

        clearResults();

        return;
    }


    /*
        Get selected input unit.
    */

    const selectedUnit =
        unitSelector.value;


    /*
        Variables used for final results.
    */

    let celsius;

    let fahrenheit;

    let kelvin;


    /* ============================== */
    /* CELSIUS INPUT */
    /* ============================== */

    if (selectedUnit === "celsius") {

        /*
            Absolute zero in Celsius:
            -273.15°C
        */

        if (temperature < -273.15) {

            showError(
                "Temperature cannot be below absolute zero (-273.15°C)."
            );

            clearResults();

            return;
        }


        celsius =
            temperature;


        fahrenheit =
            (celsius * 9 / 5) + 32;


        kelvin =
            celsius + 273.15;
    }


    /* ============================== */
    /* FAHRENHEIT INPUT */
    /* ============================== */

    else if (
        selectedUnit === "fahrenheit"
    ) {

        /*
            Absolute zero in Fahrenheit:
            -459.67°F
        */

        if (temperature < -459.67) {

            showError(
                "Temperature cannot be below absolute zero (-459.67°F)."
            );

            clearResults();

            return;
        }


        fahrenheit =
            temperature;


        celsius =
            (fahrenheit - 32) * 5 / 9;


        kelvin =
            celsius + 273.15;
    }


    /* ============================== */
    /* KELVIN INPUT */
    /* ============================== */

    else if (
        selectedUnit === "kelvin"
    ) {

        /*
            Absolute zero in Kelvin:
            0 K
        */

        if (temperature < 0) {

            showError(
                "Kelvin cannot be below 0 K because 0 K is absolute zero."
            );

            clearResults();

            return;
        }


        kelvin =
            temperature;


        celsius =
            kelvin - 273.15;


        fahrenheit =
            (celsius * 9 / 5) + 32;
    }


    /* ============================== */
    /* DISPLAY RESULTS */
    /* ============================== */

    celsiusResult.textContent =
        formatTemperature(celsius);


    fahrenheitResult.textContent =
        formatTemperature(fahrenheit);


    kelvinResult.textContent =
        formatTemperature(kelvin);
}


/* ============================== */
/* FORMAT RESULT */
/* ============================== */

function formatTemperature(value) {

    /*
        Convert the value to 2 decimal places.
        Example:
        25.333333 becomes 25.33
    */

    return value.toFixed(2);
}


/* ============================== */
/* DISPLAY ERROR */
/* ============================== */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


/* ============================== */
/* REMOVE ERROR */
/* ============================== */

function hideError() {

    errorMessage.textContent = "";

    errorMessage.style.display =
        "none";
}


/* ============================== */
/* CLEAR RESULTS */
/* ============================== */

function clearResults() {

    celsiusResult.textContent =
        "--";

    fahrenheitResult.textContent =
        "--";

    kelvinResult.textContent =
        "--";
}


/* ============================== */
/* RESET APPLICATION */
/* ============================== */

function resetConverter() {

    temperatureInput.value = "";

    unitSelector.value =
        "celsius";

    hideError();

    clearResults();

    temperatureInput.focus();
}


/* ============================== */
/* BUTTON EVENT */
/* ============================== */

convertButton.addEventListener(
    "click",
    convertTemperature
);


/* ============================== */
/* RESET EVENT */
/* ============================== */

resetButton.addEventListener(
    "click",
    resetConverter
);


/* ============================== */
/* ENTER KEY SUPPORT */
/* ============================== */

temperatureInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            convertTemperature();
        }

    }
);