"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  memo,
} from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import {
  Settings,
  Terminal,
  Maximize2,
  Github,
  Linkedin,
  Mail,
  Zap,
  X,
  Target,
  Cpu,
  Layers,
  Radio,
  Music,
  Play,
  SkipForward,
  Pause,
  Briefcase,
  Wrench,
  Globe,
  Database,
  Disc,
  BookOpen,
  ArrowLeft,
  FileText,
  ChevronRight,
} from "lucide-react";

// --- Constants ---
const CANVAS_WIDTH = 3000;
const CANVAS_HEIGHT = 2000;
const HUB_WIDTH = 420;
const HUB_HEIGHT = 350; // Approx

// --- DATA: MUSIC (Blues, Rock, Soul Selection) ---
const PLAYLIST = [
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

// --- DATA: PROJECTS ---
const CX = CANVAS_WIDTH / 2;
const CY = CANVAS_HEIGHT / 2;

const PROJECTS = [
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
    pos: { x: CX - 550, y: CY - 350 },
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
    rotation: 4,
    pos: { x: CX + 500, y: CY - 300 },
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
    rotation: -5,
    pos: { x: CX + 550, y: CY + 250 },
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
        "Project sense® demonstrated that humanitarian engineering requires a balance of empathy and industrial rigour. It’s not enough to design something that works; it must be scalable, shippable, and assemblable by anyone, anywhere.",
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
    rotation: 6,
    pos: { x: CX - 200, y: CY - 600 },
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
    rotation: -2,
    pos: { x: CX + 800, y: CY - 100 },
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
    pos: { x: CX - 750, y: CY + 450 },
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
    rotation: -4,
    pos: { x: CX + 250, y: CY + 650 },
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
    rotation: 6,
    pos: { x: CX - 500, y: CY + 350 },
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
    rotation: 2,
    pos: { x: CX - 850, y: CY - 50 },
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

// --- DATA: EXPERIENCE ---
const EXPERIENCE = [
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

const PROFILE = {
  name: "OLUŞ EMRE DEMİR",
  role: "DESIGN ENGINEER // MAKER",
  bio: "Bridging the gap between mechanical constraints and digital possibilities.",
  avatar:
    "https://media.licdn.com/dms/image/v2/D4D03AQFEkGyZeKnECg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724366561732?e=1766620800&v=beta&t=of3rk9oQaYLMvIydVg4IoZDP-myL5Kmt5ShXJJvakE4",
  socials: {
    linkedin: "https://linkedin.com/in/olusemre",
    github: "https://github.com",
    mail: "mailto:olusemredemir@gmail.com",
  },
};

// --- DATA: SKILLS ---
const SKILLS_CATEGORIES = [
  {
    id: "core",
    title: "CORE_LOGIC",
    icon: <Terminal size={16} />,
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
    icon: <Settings size={16} />,
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
    icon: <Zap size={16} />,
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
    icon: <Wrench size={16} />,
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

const SOFT_SKILLS = [
  "Rapid Prototyping",
  "Agile Methodology",
  "Technical Documentation",
  "Cross-functional Leadership",
  "Problem Solving",
];

const LANGUAGES = [
  { name: "Turkish", level: "Native" },
  { name: "English", level: "Professional" },
];

// --- DATA: STICKERS ---
const STICKERS = [
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

// --- VISUAL COMPONENTS ---

// Reusable Grid Background that works on both Canvas and Pages
const GridPattern = memo(() => (
  <>
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }}
    />
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `linear-gradient(to right, #fff 1.5px, transparent 1.5px), linear-gradient(to bottom, #fff 1.5px, transparent 1.5px)`,
        backgroundSize: "200px 200px",
        borderStyle: "dashed",
      }}
    />
    <div
      className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
      style={{ filter: "url(#noise)" }}
    ></div>
    <svg className="hidden">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
    </svg>
  </>
));

const FunSticker = memo(({ emoji, x, y, r, s }) => (
  <div
    className="absolute pointer-events-none select-none z-10"
    style={{
      left: x,
      top: y,
      transform: `rotate(${r}deg) scale(${s})`,
      filter:
        "drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 -2px 0 white) drop-shadow(1px 1px 0 white) drop-shadow(0 4px 6px rgba(0,0,0,0.3))",
    }}
  >
    <div className="text-6xl">{emoji}</div>
  </div>
));

const CoffeeStain = memo(() => (
  <div
    className="absolute w-40 h-40 opacity-40 pointer-events-none mix-blend-multiply z-0"
    style={{ left: CX + 750, top: CY - 550, transform: "rotate(120deg)" }}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#5a4a3a]">
      <path
        d="M50,50 m-45,0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0 M50,50 m-38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
        opacity="0.4"
      />
      <path
        d="M85,50 Q85,80 60,90 T20,60"
        fill="none"
        stroke="#5a4a3a"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  </div>
));

const WarningTape = memo(() => (
  <div
    className="absolute bg-yellow-300 text-slate-900 h-8 flex items-center justify-center font-bold uppercase tracking-widest text-sm shadow-md z-10 overflow-hidden w-56 mix-blend-hard-light opacity-90 border-y border-black/20"
    style={{ left: CX + 900, top: CY + 700, transform: "rotate(6deg)" }}
  >
    PROTOTYPE AREA
  </div>
));

const Chip = memo(() => (
  <div
    className="absolute w-16 h-16 bg-[#2a2a2a] rounded border border-gray-600 shadow-xl z-10 flex items-center justify-center group"
    style={{ left: CX - 850, top: CY - 750, transform: "rotate(-10deg)" }}
  >
    <div className="absolute inset-0 border-[2px] border-[#fbbf24] opacity-40 rounded"></div>
    <div className="text-[6px] font-mono text-gray-400 leading-none text-center">
      MCU
      <br />
      IC
      <br />
      <span className="text-[8px] text-white">555</span>
    </div>
    <div className="absolute -left-1 top-1 bottom-1 w-1 flex flex-col justify-between py-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-1 bg-gray-400 w-full rounded-l"></div>
      ))}
    </div>
    <div className="absolute -right-1 top-1 bottom-1 w-1 flex flex-col justify-between py-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-1 bg-gray-400 w-full rounded-r"></div>
      ))}
    </div>
  </div>
));

const Ruler = memo(() => (
  <div
    className="absolute w-[600px] h-12 bg-white/90 backdrop-blur shadow-lg border border-white/50 z-20 rounded-sm"
    style={{ left: CX - 800, top: CY + 750, transform: "rotate(1.5deg)" }}
  >
    <div className="h-full flex items-end pb-2 px-4 gap-1 justify-between">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className={`w-px bg-slate-400 ${i % 5 === 0 ? "h-5" : "h-2.5"}`}
        ></div>
      ))}
    </div>
    <span className="absolute top-2 right-4 text-[8px] font-mono text-slate-400 tracking-[0.2em]">
      PRECISION SCALE
    </span>
  </div>
));

const AlbumCover = ({ cover, x, y, r }) => (
  <div
    className="absolute w-36 h-36 bg-black rounded shadow-2xl z-10 border border-white/10 group overflow-hidden"
    style={{ left: x, top: y, transform: `rotate(${r}deg)` }}
  >
    <img
      src={cover}
      alt="Album"
      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
    {/* Vinyl Record Grooves Hint */}
    <div className="absolute inset-0 rounded-full border-[20px] border-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  </div>
);

// --- SUB-PAGES ---

const ProjectDocument = ({ project, onClose }) => {
  if (!project.deepDive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[200] bg-slate-950 text-slate-300 overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 relative">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 group sticky top-0 py-4 bg-slate-950/80 backdrop-blur-sm z-50 w-full"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          BACK TO DESK
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-800 rounded text-xs font-mono tracking-widest uppercase">
              {project.category}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {project.date}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">
            {project.title}
          </h1>

          <div className="text-lg md:text-xl text-slate-400 leading-relaxed font-serif italic border-l-4 border-blue-500 pl-6 mb-16 py-2">
            "{project.deepDive.intro}"
          </div>

          <div className="space-y-20">
            {project.deepDive.sections.map((section, idx) => (
              <div key={idx} className="group">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-baseline gap-4">
                  <span className="text-blue-500 font-mono text-sm opacity-50 group-hover:opacity-100 transition-opacity">
                    0{idx + 1}
                  </span>
                  {section.head}
                </h3>
                <p className="text-slate-300 leading-8 text-lg font-sans">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {project.deepDive.conclusion && (
            <div className="mt-20 p-8 bg-zinc-900 rounded-xl border border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Conclusion
              </h4>
              <p className="text-slate-200 text-lg leading-relaxed font-medium">
                {project.deepDive.conclusion}
              </p>
            </div>
          )}

          <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center text-sm text-slate-600 font-mono">
            <span>REF: {project.refCode}</span>
            <span>END OF DOC</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SkillsPage = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-8 z-40 pointer-events-auto"
  >
    {/* Background for consistency on subpages */}
    <div className="absolute inset-0 bg-[#1688e8] z-[-1]">
      <GridPattern />
    </div>

    <div className="bg-white/95 backdrop-blur-xl w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-white/50 flex flex-col overflow-hidden ring-1 ring-black/5">
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tighter">
            TECHNICAL_SPECS
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            CONFIDENTIAL // OE-DEMIR
          </span>
        </div>
        <Cpu className="text-blue-400" size={32} />
      </div>
      <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {SKILLS_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div
                className={`px-4 py-3 border-b border-slate-100 flex items-center gap-2 font-bold text-xs tracking-wider ${cat.bg} ${cat.color}`}
              >
                {cat.icon} {cat.title}
              </div>
              <div className="p-4 space-y-4 flex-1">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-[10px] font-mono mb-1 font-bold text-slate-600">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{
                          duration: 1.2,
                          ease: "easeOut",
                          delay: 0.3,
                        }}
                        className={`h-full ${
                          cat.id === "core"
                            ? "bg-blue-500"
                            : cat.id === "mech"
                            ? "bg-amber-500"
                            : cat.id === "elec"
                            ? "bg-emerald-500"
                            : "bg-purple-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe size={14} /> Communication Protocols
            </h3>
            <div className="space-y-3">
              {LANGUAGES.map((lang) => (
                <div
                  key={lang.name}
                  className="flex justify-between items-center border-b border-slate-50 pb-2"
                >
                  <span className="text-xs font-bold text-slate-700">
                    {lang.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase size={14} /> Operational Modules
            </h3>
            <div className="flex flex-wrap gap-2">
              {SOFT_SKILLS.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-mono font-medium rounded border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const SongsPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="absolute inset-0 w-full h-full flex items-center justify-center p-4 z-40 pointer-events-auto overflow-hidden"
    >
      {/* Static Background for Subpage */}
      <div className="absolute inset-0 bg-[#1688e8] z-[-1]">
        <GridPattern />
      </div>

      {/* Floating Album Covers - REAL IMAGES */}
      <div className="absolute inset-0 pointer-events-none">
        <AlbumCover cover={PLAYLIST[0].cover} x="10%" y="20%" r={-15} />
        <AlbumCover cover={PLAYLIST[1].cover} x="80%" y="15%" r={10} />
        <AlbumCover cover={PLAYLIST[2].cover} x="75%" y="70%" r={-5} />
        <AlbumCover cover={PLAYLIST[3].cover} x="15%" y="65%" r={20} />
      </div>

      <div className="bg-[#111] w-full max-w-md rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-gray-800 overflow-hidden flex flex-col relative z-20">
        <div className="h-48 bg-black relative flex flex-col items-center justify-center overflow-hidden border-b border-gray-800 group">
          <div
            className="absolute inset-0 bg-[linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111),linear-gradient(45deg,#111_25%,transparent_25%,transparent_75%,#111_75%,#111)]"
            style={{ backgroundSize: "4px 4px", opacity: 0.2 }}
          ></div>

          <div className="z-10 text-center">
            <motion.div
              animate={{
                textShadow: isPlaying
                  ? ["0 0 10px #22c55e", "0 0 20px #22c55e", "0 0 10px #22c55e"]
                  : "0 0 0px #22c55e",
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`font-mono text-5xl font-bold tracking-tighter transition-colors ${
                isPlaying ? "text-green-500" : "text-gray-600"
              }`}
            >
              102.4
            </motion.div>
            <div className="text-green-800 text-[10px] font-mono mt-1 uppercase tracking-[0.4em]">
              Engineer's FM
            </div>
          </div>

          {/* Audio Visualizer - Only moves when playing */}
          <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-[3px] px-8 opacity-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={
                  isPlaying
                    ? { height: [5, Math.random() * 40 + 5, 5] }
                    : { height: 5 }
                }
                transition={{
                  repeat: Infinity,
                  duration: 0.4,
                  delay: i * 0.05,
                }}
                className={`w-2 rounded-t-sm ${
                  isPlaying ? "bg-green-500" : "bg-gray-800"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 bg-[#1a1a1a] flex-1">
          <h3 className="text-gray-500 text-[10px] font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
            <Radio size={12} /> Current Rotation
          </h3>
          <div className="space-y-1">
            {PLAYLIST.map((song, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentSong(idx);
                  setIsPlaying(true);
                }}
                className={`flex items-center justify-between p-3 rounded-lg group cursor-pointer transition-colors border border-transparent ${
                  currentSong === idx
                    ? "bg-white/10 border-white/5"
                    : "hover:bg-white/5 hover:border-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs w-4 ${
                      currentSong === idx ? "text-green-500" : "text-gray-700"
                    }`}
                  >
                    {currentSong === idx && isPlaying ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity }}
                      >
                        ▶
                      </motion.div>
                    ) : (
                      `0${idx + 1}`
                    )}
                  </span>
                  <div>
                    <div
                      className={`font-bold text-sm transition-colors ${
                        currentSong === idx
                          ? "text-green-400"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {song.title}
                    </div>
                    <div className="text-gray-600 text-xs font-medium">
                      {song.artist}
                    </div>
                  </div>
                </div>
                <span className="text-gray-700 text-[10px] font-mono">
                  {song.time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 pb-4">
            <button className="text-gray-500 hover:text-white transition-colors">
              <SkipForward className="rotate-180" size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-green-600 text-black rounded-full flex items-center justify-center hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause fill="black" className="ml-0.5" size={28} />
              ) : (
                <Play fill="black" className="ml-1" size={28} />
              )}
            </button>
            <button className="text-gray-500 hover:text-white transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- INTERACTIVE COMPONENTS ---

const HubDevice = memo(() => {
  const [activeTab, setActiveTab] = useState("bio");

  return (
    <div
      className="absolute w-[420px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl z-40 flex flex-col border border-white/40 ring-1 ring-black/5"
      style={{ left: CX - 210, top: CY - 150 }}
    >
      <div className="h-10 flex items-center justify-between px-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400"></div>
        </div>
        <span className="text-[9px] font-mono text-slate-400 font-medium tracking-wider">
          UNIT_ID: Oluş-Emre
        </span>
      </div>

      <div className="p-6 text-slate-700 flex-1 flex flex-col">
        <div className="flex items-center gap-5 mb-6">
          <img
            src={PROFILE.avatar}
            alt="Profile"
            className="w-16 h-16 rounded-xl shadow-sm object-cover border border-slate-200"
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {PROFILE.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full border border-blue-200">
                {PROFILE.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex border-b border-slate-200 mb-4">
          <button
            onClick={() => setActiveTab("bio")}
            className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors relative ${
              activeTab === "bio"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            BIO
            {activeTab === "bio" && (
              <motion.div
                layoutId="tabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("exp")}
            className={`px-4 py-2 text-xs font-bold tracking-wider transition-colors relative ${
              activeTab === "exp"
                ? "text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            EXPERIENCE_LOG
            {activeTab === "exp" && (
              <motion.div
                layoutId="tabLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        </div>

        <div className="h-48 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "bio" ? (
              <motion.div
                key="bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-slate-50 p-3 rounded border border-slate-100 text-sm leading-relaxed text-slate-600 font-sans">
                  {PROFILE.bio}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(PROFILE.socials).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 p-2 bg-white border border-slate-200 rounded hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                    >
                      {key === "linkedin" && (
                        <Linkedin
                          size={14}
                          className="text-slate-400 group-hover:text-blue-600"
                        />
                      )}
                      {key === "github" && (
                        <Github
                          size={14}
                          className="text-slate-400 group-hover:text-slate-900"
                        />
                      )}
                      {key === "mail" && (
                        <Mail
                          size={14}
                          className="text-slate-400 group-hover:text-emerald-600"
                        />
                      )}
                      <span className="text-[10px] font-bold uppercase text-slate-500 group-hover:text-slate-800">
                        {key}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="exp"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {EXPERIENCE.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-4 border-l-2 border-slate-200 pb-1"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-blue-400"></div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {exp.role}
                    </h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-slate-600">
                        {exp.company}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 rounded">
                        {exp.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="h-1.5 bg-slate-50 rounded-b-xl border-t border-slate-100 mx-4 mb-2"></div>
    </div>
  );
});

const PaperCard = memo(({ data, onSelect, isSelected }) => {
  return (
    <motion.div
      layoutId={`card-container-${data.id}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isSelected ? 0 : 1,
        scale: 1,
      }}
      style={{
        position: "absolute",
        left: data.pos.x,
        top: data.pos.y,
        rotate: data.rotation,
        zIndex: isSelected ? 0 : 1,
      }}
      whileHover={{
        y: -4,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        zIndex: 50,
        borderColor: "#94a3b8",
        transition: { duration: 0.2 },
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
      className="w-[300px] min-h-[240px] bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15)] cursor-pointer group flex flex-col font-mono text-xs text-slate-800 border border-slate-200 rounded-sm transition-colors duration-200"
    >
      <motion.div className="w-full h-full flex flex-col bg-white rounded-sm overflow-hidden">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/80 border border-white/50 shadow-sm rotate-1 z-20 backdrop-blur-sm opacity-80"></div>
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="flex justify-between items-start mb-2">
            <motion.span
              layoutId={`card-title-${data.id}`}
              className="font-bold text-lg tracking-tight text-slate-800 uppercase"
            >
              {data.title}
            </motion.span>
            <div className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-sm">
              {data.status}
            </div>
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 uppercase tracking-wider">
            <span>REF: {data.refCode}</span>
            <span>{data.date}</span>
          </div>
        </div>
        <div className="flex-1 p-4 relative bg-white">
          <div className="relative z-10">
            <div className="mb-3 font-bold text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1 w-fit">
              {data.shortDesc}
            </div>
            <motion.p
              layoutId={`card-content-${data.id}`}
              className="mb-4 leading-relaxed font-sans text-sm text-slate-600 line-clamp-4"
            >
              {data.content}
            </motion.p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {data.tech.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-medium rounded-full border border-slate-100"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 opacity-[0.08] rotate-[-15deg] pointer-events-none">
          {data.category === "MECH" && <Settings size={64} />}
          {data.category === "ELEC" && <Zap size={64} />}
          {data.category === "SOFT" && <Terminal size={64} />}
        </div>
      </motion.div>
    </motion.div>
  );
});

const Navbar = memo(({ currentPage, setPage }) => {
  const items = [
    { id: "OVERVIEW", label: "OVERVIEW", icon: <Maximize2 size={18} /> },
    { id: "SKILLS", label: "SPECS", icon: <Cpu size={18} /> },
    { id: "SONGS", label: "RADIO", icon: <Radio size={18} /> },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-white/40 px-6 py-3 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] flex items-center gap-6 ring-1 ring-black/5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all relative group ${
              currentPage === item.id
                ? "text-blue-600 scale-110"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-colors ${
                currentPage === item.id
                  ? "bg-blue-50"
                  : "group-hover:bg-slate-50"
              }`}
            >
              {item.icon}
            </div>
            <span className="text-[9px] font-bold tracking-widest font-mono absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white px-2 py-0.5 rounded">
              {item.label}
            </span>
            {currentPage === item.id && (
              <div className="w-1 h-1 bg-blue-600 rounded-full absolute -bottom-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
});

// --- MAIN ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState("OVERVIEW");
  const [selectedCard, setSelectedCard] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const isDraggingCanvas = useRef(false);

  // We use x and y motion values to control the initial position of the dragged map
  // This solves the "start in the middle" problem without using scrollTo (which is for scrollbars)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // --- AUTO-CENTERING LOGIC ---
  // Calculates the negative offset needed to place the center (CX, CY) in the middle of the viewport
  useLayoutEffect(() => {
    const centerX = window.innerWidth / 2 - CX;
    const centerY = window.innerHeight / 2 - CY;
    x.set(centerX);
    y.set(centerY);
    // Give the UI a brief moment to settle before removing loader
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden bg-[#1688e8] font-sans text-slate-800 cursor-default selection:bg-blue-200">
      {/* Themed Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            aria-busy="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#1688e8]"
          >
            <div className="absolute inset-0">
              <GridPattern />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative bg-white/95 backdrop-blur-xl border border-white/40 ring-1 ring-black/5 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] p-8 w-[320px] text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-3 text-slate-800">
                <Terminal size={18} className="text-blue-600" />
                <span className="font-mono text-xs tracking-widest font-bold">SYSTEM BOOT</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-4">OLUŞ EMRE DEMİR</h1>
              <p className="text-xs text-slate-500 font-mono mb-6">DESIGN ENGINEER // MAKER</p>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="h-full bg-blue-500"
                />
              </div>
              <div className="mt-3 text-[10px] text-slate-500 font-mono flex items-center justify-center gap-2">
                <Radio size={12} className="text-blue-500" />
                <span>Initializing desk layout…</span>
              </div>

              {/* Tiny animated dots */}
              <div className="mt-4 flex items-center justify-center gap-1">
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-500/70"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.06 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navbar */}
  {!isLoading && <Navbar currentPage={page} setPage={setPage} />}

      <AnimatePresence mode="wait">
        {/* --- OVERVIEW PAGE (The Desk) --- */}
        {!isLoading && page === "OVERVIEW" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full overflow-hidden relative"
          >
            {/* Draggable Workspace Container */}
            {/* The background grid is INSIDE here so it moves with drag */}
            <motion.div
              drag
              style={{ x, y, willChange: "transform" }} // Controlled by motion values
              dragConstraints={{
                left: -(CANVAS_WIDTH - window.innerWidth),
                right: 0,
                top: -(CANVAS_HEIGHT - window.innerHeight),
                bottom: 0,
              }}
              className="absolute w-[3000px] h-[2000px] cursor-grab active:cursor-grabbing bg-[#1688e8]"
              onDragStart={() => (isDraggingCanvas.current = true)}
              onDragEnd={() =>
                setTimeout(() => (isDraggingCanvas.current = false), 100)
              }
            >
              <GridPattern /> {/* Moves with the desk */}
              {/* Stickers & Decor */}
              {STICKERS.map((s, i) => (
                <FunSticker key={i} {...s} />
              ))}
              <CoffeeStain />
              <WarningTape />
              <Ruler />
              <Chip />
              <HubDevice />
              {PROJECTS.map((project) => (
                <PaperCard
                  key={project.id}
                  data={project}
                  onSelect={(data) => {
                    if (!isDraggingCanvas.current) setSelectedCard(data);
                  }}
                  isSelected={selectedCard?.id === project.id}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* --- SUB-PAGES --- */}
        {/* Note: They have their own static GridPattern background */}

        {!isLoading && page === "SKILLS" && <SkillsPage key="skills" />}

        {!isLoading && page === "SONGS" && <SongsPage key="songs" />}
      </AnimatePresence>

      {/* --- PROJECT MODAL (Only on Overview) --- */}
      <AnimatePresence>
        {!isLoading && selectedCard && !viewingDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              layoutId={`card-container-${selectedCard.id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white w-full max-w-3xl shadow-2xl relative rounded-lg overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[85vh] z-50"
            >
              <div className="bg-white p-6 md:p-8 border-b border-slate-100 flex justify-between items-start sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded tracking-wider uppercase">
                      {selectedCard.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {selectedCard.date}
                    </span>
                  </div>
                  <motion.h2
                    layoutId={`card-title-${selectedCard.id}`}
                    className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight"
                  >
                    {selectedCard.title}
                  </motion.h2>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="text-slate-400" />
                </button>
              </div>
              <div className="p-6 md:p-8 font-sans text-slate-600 overflow-y-auto flex-1 custom-scrollbar">
                <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-10">
                  <div className="md:col-span-2 space-y-8 order-1">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                        Abstract
                      </h3>
                      <motion.p
                        layoutId={`card-content-${selectedCard.id}`}
                        className="text-sm leading-relaxed"
                      >
                        {selectedCard.content}
                      </motion.p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                        Key Deliverables
                      </h3>
                      <ul className="text-sm space-y-3 list-disc pl-4 marker:text-blue-500">
                        <li>
                          Core architecture utilizing{" "}
                          <strong>{selectedCard.tech[0]}</strong> and{" "}
                          <strong>{selectedCard.tech[1]}</strong>.
                        </li>
                        <li>
                          Rigorous testing completed in{" "}
                          <strong>{selectedCard.status}</strong> phase with
                          focus on reliability.
                        </li>
                        <li>
                          Optimized for performance efficiency and scalability.
                        </li>
                      </ul>
                    </motion.div>
                  </div>

                  {/* Tech Stack Side Card - Moves to bottom on mobile */}
                  <div className="md:col-span-1 bg-slate-50 p-5 rounded-lg h-fit border border-slate-100 order-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Target size={14} className="text-blue-500" /> Tech
                        Stack
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCard.tech.map((t) => (
                          <div
                            key={t}
                            className="bg-white px-3 py-2 text-xs font-medium border border-slate-200 rounded text-slate-600 shadow-sm"
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                      <button
                        onClick={() => setViewingDoc(selectedCard)}
                        className="flex-1 py-3 bg-slate-900 text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 w-full"
                      >
                        READ{" "}
                        <ChevronRight size={14} className="flex-shrink-0" />
                      </button>
                      <button className="w-full sm:w-12 py-3 bg-white text-slate-700 rounded border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm">
                        <Github size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3 text-[10px] text-slate-400 flex justify-between items-center border-t border-slate-100 mt-auto sticky bottom-0">
                <span className="font-mono">
                  ID: {selectedCard.id.toUpperCase()}
                </span>
                <span className="font-mono">STATUS: {selectedCard.status}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FULL DOCUMENT VIEW --- */}
      <AnimatePresence>
        {!isLoading && viewingDoc && (
          <ProjectDocument
            project={viewingDoc}
            onClose={() => setViewingDoc(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
