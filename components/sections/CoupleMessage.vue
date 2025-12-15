<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4"
  >
    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">
      Message for Me 💌
    </h2>
    <p class="text-slate-300 mb-8 max-w-xl text-center">
      Apapun boleh kamu sampaiin, nanti aku baca yaaaaa!
    </p>

    <form
      class="flex flex-col gap-4 w-full max-w-xl"
      @submit.prevent="sendMessage"
    >
      <textarea
        v-model="message"
        rows="4"
        placeholder="Tulis disini yang..."
        class="p-4 rounded-xl text-black focus:outline-none"
      ></textarea>
      <button
        type="submit"
        class="bg-yellow-300 text-black font-bold py-2 px-6 rounded-xl hover:bg-yellow-400 transition"
      >
        Kirim Pesan
      </button>
    </form>

    <div v-if="successMessage" class="mt-4 text-green-300 font-semibold">
      {{ successMessage }}
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const message = ref("");
const successMessage = ref("");
const userId = "user123"; // ganti sesuai user session

const sendMessage = async () => {
  if (!message.value.trim()) return;

  try {
    const res = await axios.post("/api/messages", {
      userId,
      message: message.value.trim(),
    });

    successMessage.value = res.data.message; // axios response ada di .data
    message.value = "";
  } catch (err) {
    console.error(err);
    successMessage.value = "Terjadi kesalahan, coba lagi 😢";
  }
};
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
