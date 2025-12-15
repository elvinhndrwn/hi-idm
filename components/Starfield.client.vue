<template>
  <canvas ref="canvas" class="fixed inset-0 z-0 pointer-events-none"></canvas>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";

const canvas = ref(null);
let ctx,
  stars = [],
  animationId;

const STAR_COUNT = 120;

function resize() {
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
}

function initStars() {
  stars = Array.from({ length: STAR_COUNT }).map(() => ({
    x: Math.random() * canvas.value.width,
    y: Math.random() * canvas.value.height,
    r: Math.random() * 1.5 + 0.5,
    o: Math.random(),
    s: Math.random() * 0.3 + 0.1,
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.fillStyle = "white";

  stars.forEach((star) => {
    ctx.globalAlpha = star.o;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();

    star.y += star.s;
    if (star.y > canvas.value.height) {
      star.y = 0;
      star.x = Math.random() * canvas.value.width;
    }
  });

  animationId = requestAnimationFrame(draw);
}

onMounted(() => {
  ctx = canvas.value.getContext("2d");
  resize();
  initStars();
  draw();
  window.addEventListener("resize", resize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", resize);
});
</script>
