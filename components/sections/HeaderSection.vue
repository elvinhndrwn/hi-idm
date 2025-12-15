<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white"
  >
    <!-- TEXT -->
    <div class="relative z-10 text-center mb-5">
      <h1 class="text-4xl font-bold mb-3">Our Little Universe ✨</h1>
      <p class="opacity-80">
        Coba klik planetnya yang, ini kota-kota yang pernah kita datengin hehe
        🌍
      </p>
    </div>

    <!-- ORBIT -->
    <div class="relative orbit-container">
      <!-- CENTER -->
      <div class="center-us">
        <span>Cities we<br />traveled here</span>
      </div>

      <!-- ORBIT 1 -->
      <div class="orbit orbit-1">
        <div class="planet jogja">
          YK

          <div class="tooltip">
            <h4>Yogyakarta 🤍</h4>
            <p>The city where our story began.</p>
            <button class="tooltip-btn" @click="goToCity('jogja')">
              See memories
            </button>
          </div>
        </div>
      </div>

      <!-- ORBIT 2 -->
      <div class="orbit orbit-2">
        <div class="planet garut">
          GRT

          <div class="tooltip">
            <h4>Garut ✨</h4>
            <p>
              The haven of our first escape <br />
              and my very first summit.
            </p>
            <button class="tooltip-btn" @click="goToCity('garut')">
              See memories
            </button>
          </div>
        </div>
      </div>

      <!-- ORBIT 3 -->
      <div class="orbit orbit-3">
        <div class="planet malang">
          MLG

          <div class="tooltip">
            <h4>Malang 🌙</h4>
            <p>Our lips first traced a memory.</p>
            <button class="tooltip-btn" @click="goToCity('malang')">
              See memories
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* TOOLTIP */
.tooltip {
  position: absolute;
  bottom: 140%;
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  background: linear-gradient(135deg, #ffffff, #f3ecff);
  padding: 14px 16px;
  width: 200px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

/* Tooltip arrow */
.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: #f3ecff transparent transparent transparent;
}

/* Title */
.tooltip h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #3a2f5f;
}

/* Description */
.tooltip p {
  font-size: 12px;
  color: #6b5fa7;
  line-height: 1.4;
  margin-bottom: 10px;
}

/* Button */
.tooltip button {
  background: linear-gradient(135deg, #c7b8ff, #ffb4c6);
  color: #2a2143;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.tooltip button:hover {
  transform: scale(1.05);
}

/* SHOW tooltip on click / hover */
.planet:hover .tooltip,
.planet.active .tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
  pointer-events: auto;
}

/* ORBIT WRAPPER */
.orbit-container {
  width: 420px;
  height: 420px;
  position: relative;
}

/* CENTER */
.center-us {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffff, #c7b8ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #1a1a2e;
  box-shadow: 0 0 30px rgba(199, 184, 255, 0.8);
  z-index: 10;
}

.center-us span {
  text-align: center;
  font-size: 11px;
  line-height: 1.2;
}

/* ORBIT BASE */
.orbit {
  position: absolute;
  inset: 0;
  margin: auto;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: spin linear infinite;
}

/* ORBIT SIZE & SPEED */
.orbit-1 {
  width: 180px;
  height: 180px;
  animation-duration: 14s;
}

.orbit-2 {
  width: 260px;
  height: 260px;
  animation-duration: 22s;
}

.orbit-3 {
  width: 340px;
  height: 340px;
  animation-duration: 30s;
}

/* PLANET */
.planet {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 12px;
  white-space: nowrap;
}

/* COLORS */
.garut {
  background: #ffb4c6;
  box-shadow: 0 0 12px #ffb4c6;
}

.jogja {
  background: #a5d8ff;
  box-shadow: 0 0 12px #a5d8ff;
}

.malang {
  background: #cdb4ff;
  box-shadow: 0 0 12px #cdb4ff;
}

/* LABEL */
.planet span {
  position: absolute;
  top: -26px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.planet:hover span {
  opacity: 1;
}

/* COLORS */
.planet-garut {
  background: #ffb4c6;
  box-shadow: 0 0 12px #ffb4c6;
}

.planet-jogja {
  background: #a5d8ff;
  box-shadow: 0 0 12px #a5d8ff;
}

.planet-malang {
  background: #cdb4ff;
  box-shadow: 0 0 12px #cdb4ff;
}

/* ANIMATION */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const activeCity = ref(null);

const data = {
  garut: {
    title: "Garut",
    desc: "Where laughter felt warmer than the air.",
    link: "/gallery/garut",
  },
  jogja: {
    title: "Yogyakarta",
    desc: "Slow days, long talks, and quiet love.",
    link: "/gallery/jogja",
  },
  malang: {
    title: "Malang",
    desc: "Cold nights, close hearts.",
    link: "/gallery/malang",
  },
};

function open(city) {
  activeCity.value = city;
}

function close() {
  activeCity.value = null;
}

function go(url) {
  window.location.href = url;
}

onMounted(() => {
  window.addEventListener("click", close);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", close);
});

const goToCity = (city) => {
  navigateTo(`/memories/${city}`);
};
</script>
