document.addEventListener("DOMContentLoaded", function () {
  let percent = 0;
  const interval = setInterval(() => {
    percent++;
    document.querySelector("#percent").innerText = percent + "%";
    document.querySelector(".progress-fill").style.width = percent + "%";

    if (percent >= 100) {
      clearInterval(interval);

      const preloader = document.getElementById("preloader");
      preloader.style.opacity = 0;

      // Wait for the fade-out to complete before hiding the element
      setTimeout(() => {
        preloader.style.display = "none";
        document.getElementById("main-content").style.display = "block";
      }, 600);
    }
  }, 30);

  Fancybox.bind('[data-fancybox="cert"]', {
    dragToClose: false, 
  });

  const lenis = new Lenis({
    smooth: 5,
    lerp: 0.05,
    scrub: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Handle window resize
  function handleResize() {
    ScrollTrigger.refresh(); 
    lenis.resize(); 
  }

  window.addEventListener("resize", () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(handleResize, 200); 
  });

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const elements = document.querySelectorAll(".js-fade-up");
  elements.forEach((element) => {
    gsap.from(element, {
      autoAlpha: 0,
      y: 10,
      ease: "power1.inOut",
      duration: 0.6,
      scrollTrigger: {
        trigger: element,
        start: "top 70%",
        toggleActions: "play none none reset",
      },
    });
  });

  // Staggered Animation
  document.querySelectorAll(".js-staggered").forEach((elem) => {
    gsap.from(elem.querySelectorAll(":scope > *"), {
      autoAlpha: 0,
      y: 30,
      ease: "power1.inOut",
      stagger: 0.2,
      scrollTrigger: {
        trigger: elem,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // bg change colors
  // gsap.set("body", { backgroundColor: "#01010e" });
  // document.querySelectorAll("section").forEach(sectionColor => {
  //   let color = sectionColor.dataset.color;

  //   ScrollTrigger.create({
  //     trigger: sectionColor,
  //     start: "top center",
  //     end: "bottom center",
  //     onEnter: () => gsap.to("body", { backgroundColor: color, duration: 0.5 }),
  //     onEnterBack: () => gsap.to("body", { backgroundColor: color, duration: 0.5 }),
  //   });
  // });

  const btnContact = document.querySelector('.btn-contact');
  const leftArm = document.querySelector('.left-arm');
  const godsArm = document.querySelector('.gods-arm');
  const btnParent = btnContact.parentElement;

  btnContact.addEventListener('mouseenter', () => {
    leftArm.style.filter = 'none';
    godsArm.style.filter = 'none';
    btnParent.style.transform = 'scale(1.1)';
  });

  btnContact.addEventListener('mouseleave', () => {
    btnParent.style.transform = 'scale(1)';
    leftArm.style.filter = 'grayscale(100%)';
    godsArm.style.filter = 'grayscale(100%)';
  });

  const contactSection = document.querySelector(".contact-section");

  // Determine the start position based on screen width
  const isMediumScreen = window.innerWidth <= 769;
  const scrollStart = isMediumScreen ? "top center" : "top 40%";
  
  const contactTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: contactSection,
      start: scrollStart,
      toggleActions: "play none none reverse",
    }
  });  

  contactTimeline.to(contactSection, { opacity: 1, duration: 0.5 });

  // Animate arms
  contactTimeline.from(leftArm, {
    x: "-100%",
    opacity: 0,
    duration: 1,
    ease: "power2.inOut"
  }, "<"); 

  contactTimeline.from(godsArm, {
    x: "100%",
    opacity: 0,
    duration: 1,
    ease: "power2.inOut"
  }, "<"); 
});

let scrollTween;
// Horixontal scroll stories
function setupHorizontalScroll() {
  // Kill previous scroll animations and triggers
  if (scrollTween) {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    scrollTween.kill();
  }
  const panels = gsap.utils.toArray(".collections-card");
  const horizontalWrapper = document.querySelector(".horizontal-wrapper");
  const totalScroll = horizontalWrapper.scrollWidth - window.innerWidth;
  
  const isMobile = window.innerWidth < 768;
	const scrollStart = isMobile ? "top 15%" : "top top";
  scrollTween = gsap.to(horizontalWrapper, {
    x: () => `-${totalScroll}px`,
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-scroll-section",
      start: scrollStart,
      end: () => `+=${totalScroll}`,
      pin: true,
      scrub: true,
      //markers: true, 
      anticipatePin: 1,
      onUpdate: () => {
        const centerX = window.innerWidth / 2;
        let closestPanel = null;
        let minDistance = Infinity;
        panels.forEach(panel => {
          const rect = panel.getBoundingClientRect();
          const panelCenter = rect.left + rect.width / 2;
          const distance = Math.abs(panelCenter - centerX);
          if (distance < minDistance) {
            minDistance = distance;
            closestPanel = panel;
          }
        });

        panels.forEach(panel => {
          const isActive = panel === closestPanel;
          panel.classList.toggle("active", isActive);
        });
      },
      onLeaveBack: () => {
        // Remove active class from all panels when scrolling past the section
        panels.forEach(panel => {
          panel.classList.remove("active");
        });
      }
    }
  });
  
  ScrollTrigger.refresh();
}

// Text reveal
let revealTriggers = [];

function initRevealTextAnimation() {
  revealTriggers.forEach(trigger => trigger.kill());
  revealTriggers = [];

  const isMobile = window.innerWidth <= 768;

  document.querySelectorAll(".reveal-text").forEach((el) => {
    // Reset text to original if it was already split
    if (!el.dataset.originalHtml) {
      el.dataset.originalHtml = el.innerHTML;
    } else {
      el.innerHTML = el.dataset.originalHtml;
    }

    // Use SplitText to split into words
    const split = new SplitText(el, {
      type: "words",
      wordsClass: "split-word"
    });

    // Apply initial styles to words
    gsap.set(split.words, {
      opacity: 0,
      display: "inline-block",
      webkitMaskImage: "linear-gradient(90deg, #fff 33.3%, rgba(255,255,255,.1) 66.6%)",
      maskImage: "linear-gradient(90deg, #fff 33.3%, rgba(255,255,255,.1) 66.6%)",
      webkitMaskPosition: "100% 100%",
      maskPosition: "100% 100%",
      webkitMaskSize: "300% 100%",
      maskSize: "300% 100%",
      transition: "mask-position .5s ease-in-out, opacity .2s ease-in-out",
    });

    const animationElements = [...split.words];

    // If there's a `.window` child (e.g., images), handle that as well
    el.querySelectorAll(".window").forEach((node) => {
      if (!isMobile) {
        const img = node.querySelector("img");
        if (img) {
          gsap.set(img, { clipPath: "inset(0 50% 0 50%)", opacity: 0 });
          animationElements.push(img);
        }
      }
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        end: "bottom 70%",
        scrub: true,
        invalidateOnRefresh: true,
        // markers: true,
      }
    });

    animationElements.forEach((animEl, i) => {
      if (animEl.tagName === "IMG") {
        timeline.to(animEl, {
          clipPath: "inset(0 0% 0 0%)",
          opacity: 1,
          duration: 0.8,
        }, i * 0.2);
      } else {
        timeline.to(animEl, {
          opacity: 1,
          webkitMaskPosition: "0 100%",
          maskPosition: "0 100%",
          duration: 0.8,
        }, i * .5);
      }
    });

    revealTriggers.push(timeline.scrollTrigger);
  });

  ScrollTrigger.refresh();
}

initRevealTextAnimation();
setupHorizontalScroll();

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    setupHorizontalScroll();
    initRevealTextAnimation();
    ScrollTrigger.refresh();
  }, 200);
});

document.addEventListener("DOMContentLoaded", function () {
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const sideMenu = document.querySelector('.menu');
  let menuOpen = false;

  const animation = lottie.loadAnimation({
    container: hamburgerIcon,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: 'https://cdn.prod.website-files.com/680883bf197fced5bb5d69db/68142aea2632afc8c8326e67_6bbc5df70054f4c271265a76821d91c0_hamburger.json'
  });

  animation.setSpeed(3);

  function closeMenu() {
    animation.setDirection(-1);
    animation.play();
    sideMenu.style.opacity = "0";
    sideMenu.style.visibility = "hidden"
    menuOpen = false;
  }

  hamburgerIcon.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent click from bubbling to document
    if (menuOpen) {
      closeMenu();
    } else {
      animation.setDirection(1);
      animation.play();
      sideMenu.style.opacity = "1";
      sideMenu.style.visibility = "visible"
      menuOpen = true;
    }
  });

  // Close menu if clicked outside
  document.addEventListener('click', function (event) {
    const isClickInsideMenu = sideMenu.contains(event.target);
    const isClickOnIcon = hamburgerIcon.contains(event.target);

    if (menuOpen && !isClickInsideMenu && !isClickOnIcon) {
      closeMenu();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const interBubble = document.querySelector('.interactive');
  let curX = 0;
  let curY = 0;
  let tgX = 0;
  let tgY = 0;

  function move() {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    requestAnimationFrame(move);
  }

  window.addEventListener('mousemove', (event) => {
    tgX = event.clientX;
    tgY = event.clientY;
  });

  move();
});