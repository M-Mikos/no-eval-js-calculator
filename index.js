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
  // Double operator guard
  if (term.type === "operator" && expression[expression.length - 1]?.type === "operator") {
    expression.length -= 1;
  }

  // Operator after point guard
  if (term.type === "operator" && expression[expression.length - 1]?.value === ".") return;

  // Point after operator guard
  if (term.value === "." && expression[expression.length - 1]?.type === "operator") return;

  // Double point in number guard
  if (term.value === ".") {
    // Double backslash is used to prevent removing the backslash as unnecessary by formatter extension
    const regex = new RegExp("\\d*\\.\\d*$");
    const expressionString = expression.map((el) => el.value).join("");
    const isPointUnavailable = regex.test(expressionString);
    if (isPointUnavailable) return;
  }
  expression.push(term);
}

function calculateExpression(expression) {
  // Clear expression
  if (expression[expression.length - 1]?.type === "operator") expression.pop();
  if (expression[expression.length - 1]?.value === ".") expression.pop();
  if (expression[0]?.value === "-") expression.unshift({ type: "number", value: "0" });
  if (expression[0]?.type === "operator") expression.shift();

  // Exceptions
  if (expression.length === 1) return expression[0].value;
  if (expression.length === 0) return 0;

  const expressionString = expression.map((el) => el.value).join("");

  // Parse operands
  const operands = expressionString.match(/\d+\.?\d*/g).map((el) => Number(el));

  // Parse operators
  const operators = expressionString.match(/[\*\-\/\+]/g);

  // Parse expression
  const parsedExpression = [];
  operands.forEach((_, i) => {
    parsedExpression.push(operands[i]);
    if (operators[i]) parsedExpression.push(operators[i]);
  });

  // Available operation groups in execution order. Each group contains opareation object with sign as a key and execution logic as a method
  const operations = [
    {
      "*": {
        execute(a, b) {
          return a * b;
        },
      },
      "/": {
        execute(a, b) {
          return a / b;
        },
      },
    },
    {
      "+": {
        execute(a, b) {
          return a + b;
        },
      },
      "-": {
        execute(a, b) {
          return a - b;
        },
      },
    },
  ];

  // Calculating
  function executeOperation(operationsGroup, expression) {
    const calculatedExpression = [];
    const signs = Object.keys(operationsGroup);
    expression.forEach((el) => {
      if (signs.includes(calculatedExpression[calculatedExpression.length - 1])) {
        const operationName = calculatedExpression[calculatedExpression.length - 1];
        const operation = operationsGroup[operationName];
        calculatedExpression.splice(
          calculatedExpression.length - 2,
          2,
          operation.execute(calculatedExpression[calculatedExpression.length - 2], el)
        );
        return;
      }
      calculatedExpression.push(el);
    });
    return calculatedExpression;
  }

  let result = [...parsedExpression];
  operations.forEach((operationGroup) => {
    result = executeOperation(operationGroup, result);
  });

  return result;
}

// Viewer functions

function addButtonHandler(handler) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) =>
    button.addEventListener("click", (e) => {
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
addButtonHandler(controllClick);
