export function countEqualElements(array1, array2) {
    let count = 0;
    const usedIndices = new Set();
    for (let i = 0; i < array1.length; i++) {
        const [a, b] = array1[i];
        for (let j = 0; j < array2.length; j++) {
            if (usedIndices.has(j)) continue;
            if (array2[j][0] === a && array2[j][1] === b) {
                count++;
                usedIndices.add(j);
                break;
            }
        }
    }
    return count;
}

export function findUnmatchedElements(array1, array2) {
    const unmatchedElements = [];
    const usedIndices = new Set();
    for (let i = 0; i < array1.length; i++) {
        const [a, b] = array1[i];
        let found = false;
        for (let j = 0; j < array2.length; j++) {
            if (usedIndices.has(j)) continue;
            if (array2[j][0] === a && array2[j][1] === b) {
                found = true;
                usedIndices.add(j);
                break;
            }
        }
        if (!found) {
            unmatchedElements.push(array1[i]);
        }
    }
    return unmatchedElements;
}
