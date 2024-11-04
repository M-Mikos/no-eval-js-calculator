// 1. Build html
// 1.1. Input field
// 1.2. Output field
// 1.3. Keyboard: Numbers, Delete, Clear, Operators (+, -, *, /, =), Comma
// 2. Build styles
// 3. Build model - input stack
// 4. Build event hadling
// 4.1. Clicking
// 4.2. Typing
// 4.3. Deleting
// 4.4. Clearing
// 4. Build computing algorithm
// 5. Show output

// 6. Extensions:
// 6.1 Change sign
// 6.2 Modulo

// Data

const expression = [];

// Model functions

function clearExpression() {
  expression.length = 1;
  expression[0] = { type: "number", value: 0 };
}
function deleteLastTerm() {
  expression.length -= 1;
}

function addTerm(term) {
  if (term.type === "operator" && expression[expression.length - 1]?.type === "operator") {
    expression.length -= 1;
  }
  expression.push(term);
}

function calculateExpression(expression) {
  return 3;
}

// Viewer functions

function addButtonHandler(handler) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) =>
    button.addEventListener("click", (e) => {
      console.log("click");
      e.preventDefault();
      const data = e.target.dataset;
      handler({ type: data.type, value: data.value });
    })
  );
}

function updateInputElement(expression) {
  const input = document.querySelector(".input");
  input.innerHTML = expression.map((term) => term.value).join("");
}

function updateOutputElement(outputValue) {
  const output = document.querySelector(".output");
  output.classList.remove("hidden");
  output.innerHTML = outputValue;
}

// Viewer controller

function controllClick(term) {
  console.log("click", term.type);
  if (term.type === "action") {
    switch (term.value) {
      case "clear":
        clearExpression();
        break;
      case "delete":
        deleteLastTerm();
        break;
      case "equals":
        const output = calculateExpression(expression);
        updateOutputElement(output);
        break;
    }
  } else {
    addTerm(term);
  }
  updateInputElement(expression);
}

// Run app
console.log("App init");
addButtonHandler(controllClick);
