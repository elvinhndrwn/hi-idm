<template>
  <section class="py-24 px-6">
    <h2 class="text-center text-3xl md:text-4xl font-bold mb-16">
      Little Notes 💫
    </h2>

    <div
      class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
    >
      <div
        v-for="(note, index) in notes"
        :key="index"
        class="note-container"
        @click="toggle(index)"
      >
        <div class="note" :class="{ flipped: flippedIndex === index }">
          <!-- Front -->
          <div class="note-face front">💌</div>

          <!-- Back -->
          <div class="note-face back">
            {{ note }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const notes = [
  "Terima kasih sudah selalu ada 🤍",
  "Aku bersyukur punya kamu ✨",
  "Jarak cuma angka buat kita 🌙",
  "Aku cinta kamu, selalu 💖",
  "Kamu rumahku 🏡",
  "Kita kuat bareng 🚀",
];

const flippedIndex = ref(null);

const toggle = (index) => {
  flippedIndex.value = flippedIndex.value === index ? null : index;
};
</script>

<style scoped>
.note-container {
  perspective: 1000px;
}

.note {
  width: 100%;
  height: 180px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s ease;
  animation: float 7s ease-in-out infinite;
}

.note.flipped {
  transform: rotateY(180deg);
}

.note-face {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.note-face.front {
  font-size: 3rem;
}

.note-face.back {
  transform: rotateY(180deg);
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
