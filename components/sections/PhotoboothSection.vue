<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4 py-12"
  >
    <h2 class="text-3xl md:text-4xl font-bold mb-6">Photobooth 📸</h2>

    <p class="text-slate-300 mb-8 max-w-xl text-center">
      Selpi doonnggg, pengen liat kamooooo 👀
    </p>

    <!-- Camera Preview -->
    <div v-if="cameraOpen" class="relative w-full max-w-md mb-6">
      <video
        ref="videoRef"
        autoplay
        playsinline
        class="rounded-xl w-full"
      ></video>

      <!-- Loading Overlay -->
      <div
        v-if="isUploading"
        class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl"
      >
        <div class="text-white font-medium animate-pulse">
          Saving, please wait... ⏳
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-4 flex-wrap justify-center mb-4">
      <button v-if="!cameraOpen" class="btn-primary" @click="openCamera">
        Open Camera 🎥
      </button>

      <button
        v-else
        class="btn-primary"
        :disabled="isUploading"
        @click="handleCaptureClick"
      >
        <span v-if="isUploading">Saving... ⏳</span>
        <span v-else>
          {{
            captures.length < 3
              ? `Capture 📸 (${captures.length}/3)`
              : "Ulangi Selfie 🔄"
          }}
        </span>
      </button>
    </div>

    <!-- Thumbnails -->
    <div class="flex gap-4 flex-wrap justify-center mt-4">
      <div
        v-for="(photo, i) in captures"
        :key="photo.id"
        class="w-32 h-32 rounded-xl overflow-hidden"
      >
        <img :src="`/api/${photo.id}`" class="w-full h-full object-cover" />
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
import { ref } from "vue";

const videoRef = ref(null);
const cameraOpen = ref(false);
const isUploading = ref(false);
const captures = ref([]);
const sessionId = ref(null);
const overlay = ref("/images/overlay.png");

// Open camera
const openCamera = async () => {
  cameraOpen.value = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });
    videoRef.value.srcObject = stream;
  } catch (err) {
    alert("Cannot access camera");
    console.error(err);
  }
};

// Capture photo
const capturePhoto = async () => {
  if (captures.value.length >= 3 || isUploading.value) return;

  isUploading.value = true;

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;

  const ctx = canvas.getContext("2d");

  // flip horizontal (anti mirror)
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  const imageBase64 = canvas.toDataURL("image/png");

  try {
    const response = await $fetch("/api/photobooth", {
      method: "POST",
      body: {
        imageBase64,
        sessionId: sessionId.value,
      },
    });

    sessionId.value = response.data.sessionId;

    captures.value.push({
      id: response.data.id,
    });
  } catch (err) {
    console.error("Upload failed:", err);
  } finally {
    isUploading.value = false;
  }
};

// Reset
const resetSelfies = () => {
  captures.value = [];
  sessionId.value = null;
};

// Button handler
const handleCaptureClick = () => {
  if (captures.value.length < 3) {
    capturePhoto();
  } else {
    resetSelfies();
  }
};

// Download merged
const downloadMerged = async () => {
  const images = await Promise.all(
    captures.value.map(
      (c) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = `/api/${c.id}`;
          img.onload = () => resolve(img);
          img.onerror = reject;
        })
    )
  );

  const width = Math.max(...images.map((i) => i.width));
  const height = images.reduce(
    (sum, img) => sum + (img.height * width) / img.width,
    0
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  let y = 0;
  images.forEach((img) => {
    const h = (img.height * width) / img.width;
    ctx.drawImage(img, 0, y, width, h);
    y += h;
  });

  const overlayImg = new Image();
  overlayImg.src = overlay.value;
  await new Promise((r) => (overlayImg.onload = r));

  ctx.drawImage(overlayImg, 0, 0, width, height);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "merged_selfies.png";
  link.click();
};
</script>

<style scoped>
.btn-primary {
  padding: 10px 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c7b8ff, #a5d8ff);
  color: #1a1a2e;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

video {
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(200, 180, 255, 0.5);
  transform: scaleX(-1);
}
</style>
