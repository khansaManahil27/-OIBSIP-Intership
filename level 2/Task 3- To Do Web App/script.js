/* ================================= */
/* GET HTML ELEMENTS */
/* ================================= */

const taskInput =
    document.getElementById("task-input");

const addTaskButton =
    document.getElementById("add-task-button");

const pendingList =
    document.getElementById("pending-list");

const completedList =
    document.getElementById("completed-list");

const pendingCount =
    document.getElementById("pending-count");

const completedCount =
    document.getElementById("completed-count");

const pendingSummaryCount =
    document.getElementById("pending-summary-count");

const completedSummaryCount =
    document.getElementById("completed-summary-count");

const pendingEmpty =
    document.getElementById("pending-empty");

const completedEmpty =
    document.getElementById("completed-empty");

const errorMessage =
    document.getElementById("error-message");


/* ================================= */
/* TASK ARRAY */
/* ================================= */

/*
    Load existing tasks from localStorage.

    If there are no saved tasks,
    start with an empty array.
*/

let tasks =
    JSON.parse(
        localStorage.getItem("todoTasks")
    ) || [];


/* ================================= */
/* CREATE UNIQUE ID */
/* ================================= */

function createTaskId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(16)
            .slice(2)
    );
}


/* ================================= */
/* ADD TASK */
/* ================================= */

function addTask() {

    hideError();


    const taskText =
        taskInput.value.trim();


    /*
        Prevent empty tasks.
    */

    if (taskText === "") {

        showError(
            "Please enter a task before clicking Add Task."
        );

        taskInput.focus();

        return;
    }


    /*
        Create a new task object.
    */

    const newTask = {

        id: createTaskId(),

        text: taskText,

        completed: false,

        createdAt:
            new Date().toISOString(),

        completedAt: null
    };


    /*
        Add task to array.
    */

    tasks.push(newTask);


    /*
        Save tasks.
    */

    saveTasks();


    /*
        Refresh screen.
    */

    renderTasks();


    /*
        Clear input.
    */

    taskInput.value = "";

    taskInput.focus();
}


/* ================================= */
/* SAVE TO LOCAL STORAGE */
/* ================================= */

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );
}


/* ================================= */
/* RENDER TASKS */
/* ================================= */

function renderTasks() {

    /*
        Clear current HTML task lists.
    */

    pendingList.innerHTML = "";

    completedList.innerHTML = "";


    /*
        Separate pending and completed.
    */

    const pendingTasks =
        tasks.filter(
            function (task) {

                return !task.completed;
            }
        );


    const completedTasks =
        tasks.filter(
            function (task) {

                return task.completed;
            }
        );


    /*
        Display pending tasks.
    */

    pendingTasks.forEach(
        function (task) {

            const taskElement =
                createTaskElement(task);

            pendingList.appendChild(
                taskElement
            );
        }
    );


    /*
        Display completed tasks.
    */

    completedTasks.forEach(
        function (task) {

            const taskElement =
                createTaskElement(task);

            completedList.appendChild(
                taskElement
            );
        }
    );


    /*
        Update counters.
    */

    updateCounts();


    /*
        Update empty-state messages.
    */

    updateEmptyStates();
}


/* ================================= */
/* CREATE TASK ELEMENT */
/* ================================= */

function createTaskElement(task) {

    /*
        Main task card.
    */

    const taskCard =
        document.createElement("article");


    taskCard.className =
        task.completed
            ? "task-card completed"
            : "task-card";


    taskCard.dataset.id =
        task.id;


    /*
        Task content area.
    */

    const taskContent =
        document.createElement("div");

    taskContent.className =
        "task-content";


    /*
        Task text.
    */

    const taskText =
        document.createElement("p");

    taskText.className =
        "task-text";

    taskText.textContent =
        task.text;


    /*
        Added timestamp.
    */

    const createdTime =
        document.createElement("p");

    createdTime.className =
        "task-time";

    createdTime.textContent =
        "Added: " +
        formatDate(task.createdAt);


    taskContent.appendChild(
        taskText
    );

    taskContent.appendChild(
        createdTime
    );


    /*
        Completion timestamp.
    */

    if (
        task.completed &&
        task.completedAt
    ) {

        const completedTime =
            document.createElement("p");

        completedTime.className =
            "task-time completed-time";

        completedTime.textContent =
            "Completed: " +
            formatDate(
                task.completedAt
            );

        taskContent.appendChild(
            completedTime
        );
    }


    /*
        Buttons container.
    */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    /*
        Complete / Undo button.
    */

    const completeButton =
        document.createElement("button");

    completeButton.type =
        "button";

    completeButton.className =
        task.completed
            ? "action-button undo-button"
            : "action-button complete-button";


    completeButton.textContent =
        task.completed
            ? "↩ Undo"
            : "✓ Complete";


    completeButton.addEventListener(
        "click",
        function () {

            toggleTaskComplete(
                task.id
            );
        }
    );


    /*
        Edit button.
    */

    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "action-button edit-button";

    editButton.textContent =
        "✎ Edit";


    editButton.addEventListener(
        "click",
        function () {

            enableEditMode(
                task,
                taskContent
            );
        }
    );


    /*
        Delete button.
    */

    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "action-button delete-button";

    deleteButton.textContent =
        "🗑 Delete";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(
                task.id
            );
        }
    );


    /*
        Add buttons.
    */

    actions.appendChild(
        completeButton
    );

    actions.appendChild(
        editButton
    );

    actions.appendChild(
        deleteButton
    );


    /*
        Add content + actions
        to task card.
    */

    taskCard.appendChild(
        taskContent
    );

    taskCard.appendChild(
        actions
    );


    return taskCard;
}


/* ================================= */
/* COMPLETE / UNDO */
/* ================================= */

function toggleTaskComplete(taskId) {

    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;
            }
        );


    if (!task) {

        return;
    }


    /*
        Reverse status.
    */

    task.completed =
        !task.completed;


    /*
        Store completion time.
    */

    if (task.completed) {

        task.completedAt =
            new Date().toISOString();
    }

    else {

        task.completedAt =
            null;
    }


    saveTasks();

    renderTasks();
}


/* ================================= */
/* DELETE TASK */
/* ================================= */

function deleteTask(taskId) {

    tasks =
        tasks.filter(
            function (task) {

                return task.id !== taskId;
            }
        );


    saveTasks();

    renderTasks();
}


/* ================================= */
/* EDIT TASK INLINE */
/* ================================= */

function enableEditMode(
    task,
    taskContent
) {

    /*
        Temporarily replace task content
        with an editable input.
    */

    taskContent.innerHTML = "";


    const editContainer =
        document.createElement("div");

    editContainer.className =
        "edit-container";


    const editInput =
        document.createElement("input");

    editInput.type =
        "text";

    editInput.className =
        "edit-input";

    editInput.value =
        task.text;

    editInput.maxLength =
        120;


    const saveButton =
        document.createElement("button");

    saveButton.type =
        "button";

    saveButton.className =
        "save-button";

    saveButton.textContent =
        "Save";


    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.className =
        "cancel-button";

    cancelButton.textContent =
        "Cancel";


    /*
        Save edited task.
    */

    saveButton.addEventListener(
        "click",
        function () {

            saveEditedTask(
                task.id,
                editInput.value
            );
        }
    );


    /*
        Cancel editing.
    */

    cancelButton.addEventListener(
        "click",
        function () {

            renderTasks();
        }
    );


    /*
        Press Enter to save.
    */

    editInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                saveEditedTask(
                    task.id,
                    editInput.value
                );
            }


            if (
                event.key === "Escape"
            ) {

                renderTasks();
            }
        }
    );


    editContainer.appendChild(
        editInput
    );

    editContainer.appendChild(
        saveButton
    );

    editContainer.appendChild(
        cancelButton
    );


    taskContent.appendChild(
        editContainer
    );


    editInput.focus();

    editInput.select();
}


/* ================================= */
/* SAVE EDITED TASK */
/* ================================= */

function saveEditedTask(
    taskId,
    newText
) {

    const trimmedText =
        newText.trim();


    if (trimmedText === "") {

        showError(
            "Task text cannot be empty."
        );

        return;
    }


    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;
            }
        );


    if (!task) {

        return;
    }


    task.text =
        trimmedText;


    saveTasks();

    renderTasks();

    hideError();
}


/* ================================= */
/* UPDATE COUNTERS */
/* ================================= */

function updateCounts() {

    const pendingTotal =
        tasks.filter(
            function (task) {

                return !task.completed;
            }
        ).length;


    const completedTotal =
        tasks.filter(
            function (task) {

                return task.completed;
            }
        ).length;


    /*
        Section counters.
    */

    pendingCount.textContent =
        `${pendingTotal} ${
            pendingTotal === 1
                ? "pending"
                : "pending"
        }`;


    completedCount.textContent =
        `${completedTotal} ${
            completedTotal === 1
                ? "completed"
                : "completed"
        }`;


    /*
        Dashboard summary.
    */

    pendingSummaryCount.textContent =
        pendingTotal;


    completedSummaryCount.textContent =
        completedTotal;
}


/* ================================= */
/* EMPTY STATES */
/* ================================= */

function updateEmptyStates() {

    const hasPendingTask =
        tasks.some(
            function (task) {

                return !task.completed;
            }
        );


    const hasCompletedTask =
        tasks.some(
            function (task) {

                return task.completed;
            }
        );


    pendingEmpty.style.display =
        hasPendingTask
            ? "none"
            : "block";


    completedEmpty.style.display =
        hasCompletedTask
            ? "none"
            : "block";
}


/* ================================= */
/* FORMAT DATE */
/* ================================= */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


/* ================================= */
/* ERROR MESSAGE */
/* ================================= */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


/* ================================= */
/* HIDE ERROR */
/* ================================= */

function hideError() {

    errorMessage.textContent = "";

    errorMessage.style.display =
        "none";
}


/* ================================= */
/* ADD BUTTON EVENT */
/* ================================= */

addTaskButton.addEventListener(
    "click",
    addTask
);


/* ================================= */
/* ENTER KEY */
/* ================================= */

taskInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addTask();
        }
    }
);


/* ================================= */
/* REMOVE ERROR WHILE TYPING */
/* ================================= */

taskInput.addEventListener(
    "input",
    function () {

        hideError();
    }
);


/* ================================= */
/* INITIAL PAGE LOAD */
/* ================================= */

renderTasks();