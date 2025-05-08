'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Demo tasks for globe and dashboard
const demoTasks = [
  { id: 1, title: 'Project Kickoff', category: 'Planning', date: '2025-05-08', status: 'Scheduled', lat: 20, lon: 30 },
  { id: 2, title: 'Design Review', category: 'Design', date: '2025-05-10', status: 'In Progress', lat: -10, lon: 100 },
  { id: 3, title: 'Code Implementation', category: 'Development', date: '2025-05-12', status: 'Pending', lat: 40, lon: -50 },
  { id: 4, title: 'Testing Phase', category: 'Testing', date: '2025-05-15', status: 'Pending', lat: -30, lon: -120 },
];

// Productivity tips
const productivityTips = [
  'Chunk tasks into 25-minute focus sessions.',
  'Prioritize high-impact tasks early in the day.',
  'Use labels to categorize and streamline workflows.',
  'Schedule breaks to maintain peak productivity.',
];

// Task categories
const categories = ['All', 'Planning', 'Design', 'Development', 'Testing'];

const IntroPage = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState(demoTasks);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const canvasRef = useRef(null);
  const globeRef = useRef(null);

  // Cycle through productivity tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % productivityTips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  // Filter tasks based on category and search
  useEffect(() => {
    let tasks = demoTasks;
    if (selectedCategory !== 'All') {
      tasks = tasks.filter((task) => task.category === selectedCategory);
    }
    if (searchQuery) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTasks(tasks);
  }, [selectedCategory, searchQuery]);

  // Particle system with connectivity
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: Math.random() * 0.4 - 0.2,
      vy: Math.random() * 0.4 - 0.2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      particles.forEach((p1) => {
        p1.x += p1.vx;
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3D Task Globe
  useEffect(() => {
    const container = globeRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const taskPoints = demoTasks.map((task) => {
      const phi = (90 - task.lat) * (Math.PI / 180);
      const theta = (task.lon + 180) * (Math.PI / 180);
      const x = 5 * Math.sin(phi) * Math.cos(theta);
      const y = 5 * Math.cos(phi);
      const z = 5 * Math.sin(phi) * Math.sin(theta);
      const pointGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const pointMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const point = new THREE.Mesh(pointGeo, pointMat);
      point.position.set(x, y, z);
      scene.add(point);
      return point;
    });

    camera.position.z = 10;

    const animate = () => {
      sphere.rotation.y += 0.005;
      taskPoints.forEach((point) => {
        point.scale.set(1 + Math.sin(Date.now() * 0.002) * 0.2, 1 + Math.sin(Date.now() * 0.002) * 0.2, 1);
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
      {/* Particle Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Hero Section */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-center text-center px-4 py-8 md:py-12 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-blue-800 mb-4"
          variants={itemVariants}
        >
          Revolutionize Your Productivity
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-gray-600 mb-6 max-w-xl"
          variants={itemVariants}
        >
          Orchestrate tasks, optimize workflows, and achieve unparalleled efficiency.
        </motion.p>
        <motion.div 
  className="flex flex-col sm:flex-row justify-center gap-8 mb-6" 
  variants={itemVariants}
>
  <Link href="/login" passHref>
    <motion.button
      className="relative w-64 py-4 px-10 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-shadow duration-300"
      whileHover={{ scale: 1.05, background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 text-xl tracking-wide">Login</span>
    </motion.button>
  </Link>

  <Link href="/register" passHref>
    <motion.button
      className="relative w-64 py-4 px-10 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-300/50 transition-shadow duration-300"
      whileHover={{ scale: 1.05, background: 'linear-gradient(to right, #14b8a6, #06b6d4)' }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 text-xl tracking-wide">Start Now</span>
    </motion.button>
  </Link>
        </motion.div>




        {/* Productivity Tip */}
        <motion.div
          className="bg-blue-100 p-4 rounded-lg shadow-md max-w-md w-full mb-6"
          key={currentTip}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-700 italic">"{productivityTips[currentTip]}"</p>
        </motion.div>
      </motion.div>

      {/* Task Globe Section */}
      <div className="py-12 bg-white z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8">
            Explore Your Task Universe
          </h2>
          <div
            ref={globeRef}
            className="w-full h-[300px] md:h-[400px] mx-auto"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Task Search and Filter Section */}
      <div className="py-12 bg-blue-50 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8">
            Organize with Precision
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-blue-300 focus:outline-none focus:border-blue-600"
            />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`py-2 px-4 rounded-lg ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.length ? (
              filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-blue-800">{task.title}</h3>
                  <p className="text-gray-600">Category: {task.category}</p>
                  <p className="text-gray-600">Due: {task.date}</p>
                  <p className="text-gray-600">Status: {task.status}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No tasks match your criteria.</p>
            )}
          </div>
        </div>
      </div>

      {/* Productivity Dashboard Preview */}
      <div className="py-12 bg-white z-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8">
            Your Productivity at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="bg-blue-50 p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Completion Rate</h3>
              <p className="text-3xl font-bold text-gray-700">75%</p>
              <p className="text-gray-600">Based on demo tasks</p>
            </motion.div>
            <motion.div
              className="bg-blue-50 p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Upcoming Deadlines</h3>
              <p className="text-3xl font-bold text-gray-700">3</p>
              <p className="text-gray-600">Within next 7 days</p>
            </motion.div>
            <motion.div
              className="bg-blue-50 p-6 rounded-lg shadow-md text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Active Projects</h3>
              <p className="text-3xl font-bold text-gray-700">2</p>
              <p className="text-gray-600">Currently in progress</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-blue-50 z-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-8">Next-Level Task Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="p-6 bg-white rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Task Manager</h3>
              <p className="text-gray-600">
                You can assign tasks to team members, set deadlines, and track progress.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Cross-Platform Sync</h3>
              <p className="text-gray-600">
                Access your tasks seamlessly on mobile, tablet, or desktop.
              </p>
            </motion.div>
            <motion.div
              className="p-6 bg-white rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Advanced Automation</h3>
              <p className="text-gray-600">
                Automate repetitive tasks with custom workflows.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;