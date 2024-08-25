const range = document.querySelector('input[type="range"]');
const label_for_check = document.querySelectorAll('.label_for_check');
const char_length_display = document.querySelector('#char_length_display');
const copy_icon = document.querySelector('#copy_icon');
const copy_msg = document.querySelector('#copy_msg');
const pw_generated = document.querySelector('#pw_generated');

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