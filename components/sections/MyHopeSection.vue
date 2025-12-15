<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4"
  >
    <h2
      class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center"
    >
      Little Hopes 🌟
    </h2>

    <p class="text-slate-300 mb-8 sm:mb-12 max-w-md sm:max-w-xl text-center">
      Semangat buat semua impian yang kamu mau capai, usaha dan doa kamu aku
      yakin suatu saat nanti pasti ada hasilnya, kalau ada yang belum tercapai
      berarti ini cuma belum waktunya. Lakuin apa yang kamu suka, main kemanapun
      yang kamu mau, beli apa yang kamu pengen hidup jangan dibawa beban ya
      sayang. Kalo ada umur panjang, aku kayaknya pengen lama-lama sama kamu.
      Gatau kenapa aku kayak nyaman banget kalo lagi ketemu, ngobrol, atau
      apapun yang aku lakuin bareng kamu. Jaga kesehatan juga jangan lupa yaa.
      Love u🤍
    </p>

    <!-- Button Surprise -->
    <button
      @click="showPhoto = !showPhoto"
      class="mb-6 px-6 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition"
    >
      Coba klik tombol ini yang hihi 🤫
    </button>

    <!-- Foto muncul jika showPhoto true -->
    <img
      v-if="showPhoto"
      src="/images/kicil.jpeg"
      alt="Surprise"
      class="w-64 sm:w-96 rounded-xl shadow-lg transition-all mt-4"
    />
  </section>
</template>

<script setup>
import { ref } from "vue";

const showPhoto = ref(false);
</script>
