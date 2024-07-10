const args = [1, 2];
const expected = 3;
const fn = `
function sum(a, b) {
    return a + b;
}

sum(${args.join(', ')});
`;



console.log(eval(fn));
