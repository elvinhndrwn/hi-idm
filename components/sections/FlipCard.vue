<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white px-4"
  >
    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-center">
      Flip the Cards 💌
    </h2>
    <p class="text-slate-300 mb-12 max-w-xl text-center">
      Klik kartunya ya yang, nanti harus dijawab.. wajiiibbbb jujur yang boong
      bisulan!!
    </p>

    <div class="flex flex-wrap justify-center gap-4 md:gap-6">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="flip-card"
        @click="toggleFlip(index)"
      >
        <div class="flip-card-inner" :class="{ flipped: card.flipped }">
          <!-- Front Side -->
          <div class="flip-card-front">
            <span class="text-4xl">❓</span>
            <p class="mt-2 font-semibold text-sm md:text-base">
              Click to reveal
            </p>
          </div>

          <!-- Back Side -->
          <div class="flip-card-back">
            <p class="mb-4 text-sm md:text-base">{{ card.question }}</p>
            <button class="btn-answer" @click.stop="openAnswerModal(index)">
              Jawab ✨
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Answer Modal -->
    <transition name="fade">
      <div
        v-if="modal.active"
        class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
      >
        <div class="bg-gray-900 p-6 rounded-xl max-w-sm w-full text-center">
          <h3 class="text-xl font-semibold mb-2">{{ modal.question }}</h3>
          <input
            type="text"
            v-model="modal.answer"
            placeholder="Type your answer..."
            class="input-answer w-full mb-4"
          />
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button class="btn-submit" @click="submitAnswer(modal.index)">
              Submit ✨
            </button>
            <button class="btn-cancel" @click="closeModal">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const cards = ref([
  {
    question: "Kamu mulai kapan suka sama aku dan kenapaaa ?",
    flipped: false,
    answer: "",
  },
  {
    question: "Kalau kamu bisa balik ke masa lalu, apa yang pengen kamu ubah ?",
    flipped: false,
    answer: "",
  },
  {
    question:
      "Apa hal yang belum pernah kamu sampaiin ke akuu, mau tau donggg hhe :)",
    flipped: false,
    answer: "",
    flipped: false,
    answer: "",
  },
]);

const modal = ref({
  active: false,
  index: null,
  question: "",
  answer: "",
});

const toggleFlip = (index) => {
  // Tutup kartu lain
  cards.value.forEach((c, i) => {
    c.flipped = i === index ? !c.flipped : false;
  });
};

const openAnswerModal = (index) => {
  modal.value.active = true;
  modal.value.index = index;
  modal.value.question = cards.value[index].question;
  modal.value.answer = cards.value[index].answer || "";
};

const closeModal = () => {
  modal.value.active = false;
  modal.value.index = null;
  modal.value.answer = "";
};

const submitAnswer = async (index) => {
  const card = cards.value[index];
  if (!modal.value.answer.trim())
    return alert("Please type your answer first!");

  try {
    // Simpan ke backend PostgreSQL
    await axios.post("/api/answers", {
      question: card.question,
      answer: modal.value.answer,
    });

    card.answer = modal.value.answer;
    alert("Answer saved! ✅");
    closeModal();
  } catch (err) {
    console.error(err);
    alert("Failed to save answer. Please try again.");
  }
};
</script>

<style scoped>
.flip-card {
  background: transparent;
  width: 180px;
  max-width: 40vw;
  height: 250px;
  perspective: 1000px;
  cursor: pointer;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}
.flip-card-inner.flipped {
  transform: rotateY(180deg);
}
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 16px;
}

.flip-card-front {
  background: rgba(50, 50, 100, 0.8);
}

.flip-card-back {
  background: rgba(100, 50, 150, 0.85);
  transform: rotateY(180deg);
}

.input-answer {
  padding: 8px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  text-align: center;
}

.btn-answer,
.btn-submit,
.btn-cancel {
  padding: 6px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, #c7b8ff, #a5d8ff);
  color: #1a1a2e;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
