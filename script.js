// SLIDER
var isDraggable = false;
var slider = document.getElementById("slider"),
  sliderItems = document.getElementById("slides"),
  prev = document.getElementById("prev"),
  next = document.getElementById("next");

function slide(wrapper, items, prev, next) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    posFinal,
    threshold = 10,
    slides = items.getElementsByClassName("slide"),
    slidesLength = slides.length,
    slideSize = items.getElementsByClassName("slide")[0].offsetWidth,
    firstSlide = slides[0],
    secondSlide = slides[1],
    penutlimateSlide = slides[slidesLength - 2],
    lastSlide = slides[slidesLength - 1],
    cloneFirst = firstSlide.cloneNode(true),
    cloneSecond = secondSlide.cloneNode(true),
    clonePenultimate = penutlimateSlide.cloneNode(true),
    cloneLast = lastSlide.cloneNode(true),
    index = 0,
    allowShift = true;
  var timeout;

  // Clone first and last slide
  items.appendChild(cloneFirst);
  items.appendChild(cloneSecond);
  items.insertBefore(cloneLast, firstSlide);
  items.insertBefore(clonePenultimate, cloneLast);
  wrapper.classList.add("loaded");

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener("touchstart", dragStart);
  items.addEventListener("touchend", dragEnd);
  items.addEventListener("touchmove", dragAction);

  // Click events
  prev.addEventListener("click", function () {
    shiftSlide(-1);
  });
  next.addEventListener("click", function () {
    shiftSlide(1);
  });

  // Transition events
  items.addEventListener("transitionend", checkIndex);

  advance();

  function advance() {
    clearTimeout(timeout);

    timeout = setInterval(() => {
      shiftSlide(1);
    }, 3000);
  }

  function dragStart(e) {
    e = e || window.event;
    e.preventDefault();
    posInitial = items.offsetLeft;

    if (e.type === "touchstart") {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type === "touchmove") {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    items.style.left = items.offsetLeft - posX2 + "px";
    isDraggable = true;
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, "drag");
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, "drag");
    } else {
      items.style.left = posInitial + "px";
      isDraggable = false;
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

  function shiftSlide(dir, action) {
    items.classList.add("shifting");

    if (allowShift) {
      if (!action) {
        posInitial = items.offsetLeft;
      }

      if (dir === 1) {
        items.style.left = posInitial - slideSize + "px";
        index++;
      } else if (dir === -1) {
        items.style.left = posInitial + slideSize + "px";
        index--;
      }
    }

    allowShift = false;
    advance();
  }

  function checkIndex() {
    items.classList.remove("shifting");
    isDraggable = false;

    if (index === -1) {
      items.style.left = -(slidesLength * slideSize) + "px";
      index = slidesLength - 1;
    }

    if (index === slidesLength) {
      items.style.left = -(1 * slideSize) + "px";
      index = 0;
    }

    allowShift = true;
  }
}

slide(slider, sliderItems, prev, next);

// LIGHTBOX

const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

const images = document.querySelectorAll(".slides > span > img");
images.forEach(function (image, index) {
  image.addEventListener("click", (e) => {
    if (!isDraggable) {
      lightbox.classList.add("active");
      const img = document.createElement("img");
      img.setAttribute("src", "");
      const prev = document.createElement("button");
      prev.classList.add("prev");
      prev.innerHTML = '<i class="fas fa-chevron-left">';
      prev.addEventListener("click", () => {
        img.src = images[index - 1].src;
        index = index - 1;
        if (index === 0) {
          index = images.length;
          img.src = images[index].src;
        }
      });
      const next = document.createElement("button");
      next.classList.add("next");
      next.innerHTML = '<i class="fas fa-chevron-right">';
      next.addEventListener("click", () => {
        img.src = images[index + 1].src;
        index = index + 1;
        if (index === images.length - 1) {
          index = 0;
          img.src = images[index].src;
        }
      });
      img.src = image.src;
      while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild);
      }
      lightbox.appendChild(img);
      lightbox.appendChild(prev);
      lightbox.appendChild(next);
    } else {
      return;
    }
  });
});

lightbox.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) return;
  lightbox.classList.remove("active");
});
