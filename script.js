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
    if(nb_characters <= 0){
        alert("Chars length should be more than ZERO");
        return;
    }

    let pw;
    do{
        pw = Array.from({length:nb_characters},()=>{
            const random_index = Math.floor(Math.random()*characters.length);
            return characters[random_index];
        }).join('');

    }while(!pattern.test(pw));
    return pw;
}

const escapeRegexCharacters = (chars_list)=>{
    return chars_list.map(symbol => symbol.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('');
}

const createCharsList = (data)=>{
    const charMap = {
        'uppercase': uppercase,
        'lowercase': lowercase,
        'numbers': numbers,
        'symbols': symbols
    };
    let characters_list = [];
    data.pw_params.forEach((param)=>{
        characters_list.push(...charMap[param]);
    });
    return characters_list;
}

const buildRegex = (data)=>{
    const regexPattern = {
        'uppercase': '(?=.*[A-Z])',
        'lowercase': '(?=.*[a-z])',
        'numbers': '(?=.*[0-9])',
        'symbols': `(?=.*[${escapeRegexCharacters(symbols)}])`
    }
    const pattern = `^${data.pw_params.map(param=>regexPattern[param] || '').join('')}.*$`;
    return new RegExp(pattern);
}

const complexityLevel = (data, password)=>{
    const isUppercase = uppercase.some(item => password.includes(item));
    const isLowercase = lowercase.some(item => password.includes(item));
    const isNumber = numbers.some(item => password.includes(item));
    const isSymbol = symbols.some(item => password.includes(item));

    const charType = [isUppercase, isLowercase, isNumber, isSymbol ].filter(Boolean).length;
    if(data.char_length<6 || (charType === 1 && !isSymbol)){
        return "too_weak";
    }

    if((data.char_length>=6 && data.char_length<8) || (charType === 2 && !isSymbol)){
        return "weak";
    }

    if((data.char_length>=8 && data.char_length<12 && charType >= 3) || (data.char_length>=12 && charType >= 3 && !isSymbol)){
        const symbolCount = [...password].filter(char => symbols.includes(char)).length;
        if(symbolCount <= 3){
            return "medium";
        }
    }
    return "strong";
}

const changeLevelColor = (strength_level)=>{
    const levels = ['too_weak','weak','medium','strong'];
    const index = levels.indexOf(strength_level);

    level.forEach((element, i)=>{
        element.classList.remove(...levels);
        if(i<=index){
            element.classList.add(strength_level);
        }
    })
}

const changeLevelLabel = (level)=>{
    const labels = {
        "too_weak": "too weak!",
        "weak": "weak",
        "medium": "medium",
        "strong": "strong"
    };

    if(labels[level]){
        strength_level.textContent = labels[level];
    }else{
        console.log("something went wrong");
        alert("something went wrong");
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    pw_generated.value = '';
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

