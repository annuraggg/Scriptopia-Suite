const createCTemplate = (scl: any) => {
    console.log(scl);
    const sclWithoutReturn = scl.filter((scl) => scl.type !== "return");
    const finalStatement = [];
    const inputNames = sclWithoutReturn.map((scl) => scl.name);
    const returnType = sclWithoutReturn.find((scl) => scl.type === "return");
    let finalReturn = ""
    if (returnType === "array") {
        finalReturn = 
    } else {
        finalReturn = returnType.type
    }

export default createCCode;
