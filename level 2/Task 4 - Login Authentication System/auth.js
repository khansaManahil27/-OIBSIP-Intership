/* ===================================== */
/* PAGE */
/* ===================================== */

const currentPage =
    document.body.dataset.page;


/* ===================================== */
/* STORAGE KEYS */
/* ===================================== */

const USERS_KEY =
    "secureAuthUsers";

const SESSION_KEY =
    "secureAuthSession";


/* ===================================== */
/* GET USERS */
/* ===================================== */

function getUsers() {

    const storedUsers =
        localStorage.getItem(
            USERS_KEY
        );


    if (!storedUsers) {

        return [];
    }


    try {

        return JSON.parse(
            storedUsers
        );

    }

    catch (error) {

        return [];
    }
}


/* ===================================== */
/* SAVE USERS */
/* ===================================== */

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );
}


/* ===================================== */
/* EMAIL VALIDATION */
/* ===================================== */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailPattern.test(
        email
    );
}


/* ===================================== */
/* PASSWORD VALIDATION */
/* ===================================== */

function isValidPassword(password) {

    const hasMinimumLength =
        password.length >= 8;


    const hasNumber =
        /\d/.test(password);


    return (
        hasMinimumLength &&
        hasNumber
    );
}


/* ===================================== */
/* RANDOM SALT */
/* ===================================== */

function generateSalt() {

    const bytes =
        new Uint8Array(16);


    crypto.getRandomValues(
        bytes
    );


    return Array
        .from(bytes)
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


/* ===================================== */
/* SHA-256 */
/* ===================================== */

async function hashPassword(
    password,
    salt
) {

    const data =
        new TextEncoder()
            .encode(
                `${salt}:${password}`
            );


    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );


    const hashArray =
        Array.from(
            new Uint8Array(
                hashBuffer
            )
        );


    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


/* ===================================== */
/* MESSAGE */
/* ===================================== */

function showMessage(
    element,
    message,
    type
) {

    element.textContent =
        message;


    element.className =
        `form-message ${type}`;
}


/* ===================================== */
/* CLEAR MESSAGE */
/* ===================================== */

function clearMessage(element) {

    element.textContent = "";

    element.className =
        "form-message";
}


/* ===================================== */
/* SHOW / HIDE PASSWORD */
/* ===================================== */

function setupPasswordButtons() {

    const buttons =
        document.querySelectorAll(
            ".show-password-button"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.dataset.target;


                    const input =
                        document.getElementById(
                            targetId
                        );


                    if (
                        input.type ===
                        "password"
                    ) {

                        input.type =
                            "text";

                        button.textContent =
                            "Hide";

                    }

                    else {

                        input.type =
                            "password";

                        button.textContent =
                            "Show";
                    }

                }
            );

        }
    );
}


/* ===================================== */
/* SESSION */
/* ===================================== */

function createSession(user) {

    const session = {

        userId:
            user.id,

        email:
            user.email,

        username:
            user.username,

        loginTime:
            new Date()
                .toISOString()

    };


    /*
        sessionStorage lasts until
        the browser/tab session ends.

        This is preferable to storing
        authentication state permanently.
    */

    sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );
}


/* ===================================== */
/* GET SESSION */
/* ===================================== */

function getSession() {

    const savedSession =
        sessionStorage.getItem(
            SESSION_KEY
        );


    if (!savedSession) {

        return null;
    }


    try {

        return JSON.parse(
            savedSession
        );

    }

    catch (error) {

        return null;
    }
}


/* ===================================== */
/* REMOVE SESSION */
/* ===================================== */

function logout() {

    sessionStorage.removeItem(
        SESSION_KEY
    );


    window.location.href =
        "login.html";
}


/* ===================================== */
/* REGISTER PAGE */
/* ===================================== */

function setupRegisterPage() {

    const form =
        document.getElementById(
            "register-form"
        );


    const usernameInput =
        document.getElementById(
            "register-username"
        );


    const emailInput =
        document.getElementById(
            "register-email"
        );


    const passwordInput =
        document.getElementById(
            "register-password"
        );


    const confirmPasswordInput =
        document.getElementById(
            "confirm-password"
        );


    const message =
        document.getElementById(
            "register-message"
        );


    const registerButton =
        document.getElementById(
            "register-button"
        );


    const lengthRule =
        document.getElementById(
            "rule-length"
        );


    const numberRule =
        document.getElementById(
            "rule-number"
        );


    /*
        Password rule indicators.
    */

    passwordInput.addEventListener(
        "input",
        function () {

            const password =
                passwordInput.value;


            if (
                password.length >= 8
            ) {

                lengthRule.classList.add(
                    "valid-rule"
                );

            }

            else {

                lengthRule.classList.remove(
                    "valid-rule"
                );
            }


            if (
                /\d/.test(password)
            ) {

                numberRule.classList.add(
                    "valid-rule"
                );

            }

            else {

                numberRule.classList.remove(
                    "valid-rule"
                );
            }


            clearMessage(
                message
            );

        }
    );


    /*
        Registration.
    */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            clearMessage(
                message
            );


            const username =
                usernameInput
                    .value
                    .trim();


            const email =
                emailInput
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            const confirmPassword =
                confirmPasswordInput
                    .value;


            /*
                Empty validation.
            */

            if (
                username === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === ""
            ) {

                showMessage(
                    message,
                    "Please complete all registration fields.",
                    "error"
                );

                return;
            }


            /*
                Username length.
            */

            if (
                username.length < 3
            ) {

                showMessage(
                    message,
                    "Username must contain at least 3 characters.",
                    "error"
                );

                return;
            }


            /*
                Email format.
            */

            if (
                !isValidEmail(email)
            ) {

                showMessage(
                    message,
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /*
                Password rules.
            */

            if (
                !isValidPassword(
                    password
                )
            ) {

                showMessage(
                    message,
                    "Password must contain at least 8 characters and at least 1 number.",
                    "error"
                );

                return;
            }


            /*
                Confirm password.
            */

            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    message,
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            const users =
                getUsers();


            /*
                Duplicate email.
            */

            const emailExists =
                users.some(
                    function (user) {

                        return (
                            user.email
                                .toLowerCase()
                            === email
                        );
                    }
                );


            if (emailExists) {

                showMessage(
                    message,
                    "An account with this email already exists.",
                    "error"
                );

                return;
            }


            /*
                Duplicate username.
            */

            const usernameExists =
                users.some(
                    function (user) {

                        return (
                            user.username
                                .toLowerCase()
                            ===
                            username
                                .toLowerCase()
                        );
                    }
                );


            if (
                usernameExists
            ) {

                showMessage(
                    message,
                    "This username is already in use.",
                    "error"
                );

                return;
            }


            /*
                Disable while hashing.
            */

            registerButton.disabled =
                true;

            registerButton.textContent =
                "Creating Account...";


            try {

                /*
                    Generate unique salt.
                */

                const salt =
                    generateSalt();


                /*
                    Hash password.
                */

                const passwordHash =
                    await hashPassword(
                        password,
                        salt
                    );


                /*
                    User object.

                    IMPORTANT:
                    The original password
                    is NOT stored.
                */

                const newUser = {

                    id:
                        Date.now()
                            .toString(),

                    username:
                        username,

                    email:
                        email,

                    salt:
                        salt,

                    passwordHash:
                        passwordHash,

                    createdAt:
                        new Date()
                            .toISOString()

                };


                users.push(
                    newUser
                );


                saveUsers(
                    users
                );


                showMessage(
                    message,
                    "Registration successful! Redirecting to login...",
                    "success"
                );


                form.reset();


                lengthRule.classList.remove(
                    "valid-rule"
                );

                numberRule.classList.remove(
                    "valid-rule"
                );


                /*
                    Go to login page.
                */

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1000
                );

            }

            catch (error) {

                showMessage(
                    message,
                    "Unable to create the account. Please try again.",
                    "error"
                );

            }

            finally {

                registerButton.disabled =
                    false;

                registerButton.textContent =
                    "Register Account";
            }

        }
    );

}


/* ===================================== */
/* LOGIN PAGE */
/* ===================================== */

function setupLoginPage() {

    const form =
        document.getElementById(
            "login-form"
        );


    const emailInput =
        document.getElementById(
            "login-email"
        );


    const passwordInput =
        document.getElementById(
            "login-password"
        );


    const message =
        document.getElementById(
            "login-message"
        );


    const loginButton =
        document.getElementById(
            "login-button"
        );


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            clearMessage(
                message
            );


            const email =
                emailInput
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                passwordInput.value;


            /*
                Empty validation.
            */

            if (
                email === "" ||
                password === ""
            ) {

                showMessage(
                    message,
                    "Please enter your email and password.",
                    "error"
                );

                return;
            }


            if (
                !isValidEmail(email)
            ) {

                showMessage(
                    message,
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            const users =
                getUsers();


            const user =
                users.find(
                    function (user) {

                        return (
                            user.email
                                .toLowerCase()
                            === email
                        );
                    }
                );


            /*
                Same generic error is used
                whether the email or password
                is incorrect.

                This avoids revealing which
                credential failed.
            */

            if (!user) {

                showMessage(
                    message,
                    "Incorrect email or password.",
                    "error"
                );

                return;
            }


            loginButton.disabled =
                true;

            loginButton.textContent =
                "Checking...";


            try {

                /*
                    Hash entered password
                    using stored salt.
                */

                const enteredHash =
                    await hashPassword(
                        password,
                        user.salt
                    );


                /*
                    Compare hashes.
                */

                if (
                    enteredHash !==
                    user.passwordHash
                ) {

                    showMessage(
                        message,
                        "Incorrect email or password.",
                        "error"
                    );

                    return;
                }


                /*
                    Successful login.
                */

                createSession(
                    user
                );


                window.location.href =
                    "dashboard.html";

            }

            catch (error) {

                showMessage(
                    message,
                    "Login could not be completed. Please try again.",
                    "error"
                );

            }

            finally {

                loginButton.disabled =
                    false;

                loginButton.textContent =
                    "Login";
            }

        }
    );

}


/* ===================================== */
/* DASHBOARD PAGE */
/* ===================================== */

function setupDashboardPage() {

    const session =
        getSession();


    /*
        Protected page check.

        If no active session exists,
        immediately redirect to login.
    */

    if (!session) {

        window.location.replace(
            "login.html"
        );

        return;
    }


    const usernameElements = [

        document.getElementById(
            "navbar-username"
        ),

        document.getElementById(
            "dashboard-username"
        ),

        document.getElementById(
            "account-username"
        )

    ];


    usernameElements.forEach(
        function (element) {

            if (element) {

                element.textContent =
                    session.username;
            }

        }
    );


    const emailElement =
        document.getElementById(
            "account-email"
        );


    emailElement.textContent =
        session.email;


    const logoutButton =
        document.getElementById(
            "logout-button"
        );


    logoutButton.addEventListener(
        "click",
        logout
    );

}


/* ===================================== */
/* REDIRECT LOGGED-IN USERS */
/* ===================================== */

function redirectLoggedInUser() {

    const session =
        getSession();


    if (
        session &&
        (
            currentPage === "login" ||
            currentPage === "register"
        )
    ) {

        window.location.replace(
            "dashboard.html"
        );
    }

}


/* ===================================== */
/* INITIALIZE */
/* ===================================== */

setupPasswordButtons();


redirectLoggedInUser();


if (
    currentPage === "register"
) {

    setupRegisterPage();
}


if (
    currentPage === "login"
) {

    setupLoginPage();
}


if (
    currentPage === "dashboard"
) {

    setupDashboardPage();
}