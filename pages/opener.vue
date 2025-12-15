<template>
  <div
    v-show="ready"
    class="min-h-screen flex flex-col justify-center items-center text-center overflow-hidden relative space-bg"
  >
    <!-- Starfield background -->
    <div
      v-for="i in 50"
      :key="'star-' + i"
      class="absolute rounded-full pointer-events-none"
      :style="{
        width: Math.random() * 3 + 1 + 'px',
        height: Math.random() * 3 + 1 + 'px',
        background: 'white',
        opacity: Math.random() * 0.8 + 0.2,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      }"
    ></div>

    <!-- Floating faces -->
    <div
      v-for="i in 8"
      :key="'face-' + i"
      class="absolute pointer-events-none"
      :style="{
        left: Math.random() * 90 + '%',
        top: Math.random() * 80 + '%',
      }"
    >
      <img
        src="/images/face.png"
        class="w-16 h-16 rounded-full opacity-70 shadow-lg"
      />
    </div>

    <h1 class="title text-4xl md:text-6xl font-bold mb-4 text-white">
      Hello, Intan Devi Maulidya!
    </h1>

    <p class="subtitle text-lg md:text-2xl mb-8 text-white/80">
      Coba klik tombol explore dibawah ini yak, semoga sukaaaak hehe 💕
    </p>

    <button
      class="button-opener px-8 py-3 rounded-full text-white shadow-lg hover:scale-105 transition-transform duration-300"
      style="background: linear-gradient(135deg, #5d688a, #7c82ff)"
      @click="goToLock"
    >
      Explore 👀
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import anime from "animejs/lib/anime.min.js";

const ready = ref(false);
const goToLock = () => navigateTo("/lock");

onMounted(() => {
  requestAnimationFrame(() => {
    ready.value = true;

    // Animasi teks
    anime({
      targets: ".title",
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 900,
      easing: "easeOutBack",
    });

    anime({
      targets: ".subtitle",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: 200,
      duration: 700,
      easing: "easeOutQuad",
    });

    // Animasi tombol
    anime({
      targets: ".button-opener",
      opacity: [0, 1],
      scale: [0.9, 1],
      delay: 400,
      duration: 700,
      easing: "easeOutBack",
    });

    // Animasi floating faces
    anime({
      targets: "img",
      translateY: [
        { value: -20, duration: 1500 },
        { value: 0, duration: 1500 },
      ],
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });

    // Animasi bintang
    anime({
      targets: ".space-bg div:not(img)",
      translateY: [
        { value: -10, duration: 3000 },
        { value: 0, duration: 3000 },
      ],
      direction: "alternate",
      loop: true,
      easing: "easeInOutSine",
    });
  });
});
</script>

<style scoped>
.space-bg {
  background: radial-gradient(ellipse at bottom, #0b0c1a, #1a1c3d);
}
</style>
