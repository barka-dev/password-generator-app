const range = document.querySelector('input[type="range"]');
const label_for_check = document.querySelectorAll('.label_for_check');

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
})