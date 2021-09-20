function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.readAsText(file);
  
    reader.onload = function() {
        fileContent = reader.result;
        calculate(fileContent);
    };
  
    reader.onerror = function() {
        console.log(reader.error);
    };
}

///////// START OF CALCULATION /////////

const calculate = (input) => {
    let isValidInput = checkInput(input);

    if (!isValidInput) {
        console.log("Input is invalid!");
        return;
    }

    const linesToCalculate = splitByNewLines(input);
    linesToCalculate.forEach(line => {
        const lineWithoutSpaces = line.replace(/ /g, '');
        const charactersOfLine = lineWithoutSpaces.split('');
        let numberOfParanthesesPairs = 0;
        for(let i = 0; i < charactersOfLine.length; ++i) {
            if (charactersOfLine[i] === '(') {
                numberOfParanthesesPairs++;
            }
        }

        let solvedLineResult = [...charactersOfLine];
        for(let i = 0; i < numberOfParanthesesPairs; ++i) {
            const paranthesesOpeningAndClosingIndexes = findRightmostParanthesesPair(solvedLineResult);
            solvedLineResult = solvePartOfLine(solvedLineResult, paranthesesOpeningAndClosingIndexes);
        }

        if (solvedLineResult.length > 1) {
            solvedLineResult = solvePartOfLine(solvedLineResult, {"fromIndex": 0, "toIndex": solvedLineResult.length - 1});
        }

        // result on console
        console.log(`${line} = ${solvedLineResult}`);
    });
}

///////// HELPER FUNCTIONS /////////

const checkInput = (input) => {
    // TODO
    return true;
}

const splitByNewLines = (input) => {
    return input.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);
}

const findRightmostParanthesesPair = (charactersOfLine) => {
    let openingParenthesisIndex = 0;
    let closingParenthesisIndex = charactersOfLine.length - 1;
    for(let i = charactersOfLine.length - 1; i >= 0; --i) {
        if (charactersOfLine[i] === '(') {
            openingParenthesisIndex = i;
            break;
        }
    }

    for(let i = openingParenthesisIndex; i < charactersOfLine.length; ++i) {
        if (charactersOfLine[i] === ')') {
            closingParenthesisIndex = i;
            break;
        }
    }

    return {
        "fromIndex": openingParenthesisIndex,
        "toIndex": closingParenthesisIndex
    };
}

const solvePartOfLine = (charactersOfLine, interval) => {
    const fromIndex = interval.fromIndex;
    const toIndex = interval.toIndex;
    const intervalLength = toIndex - fromIndex + 1;
    let updatedLineResult = [...charactersOfLine];
    let sum = updatedLineResult[fromIndex];

    if (updatedLineResult[fromIndex] === '(') {
        sum = updatedLineResult[fromIndex + 1];
    }

    for(let i = fromIndex + 1; i <= toIndex; ++i) {
        const currentCharacter = charactersOfLine[i];
        if (currentCharacter === '+') {
            sum = parseInt(sum, 10) + parseInt(charactersOfLine[i + 1], 10);
        } else if (currentCharacter === '*') {
            sum = parseInt(sum, 10) * parseInt(charactersOfLine[i + 1], 10);
        }
    }

    updatedLineResult.splice(fromIndex, intervalLength, sum);
    return updatedLineResult;
}