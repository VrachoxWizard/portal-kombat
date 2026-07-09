"use client";

import React, { useEffect, useRef, useState } from "react";
import { 
  OrbitControls 
} from "three/examples/jsm/controls/OrbitControls.js";
import { Swords, Eye, RefreshCw, Zap, ShieldAlert } from "lucide-react";
import * as THREE from "three";

// Database Event interface based on schema.prisma
interface FighterDetails {
  name: string;
  weightClass: string;
  record: string;
  stance?: string | null;
  imageUrl?: string | null;
  bio?: string | null;
}

interface DBEvent {
  id: string;
  event: string;
  date: string;
  fighterA: string;
  fighterB: string;
  fighterARel?: FighterDetails | null;
  fighterBRel?: FighterDetails | null;
}

interface CombatArena3DProps {
  upcomingEvents?: DBEvent[];
}

// Fallback events data in Croatian if DB is empty
const FALLBACK_EVENTS: DBEvent[] = [
  {
    id: "fb-1",
    event: "UFC 308 Matchup",
    date: "25. srpnja 2026.",
    fighterA: "Jon Jones",
    fighterB: "Rico Verhoeven",
    fighterARel: {
      name: "Jon Jones",
      weightClass: "Teška kategorija (MMA)",
      record: "27-1-0 (1 NC)",
      stance: "Orthodox",
      bio: "UFC prvak u teškoj kategoriji i jedan od najvećih boraca svih vremena."
    },
    fighterBRel: {
      name: "Rico Verhoeven",
      weightClass: "Teška kategorija (Kickboks)",
      record: "64-10-0 (22 KO)",
      stance: "Orthodox",
      bio: "GLORY kickboks šampion u teškoj kategoriji, poznat kao 'Kralj kickboksa'."
    }
  },
  {
    id: "fb-2",
    event: "Riyadh Box Show",
    date: "15. kolovoza 2026.",
    fighterA: "Anthony Joshua",
    fighterB: "Kristian Prenga",
    fighterARel: {
      name: "Anthony Joshua",
      weightClass: "Teška kategorija (Boks)",
      record: "28-3-0 (25 KO)",
      stance: "Orthodox",
      bio: "Bivši dvostruki ujedinjeni svjetski prvak u teškoj kategoriji."
    },
    fighterBRel: {
      name: "Kristian Prenga",
      weightClass: "Teška kategorija (Boks)",
      record: "15-1-0 (14 KO)",
      stance: "Orthodox",
      bio: "Regionalni teškaški prvak razornog udarca."
    }
  },
  {
    id: "fb-3",
    event: "UFC 330",
    date: "29. kolovoza 2026.",
    fighterA: "Islam Makhachev",
    fighterB: "Ian Garry",
    fighterARel: {
      name: "Islam Makhachev",
      weightClass: "Laka kategorija (MMA)",
      record: "26-1-0",
      stance: "Southpaw",
      bio: "UFC prvak u lakoj kategoriji i vodeći na pound-for-pound ljestvici."
    },
    fighterBRel: {
      name: "Ian Garry",
      weightClass: "Velter kategorija (MMA)",
      record: "15-0-0",
      stance: "Orthodox",
      bio: "Neporaženi irski velteraš poznat po brzom tempu i elokvenciji."
    }
  },
  {
    id: "fb-4",
    event: "FNC 33: Zagreb",
    date: "12. rujna 2026.",
    fighterA: "Ivan Vitasović",
    fighterB: "TBA",
    fighterARel: {
      name: "Ivan Vitasović",
      weightClass: "Teška kategorija (MMA)",
      record: "13-6-1",
      stance: "Orthodox",
      bio: "Hrvatski teškaš, FNC prvak teške kategorije s iznimnom izdržljivošću."
    },
    fighterBRel: {
      name: "TBA",
      weightClass: "Teška kategorija",
      record: "0-0-0",
      stance: "Orthodox",
      bio: "Protivnik će biti objavljen uskoro."
    }
  }
];

type ThemeType = "obsidian" | "neon" | "gold";

interface SparkParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
  age: number;
  maxAge: number;
}

// Deterministic rating generator for fighter stats
function getFighterStats(name: string) {
  let striking = 75;
  let grappling = 70;
  let stamina = 80;
  
  if (name) {
    const codeSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    striking = 70 + (codeSum % 26);
    grappling = 60 + ((codeSum * 7) % 36);
    stamina = 75 + ((codeSum * 13) % 21);
  }
  
  if (name === "Jon Jones") { striking = 89; grappling = 96; stamina = 90; }
  else if (name === "Rico Verhoeven") { striking = 98; grappling = 45; stamina = 95; }
  else if (name === "Anthony Joshua") { striking = 95; grappling = 30; stamina = 85; }
  else if (name === "Kristian Prenga") { striking = 88; grappling = 40; stamina = 82; }
  else if (name === "Islam Makhachev") { striking = 82; grappling = 98; stamina = 94; }
  else if (name === "Ian Garry") { striking = 90; grappling = 75; stamina = 88; }
  else if (name === "Ivan Vitasović") { striking = 85; grappling = 80; stamina = 92; }

  return { striking, grappling, stamina };
}

// Helper to determine light theme based on fighter division/sport
function getThemeForEvent(event: DBEvent): ThemeType {
  const weight = (event.fighterARel?.weightClass || event.fighterBRel?.weightClass || "").toLowerCase();
  if (weight.includes("boks") || weight.includes("box")) return "neon";
  if (weight.includes("kickboks") || weight.includes("kickbox")) return "gold";
  return "obsidian"; // default MMA (Obsidian Red)
}

export default function CombatArena3D({ upcomingEvents }: CombatArena3DProps) {
  const events = upcomingEvents && upcomingEvents.length > 0 ? upcomingEvents : FALLBACK_EVENTS;

  // Selected state
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedCorner, setSelectedCorner] = useState<"red" | "blue" | "none">("none");
  const [lightTheme, setLightTheme] = useState<ThemeType>("obsidian");
  const [votedCorner, setVotedCorner] = useState<"red" | "blue" | null>(null);
  const [webglSupported] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch {
      return false;
    }
  });

  // References
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cageGroupRef = useRef<THREE.Group | null>(null);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const redLightRef = useRef<THREE.PointLight | null>(null);
  const blueLightRef = useRef<THREE.PointLight | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const autoRotateRef = useRef(true);



  // Physics-based sparks ref
  const activeSparksRef = useRef<SparkParticle[]>([]);
  const sparkPointsRef = useRef<THREE.Points | null>(null);
  const sparkMaxCount = 300;

  // Camera Cinematic Intro state ref (0 = starting, 1 = running, 2 = user control)
  const introPhaseRef = useRef(0);

  const activeEvent = events[currentEventIndex] || events[0];
  const fighterStats = getFighterStats(selectedCorner === "red" ? activeEvent.fighterA : activeEvent.fighterB);

  // Track previous event ID to adjust theme on matchup change during render, avoiding useEffect setState warning
  const [prevEventId, setPrevEventId] = useState(activeEvent?.id);
  if (activeEvent && activeEvent.id !== prevEventId) {
    setPrevEventId(activeEvent.id);
    setLightTheme(getThemeForEvent(activeEvent));
  }

  // Deterministic base votes based on activeEvent
  const baseRedVotes = (() => {
    const seed = (activeEvent.fighterA.length * 7 + activeEvent.fighterB.length * 13) % 100;
    return 45 + (seed % 15);
  })();
  const baseBlueVotes = (() => {
    const seed = (activeEvent.fighterA.length * 7 + activeEvent.fighterB.length * 13) % 100;
    return 55 - (seed % 15);
  })();

  const redVotes = baseRedVotes + (votedCorner === "red" ? 1 : 0);
  const blueVotes = baseBlueVotes + (votedCorner === "blue" ? 1 : 0);
  const totalVotesForActive = redVotes + blueVotes;
  const redPercent = Math.round((redVotes / totalVotesForActive) * 100);
  const bluePercent = 100 - redPercent;

  // Handle vote click
  const handleVote = (corner: "red" | "blue") => {
    if (votedCorner) return; // already voted for this event
    setVotedCorner(corner);
    triggerBlast(corner);
  };

  // Trigger physics-based spark shower on vote
  const triggerBlast = (corner: "red" | "blue") => {
    const x = corner === "red" ? -3.1 : 3.1;
    const z = corner === "red" ? 3.1 : -3.1;
    const color = corner === "red" ? new THREE.Color(0xe11d48) : new THREE.Color(0x2563eb);
    
    const count = 150;
    const newSparks: SparkParticle[] = [];
    for (let i = 0; i < count; i++) {
      newSparks.push({
        pos: new THREE.Vector3(
          x + (Math.random() - 0.5) * 0.15,
          1.0 + (Math.random() - 0.5) * 0.3,
          z + (Math.random() - 0.5) * 0.15
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.09 + (corner === "red" ? 0.04 : -0.04), // splash outward
          0.12 + Math.random() * 0.14, // vertical launch
          (Math.random() - 0.5) * 0.09 + (corner === "red" ? -0.04 : 0.04)
        ),
        color: color.clone(),
        size: 0.08 + Math.random() * 0.12,
        age: 0,
        maxAge: 70 + Math.random() * 40
      });
    }

    activeSparksRef.current = [...activeSparksRef.current, ...newSparks].slice(-sparkMaxCount);
  };

  // Switch events reset vote status
  const selectEvent = (index: number) => {
    setCurrentEventIndex(index);
    setVotedCorner(null);
    setSelectedCorner("none");

    // Smoothly pan camera slightly on matchup change
    const camera = cameraRef.current;
    if (camera) {
      camera.position.set(0, 4.5, 8.5);
      camera.lookAt(0, 0.5, 0);
    }
  };

  // Reset Camera view
  const handleResetCamera = () => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (camera && controls) {
      camera.position.set(0, 4.5, 8.5);
      controls.target.set(0, 0.5, 0);
      controls.update();
      introPhaseRef.current = 2; // skip intro
    }
  };

  // Update Three.js lights based on theme
  useEffect(() => {
    const spotLight = spotLightRef.current;
    const redLight = redLightRef.current;
    const blueLight = blueLightRef.current;
    const particles = particleSystemRef.current;
    if (!spotLight || !redLight || !blueLight) return;

    if (lightTheme === "obsidian") {
      spotLight.color.setHex(0xffffff);
      spotLight.intensity = 8.0;
      redLight.color.setHex(0xe11d48);
      redLight.intensity = 6.0;
      blueLight.color.setHex(0x1e3a8a);
      blueLight.intensity = 4.0;
      
      if (particles) (particles.material as THREE.PointsMaterial).color.setHex(0x94a3b8);
    } else if (lightTheme === "neon") {
      spotLight.color.setHex(0x06b6d4); // Cyan
      spotLight.intensity = 10.0;
      redLight.color.setHex(0xec4899); // Magenta pink
      redLight.intensity = 10.0;
      blueLight.color.setHex(0x06b6d4); // Cyan blue
      blueLight.intensity = 8.0;

      if (particles) (particles.material as THREE.PointsMaterial).color.setHex(0xec4899);
    } else if (lightTheme === "gold") {
      spotLight.color.setHex(0xf59e0b); // Gold
      spotLight.intensity = 12.0;
      redLight.color.setHex(0xf59e0b);
      redLight.intensity = 8.0;
      blueLight.color.setHex(0xb45309);
      blueLight.intensity = 6.0;

      if (particles) (particles.material as THREE.PointsMaterial).color.setHex(0xf59e0b);
    }
  }, [lightTheme]);

  // Main Three.js Scene Initialization
  useEffect(() => {
    if (!webglSupported) return;
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 350;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x04050a, 0.08);

    // 2. Camera setup - starts at a low, dramatic angle for cinematic sweep
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 0.6, 1.2);
    cameraRef.current = camera;
    introPhaseRef.current = 1; // Start intro sweep

    // 3. Renderer setup
    const isMobile = typeof navigator !== "undefined" && /iPhone|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Prevent page scroll hijack
    controls.minDistance = 5.0;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below floor level
    controls.target.set(0, 0.5, 0);
    controlsRef.current = controls;

    // 5. Build Octagon Ring Group
    const cageGroup = new THREE.Group();
    scene.add(cageGroup);
    cageGroupRef.current = cageGroup;

    // --- A. Octagon Floor Canvas Texture (with Bump Map) ---
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const ctx = floorCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#0c0d14";
      ctx.fillRect(0, 0, 1024, 1024);

      const cx = 512;
      const cy = 512;
      const radius = 500;

      ctx.strokeStyle = "#161c32";
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 10, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(71, 85, 105, 0.18)";
      ctx.lineWidth = 4;
      for (let i = 100; i < 1000; i += 80) {
        ctx.beginPath();
        ctx.moveTo(i, 50);
        ctx.lineTo(i, 974);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(50, i);
        ctx.lineTo(974, i);
        ctx.stroke();
      }

      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 8;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + Math.PI / 8;
        const x = cx + Math.cos(angle) * (radius - 20);
        const y = cy + Math.sin(angle) * (radius - 20);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = "rgba(225, 29, 72, 0.16)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius - 25, (Math.PI * 3.5) / 4, (Math.PI * 4.5) / 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(37, 99, 235, 0.16)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius - 25, (Math.PI * -0.5) / 4, (Math.PI * 0.5) / 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "900 85px sans-serif";
      
      ctx.save();
      ctx.translate(cx, cy - 65);
      ctx.fillText("PORTAL", 0, 0);
      ctx.restore();

      ctx.fillStyle = "#e11d48";
      ctx.save();
      ctx.translate(cx, cy + 55);
      ctx.fillText("KOMBAT", 0, 0);
      ctx.restore();

      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#e11d48";
      ctx.fillText("CRVENI KUT", 185, 512);
      ctx.fillStyle = "#2563eb";
      ctx.fillText("PLAVI KUT", 839, 512);
    }

    // Procedural Noise Bump Map for canvas fabric texture
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 64;
    bumpCanvas.height = 64;
    const bCtx = bumpCanvas.getContext("2d");
    if (bCtx) {
      bCtx.fillStyle = "#808080";
      bCtx.fillRect(0, 0, 64, 64);
      bCtx.fillStyle = "#ffffff";
      for (let i = 0; i < 64; i += 4) {
        bCtx.fillRect(i, 0, 1.5, 64);
        bCtx.fillRect(0, i, 64, 1.5);
      }
      bCtx.fillStyle = "#222222";
      for (let i = 2; i < 64; i += 4) {
        bCtx.fillRect(i, 0, 1, 64);
        bCtx.fillRect(0, i, 64, 1);
      }
    }
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(128, 128);

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    const floorGeo = new THREE.CylinderGeometry(3.5, 3.6, 0.25, 8);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.04,
      roughness: 0.75,
      metalness: 0.15,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.125;
    floorMesh.receiveShadow = true;
    cageGroup.add(floorMesh);

    // --- B. Metallic Corner Posts ---
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8);
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.18,
      metalness: 0.9,
    });

    const postRadius = 3.5;
    const postVertices: THREE.Vector3[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      const x = Math.cos(angle) * postRadius;
      const z = Math.sin(angle) * postRadius;
      const postPos = new THREE.Vector3(x, 0.9, z);
      postVertices.push(postPos);

      const postMesh = new THREE.Mesh(postGeo, postMat);
      postMesh.position.copy(postPos);
      postMesh.castShadow = true;
      cageGroup.add(postMesh);
    }

    // --- C. Procedural Chain-Link Fence Texture ---
    const fenceCanvas = document.createElement("canvas");
    fenceCanvas.width = 64;
    fenceCanvas.height = 64;
    const fCtx = fenceCanvas.getContext("2d");
    if (fCtx) {
      fCtx.clearRect(0, 0, 64, 64);
      fCtx.strokeStyle = "#475569";
      fCtx.lineWidth = 2.5;
      fCtx.beginPath();
      fCtx.moveTo(0, 32);
      fCtx.lineTo(32, 0);
      fCtx.lineTo(64, 32);
      fCtx.lineTo(32, 64);
      fCtx.closePath();
      fCtx.stroke();
    }
    const fenceTexture = new THREE.CanvasTexture(fenceCanvas);
    fenceTexture.wrapS = THREE.RepeatWrapping;
    fenceTexture.wrapT = THREE.RepeatWrapping;
    fenceTexture.repeat.set(16, 2);

    const fenceGeo = new THREE.CylinderGeometry(postRadius, postRadius, 1.4, 8, 1, true);
    const fenceMat = new THREE.MeshStandardMaterial({
      map: fenceTexture,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.8,
      depthWrite: false
    });
    const fenceMesh = new THREE.Mesh(fenceGeo, fenceMat);
    fenceMesh.position.y = 1.0;
    cageGroup.add(fenceMesh);

    // --- D. Glowing Corner Pads (Raycast Hotspots) ---
    const padGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 8);
    
    const redCornerIdx = 4; // Angle ~ 135deg (Left Corner)
    const redPadMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0x9f1239,
      emissiveIntensity: 0.8,
      roughness: 0.8,
    });
    const redPad = new THREE.Mesh(padGeo, redPadMat);
    redPad.position.copy(postVertices[redCornerIdx]);
    redPad.position.y = 0.9;
    redPad.name = "red-pad";
    cageGroup.add(redPad);

    const blueCornerIdx = 0; // Angle ~ -45deg (Right Corner)
    const bluePadMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1e40af,
      emissiveIntensity: 0.8,
      roughness: 0.8,
    });
    const bluePad = new THREE.Mesh(padGeo, bluePadMat);
    bluePad.position.copy(postVertices[blueCornerIdx]);
    bluePad.position.y = 0.9;
    bluePad.name = "blue-pad";
    cageGroup.add(bluePad);

    // --- E. Overhead Truss Gantry (UPGRADE) ---
    const trussGroup = new THREE.Group();
    cageGroup.add(trussGroup);

    const trussRingRadius = 3.5;
    const trussHeight = 2.3;
    const trussGeo = new THREE.BoxGeometry(2.8, 0.08, 0.08);
    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const nextAngle = ((i + 1) * Math.PI) / 4;
      const x1 = Math.cos(angle) * trussRingRadius;
      const z1 = Math.sin(angle) * trussRingRadius;
      const x2 = Math.cos(nextAngle) * trussRingRadius;
      const z2 = Math.sin(nextAngle) * trussRingRadius;
      
      const segment = new THREE.Mesh(trussGeo, trussMat);
      segment.position.set((x1 + x2) / 2, trussHeight, (z1 + z2) / 2);
      segment.lookAt(new THREE.Vector3(x2, trussHeight, z2));
      trussGroup.add(segment);
    }
    
    // Connect posts up to truss gantry
    const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      const x = Math.cos(angle) * postRadius;
      const z = Math.sin(angle) * postRadius;
      const strut = new THREE.Mesh(strutGeo, postMat);
      strut.position.set(x, 1.95, z);
      trussGroup.add(strut);
    }



    // --- G. Physics-Based Spark System (UPGRADE) ---
    const sparkPositions = new Float32Array(sparkMaxCount * 3);
    const sparkColors = new Float32Array(sparkMaxCount * 3);
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeo.setAttribute("color", new THREE.BufferAttribute(sparkColors, 3));
    
    const sparkMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);
    sparkPointsRef.current = sparkPoints;

    // --- H. Atmosphere Floating Particles ---
    const particleCount = isMobile ? 75 : 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.2) * 4;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.12 : 0.07,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // --- I. Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 8, 15, Math.PI / 3, 0.5, 1);
    spotLight.position.set(0, 6, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.bias = -0.002;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    const redLight = new THREE.PointLight(0xe11d48, 6, 4.5);
    redLight.position.copy(postVertices[redCornerIdx]);
    redLight.position.y = 1.0;
    scene.add(redLight);
    redLightRef.current = redLight;

    const blueLight = new THREE.PointLight(0x2563eb, 4, 4.5);
    blueLight.position.copy(postVertices[blueCornerIdx]);
    blueLight.position.y = 1.0;
    scene.add(blueLight);
    blueLightRef.current = blueLight;

    // Raycasting setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([redPad, bluePad]);

      if (intersects.length > 0) {
        const name = intersects[0].object.name;
        if (name === "red-pad") {
          setSelectedCorner("red");
          autoRotateRef.current = false;
        } else if (name === "blue-pad") {
          setSelectedCorner("blue");
          autoRotateRef.current = false;
        }
      }
    };

    const handleUserInteraction = () => {
      autoRotateRef.current = false;
      if (introPhaseRef.current === 1) {
        // Skip intro if user interacts
        introPhaseRef.current = 2;
      }
    };

    renderer.domElement.addEventListener("click", handleCanvasClick);
    renderer.domElement.addEventListener("pointerdown", handleUserInteraction);

    // Window resizing handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 350;
      
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // --- Animation loop ---
    let animFrameId = 0;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animFrameId = requestAnimationFrame(animate);
      
      timer.update(timestamp);
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();

      // 1. Cinematic Intro Camera Sweep
      if (introPhaseRef.current === 1) {
        const finalCameraPos = new THREE.Vector3(0, 4.5, 8.5);
        camera.position.lerp(finalCameraPos, 0.04);
        if (camera.position.distanceTo(finalCameraPos) < 0.15) {
          camera.position.copy(finalCameraPos);
          introPhaseRef.current = 2; // finish intro
        }
        controls.target.set(0, 0.5, 0);
      }

      // 2. Slow Cage Rotation
      if (autoRotateRef.current && cageGroupRef.current) {
        cageGroupRef.current.rotation.y = elapsed * 0.07;
      }



      // 4. Update Physics-Based Bouncing Sparks (UPGRADE)
      const activeSparks = activeSparksRef.current;
      if (sparkPointsRef.current && activeSparks.length > 0) {
        const pArray = sparkPointsRef.current.geometry.attributes.position.array as Float32Array;
        const cArray = sparkPointsRef.current.geometry.attributes.color.array as Float32Array;
        
        activeSparksRef.current = activeSparks.filter(spark => {
          spark.pos.add(spark.vel);
          spark.vel.y -= 0.0065; // gravity
          
          // Bounce off cage floor (y = 0)
          if (spark.pos.y < 0) {
            spark.pos.y = 0;
            spark.vel.y = -spark.vel.y * 0.45; // damping bounce height
            spark.vel.x *= 0.75;
            spark.vel.z *= 0.75;
          }
          
          spark.age += 1;
          return spark.age < spark.maxAge;
        });

        const newActive = activeSparksRef.current;
        for (let i = 0; i < sparkMaxCount; i++) {
          if (i < newActive.length) {
            const s = newActive[i];
            pArray[i * 3] = s.pos.x;
            pArray[i * 3 + 1] = s.pos.y;
            pArray[i * 3 + 2] = s.pos.z;
            
            const lifeRatio = 1.0 - (s.age / s.maxAge);
            cArray[i * 3] = s.color.r * lifeRatio;
            cArray[i * 3 + 1] = s.color.g * lifeRatio;
            cArray[i * 3 + 2] = s.color.b * lifeRatio;
          } else {
            pArray[i * 3] = 0;
            pArray[i * 3 + 1] = -999; // hide
            pArray[i * 3 + 2] = 0;
          }
        }
        sparkPointsRef.current.geometry.attributes.position.needsUpdate = true;
        sparkPointsRef.current.geometry.attributes.color.needsUpdate = true;
      }

      // 5. Animate Atmospheric Particles
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += delta * 0.15;
          if (positions[i] > 3.0) {
            positions[i] = -1.0;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
        particleSystemRef.current.rotation.y = elapsed * 0.02;
      }

      // 6. Update Orbit Controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // 7. Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // --- Cleanup on Unmount ---
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      
      if (renderer.domElement && handleCanvasClick) {
        renderer.domElement.removeEventListener("click", handleCanvasClick);
        renderer.domElement.removeEventListener("pointerdown", handleUserInteraction);
      }

      // Dispose of geometry & materials
      floorGeo.dispose();
      floorMat.dispose();
      floorTexture.dispose();
      bumpTexture.dispose();
      postGeo.dispose();
      postMat.dispose();
      fenceGeo.dispose();
      fenceMat.dispose();
      fenceTexture.dispose();
      padGeo.dispose();
      redPadMat.dispose();
      bluePadMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      trussGeo.dispose();
      trussMat.dispose();
      strutGeo.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();

      // Remove canvas
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [webglSupported]);

  // --- SVG/HTML Fallback Component ---
  if (!webglSupported) {
    return (
      <div className="surface-card flex flex-col md:grid md:grid-cols-2 min-h-[400px] border-2 border-border shadow-[var(--shadow-brutalist)] bg-[#04050a] rounded-none relative overflow-hidden">
        {/* Matchup details */}
        <div className="p-6 md:p-8 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-border z-10 bg-gradient-to-br from-[#080a12] to-transparent">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black tracking-widest bg-rose-600 text-white uppercase rounded-none">
                UŽIVO 3D PROGNOZA
              </span>
              <span className="text-xs text-muted-foreground font-semibold">{activeEvent.date}</span>
            </div>
            
            <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight mb-1">
              {activeEvent.event}
            </h2>
            <p className="text-xs text-muted-foreground mb-6">Pregled borbe i statistika. Odaberite borca i dajte svoj glas.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => setSelectedCorner("red")}
                className={`text-left p-4 rounded-none border-2 transition-all ${
                  selectedCorner === "red" 
                    ? "bg-rose-950/20 border-rose-600 shadow-[2px_2px_0px_#e11d48]" 
                    : "bg-[#090b14]/50 border-border/40 hover:border-rose-600/40"
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-rose-500 mb-1">CRVENI KUT</div>
                <div className="font-display font-black text-white tracking-wide">{activeEvent.fighterA}</div>
                <div className="text-xs text-slate-400 mt-1">{activeEvent.fighterARel?.record || "N/A"}</div>
              </button>

              <button 
                onClick={() => setSelectedCorner("blue")}
                className={`text-left p-4 rounded-none border-2 transition-all ${
                  selectedCorner === "blue" 
                    ? "bg-blue-950/20 border-blue-600 shadow-[2px_2px_0px_#2563eb]" 
                    : "bg-[#090b14]/50 border-border/40 hover:border-blue-600/40"
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-blue-500 mb-1">PLAVI KUT</div>
                <div className="font-display font-black text-white tracking-wide">{activeEvent.fighterB}</div>
                <div className="text-xs text-slate-400 mt-1">{activeEvent.fighterBRel?.record || "N/A"}</div>
              </button>
            </div>

            {selectedCorner !== "none" && (
              <div className={`p-4 border-l-4 rounded-none ${selectedCorner === "red" ? "bg-rose-950/10 border-rose-600" : "bg-blue-950/10 border-blue-600"}`}>
                <h4 className="font-display font-black text-sm uppercase tracking-wide text-white mb-2">
                  Statistika: {selectedCorner === "red" ? activeEvent.fighterA : activeEvent.fighterB}
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Težinska kategorija</span>
                    <span className="text-white font-medium">
                      {selectedCorner === "red" 
                        ? activeEvent.fighterARel?.weightClass || "Teška" 
                        : activeEvent.fighterBRel?.weightClass || "Teška"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Stav</span>
                    <span className="text-white font-medium">
                      {selectedCorner === "red" 
                        ? activeEvent.fighterARel?.stance || "Orthodox" 
                        : activeEvent.fighterBRel?.stance || "Orthodox"}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                  {selectedCorner === "red" ? activeEvent.fighterARel?.bio : activeEvent.fighterBRel?.bio}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex gap-2">
              <button 
                onClick={() => handleVote("red")}
                disabled={!!votedCorner}
                className="flex-1 py-3 text-center text-xs font-black uppercase tracking-wider text-white border-2 border-rose-600 bg-rose-600/10 hover:bg-rose-600 hover:text-black transition-all rounded-none"
              >
                {votedCorner === "red" ? "GLASANO ✔" : "CRVENI KUT"}
              </button>
              <button 
                onClick={() => handleVote("blue")}
                disabled={!!votedCorner}
                className="flex-1 py-3 text-center text-xs font-black uppercase tracking-wider text-white border-2 border-blue-600 bg-blue-600/10 hover:bg-blue-600 hover:text-black transition-all rounded-none"
              >
                {votedCorner === "blue" ? "GLASANO ✔" : "PLAVI KUT"}
              </button>
            </div>
            
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                <span>{activeEvent.fighterA} {redPercent}%</span>
                <span>{bluePercent}% {activeEvent.fighterB}</span>
              </div>
              <div className="w-full h-3 bg-slate-900 border border-border flex rounded-none">
                <div className="h-full bg-rose-600 transition-all duration-500" style={{ width: `${redPercent}%` }} />
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${bluePercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Fallback Graphic */}
        <div className="h-[280px] md:h-full flex items-center justify-center bg-[#070911] relative border-t-2 md:border-t-0 border-border">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_75%)]" />
          <svg className="w-48 h-48 text-[#161c32] animate-pulse" viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 82,18 95,50 82,82 50,95 18,82 5,50 18,18" />
            <polygon points="50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25" fill="#04050a" />
            <circle cx="50" cy="50" r="10" stroke="#e11d48" strokeWidth="1" fill="none" />
          </svg>
          <div className="absolute bottom-4 text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5 bg-[#04050a]/80 px-3 py-1 border border-border/50">
            <ShieldAlert size={12} className="text-amber-500" />
            WebGL nedostupan • Prikazan 2D režim
          </div>
        </div>
      </div>
    );
  }

  // --- WebGL Full Render Layout ---
  return (
    <div className="surface-card flex flex-col md:grid md:grid-cols-2 min-h-[460px] border-2 border-border shadow-[var(--shadow-brutalist)] bg-[#04050a] rounded-none relative overflow-hidden">
      
      {/* 1. Left Panel: Info Dashboard & Matchup Controller */}
      <div className="p-6 md:p-8 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-border z-10 bg-gradient-to-br from-[#080a12] to-transparent relative">
        <div className="absolute top-0 right-0 p-4 flex gap-1">
          <button 
            onClick={() => setLightTheme("obsidian")}
            title="Obsidian Red"
            className={`w-3.5 h-3.5 rounded-full bg-rose-600 border ${lightTheme === "obsidian" ? "border-white ring-2 ring-rose-950 scale-110" : "border-transparent"}`}
          />
          <button 
            onClick={() => setLightTheme("neon")}
            title="Neon Pink/Blue"
            className={`w-3.5 h-3.5 rounded-full bg-pink-500 border ${lightTheme === "neon" ? "border-white ring-2 ring-pink-950 scale-110" : "border-transparent"}`}
          />
          <button 
            onClick={() => setLightTheme("gold")}
            title="Championship Gold"
            className={`w-3.5 h-3.5 rounded-full bg-amber-500 border ${lightTheme === "gold" ? "border-white ring-2 ring-amber-950 scale-110" : "border-transparent"}`}
          />
        </div>

        <div>
          {/* Header info */}
          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-black tracking-widest bg-rose-600 text-white uppercase rounded-none shadow-[2px_2px_0px_#000]">
              <Zap size={10} className="fill-white" />
              INTERAKTIVNA ARENA
            </span>
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">{activeEvent.date}</span>
          </div>

          <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight mb-1.5">
            {activeEvent.event}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            Istražite borbu u 3D kavezu. Kliknite na crveni/plavi kut arene ili borca niže da biste vidjeli statistiku i glasovali.
          </p>

          {/* Tab buttons */}
          <div className="grid grid-cols-3 gap-1 mb-6 bg-slate-950 p-1 border border-border/40">
            <button
              onClick={() => { setSelectedCorner("none"); autoRotateRef.current = true; }}
              className={`py-1.5 text-[10px] font-black tracking-wider uppercase rounded-none transition-all ${
                selectedCorner === "none" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              SUČELJAVANJE
            </button>
            <button
              onClick={() => { setSelectedCorner("red"); autoRotateRef.current = false; }}
              className={`py-1.5 text-[10px] font-black tracking-wider uppercase rounded-none transition-all ${
                selectedCorner === "red" ? "bg-rose-600 text-black" : "text-rose-500 hover:text-white"
              }`}
            >
              CRVENI KUT
            </button>
            <button
              onClick={() => { setSelectedCorner("blue"); autoRotateRef.current = false; }}
              className={`py-1.5 text-[10px] font-black tracking-wider uppercase rounded-none transition-all ${
                selectedCorner === "blue" ? "bg-blue-600 text-white" : "text-blue-500 hover:text-white"
              }`}
            >
              PLAVI KUT
            </button>
          </div>

          {/* Dashboard Tab Content */}
          {selectedCorner === "none" ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between gap-4 p-4 border border-border bg-[#090b14]/40">
                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase font-bold text-rose-500 mb-0.5">Crveni Kut</div>
                  <div className="font-display font-black text-white text-base tracking-wide uppercase line-clamp-1">
                    {activeEvent.fighterA}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-1">
                    {activeEvent.fighterARel?.record || "0-0-0"}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0 w-8 h-8 rounded-none border border-border/80 bg-[#0d0e15] text-[10px] font-black text-rose-600">
                  <Swords size={14} />
                </div>

                <div className="text-center flex-1">
                  <div className="text-[10px] uppercase font-bold text-blue-500 mb-0.5">Plavi Kut</div>
                  <div className="font-display font-black text-white text-base tracking-wide uppercase line-clamp-1">
                    {activeEvent.fighterB}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-1">
                    {activeEvent.fighterBRel?.record || "0-0-0"}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3 leading-relaxed py-1">
                <span className="font-black text-white block uppercase text-[10px] tracking-wider mb-1">PROGNOZA PORTALA</span>
                Naša analitika predviđa uzbudljiv i neizvjestan meč. Kliknite na željeni kut za detaljnu biografiju i statistiku svakog borca.
              </div>
            </div>
          ) : (
            <div className={`p-4 border-l-4 rounded-none transition-all duration-300 ${
              selectedCorner === "red" 
                ? "bg-rose-950/15 border-rose-600" 
                : "bg-blue-950/15 border-blue-600"
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-display font-black text-base uppercase tracking-wide text-white">
                  {selectedCorner === "red" ? activeEvent.fighterA : activeEvent.fighterB}
                </h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 uppercase ${
                  selectedCorner === "red" ? "bg-rose-600/20 text-rose-400" : "bg-blue-600/20 text-blue-400"
                }`}>
                  {selectedCorner === "red" ? "RED CORNER" : "BLUE CORNER"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs border-b border-border/30 pb-3 mb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wide text-slate-400 block font-semibold">Težinska divizija</span>
                  <span className="text-white font-black font-display uppercase tracking-wide">
                    {selectedCorner === "red" 
                      ? activeEvent.fighterARel?.weightClass || "Teška kategorija" 
                      : activeEvent.fighterBRel?.weightClass || "Teška kategorija"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wide text-slate-400 block font-semibold">Stav borca</span>
                  <span className="text-white font-black font-display uppercase tracking-wide">
                    {selectedCorner === "red" 
                      ? activeEvent.fighterARel?.stance || "Orthodox" 
                      : activeEvent.fighterBRel?.stance || "Orthodox"}
                  </span>
                </div>
              </div>

              {/* Fighter Skill Ratings (UPGRADE) */}
              <div className="space-y-2.5 mb-4 pt-1">
                <span className="text-[9.5px] uppercase tracking-widest text-slate-400 block font-black mb-2">OCJENE VJEŠTINA:</span>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                    <span>UDARCI (STRIKING)</span>
                    <span className={selectedCorner === "red" ? "text-rose-500" : "text-blue-500"}>{fighterStats.striking}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 border border-border/35">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        selectedCorner === "red" ? "bg-rose-600 shadow-[0_0_8px_#f43f5e]" : "bg-blue-600 shadow-[0_0_8px_#2563eb]"
                      }`} 
                      style={{ width: `${fighterStats.striking}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                    <span>HRVANJE (GRAPPLING)</span>
                    <span className={selectedCorner === "red" ? "text-rose-500" : "text-blue-500"}>{fighterStats.grappling}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 border border-border/35">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        selectedCorner === "red" ? "bg-rose-600 shadow-[0_0_8px_#f43f5e]" : "bg-blue-600 shadow-[0_0_8px_#2563eb]"
                      }`} 
                      style={{ width: `${fighterStats.grappling}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 font-bold mb-1">
                    <span>KONDICIJA (STAMINA)</span>
                    <span className={selectedCorner === "red" ? "text-rose-500" : "text-blue-500"}>{fighterStats.stamina}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 border border-border/35">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        selectedCorner === "red" ? "bg-rose-600 shadow-[0_0_8px_#f43f5e]" : "bg-blue-600 shadow-[0_0_8px_#2563eb]"
                      }`} 
                      style={{ width: `${fighterStats.stamina}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-border/20 pt-3">
                &ldquo;{selectedCorner === "red" 
                  ? activeEvent.fighterARel?.bio || "UFC teškaš vrhunskog kalibra." 
                  : activeEvent.fighterBRel?.bio || "Šampionski kickboksač i izazivač."}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Voter Panel / Predictions */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => handleVote("red")}
              disabled={!!votedCorner}
              className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider transition-all rounded-none border-2 ${
                votedCorner === "red"
                  ? "bg-rose-600 text-black border-rose-600 shadow-[2px_2px_0px_#000]"
                  : votedCorner
                    ? "bg-transparent text-slate-600 border-slate-900 cursor-not-allowed"
                    : "text-rose-500 border-rose-600 bg-rose-600/5 hover:bg-rose-600 hover:text-black shadow-[3px_3px_0px_rgba(225,29,72,0.15)] hover:shadow-none"
              }`}
            >
              {votedCorner === "red" ? "GLASANO ✔" : "GLASAJ: CRVENI"}
            </button>
            
            <button 
              onClick={() => handleVote("blue")}
              disabled={!!votedCorner}
              className={`flex-1 py-3 text-center text-xs font-black uppercase tracking-wider transition-all rounded-none border-2 ${
                votedCorner === "blue"
                  ? "bg-blue-600 text-white border-blue-600 shadow-[2px_2px_0px_#000]"
                  : votedCorner
                    ? "bg-transparent text-slate-600 border-slate-900 cursor-not-allowed"
                    : "text-blue-500 border-blue-600 bg-blue-600/5 hover:bg-blue-600 hover:text-black shadow-[3px_3px_0px_rgba(37,99,235,0.15)] hover:shadow-none"
              }`}
            >
              {votedCorner === "blue" ? "GLASANO ✔" : "GLASAJ: PLAVI"}
            </button>
          </div>
          
          {/* Live voting meter */}
          <div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
              <span className={votedCorner === "red" ? "text-rose-500" : ""}>{activeEvent.fighterA} {redPercent}%</span>
              <span className="text-slate-600 font-normal">Rezultati čitatelja</span>
              <span className={votedCorner === "blue" ? "text-blue-500" : ""}>{bluePercent}% {activeEvent.fighterB}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 border border-border/30 flex rounded-none">
              <div className="h-full bg-rose-600 transition-all duration-700" style={{ width: `${redPercent}%` }} />
              <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${bluePercent}%` }} />
            </div>
          </div>

          {/* Event selector dots */}
          <div className="flex items-center justify-between border-t border-border/30 pt-4 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              OSTALI MEČEVI:
            </span>
            <div className="flex gap-1.5">
              {events.map((evt, idx) => (
                <button
                  key={evt.id}
                  onClick={() => selectEvent(idx)}
                  title={evt.event}
                  className={`px-2 py-0.5 text-[9px] font-bold uppercase transition-all rounded-none border ${
                    idx === currentEventIndex
                      ? "bg-white text-black border-white font-black"
                      : "bg-[#090b14] text-slate-400 border-border/40 hover:border-white hover:text-white"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Right Panel: Three.js 3D WebGL Canvas */}
      <div className="h-[320px] md:h-auto flex flex-col bg-[#05060b] relative select-none">
        
        {/* Canvas container */}
        <div ref={mountRef} className="flex-1 w-full h-full" />

        {/* Hover / instruction badge */}
        <div className="absolute top-4 left-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 bg-[#04050a]/80 px-2.5 py-1 border border-border/50 backdrop-blur-sm pointer-events-none">
          <Eye size={12} className="text-rose-500 animate-pulse" />
          Rotiraj kavez • Klikni na crveni/plavi kut
        </div>

        {/* Canvas floating controls */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          <button
            onClick={() => {
              autoRotateRef.current = !autoRotateRef.current;
            }}
            title="Pokreni/Zaustavi rotaciju"
            className="w-8 h-8 rounded-none border border-border bg-[#04050a]/90 hover:bg-[#161c32] text-white flex items-center justify-center transition-all shadow-[2px_2px_0px_#000]"
          >
            <RefreshCw size={14} className="animate-spin-slow" />
          </button>
          <button
            onClick={handleResetCamera}
            title="Resetiraj kameru"
            className="px-3.5 h-8 text-[9px] font-black uppercase tracking-widest rounded-none border border-border bg-[#04050a]/90 hover:bg-[#161c32] text-white flex items-center justify-center transition-all shadow-[2px_2px_0px_#000]"
          >
            RESET
          </button>
        </div>

        {/* Glow corner indicators matching current light theme */}
        <div className="absolute top-4 right-4 pointer-events-none text-right">
          <span className="text-[9px] font-black tracking-widest text-slate-500 block uppercase mb-1">
            SVJETLA ARENE
          </span>
          <span className={`text-[10px] font-black font-display uppercase ${
            lightTheme === "obsidian" ? "text-rose-500" : lightTheme === "neon" ? "text-pink-500" : "text-amber-500"
          }`}>
            {lightTheme === "obsidian" ? "Obsidian" : lightTheme === "neon" ? "Cyber Neon" : "Championship"}
          </span>
        </div>
      </div>
    </div>
  );
}
