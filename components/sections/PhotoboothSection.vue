<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4 py-12"
  >
    <h2 class="text-3xl md:text-4xl font-bold mb-4">Photobooth 📸</h2>

    <p class="text-slate-300 mb-6 max-w-xl text-center">
      Selpi doonnggg, pengen liat kamooooo 👀
    </p>

    <!-- CAMERA PREVIEW -->
    <div
      v-if="cameraOpen"
      class="relative w-full max-w-xs aspect-[3/4] mb-6 rounded-xl overflow-hidden"
    >
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="w-full h-full object-contain mirror"
      />

      <!-- Loading Overlay -->
      <div
        v-if="isUploading"
        class="absolute inset-0 flex items-center justify-center bg-black/50"
      >
        <div class="animate-pulse">Saving... ⏳</div>
      </div>
    </div>

    <!-- BUTTONS -->
    <div class="flex gap-3 flex-wrap justify-center mb-3">
      <button v-if="!cameraOpen" class="btn-primary" @click="openCamera">
        Open Camera 🎥
      </button>

      <button
        v-else
        class="btn-primary"
        :disabled="isUploading"
        @click="handleCaptureClick"
      >
        {{
          captures.length < 3
            ? `Capture 📸 (${captures.length}/3)`
            : "Ulangi Selfie 🔄"
        }}
      </button>
    </div>

    <!-- REFRESH PAGE -->
    <button class="btn-secondary" @click="forceReload">
      Klik ini kalo nge-blank yak 🔄
    </button>

    <!-- THUMBNAILS -->
    <div class="flex gap-3 flex-wrap justify-center mt-5">
      <div
        v-for="photo in captures"
        :key="photo.id"
        class="w-24 h-32 rounded-lg overflow-hidden"
      >
        <img :src="`/api/${photo.id}`" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- DOWNLOAD -->
    <button
      v-if="captures.length === 3"
      class="btn-primary mt-6"
      @click="downloadMerged"
    >
      Download ⭐
    </button>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";

const videoRef = ref(null);
const cameraOpen = ref(false);
const isUploading = ref(false);
const captures = ref([]);
const sessionId = ref(null);
const overlay = "/images/overlay.png";

/* ================= CAMERA ================= */

const openCamera = async () => {
  cameraOpen.value = true;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
    },
  });

  videoRef.value.srcObject = stream;
};

onBeforeUnmount(() => {
  stopCamera();
});

const stopCamera = () => {
  const stream = videoRef.value?.srcObject;
  stream?.getTracks().forEach((t) => t.stop());
};

/* ================= CAPTURE ================= */

const capturePhoto = async () => {
  if (isUploading.value || captures.value.length >= 3) return;

  isUploading.value = true;
  await new Promise((r) => requestAnimationFrame(r));

  const video = videoRef.value;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");

  // mirror selfie (SAMA DENGAN PREVIEW)
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.75)
  );

  const formData = new FormData();
  formData.append("image", blob);
  if (sessionId.value) formData.append("sessionId", sessionId.value);

  try {
    const res = await $fetch("/api/photobooth", {
      method: "POST",
      body: formData,
    });

    sessionId.value = res.data.sessionId;
    captures.value.push({ id: res.data.id });
  } finally {
    isUploading.value = false;
  }
};

/* ================= RESET ================= */

const resetSelfies = () => {
  captures.value = [];
  sessionId.value = null;

  // stop camera stream
  const stream = videoRef.value?.srcObject;
  stream?.getTracks().forEach((t) => t.stop());

  cameraOpen.value = false;
};

const handleCaptureClick = () => {
  captures.value.length < 3 ? capturePhoto() : resetSelfies();
};

/* ================= DOWNLOAD ================= */

const downloadMerged = async () => {
  const images = await Promise.all(
    captures.value.map(
      (c) =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = `/api/${c.id}`;
          img.onload = () => resolve(img);
        })
    )
  );

  const width = images[0].width;
  const height = images.reduce((s, i) => s + i.height, 0);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  let y = 0;

  images.forEach((img) => {
    ctx.drawImage(img, 0, y);
    y += img.height;
  });

  const overlayImg = new Image();
  overlayImg.src = overlay;
  await new Promise((r) => (overlayImg.onload = r));

  ctx.drawImage(overlayImg, 0, 0, width, height);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "photobooth.png";
  link.click();

  resetSelfies();
};

/* ================= REFRESH ================= */

const forceReload = () => {
  window.location.reload();
};
</script>

<style scoped>
.mirror {
  transform: scaleX(-1);
}

.btn-primary {
  padding: 10px 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c7b8ff, #a5d8ff);
  color: #1a1a2e;
  font-weight: 500;
}

.btn-primary:disabled {
  opacity: 0.6;
}

.btn-secondary {
  padding: 8px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
</style>
