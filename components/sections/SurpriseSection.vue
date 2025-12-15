<template>
  <section class="py-32 px-6 flex flex-col items-center text-center">
    <h2 class="text-3xl md:text-4xl font-bold mb-12">One Last Thing… 🌌</h2>

    <button v-if="!revealed" @click="reveal" class="surprise-btn">
      Open the surprise 🎁
    </button>

    <transition name="fade">
      <div v-if="revealed" class="message-card mt-10">
        <p class="text-xl md:text-2xl leading-relaxed">
          Apapun jaraknya, di semesta manapun… aku tetap memilih kamu 🤍
        </p>

        <p class="mt-6 text-lg">I love you 🚀✨</p>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref } from "vue";

const revealed = ref(false);

const reveal = () => {
  revealed.value = true;
};
</script>

<style scoped>
.surprise-btn {
  padding: 14px 32px;
  border-radius: 9999px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #818cf8, #a78bfa);
  box-shadow: 0 0 30px rgba(167, 139, 250, 0.6);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.surprise-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 0 50px rgba(167, 139, 250, 0.9);
}

.message-card {
  max-width: 520px;
  padding: 32px;
  border-radius: 24px;
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 50px rgba(255, 255, 255, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
