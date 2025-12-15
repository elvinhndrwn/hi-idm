<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4"
  >
    <h2
      class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center"
    >
      Little Hopes 🌟
    </h2>

    <p class="text-slate-300 mb-8 sm:mb-12 max-w-md sm:max-w-xl text-center">
      Semangat buat semua impian yang kamu mau capai, kalau ada yang belum
      berarti ini cuma belum waktunya. Apapun yang kamu pengen Aku pasti dukung
      Sayang. Love you 🤍
    </p>

    <!-- Button Surprise -->
    <button
      @click="showPhoto = !showPhoto"
      class="mb-6 px-6 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition"
    >
      Coba klik tombol ini yang hihi 🤫
    </button>

    <!-- Foto muncul jika showPhoto true -->
    <img
      v-if="showPhoto"
      src="/images/kicil.jpeg"
      alt="Surprise"
      class="w-64 sm:w-96 rounded-xl shadow-lg transition-all mt-4"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";

const showPhoto = ref(false);
</script>
