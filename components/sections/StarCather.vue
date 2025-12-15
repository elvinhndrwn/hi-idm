<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white"
  >
    <h2 class="text-3xl md:text-4xl font-bold mb-6">Catch the Stars ✨</h2>
    <p class="text-slate-300 mb-12 max-w-xl text-center">
      Kamu tangkep bintangnya yaa, ada pesan buat kamu 🌙
    </p>

    <!-- Score Display -->
    <div class="mb-8 text-xl md:text-2xl font-semibold">
      Stars Caught: {{ score }}
    </div>

    <!-- Star Area -->
    <div ref="starArea" class="relative w-full h-96 md:h-[500px]">
      <div
        v-for="(star, index) in stars"
        :key="index"
        class="star-emoji"
        :class="{ caught: star.caught }"
        :style="starStyle(star)"
        @click="catchStar(index)"
      >
        {{ star.caught ? "🌟" : "⭐" }}
      </div>
    </div>

    <!-- Tooltip -->
    <transition name="fade">
      <div
        v-if="activeStar"
        class="absolute inset-0 flex items-center justify-center z-50"
      >
        <div class="tooltip-card text-center">
          <h3 class="text-2xl font-bold">💌 A Message for You</h3>
          <p class="mt-4">{{ activeStar.message }}</p>
          <button @click="closeTooltip" class="mt-6">Close ✨</button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const starArea = ref(null);
const stars = ref([]);
const score = ref(0);
const activeStar = ref(null);

const messages = [
  "Kalau aku udah ke Jakarta, hal yang paling aku tunggu selain gajian itu Pap dari kamu hehe 🙂",
  "Kamu cantik, pake bangeettt!",
  "HP aku memorinya banyak kok yang kalau pap muka jangan yg sekali liat ya :)",
  "Kamu itu orangnya asik, baik, pinter, dan banyak deh pokoknya aku sukaaaa!",
  "Jangan pernah jadi orang sombong ya kalo udah sukses.",
  "Aku bersyukur bisa ketemu dan kenal sama Kamu.",
  "Jangan pernah nyerah sama apa yang belum kamu dapetin, semangat!",
  "Can I Kiss your for a thousand times? hihi",
  "Semangat dietnya Sayang.",
  "Tahun depan kalau jadi CPNSan, semoga sukses ya yang!",
  "Love you to the moon and back 🤍",
  "Makasih yaa udah mau kenal aku.",
];

const generateStar = () => {
  const areaWidth = starArea.value.clientWidth;
  const areaHeight = starArea.value.clientHeight;
  return {
    x: Math.random() * (areaWidth - 30),
    y: Math.random() * (areaHeight - 30),
    speed: 0.5 + Math.random() * 1.5,
    direction: Math.random() < 0.5 ? 1 : -1,
    message: messages[Math.floor(Math.random() * messages.length)],
    caught: false,
  };
};

const initStars = (count = 15) => {
  stars.value = [];
  for (let i = 0; i < count; i++) stars.value.push(generateStar());
};

const starStyle = (star) => ({
  position: "absolute",
  top: `${star.y}px`,
  left: `${star.x}px`,
  fontSize: "2rem",
  cursor: "pointer",
  userSelect: "none",
  textShadow: "0 0 8px #fff, 0 0 16px #c7b8ff, 0 0 24px #a5d8ff",
  transition: "transform 0.3s ease, text-shadow 0.3s ease",
});

const animateStars = () => {
  const areaWidth = starArea.value.clientWidth;
  stars.value.forEach((star) => {
    if (!star.caught) {
      star.x += star.speed * star.direction;
      if (star.x < 0 || star.x > areaWidth - 30) star.direction *= -1;
    }
  });
  requestAnimationFrame(animateStars);
};

const catchStar = (index) => {
  score.value += 1;
  stars.value[index].caught = true;
  activeStar.value = stars.value[index];

  // animasi sederhana: scale-up lalu respawn
  setTimeout(() => {
    stars.value[index] = generateStar();
  }, 500); // bintang baru muncul setelah 0.5 detik
};

const closeTooltip = () => (activeStar.value = null);

onMounted(() => {
  initStars(15);
  animateStars();
});
</script>

<style scoped>
.star-emoji {
  transition: transform 0.2s ease, text-shadow 0.2s ease;
}
.star-emoji:hover {
  transform: scale(1.4);
  text-shadow: 0 0 12px #fff, 0 0 20px #c7b8ff, 0 0 32px #a5d8ff;
}

/* Animasi ketika sudah di-catch */
.star-emoji.caught {
  transform: scale(1.6);
  text-shadow: 0 0 16px #fff, 0 0 28px #ffd700, 0 0 40px #ffea85;
}

.tooltip-card {
  background: rgba(20, 20, 40, 0.95);
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(180, 180, 255, 0.4);
}

.tooltip-card button {
  margin-top: 12px;
  padding: 6px 16px;
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
