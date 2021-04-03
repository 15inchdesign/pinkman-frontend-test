//show and hide dropdown sub-items on dropdown click
function show_hide() {
    var click = document.getElementById('sub-items');
    if (click.style.display === 'none') {
        click.style.display = 'block';
    } else {
        click.style.display = 'none';
    }
}

//Init swiper 
var swiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
    },
});

console.log("Hello \n" + Date());
