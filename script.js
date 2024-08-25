const range = document.querySelector('input[type="range"]');

const handleRangeColor = (e) => {
    console.log("position: ", e.target.value, e.target.max);
    const position = (e.target.value*100)/e.target.max;
    range.style.background = `linear-gradient(90deg, rgba(164,255,175,1) 0%, rgba(164,255,175,1) ${position}%, rgba(24,23,31,1) ${position}%)`;
}

range.addEventListener('input', (e)=>{
    handleRangeColor(e);
})