# Sunroof Project: Section 2 Implementation Prompt

This file contains a comprehensive "Oneshot Prompt" designed to be given to an AI agent to implement the second section of the Sunroof website.

---

# THE ONESHOT PROMPT

**Task**: Implement "Sunroof" Section 2 - Bionic Light Showcase

You are a Senior Frontend Creative Developer. Your goal is to implement the SECOND section of the Sunroof website, following the existing high-end, cinematic aesthetic. This section takes over after the first "Nature Isolation" scrollytelling section ends.

## THE DESIGN CONCEPT
- **Title**: Bionic Light Engine
- **Narrative**: Transition from the "problem" of nature isolation to the "solution" of advanced engineering.
- **Visuals**: A second sticky canvas scrollytelling player. As the user scrolls, the device (ATMOS) illuminates or rotates (using the 244-frame folder).
- **Atmosphere**: Deep Midnight Background (#0c0c0c) transitioning to a warm Golden Hour glow as the light "turns on."

## THE ASSETS
- **Frames Folder**: [INSERT YOUR FOLDER NAME HERE]
- **Frame Count**: 244 frames
- **Dependencies**: GSAP, ScrollTrigger, Lenis (already in project)

## IMPLEMENTATION REQUIREMENTS

### 1. HTML STRUCTURE
Add this section immediately after the existing `#scrolly-section`:

```html
<section id="showcase-section">
    <div class="sticky-wrapper">
        <canvas id="showcase-canvas"></canvas>
        <div class="showcase-content">
            <div class="feature-tag">
                <span class="tag-label">The Engineering</span>
                <h2 class="feature-title">Bionic Light Engine</h2>
                <p class="feature-desc">Engineered to simulate the full spectrum of natural daylight, from the crisp blue of dawn to the deep amber of dusk.</p>
            </div>
            
            <div class="specs-grid">
                <div class="spec-item">
                    <span class="spec-val">99%</span>
                    <span class="spec-label">CRI Accuracy</span>
                </div>
                <div class="spec-item">
                    <span class="spec-val">10k+</span>
                    <span class="spec-label">Lumens</span>
                </div>
                <div class="spec-item">
                    <span class="spec-val">0.1s</span>
                    <span class="spec-label">Response Time</span>
                </div>
            </div>
        </div>
        <div class="bottom-gradient"></div>
    </div>
</section>
```

### 2. CSS STYLING (Append to style.css)
Ensure visual consistency with the Outfit and Inter font families.

```css
#showcase-section {
    position: relative;
    height: 600vh; /* Long scroll for 244 frames */
    background-color: #0c0c0c;
    color: white;
    z-index: 5;
}

#showcase-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.showcase-content {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    padding: 6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.feature-tag {
    max-width: 550px;
    opacity: 0;
    transform: translateX(-60px);
}

.tag-label {
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 0.85rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    display: block;
    font-weight: 600;
}

.feature-title {
    font-family: var(--font-heading);
    font-size: clamp(3rem, 6vw, 5rem);
    margin-bottom: 2rem;
    line-height: 1;
    font-weight: 500;
}

.feature-desc {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    font-weight: 300;
}

.specs-grid {
    position: absolute;
    bottom: 6rem;
    right: 6rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5rem;
    opacity: 0;
    transform: translateY(60px);
}

.spec-item {
    display: flex;
    flex-direction: column;
}

.spec-val {
    font-size: 3rem;
    font-weight: 500;
    font-family: var(--font-heading);
    color: var(--primary-color);
}

.spec-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 0.5rem;
}

.bottom-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20vh;
    background: linear-gradient(to top, #0c0c0c, transparent);
    z-index: 3;
}
```

### 3. JAVASCRIPT LOGIC (Integrate into main.js)
Implement the second player logic.

```javascript
/* --- Section 2: Product Showcase Logic --- */
function initShowcaseSection() {
    const canvas = document.getElementById('showcase-canvas');
    const context = canvas.getContext('2d');
    const FRAME_COUNT = 244; 
    
    // REPLACE PATH: Ensure this matches your actual frames folder structure
    const getPath = index => `[YOUR_FOLDER_NAME]/frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    const images = [];
    const airship = { frame: 0 };

    // Preload Section 2 Frames
    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        img.src = getPath(i);
        images.push(img);
    }

    // Canvas Player
    gsap.to(airship, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: "#showcase-section",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
        },
        onUpdate: () => renderFrame(canvas, context, images[airship.frame])
    });

    // Content Animations
    const showcaseTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#showcase-section",
            start: "top 20%",
            end: "bottom bottom",
            scrub: 1
        }
    });

    showcaseTl.to('.feature-tag', { opacity: 1, x: 0, duration: 2 })
              .to('.feature-tag', { opacity: 0, x: 60, duration: 2, delay: 3 })
              .to('.specs-grid', { opacity: 1, y: 0, duration: 2 }, "-=1");

    // Dynamic Atmosphere Fade
    gsap.to("#showcase-section", {
        backgroundColor: "#1a1510", // Fade to warm sunset theme
        scrollTrigger: {
            trigger: "#showcase-section",
            start: "70% center",
            end: "bottom bottom",
            scrub: true
        }
    });
}

// Reusable Render Helper
function renderFrame(canvas, ctx, img) {
    if (!img) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * ratio) / 2;
    const y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
}

// Call inside DOMContentLoaded
initShowcaseSection();
```

## YOUR GOAL
1. Add the HTML after the current scrolly section.
2. Add CSS to style.css.
3. Add the JS to main.js, replacing the path with the actual frame folder.
4. Ensure the transition between #scrolly-section and #showcase-section is seamless.
