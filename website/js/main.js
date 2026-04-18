// Initialize Lenis for smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const tl = gsap.timeline();

  // Initialize dynamic timeline dates
  initDynamicDates();

  // Initial setup for intro animation
  gsap.set(".navbar", { y: -50, opacity: 0 });
  gsap.set(".hero-image", { scale: 1.1, opacity: 0, y: 30 });
  gsap.set(".char", { y: 150, opacity: 0 });
  gsap.set(".title-fg .char", {
    rotationX: -90,
    transformOrigin: "bottom center",
  });
  gsap.set(".hero-tagline", { opacity: 0, y: 20 });
  gsap.set(".feature-item", { opacity: 0, x: 20 });
  gsap.set(".scroll-indicator", { opacity: 0 });

  // 1. Reveal Image
  tl.to(".hero-image", {
    scale: 1,
    opacity: 1,
    y: 0,
    duration: 1.8,
    ease: "power3.out",
  })
    // 2. Animate 'SUNROOF' letters overlapping
    .to(
      ".char",
      {
        y: 0,
        rotationX: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
      },
      "-=1.2",
    )
    // 3. Reveal Tagline
    .to(
      ".hero-tagline",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.6",
    )
    // 4. Reveal Features List sequentially
    .to(
      ".feature-item",
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=0.8",
    )
    // 5. Drop navbar down
    .to(
      ".navbar",
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.6",
    )
    // 6. Fade in scroll indicator
    .to(
      ".scroll-indicator",
      {
        opacity: 1,
        duration: 1,
      },
      "-=0.5",
    );

  // Parallax Scroll Effects

  // The image moves slowly down as you scroll
  gsap.to(".hero-image", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // The foreground letters and overlays move up slightly faster to create 3D depth separation
  gsap.to(".title-fg, .hero-tagline, .features-list", {
    yPercent: -35,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Shutter Effect: Hero physically lifts up its clip-path uncovering the section below
  gsap.to(".hero", {
    clipPath: "inset(0% 0% 100% 0%)",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      pin: true,
      pinSpacing: false,
    },
  });

  // Comparison Section Arrival Animation
  const compTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#comparison-section",
      start: "top 80%", // Start animating slightly before it's fully revealed
      end: "top 20%",
      scrub: 1,
    },
  });

  // Subtle scale down on the images
  compTl
    .from(".comp-img", { scale: 1.1, duration: 2, ease: "power2.out" })
    .from(
      ".comp-title",
      { y: 30, opacity: 0, duration: 1, stagger: 0.2 },
      "-=1.5",
    )
    .from(
      ".comp-vs",
      { scale: 0.5, opacity: 0, rotation: -10, duration: 1 },
      "-=1",
    )
    .from(
      ".comp-subtitle",
      { y: 20, opacity: 0, duration: 1, stagger: 0.2 },
      "-=1",
    )
    .from(
      ".comp-desc",
      { y: 20, opacity: 0, duration: 1, stagger: 0.2 },
      "-=0.8",
    );

  gsap.from(".comp-details > *", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out",
    scrollTrigger: { trigger: "#comparison-section", start: "top -40%" },
  });

  // --- Info Accordion Section Animations ---
  const accScroll = gsap.timeline({
    scrollTrigger: {
      trigger: "#info-accordion-section",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  });

  // Animate the accordion items and buttons appearing with masking effects
  accScroll.from(".acc-item", {
    y: 40, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 0.8, stagger: 0.1, ease: "power3.out"
  })
  .from(".acc-actions", {
    y: 30, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "power3.out"
  }, "-=0.4");

  // Since the first tab is open by default, animate its inner contents fading in on scroll
  accScroll.from(".stage-block", {
    y: 30, opacity: 0, clipPath: "inset(0 0 100% 0)", duration: 0.7, stagger: 0.1, ease: "power3.out"
  }, "-=0.2")
  .from(".split-card", {
    y: 30, opacity: 0, clipPath: "inset(0 0 100% 0)", scale: 0.98, duration: 0.8, stagger: 0.1, ease: "power3.out"
  }, "-=0.4")
  .from(".split-arrow", {
    x: -20, opacity: 0, clipPath: "inset(0 100% 0 0)", duration: 0.6, stagger: 0.1, ease: "power2.out"
  }, "-=0.6");

  // Accordion Toggle Logic (for smooth click dropdowns)
  const accHeaders = document.querySelectorAll(".acc-header");
  accHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const content = item.querySelector(".acc-content");
      const icon = item.querySelector(".acc-icon");
      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        // Close it
        item.classList.remove("is-open");
        icon.textContent = "+";
        content.style.maxHeight = null;
      } else {
        // Close all others first
        document.querySelectorAll('.acc-item').forEach(otherItem => {
          otherItem.classList.remove('is-open');
          otherItem.querySelector('.acc-icon').textContent = '+';
          otherItem.querySelector('.acc-content').style.maxHeight = null;
        });

        // Open this one
        item.classList.add("is-open");
        icon.textContent = "-";
        content.style.maxHeight = content.scrollHeight + "px";

        // Optional: Animate inner text when dropdown opens with masking effect
        const innerContent = content.querySelector('.acc-inner > *:not(.payment-splits-row)');
        if (innerContent) {
           gsap.fromTo(innerContent, 
             { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" }, 
             { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.6, delay: 0.2, ease: "power3.out" }
           );
        }
      }
    });
  });

  // Ensure initially open items have their max-height set so they don't snap closed abruptly
  document.querySelectorAll('.acc-item.is-open .acc-content').forEach(content => {
    content.style.maxHeight = content.scrollHeight + "px";
  });

  // --- French Window Cutout Reveal Animations ---
  const fwTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#fw-reveal-section",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrubbing
    }
  });

  // 1. Expand the cutout mask from center to full screen

  // 2. Expand the cutout mask from center to full screen
  fwTl.to(".fw-cutout", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ease: "power2.inOut" // Starts slow, gets fast, slows down at end
  }, 0);

  // 3. Fade in overlay darken
  fwTl.to(".fw-cutout-overlay", {
    opacity: 1,
    ease: "none"
  }, 0.4); // Starts halfway through the expansion

  // 4. Reveal the product pop-up card halfway through the scroll reveal
  gsap.set(".fw-product-card", { scale: 0.8 });
  fwTl.to(".fw-product-card", {
    opacity: 1,
    scale: 1,
    pointerEvents: "auto",
    ease: "power2.out"
  }, 0.5);

  // Quick JS layout interactivity for Grid Sizes
  const gridOpts = document.querySelectorAll(".grid-opt");
  gridOpts.forEach(opt => {
    opt.addEventListener("click", () => {
      gridOpts.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
    });
  });

  // Counter logic
  const cMinus = document.querySelector(".c-minus");
  const cPlus = document.querySelector(".c-plus");
  const cVal = document.querySelector(".c-val");
  
  if (cMinus && cPlus && cVal) {
    let count = parseInt(cVal.innerText);
    cMinus.addEventListener("click", () => {
      if (count > 1) { count--; cVal.innerText = count; }
    });
    cPlus.addEventListener("click", () => {
      count++; cVal.innerText = count;
    });
  }

  // --- Timeline Section Animations ---
  const timelineTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#timeline-section",
      start: "top 60%", // Start animating when the section is slightly in view
      toggleActions: "play none none reverse",
    },
  });

  // Animate Header
  timelineTl
    .from(".timeline-header h2", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(
      ".timeline-header p",
      { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" },
      "-=0.4",
    );

  // Animate Nodes and Arrows
  const nodes = document.querySelectorAll(".timeline-node");
  const arrows = document.querySelectorAll(".t-arrow");

  nodes.forEach((node, i) => {
    timelineTl.to(
      node,
      { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.2",
    );
    if (arrows[i]) {
      timelineTl.to(
        arrows[i],
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2",
      );
    }
  });

  timelineTl.from(
    ".delivery-notice",
    { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" },
    "-=0.2",
  );

});

/* --- Dynamic Timeline Dates Utility --- */
function initDynamicDates() {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const elements = document.querySelectorAll(".dynamic-date");
  const today = new Date();

  // We base everything off the user's current local date of booking (today)
  elements.forEach((el) => {
    const offsetString = el.getAttribute("data-offset");
    if (offsetString === null) return;

    const offsetDays = parseInt(offsetString, 10);
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + offsetDays);

    const day = targetDate.getDate().toString().padStart(2, "0");
    const month = monthNames[targetDate.getMonth()];
    const year = targetDate.getFullYear();

    el.innerText = `${day} ${month} ${year}`;
  });
}

// =============================================
// App Control Section: Skylight Toggle + Interactivity
// =============================================

function initAppControlSection() {
  const section = document.getElementById('app-control-section');
  if (!section) return;

  // --- GSAP Entrance Animation ---
  const appTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#app-control-section',
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    }
  });

  appTl
    .from('.app-heading', { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power3.out' })
    .from('.app-sub', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
    .from('.iphone-wrap', { y: 60, opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out' }, '-=0.5')
    .from('.accessories-heading', { y: 30, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power3.out' }, '-=0.7')
    .from('.accessories-sub', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
    .from('.acc-product-card', { y: 40, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power3.out' }, '-=0.4');

  // --- Skylight ON/OFF Toggle ---
  const toggleBtn = document.getElementById('skylightToggle');
  const stateWord = document.querySelector('.skylight-state-word');
  const intensityOverlay = document.getElementById('intensityOverlay');
  let isOn = true;

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isOn = !isOn;
      if (isOn) {
        section.classList.remove('skylight-off');
        section.classList.add('skylight-on');
        toggleBtn.classList.remove('off');
        if (stateWord) stateWord.textContent = 'ON';
        // Restore intensity overlay to current slider value
        const currentVal = document.getElementById('intensityRange')?.value || 60;
        if (intensityOverlay) {
          intensityOverlay.style.background = `rgba(0,0,0,${(100 - currentVal) / 250})`;
        }
      } else {
        section.classList.remove('skylight-on');
        section.classList.add('skylight-off');
        toggleBtn.classList.add('off');
        if (stateWord) stateWord.textContent = 'OFF';
        // Darken the overlay heavily when off
        if (intensityOverlay) {
          intensityOverlay.style.background = 'rgba(0,0,0,0.75)';
        }
      }
    });
  }

  // --- Intensity Slider: Controls overlay darkness over the whole section ---
  const intensityRange = document.getElementById('intensityRange');
  const intensityFill = document.getElementById('intensityFill');

  if (intensityRange && intensityFill) {
    intensityRange.addEventListener('input', () => {
      const val = parseInt(intensityRange.value);
      intensityFill.style.width = val + '%';

      // darken the whole section via the overlay (subtract from brightness)
      // At 100% intensity: overlay transparent. At 0%: nearly opaque
      if (intensityOverlay && isOn) {
        const darkness = (100 - val) / 200; // max 0.5 darkness
        intensityOverlay.style.background = `rgba(0,0,0,${darkness})`;
      }

      // Phone glow tracks intensity
      const phoneGlow = document.getElementById('phoneGlow');
      if (phoneGlow && isOn) {
        const opacity = 0.15 + (val / 100) * 0.75;
        gsap.to(phoneGlow, { opacity, duration: 0.2, ease: 'power1.out' });
      }

      // Color wheel glow
      const wheel = document.querySelector('.color-wheel-ring');
      if (wheel) {
        const glowOpacity = (val / 100) * 0.5;
        wheel.style.boxShadow = `0 0 ${15 + val / 4}px rgba(255,200,80,${glowOpacity})`;
      }
    });
  }

  // --- Mode Buttons ---
  const modeBtns = document.querySelectorAll('.mode-btn');
  const colorMap = {
    'Darkout': { fill: 'linear-gradient(90deg, #111, #333)', glow: 'rgba(80,80,200,0.3)' },
    'Day':     { fill: 'linear-gradient(90deg, #4a6aff, #a0c0ff)', glow: 'rgba(100,150,255,0.4)' },
    'Sunbeam': { fill: 'linear-gradient(90deg, #555, #ebb952)', glow: 'rgba(255,200,80,0.4)' },
    'Auto':    { fill: 'linear-gradient(90deg, #3a2a70, #ebb952)', glow: 'rgba(200,150,255,0.3)' }
  };

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const modeName = btn.querySelector('span:last-child').textContent;
      const palette = colorMap[modeName];
      if (palette && intensityFill) {
        intensityFill.style.background = palette.fill;
        const wheel = document.querySelector('.color-wheel-ring');
        if (wheel) wheel.style.boxShadow = `0 0 25px ${palette.glow}`;
      }
    });
  });

  // Grid opt selector
  const gridOpts2 = document.querySelectorAll('.grid-opt');
  gridOpts2.forEach(opt => {
    opt.addEventListener('click', () => {
      gridOpts2.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // --- Patent Section Entrance ---
  gsap.timeline({
    scrollTrigger: {
      trigger: '#patent-section',
      start: 'top 65%',
      toggleActions: 'play none none reverse'
    }
  })
    .from('.patent-drawing-card', {
      x: -60, opacity: 0, duration: 1.1, ease: 'power3.out'
    })
    .from('.patent-eyebrow', {
      y: 20, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'power3.out'
    }, '-=0.7')
    .from('.patent-heading', {
      y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power3.out'
    }, '-=0.6')
    .from('.patent-body', {
      y: 20, opacity: 0, stagger: 0.15, duration: 0.7, ease: 'power2.out'
    }, '-=0.6')
    .from('.patent-download-btn', {
      y: 20, opacity: 0, duration: 0.7, ease: 'back.out(2)'
    }, '-=0.4');
}

// Call the new section initializer
initAppControlSection();


