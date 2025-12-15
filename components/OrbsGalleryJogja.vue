<template>
  <div class="relative min-h-screen text-white overflow-hidden">
    <!-- Page Title & Subtitle -->
    <div
      class="absolute top-6 left-1/2 transform -translate-x-1/2 text-center z-20 px-4"
    >
      <h1 class="text-4xl md:text-5xl font-bold mb-2">Yogyakarta</h1>
      <p class="text-sm md:text-lg opacity-80">
        Click each photo to describe the moments
      </p>
    </div>

    <!-- Canvas untuk garis constellation -->
    <canvas ref="canvas" class="absolute inset-0 z-0"></canvas>

    <!-- Floating Orbs -->
    <div
      v-for="(memory, i) in memories"
      :key="i"
      class="orb"
      :style="orbStyle(i)"
      @click="open(memory)"
    >
      <img :src="memory.image" alt="" />
      <span class="orb-glow"></span>
    </div>

    <!-- Tooltip -->
    <transition name="fade">
      <div
        v-if="active"
        class="absolute inset-0 flex items-center justify-center z-50 px-4"
      >
        <div
          class="tooltip-card flex flex-col md:flex-row items-center md:items-start gap-6"
        >
          <!-- Foto kanan -->
          <div class="flex-shrink-0 w-48 md:w-64">
            <img
              :src="active.image"
              alt=""
              class="rounded-xl shadow-lg w-full h-auto object-cover"
            />
          </div>

          <!-- Deskripsi kiri -->
          <div class="flex-1 text-left">
            <h3>{{ active.title }}</h3>
            <p>{{ active.description }}</p>
            <button @click="close">Close</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";

const canvas = ref(null);
const active = ref(null);

const memories = [
  {
    title: "📍 Bosas",
    description: "Ini pas pertama ketemu main Badminton 😁",
    image: "/images/jogja/1.jpeg",
  },
  {
    title: "📍 Bosas",
    description: "Badminton ke-2, udah mulai suka tapi lupa nama kamu 😭",
    image: "/images/jogja/2.jpeg",
  },
  {
    title: "📍 RS Bethesda",
    description: "Nganterin princess ke IGD samnpe harus pake Emergency Bed",
    image: "/images/jogja/3.jpeg",
  },
  {
    title: "📍XXXX",
    description: "Nge date ke tempat paling sepi wkwk",
    image: "/images/jogja/4.jpeg",
  },
  {
    title: "📍XXXX",
    description: "Pertama confess ke kamu hihi.",
    image: "/images/jogja/5.jpeg",
  },
  {
    title: "📍Depan Kosmu banget",
    description: "Makasi suprisenyaaa sayaaaanggg! 🥳",
    image: "/images/jogja/6.jpeg",
  },
  {
    title: "📍 XXXX",
    description: "Mam sop ayaaammm.",
    image: "/images/jogja/7.jpeg",
  },
  {
    title: "📍 Lab Art Parfume",
    description: "Gatau suka aja motoin kamu hehe",
    image: "/images/jogja/8.jpeg",
  },
  {
    title: "📍GameID",
    description: "Hayuuu main game lagi yanggg 🤖",
    image: "/images/jogja/9.jpeg",
  },
  {
    title: "📍Tugu",
    description: "Biar kayak turis nongkorngnya di Tugu yekaaann.",
    image: "/images/jogja/10.jpeg",
  },
  {
    title: "📍Malioboro",
    description: "Photobooth pertama sama kamuu.",
    image: "/images/jogja/11.jpeg",
  },
  {
    title: "📍Malioboro",
    description: "Si paling olahraga wkwk",
    image: "/images/jogja/12.jpeg",
  },
];

const ORB_BASE = 120;
const ORB_MIN = 60;
const MIN_DISTANCE = 140;
const TOP_OFFSET = 120;

const positions = [];
const generatePosition = () => {
  let x,
    y,
    tries = 0;
  const maxWidth = window.innerWidth - ORB_BASE;
  const maxHeight = window.innerHeight - ORB_BASE - TOP_OFFSET;
  do {
    x = Math.random() * maxWidth;
    y = TOP_OFFSET + Math.random() * maxHeight;
    tries++;
    if (tries > 100) break;
  } while (positions.some((p) => Math.hypot(p.x - x, p.y - y) < MIN_DISTANCE));
  positions.push({ x, y });
  return { x, y };
};

const orbPositions = memories.map(() => generatePosition());
const getOrbSize = () => (window.innerWidth < 640 ? ORB_MIN : ORB_BASE);

const orbStyle = (i) => {
  const size = getOrbSize();
  return {
    top: `${orbPositions[i].y}px`,
    left: `${orbPositions[i].x}px`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${i * 1.5}s`,
  };
};

const open = (memory) => (active.value = memory);
const close = () => (active.value = null);

const drawLines = () => {
  const ctx = canvas.value.getContext("2d");
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.strokeStyle = "rgba(200,200,255,0.5)";
  ctx.lineWidth = 1.5;
  ctx.shadowColor = "rgba(180,180,255,0.6)";
  ctx.shadowBlur = 8;

  const size = getOrbSize();

  for (let i = 0; i < orbPositions.length; i++) {
    const p1 = orbPositions[i];
    let closestDist = Infinity;
    let closestIndex = null;

    for (let j = 0; j < orbPositions.length; j++) {
      if (i === j) continue;
      const p2 = orbPositions[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = j;
      }
    }

    if (closestIndex !== null) {
      const p2 = orbPositions[closestIndex];
      ctx.beginPath();
      ctx.moveTo(p1.x + size / 2, p1.y + size / 2);
      ctx.lineTo(p2.x + size / 2, p2.y + size / 2);
      ctx.stroke();
    }
  }
};

onMounted(() => {
  nextTick(() => drawLines());
  window.addEventListener("resize", drawLines);
});
</script>

<style scoped>
.orb {
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  animation: float 3s ease-in-out infinite;
  z-index: 10;
}

.orb img {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 18px rgba(180, 180, 255, 0.6),
    0 0 36px rgba(140, 140, 255, 0.4);
}

.orb-glow {
  position: absolute;
  inset: -14px;
  z-index: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(200, 200, 255, 0.9),
    rgba(160, 160, 255, 0.4),
    transparent 70%
  );
  filter: blur(18px);
  pointer-events: none;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Tooltip Enhancements */
.tooltip-card {
  background: rgba(20, 20, 40, 0.95);
  padding: 24px;
  border-radius: 16px;
  max-width: 90%;
  box-shadow: 0 0 40px rgba(180, 180, 255, 0.3);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tooltip-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tooltip-card p {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 16px;
}

.tooltip-card button {
  padding: 8px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c7b8ff, #a5d8ff);
  color: #1a1a2e;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
