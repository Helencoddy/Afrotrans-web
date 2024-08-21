'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const section1 = document.querySelector('#section--1');
const head = document.querySelector('.header');


const openModal = function (e) {
  e.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};



btnsOpenModal.forEach(function(btn){
  btn.addEventListener('click', openModal);
});
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//.insertAdjacentHTML
const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');

//message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie"> Got it! </button>';
header.append(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function(){
    message.remove();
});
message.style.backgroundColor = '#37383d'


btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  //scrolling
  section1.scrollIntoView({behavior: 'smooth'});
})


//Page navigation
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  //Matching strategy
  if(e.target.classList.contains('nav__link')){

    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})


//Tabbed Component

tabsContainer.addEventListener('click', function(e){
  e.preventDefault();

  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if(!clicked) return;

  //Remove active classes
  tabs.forEach(function(t){
    t.classList.remove('operations__tab--active');
  });
  tabsContent.forEach(function(c){
    c.classList.remove('operations__content--active');
  });

  clicked.classList.add('operations__tab--active');

  //Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


//MAKING THE CLICKED NAVIGATION FADE
nav.addEventListener('mouseover', function(e){
  //e.preventDefault();
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(function(el){
      if (el !== link) el.style.opacity = 0.5;
    });
    logo.style.opacity = 0.5;
  }
})

nav.addEventListener('mouseout', function(e){
  //e.preventDefault();
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(function(el){
      if (el !== link) el.style.opacity = 1;
    });
    logo.style.opacity = 1;
  }
});

//sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function(){

//   if(window.scrollY > initialCoords.top) nav.classList.add('sticky')
//     else nav.classList.remove('sticky')
// });

//THE INTERSECTION OBSERVER API TO IMPLEMENT STICKY HEADER

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting)nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headObserver = new IntersectionObserver(stickyNav, {
  root:null,
  threshold:0,
  rootMargin: `-${navHeight}px`,
});

headObserver.observe(head);

//Reveal element as you scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
  const [entry] = entries;
  
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver
(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
})

//LAZY IMAGE LOADING
const imgTarget = document.querySelectorAll('img[data-src]');
console.log(imgTarget);

const loadImg = function(entries, observer){
  const [entry] = entries
  if(!entry.isIntersecting) return;
  //Replace Src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
} );

imgTarget.forEach(function(img){
  imgObserver.observe(img);
})


//slider
const slides = document.querySelectorAll('.slide');
const slider =  document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');


let currSlide = 0;
const maxSlide = slides.length;

// slider.style.transform = 'scale(0.3) translateX(-800px)';
// slider.style.overflow = 'visible'

//This puts all the slides side by side
slides.forEach(function(s, i){
  s.style.transform = `translateX(${100 * i}%)`
}); 
//0%, 100%, 200%, 300% 

const goToSlide = function(slide){
  slides.forEach(function(s, i){
    s.style.transform = `translateX(${100 * (i - slide)}%)`
  });
}


const nextSlide =  function(){
  if(currSlide === maxSlide - 1){
    currSlide = 0 
  } else{
    currSlide++;
  }
  goToSlide(currSlide);
  activateDot(currSlide)
}

const prevSlide = function(){
  if(currSlide === 0){
    currSlide = maxSlide - 1;
  } else{
    currSlide--;
  }
  goToSlide(currSlide);
  activateDot(currSlide)
}

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function(e){
  console.log(e);
  if(e.key === 'ArrowLeft') prevSlide();
  if(e.key === 'ArrowRight') nextSlide();
})

//Dot secton
const createDots = function(){
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"> </button>`);
  })
}
createDots();

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(function(dot){
    dot.classList.remove('dots__dot--active')

    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
  })
}
activateDot(0);

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide)
  }
});




























// const h1 = document.querySelector('h1');

// const alertH1 = function(e){
//   alert('addEventListener: Great! You are reading the heading :D')

//   h1.removeEventListener('mouseenter', alertH1)
// }
// h1.addEventListener('mouseenter', alertH1)




// const links = document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     //console.log('LIKER')
//     e.preventDefault()
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   });
// });

// document.querySelector('.nav__links').addEventListener('click', function(e){
//   e.preventDefault();

//   if(e.target.classList.contains('nav__link')){
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   }
// })

// const he1 = document.querySelector('h1');

// //Going downwards: Selecting Child element
// console.log(he1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// he1.firstElementChild.style.color = 'white';
// he1.lastElementChild.style.color = 'blue';

// //Going upward: Parents
// console.log(he1.parentNode);
// console.log(he1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)'; 
// he1.closest('h1').style.background = 'var(--gradient-primary)';