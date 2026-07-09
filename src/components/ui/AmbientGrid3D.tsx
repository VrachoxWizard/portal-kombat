"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface AmbientGrid3DProps {
  color?: string; // hex string e.g. '#e11d48'
}

export default function AmbientGrid3D({ color = "#e11d48" }: AmbientGrid3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    
    // Orthographic camera works best for flat background grids to prevent clipping at screen borders
    const camera = new THREE.OrthographicCamera(
      -width / 200, width / 200,
      height / 200, -height / 200,
      0.1, 10
    );
    camera.position.z = 5;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Grid geometry
    // Calculate size of grid based on screen width/height
    const cols = 50;
    const rows = 40;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);

    const spacingX = (width / 150) / (cols - 1);
    const spacingY = (height / 150) / (rows - 1);
    const startX = -(cols - 1) * spacingX / 2;
    const startY = -(rows - 1) * spacingY / 2;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[idx * 3] = startX + c * spacingX;
        positions[idx * 3 + 1] = startY + r * spacingY;
        positions[idx * 3 + 2] = 0;

        uvs[idx * 2] = c / (cols - 1);
        uvs[idx * 2 + 1] = r / (rows - 1);
        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    // 4. Custom GLSL Shader Material
    const gridColor = new THREE.Color(color);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: gridColor },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;

          // Wave equation
          float wave = sin(pos.x * 1.8 + uTime * 0.9) * cos(pos.y * 1.8 + uTime * 0.9) * 0.15;
          
          // Distance to mouse (mouse coordinates are mapped to threejs ortho space coords)
          float dist = distance(pos.xy, uMouse);
          
          // Warp/push particles away from cursor
          if (dist < 1.8) {
            float strength = (1.8 - dist) / 1.8;
            pos.z += strength * 0.38;
            wave += strength * 0.12 * sin(uTime * 3.0);
          }

          pos.z += wave;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation based on distance / displacement
          gl_PointSize = 2.8 * (1.0 + abs(pos.z) * 2.5);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          // Circular particle shape
          float distToCenter = distance(gl_PointCoord, vec2(0.5));
          if (distToCenter > 0.5) discard;

          // Soft edge alpha
          float alpha = smoothstep(0.5, 0.2, distToCenter) * 0.35;
          
          // Fade grid edges slightly to blend with dark page background
          float edgeFade = sin(vUv.x * 3.14159) * sin(vUv.y * 3.14159);
          
          gl_FragColor = vec4(uColor, alpha * edgeFade);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 5. Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      // Map screen cursor coordinate to orthographic space coordinate limits
      const x = ((e.clientX / window.innerWidth) * 2 - 1) * (width / 200);
      const y = (-((e.clientY / window.innerHeight) * 2 - 1)) * (height / 200);
      mouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 6. Animation frame loop
    let animFrameId = 0;
    const timer = new THREE.Timer();

    const animate = (timestamp?: number) => {
      animFrameId = requestAnimationFrame(animate);
      
      timer.update(timestamp);
      const elapsed = timer.getElapsed();

      material.uniforms.uTime.value = elapsed;

      // Smoothly lerp mouse target values to prevent jumps
      const currentMouse = material.uniforms.uMouse.value as THREE.Vector2;
      currentMouse.x += (mouseRef.current.x - currentMouse.x) * 0.08;
      currentMouse.y += (mouseRef.current.y - currentMouse.y) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      camera.left = -w / 200;
      camera.right = w / 200;
      camera.top = h / 200;
      camera.bottom = -h / 200;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [color]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 bg-[#04050a]/95 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
