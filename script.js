const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn  = document.querySelector(".copy-btn");
const copyMsg = document.querySelector("[copyMsg]");
const slider = document.querySelector("[data-lengthSlider]");
const lenNum = document.querySelector("[data-lengthNumber]");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".btn");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const allCheck = document.querySelectorAll("input[type=checkbox]");
const circle = document.querySelector(".circle");

const symbols = '`~!@#$%^&*()_+=-[{]}|;:"<,>.?/';

let password = "";
let checkCount = 0;
let passwordLength = 10;
handelSlider();

function handelSlider(){
    slider.value = passwordLength;
    lenNum.innerText = passwordLength;
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
}
function setCircleShadow(color){
    circle.style.boxShadow = "0px 0px 15px "+color;
}

function getRanInt(min,max){
    return Math.floor(Math.random()*(max-min))+ min;
}


function genereateNumber(){
    return getRanInt(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRanInt(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRanInt(65,91));
}
function generateSymboles(){
    const randNum = getRanInt(0,symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasUpper = false
    let hasLower = false
    let hasNumber = false
    let hasSymbol = false

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && hasNumber && hasSymbol && passwordLength >=8){
        setIndicator("#01ff01");
        setCircleShadow("#61e461");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("yellow");
        setCircleShadow("#edf5b5");
    }
    else{
        setIndicator("red");
        setCircleShadow("#e34f4f");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    
    // copyMsg visible hoga
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckCount(){
    checkCount = 0;
    allCheck.forEach((checkBox)=>{
        if(checkBox.checked){
            checkCount++;
        }
    })
}
allCheck.forEach((checkBox)=>{
    checkBox.addEventListener('change',handleCheckCount);
})

function shufflePassword(array){
    for(let i=array.length-1; i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((ele)=> (str+=ele));
    return str;
}


// event listner
slider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handelSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{

    if(passwordLength == 0) return;

    if(passwordLength<=checkCount){
        passwordLength = checkCount;
        handelSlider();
    }


    //main
    password = "";

    const funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numberCheck.checked){
        funcArr.push(genereateNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymboles);
    }

    // For compulsury elements
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaning addition of elements
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRanInt(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    calStrength();



})