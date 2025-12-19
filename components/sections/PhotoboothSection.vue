<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4 py-12"
  >
    <h2 class="text-3xl font-bold mb-4">Photobooth 📸</h2>

    <p class="text-slate-300 mb-6 text-center">Selpi bentar yaa~ 😆</p>

    <!-- Camera Preview -->
    <div v-if="cameraOpen" class="relative w-full max-w-sm mb-4">
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="rounded-xl w-full mirror shadow-xl"
      />

      <!-- Loading Overlay -->
      <div
        v-if="isUploading"
        class="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl"
      >
        <span class="animate-pulse">Saving... ⏳</span>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3 mb-4">
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
            : "Ulangi 🔄"
        }}
      </button>
    </div>

    <!-- Preview -->
    <div class="flex gap-3 mt-4">
      <div
        v-for="photo in captures"
        :key="photo.id"
        class="w-24 h-24 rounded-lg overflow-hidden border border-white/20"
      >
        <img
          :src="`/api/${photo.id}`"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Download -->
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
import { ref, onUnmounted } from "vue";

const videoRef = ref(null);
const cameraOpen = ref(false);
const isUploading = ref(false);
const captures = ref([]);
const sessionId = ref(null);

/* 🔥 PATH OVERLAY PNG */
const overlaySrc = "/images/overlay.png"; // <-- pastikan file ini ada di /public/images

let stream = null;

/* ================= CAMERA ================= */

const openCamera = async () => {
  cameraOpen.value = true;

  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 720 },
      height: { ideal: 1280 },
    },
  });

  videoRef.value.srcObject = stream;
};

onUnmounted(() => {
  stream?.getTracks().forEach((t) => t.stop());
});

/* ================= CAPTURE ================= */

const capturePhoto = async () => {
  if (isUploading.value || captures.value.length >= 3) return;

  isUploading.value = true;
  await new Promise((r) => requestAnimationFrame(r));

  const video = videoRef.value;
  const scale = Math.min(720 / video.videoWidth, 1);

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;

  const ctx = canvas.getContext("2d");

  // mirror selfie
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.7)
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

const resetSelfies = () => {
  captures.value = [];
  sessionId.value = null;
};

const resetSession = async () => {
  // reset state
  captures.value = [];
  sessionId.value = null;

  // restart camera (biar clean)
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;

  await openCamera();
};

const handleCaptureClick = () => {
  captures.value.length < 3 ? capturePhoto() : resetSelfies();
};

/* ================= DOWNLOAD + OVERLAY ================= */

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

const downloadMerged = async () => {
  // load photos
  const photos = await Promise.all(
    captures.value.map((c) => loadImage(`/api/${c.id}`))
  );

  const width = Math.max(...photos.map((i) => i.width));
  const height = photos.reduce((s, i) => s + (i.height * width) / i.width, 0);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  let y = 0;
  photos.forEach((img) => {
    const h = (img.height * width) / img.width;
    ctx.drawImage(img, 0, y, width, h);
    y += h;
  });

  // overlay
  const overlay = await loadImage(overlaySrc);
  ctx.drawImage(overlay, 0, 0, width, height);

  // download
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "photobooth.png";
  link.click();

  // 🔥 CLEAN SESSION AFTER DOWNLOAD
  await resetSession();
};
</script>

<style scoped>
.btn-primary {
  padding: 10px 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c7b8ff, #a5d8ff);
  color: #1a1a2e;
  font-weight: 500;
}

.mirror {
  transform: scaleX(-1);
}
</style>
