<template>
  <section class="py-24 px-6 relative">
    <h2 class="text-center text-3xl md:text-4xl font-bold mb-16">
      Planet Memories 🪐
    </h2>

    <!-- Gallery Grid -->
    <div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-10">
      <div
        v-for="(img, index) in images"
        :key="index"
        class="planet-wrapper"
        @click="openLightbox(index)"
      >
        <img :src="img" class="planet" alt="memory" />
      </div>
    </div>

    <!-- Lightbox -->
    <vue-easy-lightbox
      :visible="visible"
      :imgs="images"
      :index="activeIndex"
      @hide="visible = false"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";

const images = [
  "/images/1.jpg",
  "/images/2.jpg",
  "/images/3.jpg",
  "/images/4.jpg",
  "/images/5.jpg",
];

const visible = ref(false);
const activeIndex = ref(0);

const openLightbox = (index) => {
  activeIndex.value = index;
  visible.value = true;
};
</script>

<style scoped>
.planet-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.planet {
  width: 160px;
  height: 160px;
  border-radius: 9999px;
  object-fit: cover;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.25);
  animation: float 6s ease-in-out infinite;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.planet-wrapper:hover .planet {
  transform: scale(1.08) rotate(2deg);
  box-shadow: 0 0 60px rgba(255, 255, 255, 0.45);
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
