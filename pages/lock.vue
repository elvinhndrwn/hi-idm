<template>
  <div
    class="min-h-screen flex flex-col justify-center items-center relative overflow-hidden space-bg"
  >
    <!-- Starfield -->
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

    <h2 class="text-2xl md:text-3xl mb-6 text-white">
      Masukkin PIN-nya yangggggg 🤫
    </h2>

    <input
      v-model="pin"
      type="password"
      maxlength="4"
      class="text-center text-2xl md:text-3xl p-3 rounded-xl w-32 mb-4 outline-none"
      placeholder="••••"
    />

    <button
      class="px-6 py-2 rounded-full text-white shadow-lg hover:scale-105 transition-transform duration-300"
      style="background: linear-gradient(135deg, #5d688a, #7c82ff)"
      @click="submitPin"
    >
      Go 🚀
    </button>

    <p v-if="error" class="mt-4 text-red-400 font-semibold">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const pin = ref("");
const error = ref("");

const submitPin = () => {
  if (pin.value === "1707") {
    localStorage.setItem("pinVerified", "true");
    navigateTo("/");
  } else {
    error.value = "PIN salah sayangggg 😢";
  }
};
</script>

<style scoped>
.space-bg {
  background: radial-gradient(ellipse at bottom, #0b0c1a, #1a1c3d);
}
</style>
