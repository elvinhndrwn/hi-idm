<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4"
  >
    <h2
      class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center"
    >
      Meet You For The First Time ⏳
    </h2>

    <p class="text-slate-300 mb-8 sm:mb-12 max-w-md sm:max-w-xl text-center">
      Pada suatu hari, ada pemuda bantul dengan PD-nya ngajak nonton mbak-mbak
      teller cantik CIMB Niaga wkwkw
    </p>

    <div class="flex flex-wrap justify-center gap-4 sm:gap-6">
      <div v-for="item in counters" :key="item.label" class="counter-card">
        <div class="number">{{ item.value }}</div>
        <div class="label">{{ item.label }}</div>
      </div>
    </div>

    <p class="text-slate-300 max-w-md sm:max-w-xl text-center mt-5">
      yang lalu.
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

/**
 * GANTI TANGGAL PERTAMA KALIAN DI SINI
 */
const startDate = new Date("2025-08-01T00:00:00");

const counters = ref([
  { label: "Hari", value: 0 },
  { label: "Jam", value: 0 },
  { label: "Menit", value: 0 },
  { label: "Detik", value: 0 },
]);

let timer;

const updateCounter = () => {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  counters.value = [
    { label: "Hari", value: days },
    { label: "Jam", value: hours },
    { label: "Menit", value: minutes },
    { label: "Detik", value: seconds },
  ];
};

onMounted(() => {
  updateCounter();
  timer = setInterval(updateCounter, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.counter-card {
  width: 100px;
  padding: 20px 12px;
  border-radius: 20px;
  backdrop-filter: blur(14px);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15);
  text-align: center;
  transition: transform 0.2s;
}

.counter-card:hover {
  transform: scale(1.05);
}

.number {
  font-size: 2rem;
  font-weight: 700;
}

.label {
  margin-top: 4px;
  font-size: 0.8rem;
  color: #cbd5e1;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .counter-card {
    width: 120px;
    padding: 24px 16px;
  }

  .number {
    font-size: 2.5rem;
  }

  .label {
    font-size: 0.9rem;
  }
}
</style>
