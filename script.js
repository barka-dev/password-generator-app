const range = document.querySelector('input[type="range"]');
const label_for_check = document.querySelectorAll('.label_for_check');
const char_length_display = document.querySelector('#char_length_display');
const copy_icon = document.querySelector('#copy_icon');
const copy_msg = document.querySelector('#copy_msg');
const pw_generated = document.querySelector('#pw_generated');
const form = document.querySelector('#form');
const level = document.querySelectorAll(".level");
const strength_level = document.querySelector("#strength_level");

const uppercase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const lowercase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '|', '\\', ':', ';', '"', '\'', '<', '>', ',', '.', '?', '/', '`', '~'];


const toggleCheck = (e) => {
    e.target.classList.toggle('checked');
}

label_for_check.forEach((label)=>{
    label.addEventListener('click', (e)=>{
        toggleCheck(e);
    })
})

const handleRangeColor = (e) => {
    const position = (e.target.value*100)/e.target.max;
    range.style.background = `linear-gradient(90deg, rgba(164,255,175,1) 0%, rgba(164,255,175,1) ${position}%, rgba(24,23,31,1) ${position}%)`;
}


range.addEventListener('input', (e)=>{
    handleRangeColor(e);
    char_length_display.textContent = e.target.value;
});

const showCopyMsg = () =>{
    copy_msg.classList.add('show_msg');
    setTimeout(()=>{
        copy_msg.classList.remove('show_msg');
    }, 1000);
}

const copyToClipboard = (text, showMsg) =>{
    navigator.clipboard.writeText(text)
    .then(()=>{
        showMsg();
    })
    .catch(err => {
        console.error('Failed to copy text: ', err);
    })
}

copy_icon.addEventListener('click', ()=>{
    const pw = pw_generated.value;
    if(pw!==""){
        copyToClipboard(pw, showCopyMsg);
    } 
 
});

const fetchData = (form) =>{
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key)=>{
        if(key === 'pw_params'){
            if(data[key]){
                data[key].push(value);
            }else{
                data[key] = [value];
            }
        }else{
            data[key] = value;
        }    
    })
    return data;
}

const generatePassword = (nb_characters, characters, pattern)=>{
    let pw = '';
    if(nb_characters>0){
        do{
            pw = '';
            for (let i = 0; i < nb_characters; i++) {
                const random_index = Math.floor(Math.random()*characters.length);
                pw += characters[random_index];
            }
        }while(!pattern.test(pw));
        return pw;
    }else{
        alert("Chars length should be more than ZERO");
    }
   
    
}

const escapeRegexCharacters = (chars_list)=>{
    return chars_list.map(symbol => symbol.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('');
}

const createCharsList = (data)=>{
    let characters_list = [];
    data.pw_params.forEach((param)=>{
        if(param === 'uppercase'){
            characters_list.push(...uppercase);
        }else if (param === 'lowercase'){
            characters_list.push(...lowercase);
        }else if (param === 'numbers'){
            characters_list.push(...numbers);
        }else if (param === 'symbols'){
            characters_list.push(...symbols);
        }  
    });
    return characters_list;
}

const buildRegex = (data)=>{
    let pattern = `^`;
    data.pw_params.forEach((param)=>{
        if(param === 'uppercase'){
            pattern += '(?=.*[A-Z])';
        }else if (param === 'lowercase'){
            pattern += '(?=.*[a-z])';
        }else if (param === 'numbers'){
            pattern += '(?=.*[0-9])';
        }else if (param === 'symbols'){
            const escapedChars = escapeRegexCharacters(symbols);
            pattern += `(?=.*[${escapedChars}])`;
        }
    });
    pattern += '.*$';
    const regex = new RegExp(pattern);
    return regex;
}

const complexityLevel = (data, password)=>{
    const isUppercase = uppercase.some(item => password.includes(item));
    const isLowercase = lowercase.some(item => password.includes(item));
    const isNumber = numbers.some(item => password.includes(item));
    const isSymbol = symbols.some(item => password.includes(item));

    if(data.char_length<6 || (!isSymbol && (isUppercase+isLowercase+isNumber+isSymbol) === 1)){
        return "too_weak";
    }else if ((data.char_length>=6 && data.char_length<8 && !isSymbol && !isNumber) || ((isUppercase+isLowercase+isNumber) === 2)){
        return "weak";
    }else if (data.char_length>=8 && data.char_length<12 && isSymbol && isNumber && (isUppercase+isLowercase) >= 1 ){
        const result = [];
        for (let char of password){
            if(symbols.includes(char)){
                result.push(char);
            }
        }
        if(result.length <=3){
            return "medium";
        }else{
            return "strong";
        }
    }else{
        return "strong";
    }
}

const changeLevelColor = (strength_level)=>{
    level.forEach((element)=>{
        element.classList.remove('too_weak');
        element.classList.remove('weak');
        element.classList.remove('medium');
        element.classList.remove('strong');
    });
    let index = 0;
    if(strength_level === "too_weak"){
        index = 1;
    }else if(strength_level === "weak"){
        index = 2;
    }else if(strength_level === "medium"){
        index = 3;
    }else if(strength_level === "strong"){
        index = 4;
    }else{
        console.log("something went wrong");
        alert("something went wrong");
    }

    for(let i=0 ; i<index ; i++){
        level[i].classList.add(strength_level);
    }
}

const changeLevelLabel = (level)=>{
    if(level === "too_weak"){
        strength_level.textContent = "too weak!";
    }else if(level === "weak"){
        strength_level.textContent = "weak";
    }else if(level === "medium"){
        strength_level.textContent = "medium";
    }else if(level === "strong"){
        strength_level.textContent = "strong";
    }else{
        console.log("something went wrong");
        alert("something went wrong");
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const isChecked = document.querySelector("input[type='checkbox']:checked");
    const data = fetchData(form);
    if(data.char_length >=4){
        if(isChecked){
            const chars_list = createCharsList(data);
            const regex_pattern = buildRegex(data);
            const result = generatePassword(data.char_length, chars_list, regex_pattern);
            pw_generated.value = result;
            const strength_level = complexityLevel(data, result);
            changeLevelLabel(strength_level);
            changeLevelColor(strength_level);
        }else{
            alert('You must select at least one type of character to be included in the generated password.');
        }
    }else{
        alert('Your Character Length must be more more than 4 characters.');
    }  
});

