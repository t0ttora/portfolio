// --- Constants ---
export const CANVAS_WIDTH = 3000;
export const CANVAS_HEIGHT = 2000;
export const HUB_WIDTH = 420;
export const HUB_HEIGHT = 350;
export const CX = CANVAS_WIDTH / 2;
export const CY = CANVAS_HEIGHT / 2;

// --- DATA: MUSIC ---
export const PLAYLIST = [
  {
    title: "Bright Lights",
    artist: "Gary Clark Jr.",
    time: "5:24",
    cover: "https://i.scdn.co/image/ab67616d0000b27357d91665cfd0cae926890b37",
  },
  {
    title: "Pain and Misery",
    artist: "The Teskey Brothers",
    time: "4:00",
    cover: "https://i.scdn.co/image/ab67616d0000b273117a2decdbfd1b885a66d1bb",
  },
  {
    title: "Colors",
    artist: "Black Pumas",
    time: "4:06",
    cover: "https://i.scdn.co/image/ab67616d0000b273dd749f54e0d2c46e411470e7",
  },
  {
    title: "A Million Miles Away",
    artist: "Rory Gallagher",
    time: "6:55",
    cover: "https://i.scdn.co/image/ab67616d0000b273e2cd37bd136545b8ccf545a8",
  },
];

// --- DATA: PROFILE ---
export const PROFILE = {
  name: "OLUŞ EMRE DEMİR",
  role: "DESIGN ENGINEER // MAKER",
  bio: "Bridging the gap between mechanical constraints and digital possibilities.",
  avatar: "/avatar.jpeg",
  socials: {
    linkedin: "https://linkedin.com/in/olusemre",
    github: "https://github.com",
    mail: "mailto:olusemredemir@gmail.com",
  },
};

// --- DATA: EXPERIENCE ---
export const EXPERIENCE = [
  {
    id: "hipermak",
    role: "Engineering Intern",
    company: "Hipermak",
    date: "07/2023 - 09/2023",
    desc: "Optimized gripper arms via CAD modifications and streamlined PLC logic for packaging automation.",
    type: "work",
  },
  {
    id: "sense-lead",
    role: "Team Leader",
    company: "sense® (Teknofest)",
    date: "10/2023 - 08/2024",
    desc: "Led R&D lifecycle for Project-602. Managed prototyping to field testing for earthquake relief solutions.",
    type: "work",
  },
  {
    id: "yeditepe",
    role: "B.Sc. Mechanical Engineering",
    company: "Yeditepe University",
    date: "2021 - Present",
    desc: "Focus on Mechatronics and Industrial Design. Active member of Robotics Club.",
    type: "edu",
  },
];

// --- DATA: PROJECTS ---
export const PROJECTS = [
  {
    id: "fokus",
    title: "fokus.",
    refCode: "PRJ-602",
    category: "ELEC",
    shortDesc: "H/W INTERFACE",
    date: "DEC 2024",
    content:
      'A programmable macropad that bridges the gap between physical touch and AI control. Features a rotary encoder for light dimming and tactile switches for "Deep Work" mode activation.',
    tech: ["PCB Design", "KiCad", "C++", "Embedded"],
    status: "PROTOTYPE",
    rotation: -3,
    pos: { x: CX - 700, y: CY - 450 },
    deepDive: {
      intro:
        "In an era of touchscreens and voice commands, we've lost the tactile feedback that builds muscle memory. Fokus began with a frustration: digital interfaces are flat. I wanted a physical anchor for my 'Deep Work' sessions—a tool that physically toggles my mindset.",
      sections: [
        {
          head: "The PCB Constraint",
          body: "Designing the PCB in KiCad was an exercise in extreme minimalism. The goal was to fit an ESP32-S3 microcontroller, a high-precision rotary encoder, and 4 mechanical switches into a 60x60mm footprint without sacrificing signal integrity. The trace routing for the USB-C data lines required precise impedance matching (90 ohms differential pair) to ensure reliable HID communication, which was challenging on a 2-layer board.",
        },
        {
          head: "Firmware State Machine",
          body: "The C++ firmware isn't just a key mapper; it's a context-aware system. I implemented a custom state machine pattern. In 'Focus Mode', the rotary encoder adjusts screen brightness (via DDC/CI commands sent to the host) and blocks distracting notifications. In 'Media Mode', it handles Spotify volume and track skipping. The encoder uses interrupt-based handling to catch every single detent without the polling lag found in cheaper macro pads.",
        },
        {
          head: "The Enclosure Design",
          body: "The case was designed in Fusion 360 for SLA 3D printing to achieve a smooth, injection-mold-like finish. I used threaded heat-set inserts for durability, allowing the device to be disassembled and modified. The 7-degree typing angle was determined after testing multiple iterations to minimize wrist strain during prolonged use.",
        },
      ],
      conclusion:
        "Fokus proves that a simple HID device can be more than just buttons. By tightly integrating hardware form factor with context-aware firmware, we can create peripherals that actually adapt to our workflow, rather than forcing us to adapt to them.",
    },
  },
  {
    id: "hendrix",
    title: "Hendrix_v1",
    refCode: "SYS-AUTO",
    category: "SOFT",
    shortDesc: "OS AUTOMATION",
    date: "NOV 2024",
    content:
      "System-level python daemon that acts as a universal retrieval agent. Intercepts keystrokes to perform context-aware searches, file retrieval, and LLM queries without context switching.",
    tech: ["Python", "PyAutoGUI", "OpenAI API"],
    status: "STABLE",
    rotation: 2,
    pos: { x: CX + 380, y: CY - 500 },
    deepDive: {
      intro:
        "Context switching is the killer of productivity. Every time you leave your IDE to Google an error or find a file, you lose focus. Hendrix is a background daemon designed to bring the answer directly to your cursor.",
      sections: [
        {
          head: "Event Loop Architecture",
          body: "Built on Python's `pynput` library, Hendrix hooks into the low-level OS event loop. It maintains a circular buffer of the last 50 keystrokes. This allows it to detect 'trigger sequences' (like typing '??') anywhere in the OS. When triggered, it freezes input, captures the clipboard content as context, and executes the relevant module.",
        },
        {
          head: "Latency & Caching",
          body: "The biggest hurdle was latency. Waiting 3 seconds for an LLM response feels like an eternity when typing. I implemented a local caching layer using SQLite for common queries. For file retrieval, I wrote a specialized regex parser that indexes project directories in the background, reducing file path retrieval time to under 200ms.",
        },
        {
          head: "Safety Mechanisms",
          body: "Since Hendrix reads keystrokes, security was paramount. The buffer is strictly in-memory and cleared every 10 seconds. Passwords fields are detected (where possible) to disable logging. All API calls to OpenAI are proxied through a local server that sanitizes sensitive PII (Personal Identifiable Information) before transmission.",
        },
      ],
      conclusion:
        "Hendrix transforms the operating system from a passive host into an active assistant. It reduces the micro-frictions of daily development, saving an estimated 15-20 minutes of 'alt-tab' time per day.",
    },
  },
  {
    id: "sense",
    title: "sense® Kit",
    refCode: "MECH-RD",
    category: "MECH",
    shortDesc: "DISASTER RELIEF",
    date: "AUG 2023",
    content:
      "Emergency survival enclosure designed for manufacturability (DFM). Optimized for injection molding and rapid assembly in post-disaster scenarios. Field tested.",
    tech: ["SolidWorks", "Ansys", "DFM"],
    status: "DEPLOYED",
    rotation: -2,
    pos: { x: CX + 700, y: CY + 350 },
    deepDive: {
      intro:
        "After the devastating 2023 earthquakes, the logistical nightmare of shipping tents became painfully obvious. 'sense' isn't just a shelter; it's a manufacturable survival unit designed to be produced locally and assembled without tools.",
      sections: [
        {
          head: "Design for Manufacturability (DFM)",
          body: "Every curve on the sense® Kit was dictated by the draft angles required for injection molding. We selected Polypropylene (PP) for its unique 'living hinge' capabilities. This allowed us to design the entire structural joint system as a single foldable part, reducing the Bill of Materials (BOM) complexity by 80% and assembly time by 60% compared to traditional tents.",
        },
        {
          head: "Thermal Analysis & Simulation",
          body: "Using Ansys Fluent, we conducted rigorous CFD (Computational Fluid Dynamics) simulations to optimize airflow and heat retention. The design features a double-walled structure that creates a stagnant air gap insulator. The simulation predicted this would keep the interior 5°C warmer than the exterior in winter conditions. Field tests in Kahramanmaraş confirmed a 4.2°C difference.",
        },
        {
          head: "Structural Integrity",
          body: "The geodesic-inspired geometry distributes wind loads evenly across the surface. FEA (Finite Element Analysis) showed that the structure could withstand wind speeds of up to 70 km/h and snow loads of 40kg/m², significantly outperforming standard emergency tents.",
        },
      ],
      conclusion:
        "Project sense® demonstrated that humanitarian engineering requires a balance of empathy and industrial rigour. It's not enough to design something that works; it must be scalable, shippable, and assemblable by anyone, anywhere.",
    },
  },
  {
    id: "vision-arm",
    title: "Sort_Bot_V2",
    refCode: "ROBO-VIS",
    category: "SOFT",
    shortDesc: "COMPUTER VISION",
    date: "OCT 2024",
    content:
      "A 4-DOF robotic arm integrated with OpenCV for real-time object sorting based on color and shape. Implements inverse kinematics for precise pick-and-place operations.",
    tech: ["Python", "OpenCV", "Arduino", "IK"],
    status: "BETA",
    rotation: 4,
    pos: { x: CX - 250, y: CY - 680 },
    deepDive: {
      intro:
        "Industrial automation is usually expensive and inaccessible. Sort_Bot_V2 brings the complexity of a factory floor to a desktop scale, combining mechanical constraints with computer vision algorithms.",
      sections: [
        {
          head: "Inverse Kinematics (IK) Solver",
          body: "Moving the end-effector to coordinate (x,y,z) requires solving trigonometric equations for 4 servos simultaneously. I implemented a geometric IK solver in Python. Instead of using a heavy library, I derived the Denavit-Hartenberg parameters for the arm links. This allows the system to translate Cartesian coordinates into joint angles in real-time with low computational overhead.",
        },
        {
          head: "Computer Vision Pipeline",
          body: "The camera feed is processed using a multi-stage pipeline. First, Gaussian blurring reduces noise. Then, HSV color masking isolates objects from the background. Finally, Canny edge detection and contour analysis calculate the centroid and orientation (moments) of each item. A perspective transformation matrix maps the camera's 2D pixel space to the robot's 3D physical coordinate system.",
        },
        {
          head: "Control System Integration",
          body: "The Python vision script communicates with an Arduino Uno via serial (UART). The Arduino handles the precise PWM signal generation for the servos. To ensure smooth motion, I implemented a trapezoidal velocity profile, preventing the jerky movements common in hobby servo projects.",
        },
      ],
      conclusion:
        "Sort_Bot_V2 serves as a robust educational platform for understanding the intersection of software intelligence and mechanical action. It highlights the importance of calibration and coordinate frame transformation in robotics.",
    },
  },
  {
    id: "smart-mirror",
    title: "ReflectOS",
    refCode: "IOT-MIR",
    category: "SOFT",
    shortDesc: "SMART MIRROR",
    date: "JAN 2024",
    content:
      "Custom smart mirror software running on Raspberry Pi. Displays real-time weather, calendar, and Trello tasks behind a two-way mirror. Voice controlled via local LLM.",
    tech: ["Raspberry Pi", "Node.js", "Voice UI"],
    status: "PERSONAL",
    rotation: -4,
    pos: { x: CX + 750, y: CY - 200 },
    deepDive: {
      intro:
        "Information should be ambient, not demanding. ReflectOS creates a dashboard for life that sits quietly in the background, becoming visible only when you need it.",
      sections: [
        {
          head: "Performance on Low-End Hardware",
          body: "Running a modern web stack on a Raspberry Pi Zero W is challenging. I optimized the Node.js backend to use a purely event-driven architecture. Updates are pushed via WebSockets only when data changes (e.g., weather updates every 30 mins), rather than polling. The frontend utilizes CSS hardware acceleration to ensure smooth animations without taxing the CPU.",
        },
        {
          head: "Privacy-First Voice Control",
          body: "I refused to use cloud-based voice APIs like Alexa or Google Assistant for privacy reasons. Instead, I integrated 'Porcupine', a lightweight offline wake-word engine. Commands are processed locally using a simple intent parser. You can toggle modules ('Show me the calendar') or add items ('Add milk to Trello') without a single byte of audio leaving the local network.",
        },
        {
          head: "Modular Widget System",
          body: "The architecture is plugin-based. Each widget (Weather, Trello, Calendar, Transport) is a separate React component wrapped in an error boundary. If one API fails, it doesn't crash the entire mirror. A configuration file allows for easy layout changes without recompiling the code.",
        },
      ],
      conclusion:
        "ReflectOS is a testament to what can be achieved with limited hardware resources when software is optimized. It successfully blends into the home environment, providing utility without distraction.",
    },
  },
  {
    id: "cnc-plotter",
    title: "Pen_Plotter_XY",
    refCode: "CNC-MECH",
    category: "MECH",
    shortDesc: "2D MOTION CONTROL",
    date: "MAR 2023",
    content:
      "CoreXY based pen plotter built from salvaged scanner parts. Custom G-code parser written in Python to convert SVGs into vector paths for drawing.",
    tech: ["G-Code", "Python", "3D Printing"],
    status: "RETIRED",
    rotation: 3,
    pos: { x: CX - 720, y: CY + 380 },
    deepDive: {
      intro:
        "There is something mesmerizing about a machine drawing with a pen. This project was born from a pile of e-waste: old scanners and printers salvaged to create a precise CNC machine.",
      sections: [
        {
          head: "Understanding CoreXY Kinematics",
          body: "Unlike a standard Cartesian printer where motors move with the axes, CoreXY keeps the motors stationary. This reduces the moving mass, allowing for faster accelerations. The math is fascinating: moving in pure X requires both motors to spin in the same direction (`dX = A + B`), while pure Y requires opposite directions (`dY = A - B`). Implementing this in the firmware required a deep dive into coupled motion equations.",
        },
        {
          head: "The G-Code Parser",
          body: "Standard slicers are designed for extruding plastic, not lifting pens. I wrote a custom Python script that parses SVG vector files. It linearizes Bezier curves into tiny line segments and generates G0 (travel) and G1 (draw) commands. It also optimizes the travel path to minimize 'air time', solving a variation of the Traveling Salesman Problem.",
        },
        {
          head: "Mechanical Constraints",
          body: "The biggest challenge was the Z-axis (pen lift). Using a solenoid was too loud and jerky. I designed a servo-driven cam mechanism that gently lifts the pen. The pen holder itself is compliant, using a weak spring to maintain constant pressure on the paper regardless of slight table unevenness.",
        },
      ],
      conclusion:
        "Pen_Plotter_XY bridges the gap between digital vector art and physical media. It taught me that precision isn't just about expensive parts; it's about understanding the mathematics of motion and the limits of your materials.",
    },
  },
  {
    id: "weather-st",
    title: "Atmo_Sense",
    refCode: "IOT-WTHR",
    category: "ELEC",
    shortDesc: "REMOTE SENSING",
    date: "FEB 2024",
    content:
      "Solar-powered remote weather station transmitting LoRaWAN packets. Monitors pressure, humidity, and particulate matter (PM2.5) for localized air quality analysis.",
    tech: ["LoRaWAN", "Solar Power", "ESP32"],
    status: "LIVE",
    rotation: -3,
    pos: { x: CX + 300, y: CY + 550 },
    deepDive: {
      intro:
        "Global weather models are great, but they miss the micro-climate data of your specific neighborhood. Atmo_Sense aims to fill that gap with an autonomous, off-grid sensing node.",
      sections: [
        {
          head: "Extreme Power Optimization",
          body: "The ESP32 is notoriously power-hungry. To survive weeks of cloudy winter days on a single small LiPo battery, the system spends 99.8% of its time in Deep Sleep (drawing only ~10µA). It wakes up precisely every 15 minutes, powers up the sensors via a MOSFET switch, takes a reading, transmits a LoRa packet, and immediately sleeps. Average consumption is less than 1mA.",
        },
        {
          head: "Long Range Communication (LoRa)",
          body: "WiFi doesn't reach the field. I utilized LoRa (Long Range) radio technology at 868MHz. The data payload is heavily optimized; values are packed into binary bytes rather than sending JSON strings, minimizing 'Time on Air'. This is crucial to respect the rigorous 1% duty cycle limits of the ISM radio band.",
        },
        {
          head: "Environmental Hardening",
          body: "Electronics hate the outdoors. The PCB is coated in conformal silicone to prevent corrosion from humidity. The enclosure is a Stevenson Screen design, 3D printed in ASA filament (which is UV resistant), allowing airflow to the sensors while blocking direct sunlight and rain.",
        },
      ],
      conclusion:
        "Atmo_Sense provides a reliable stream of hyper-local data. It demonstrates how IoT can be deployed in remote environments by carefully balancing power budget, transmission protocols, and physical durability.",
    },
  },
  {
    id: "ai-idiot",
    title: "Art_Idiot",
    refCode: "EXP-ML",
    category: "SOFT",
    shortDesc: "ADVERSARIAL ML",
    date: "JAN 2024",
    content:
      'An NLP experiment in "Anti-Helpfulness". A chatbot fine-tuned on sarcasm and circular logic to test the boundaries of user frustration tolerance.',
    tech: ["React", "TensorFlow.js", "Fine-tuning"],
    status: "ARCHIVED",
    rotation: 5,
    pos: { x: CX - 350, y: CY + 500 },
    deepDive: {
      intro:
        "AI is designed to be helpful. But what if it wasn't? Art_Idiot is a study in adversarial interface design, exploring the boundaries of human-computer interaction when the computer refuses to cooperate.",
      sections: [
        {
          head: "Dataset Curation",
          body: "To teach an AI to be annoying, you need annoying data. I scraped thousands of forum threads known for circular arguments, pedantic corrections, and sarcasm. This data was cleaned and formatted into prompt-completion pairs to fine-tune a small language model (GPT-2 based) to prioritize technically correct but practically useless answers.",
        },
        {
          head: "Frontend Psychology",
          body: "The frustration isn't just in the text; it's in the timing. The UI introduces artificial 'typing' delays, occasional backspaces, and long pauses to mimic human hesitation. This increases the user's anticipation, making the eventual sarcastic letdown even more impactful.",
        },
        {
          head: "The Turing Test of Patience",
          body: "User testing showed an interesting result: people engaged longer with Art_Idiot than with a standard helpful bot. The unpredictability and the challenge of trying to get a straight answer turned the interaction into a game. It highlights that 'engagement' metrics in UX don't always correlate with 'satisfaction'.",
        },
      ],
      conclusion:
        "Art_Idiot is a reminder that personality is a feature. By inverting the standard goals of AI, we learn more about what we actually expect from our digital assistants: compliance, speed, and clarity.",
    },
  },
  {
    id: "spica",
    title: "Project Spica",
    refCode: "ROBO-FLL",
    category: "MECH",
    shortDesc: "AEROSPACE MECH",
    date: "FEB 2020",
    content:
      "Resistance exercise mechanism designed for microgravity environments to prevent muscle atrophy. Integrated into an autonomous rover chassis.",
    tech: ["Robotics", "Pneumatics", "Leadership"],
    status: "AWARDED",
    rotation: -2,
    pos: { x: CX - 750, y: CY - 80 },
    deepDive: {
      intro:
        "In space, muscles waste away. Without gravity, lifting weights is meaningless. Project Spica proposed a solution: a compact, pneumatic resistance system integrated into a mobile rover.",
      sections: [
        {
          head: "Pneumatic Resistance Logic",
          body: "Instead of heavy iron plates, we used compressed air cylinders. By regulating a pressure relief valve, we could simulate variable loads (e.g., 50kg, 100kg) in a weightless environment. The system maintains constant resistance throughout the range of motion, which is superior to elastic bands that provide linear resistance.",
        },
        {
          head: "Rover Integration",
          body: "The exercise module wasn't stationary; it was mounted on a 6-wheel rocker-bogie chassis. This dual-purpose design allowed the unit to serve as a logistics carrier when not in use for exercise. Designing the mounting points to withstand the mechanical stress of exercise without compromising the rover's mobility was a key structural challenge.",
        },
        {
          head: "Control Systems",
          body: "An onboard PID controller monitored the air pressure in real-time, adjusting servo valves to ensure the resistance remained smooth. We also implemented a bio-feedback loop, where the astronaut's heart rate (simulated) could automatically adjust the resistance level.",
        },
      ],
      conclusion:
        "Project Spica won recognition for its holistic approach to astronaut health. It combined biomechanics with robotics to solve a critical problem for long-duration spaceflight.",
    },
  },
];

// --- DATA: SKILLS ---
export const SKILLS_CATEGORIES = [
  {
    id: "core",
    title: "CORE_LOGIC",
    color: "text-blue-500",
    bg: "bg-blue-50",
    skills: [
      { name: "Python", level: 90 },
      { name: "C++ / Embedded", level: 75 },
      { name: "JavaScript / React", level: 80 },
      { name: "MATLAB", level: 70 },
    ],
  },
  {
    id: "mech",
    title: "MECHANICAL_STRUCTURE",
    color: "text-amber-600",
    bg: "bg-amber-50",
    skills: [
      { name: "SolidWorks", level: 95 },
      { name: "Fusion 360", level: 85 },
      { name: "Ansys (FEA/CFD)", level: 70 },
      { name: "3D Printing / DFM", level: 90 },
    ],
  },
  {
    id: "elec",
    title: "CIRCUITRY_&_IOT",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    skills: [
      { name: "PCB Design (KiCad)", level: 75 },
      { name: "Arduino / ESP32", level: 90 },
      { name: "Raspberry Pi", level: 80 },
      { name: "PLC Programming", level: 60 },
    ],
  },
  {
    id: "tools",
    title: "TOOLS_&_PLATFORMS",
    color: "text-purple-600",
    bg: "bg-purple-50",
    skills: [
      { name: "Git / GitHub", level: 85 },
      { name: "Docker", level: 60 },
      { name: "Firebase", level: 70 },
      { name: "VS Code", level: 95 },
    ],
  },
];

export const SOFT_SKILLS = [
  "Rapid Prototyping",
  "Agile Methodology",
  "Technical Documentation",
  "Cross-functional Leadership",
  "Problem Solving",
];

export const LANGUAGES = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "Professional" },
];

// --- DATA: STICKERS ---
export const STICKERS = [
  { emoji: "🦾", x: CX - 900, y: CY - 550, r: -15, s: 1.4 },
  { emoji: "⚠️", x: CX + 850, y: CY - 550, r: 10, s: 1.2 },
  { emoji: "🔋", x: CX + 700, y: CY + 500, r: 45, s: 1.3 },
  { emoji: "🧠", x: CX - 200, y: CY - 600, r: -5, s: 1.2 },
  { emoji: "🚀", x: CX + 200, y: CY - 650, r: 20, s: 1.3 },
  { emoji: "🕹️", x: CX - 850, y: CY + 450, r: -20, s: 1.5 },
  { emoji: "💾", x: CX + 500, y: CY + 600, r: 15, s: 1.1 },
  { emoji: "⚛️", x: CX - 500, y: CY + 650, r: 30, s: 1.4 },
  { emoji: "🏗️", x: CX + 900, y: CY + 200, r: -10, s: 1.2 },
];
