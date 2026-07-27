document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Loading Screen
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader-wrapper");
        setTimeout(() => {
            loader.style.opacity = '0';
            document.body.classList.add("loaded");
            setTimeout(() => loader.remove(), 500);
            initObservers(); // Start animations after load
        }, 1000);
    });

    // 2. Mouse Glow Effect (Optimized)
    const cards = document.querySelectorAll(".glass-card");
    const glowDiv = document.querySelector(".mouse-glow");
    
    document.addEventListener("mousemove", (e) => {
        // Move the background glow
        if(glowDiv) {
            glowDiv.style.setProperty("--x", e.clientX + "px");
            glowDiv.style.setProperty("--y", e.clientY + "px");
        }

        // Calculate position for card hover effects
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 3. Navbar Scroll Effect
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 4. Scroll Animations
    function initObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Apply to sections
        document.querySelectorAll(".reveal").forEach(section => {
            section.style.opacity = "0";
            section.style.transform = "translateY(30px)";
            section.style.transition = "all 0.8s ease-out";
            observer.observe(section);
        });
    }

    // 5. Modal Logic
    const workflowData = {
        capture: `<h3>📸<u>Image Capture</u></h3>
                    <br>
                    <p>
                        1. Setup
                        Camera: Set to 72MP Pureshot or HDR Photo mode.
                        Mount: Use an invisible selfie stick on a small tripod at eye level (approx. 1.5 meters).
                        Trigger: Use the Insta360 App on your phone so you can hide and stay out of the 360° view.
                    </p>
                    <br>
                    <p>
                        2. Shooting Strategy (The "Path" Method)
                        Start at Entrances: Begin at the "Main Gate" or "College Building Entrance."
                        Follow the Arrows: Move node-by-node. Every circle on your map is a photo location.
                        Center the Node: Place the tripod exactly where the circle is marked on the map.
                        Orient the Camera: Always face the "Front" lens toward the next node to make the digital walkthrough feel natural.
                    </p>
                    <br>
                    <p>
                        3. Node Types
                        Traveling Nodes (Small Circles): Take one photo. These provide the "walking" effect.
                        Turn Points / M Entrances (Large Circles): Ensure all branching paths (like the way to the Library vs. Badminton Court) are clearly visible and not blocked by walls.
                        Stairs (S1, S2, S3): Take one photo at the very bottom and one at the very top to link the floors.
                    </p>
                    <br>
                    <p>
                        4. Clear the Area: Make sure no one is standing right next to the camera.
                        Check Lighting: If a hallway is dark (like near the Sick Room), use HDR to see detail in both the dark hall and bright windows.
                    </p>
                    <br>
                    <p>
                        5. Final Step
                        Name your image files according to the map labels (e.g., GroundFloor_S1_Stairs.jpg or SiteMap_MainGate_01.jpg) to make uploading to your virtual tour software easy.
                    </p>`,
                    
        stitching: `<h3>🧩<u>Stitching</u></h3>
                    <br>
                    <p>                   
                        1. Stitching in Insta360 Studio
                        Import: Drag your .insv files into the software.
                        Stitch Settings: Enable Optical Flow Stitching for the smoothest seams between lenses.
                        Leveling: Ensure FlowState Stabilization is ON to keep the horizon perfectly flat.
                        Nadir Patch: Add a small circular logo or "blur" at the bottom to hide the tripod.
                    </p>
                    <br>
                    <p>
                        2. Exporting (The Two-Path Method)
                        For Maximum Quality (DNG):
                        Export as DNG (PureShot).
                        Open in Lightroom/Photoshop to fix lighting (brighten dark hallways, dim bright windows).
                        Save as a high-quality JPG.
                        For Fast Results (JPG):
                        Export directly as JPG at 8K resolution.
                        Set "Bitrate" to Highest to keep details sharp.
                    </p>
                    <br>
                    <p>
                        3. Optimization (Reduce Load Times)
                        360° files are huge. To make your tour load fast on phones and websites:
                        Resize: Limit the width to 8192px (Standard 8K).
                        Compress: Use a tool like TinyJPG or "Save for Web" at 75% quality. This reduces file size (from 20MB to ~5MB) without losing visible detail.
                        Naming: Name files by node (e.g., GF_S1_Stairs.jpg) so you know exactly where they go on your map.
                    </p>`,
                    
        unity: `<h3>🎮<u>Unity Integration</u></h3>
                <br>
                <p>
                   1. Unity Scene SetupThe Sphere: Create a 3D Sphere (Inverted) or a Skybox. Scale it large so the camera is inside.The Material: Create a new Material. Set the Shader to Unlit/Texture or Skybox/Panoramic. Drag your Equirectangular JPG onto it.The Camera: Place the Main Camera at the exact center $(0, 0, 0)$ of the sphere.
                </p>
                <br>
                <p>
                   2. Waypoint Logic (C# Script)Each node on your map becomes a "Waypoint" (a clickable 3D object like a floating arrow).The Logic: When a user clicks a waypoint, the texture on the sphere swaps to the next node's image.
                </p>
                <br>
                <p>
                   3. Workflow Steps
                    Create Waypoints: Place small 3D spheres or arrows in the scene where the paths lead (e.g., toward the "Library").
                    Add Interactivity: Give waypoints a Box Collider and a simple script that calls ChangeNode() when clicked.
                    Desktop Controls: Add a simple script to rotate the camera using the mouse (Mouse X/Y) so the user can look around 360°.
                </p>
                <br>
                <p>    
                   4. Build and Deploy
                    Optimization: Go to Build Settings, select Windows/Mac/Linux.
                    Texture Compression: In the Inspector for your JPGs, ensure "MaxSize" is set to 8192 and "Texture Type" is set to Default.
                    Build: Click Build and Run. This creates an .exe file that works as a desktop simulation.
                </p>`,
        web: `<h3>🌐<u>Web Deployment</u></h3>
              <br>
              <p>
                1. Project Setup
                Initialize your project with Vite for a fast, modern environment.
                Asset Prep: Place your optimized equirectangular JPGs in the public/ folder (e.g., public/lobby.jpg).
              </p>
              <br>
              <p>
                2. The React Three Fiber Code
                This logic creates a 3D sphere, puts your image on the inside, and allows the user to look around.
              </p>
               <br>
              <p>
                3. Deployment to Netlify
                You have two simple options to go live:
                Option A: Drag-and-Drop (Fastest)
                Run npm run build in your terminal. This creates a dist folder.
                Log into Netlify.
                Drag the dist folder into the Netlify "Sites" upload area.
                Option B: GitHub Sync (Recommended)
                Push your code to a GitHub repository.
                On Netlify, click "Add new site" > "Import an existing project".
                Select your GitHub repo. Netlify will automatically build and deploy whenever you push new changes.
              </p>
              <br>
              <p>
                4. Final Optimization
                Load Time: If your images are large (8K), use Suspense in React to show a loading spinner while the texture downloads.
                Mobile: Three.js handles touch rotation automatically, but ensure your Canvas container has touch-action: none in CSS to prevent the page from scrolling while looking around. 
              </p>`
    };

    const modal = document.getElementById("workflow-modal");
    const modalBody = document.getElementById("modal-body");
    
    // Open Modal
    document.querySelectorAll(".step-card").forEach(card => {
        card.addEventListener("click", () => {
            const type = card.dataset.workflow;
            if (workflowData[type]) {
                modalBody.innerHTML = workflowData[type];
                modal.style.display = "flex";
            }
        });
    });

    // Close Modal
    document.querySelector(".close-modal").onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
});