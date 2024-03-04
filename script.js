const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];
// console.log(carouselChildrens);
// console.log(wrapper);

// Get the numbers of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to begining of carousel for infinte scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});
// console.log(carouselChildrens);
// Insert copies of the last few cards to end of carousel for infinte scrolling
carouselChildrens.slice(0,cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});


let isDragging = false , startX, startScrollLeft, timeoutId;

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn =>{
    btn.addEventListener("click",() =>{
        // console.log(btn.id);
        carousel.scrollLeft += btn.id ==="left" ? -firstCardWidth : firstCardWidth;
        // console.log(carousel.scrollLeft);
    })
});


const dragStart = (e) =>{
    isDragging = true;
    carousel.classList.add("dragging");
     // Records the initial cursor and scroll position of the carousel
     startX = e.pageX;
     // console.log(startX);
     startScrollLeft = carousel.scrollLeft;
     // console.log(startScrollLeft);
}

const dragging = (e) =>{
    // console.log(e.pageX);
    if(!isDragging) return;  //if isDragging is flase return from here
    // updates the scroll position of the carousel based on the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
   
}

const dragStop = () =>{
    isDragging = false;
    carousel.classList.remove("dragging");
}

const autoPlay = () =>{
    if(window.innerWidth < 800) return; // Reuturn if window is smaller than 800
    // Autoplay the carousel after every 2500ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

const infiniteScroll = () =>{
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0){
        // console.log("You've reached to the left end");
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - ( 2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");

    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth){
        // console.log("You've reached to the right end");
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");

    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

carousel.addEventListener("mousedown",dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup",dragStop);
carousel.addEventListener("scroll", infiniteScroll);
carousel.addEventListener("mouseenter", () => clearTimeout(timeoutId));
carousel.addEventListener("mouseleave", autoPlay);