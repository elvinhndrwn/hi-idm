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
    </div>

    <!-- Capture / Reset Buttons -->
    <div class="flex gap-4 flex-wrap justify-center mb-4">
      <button v-if="!cameraOpen" class="btn-primary" @click="openCamera">
        Open Camera 🎥
      </button>

      <button v-else class="btn-primary" @click="handleCaptureClick">
        {{
          captures.length < 3
            ? `Capture 📸 (${captures.length}/3)`
            : "Ulangi Selfie 🔄"
        }}
      </button>
    </div>

    <!-- Captured Thumbnails -->
    <div class="flex gap-4 flex-wrap justify-center mt-4">
      <div
        v-for="(photo, i) in captures"
        :key="i"
        class="w-32 h-32 rounded-xl overflow-hidden relative"
      >
        <img :src="photo.url" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Download Merged -->
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
const overlay = ref("/images/overlay.png"); // hanya untuk download
const captures = ref([]);
const sessionId = ref(null);

// Open camera
const openCamera = async () => {
  cameraOpen.value = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" }, // kamera depan
    });
    videoRef.value.srcObject = stream;
  } catch (err) {
    alert("Cannot access camera. Please allow permission.");
    console.error(err);
  }
};

// Capture selfie tanpa overlay
const capturePhoto = async () => {
  if (captures.value.length >= 3) return;

  const canvas = document.createElement("canvas");
  canvas.width = videoRef.value.videoWidth;
  canvas.height = videoRef.value.videoHeight;
  const ctx = canvas.getContext("2d");

  // Flip horizontal supaya hasil capture tidak mirror
  ctx.save(); // simpan state
  ctx.translate(canvas.width, 0); // geser canvas ke kanan
  ctx.scale(-1, 1); // flip horizontal
  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
  ctx.restore(); // kembalikan state

  const imageBase64 = canvas.toDataURL("image/png");

  try {
    const response = await $fetch("/api/photobooth", {
      method: "POST",
      body: { imageBase64, sessionId: sessionId.value },
    });

    sessionId.value = response.sessionId;
    captures.value.push({ url: response.data.photo_url });
  } catch (err) {
    console.error("Failed to upload selfie:", err);
    captures.value.push({ url: imageBase64 });
  }
};

// Reset selfies
const resetSelfies = () => {
  captures.value = [];
  sessionId.value = null;
};

// Handler tombol capture / reset
const handleCaptureClick = () => {
  if (captures.value.length < 3) {
    capturePhoto();
  } else {
    resetSelfies();
  }
};

// Download dan merge ketiga selfie vertical + overlay
const downloadMerged = async () => {
  if (captures.value.length !== 3) return;

  const images = await Promise.all(
    captures.value.map(
      (c) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = c.url;
          img.onload = () => resolve(img);
          img.onerror = reject;
        })
    )
  );

  const targetWidth = Math.max(...images.map((img) => img.width));
  const totalHeight = images.reduce(
    (sum, img) => sum + (img.height * targetWidth) / img.width,
    0
  );

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");

  let yOffset = 0;
  images.forEach((img) => {
    const scaledHeight = (img.height * targetWidth) / img.width;
    ctx.drawImage(img, 0, yOffset, targetWidth, scaledHeight);
    yOffset += scaledHeight;
  });

  const imgOverlay = new Image();
  imgOverlay.src = overlay.value;
  await new Promise((resolve) => (imgOverlay.onload = resolve));
  ctx.drawImage(imgOverlay, 0, 0, canvas.width, canvas.height);

  const mergedBase64 = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = mergedBase64;
  a.download = "merged_selfies.png";
  a.click();
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
video {
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(200, 180, 255, 0.5);
  transform: scaleX(-1); /* mirror hanya untuk preview */
}
</style>
