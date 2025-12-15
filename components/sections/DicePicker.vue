<template>
  <section
    class="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 text-white"
  >
    <h2 class="text-3xl md:text-4xl font-bold mb-6">
      🎲 Double Dice Gift Game
    </h2>
    <p class="text-slate-300 mb-8 max-w-xl text-center">
      Ada hadiah spesial buka kamu, tapi ini cuma bisa 3x kesempatan yaaah.
      Hati-hati ada zonknya juga hehe 😆
    </p>

    <!-- Dadu -->
    <div class="flex gap-8 mb-6">
      <div class="dice-container">
        <img
          :src="diceImages[dice1]"
          alt="Dice 1"
          class="dice"
          :class="{ rolling: rolling }"
          @click="rollDice"
        />
      </div>
      <div class="dice-container">
        <img
          :src="diceImages[dice2]"
          alt="Dice 2"
          class="dice"
          :class="{ rolling: rolling }"
          @click="rollDice"
        />
      </div>
    </div>

    <!-- Hasil hadiah -->
    <div v-if="gift" class="mb-6 text-xl font-bold text-yellow-300 animate-pop">
      🎉 Yeey kamu dapet: {{ gift }}
    </div>

    <!-- Info remaining roll -->
    <div v-if="remainingRolls !== null" class="mb-2 text-slate-300">
      Remaining Rolls: {{ remainingRolls }}
      <!-- <span v-if="remainingRolls === 0 && lastGift">
        | Last Gift: {{ lastGift }}
      </span> -->
    </div>
    <div v-if="remainingRolls === 0" class="mb-4 text-slate-300">
      <span v-if="lastGift === 'Zonk 😭'">
        Yah dapet Zonk, kamu WA aku aja dehhh wkwkw 😅
      </span>
      <span v-else> Semoga suka hadiahnya ya sayang! 🎁 </span>
    </div>

    <!-- Grid hadiah -->
    <div
      class="grid grid-cols-4 gap-4 text-black bg-white p-4 rounded-xl max-w-xl w-full"
    >
      <div
        v-for="(item, i) in gifts"
        :key="i"
        class="p-2 border rounded text-center font-semibold"
        :class="{ 'bg-yellow-200': i + 2 === totalDice }"
      >
        {{ i + 2 }}: {{ item }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

// State
const dice1 = ref(1);
const dice2 = ref(1);
const rolling = ref(false);
const gift = ref(null);
const totalDice = ref(null);
const remainingRolls = ref(null);
const lastGift = ref(null);
const userId = "user123"; // ganti sesuai user session / login

// Hadiah 2–12
const gifts = [
  "Checkoutin Shopee", // 2
  "Octopay 50K", // 3
  "Zonk 😭", // 4
  "Pulsa 100K", // 5
  "Traktir Makan Sushi", // 6
  "Baju", // 7
  "Mie Goreng Satu Kardus", // 8
  "Dompet", // 9
  "Zonk 😭", // 10
  "Chatime 2X", // 11
  "Skincare", // 12
];

// Dice images
const diceImages = {
  1: "/images/dice/dice1.png",
  2: "/images/dice/dice2.png",
  3: "/images/dice/dice3.png",
  4: "/images/dice/dice4.png",
  5: "/images/dice/dice5.png",
  6: "/images/dice/dice6.png",
};

// Ambil data rolls dari DB saat mount
onMounted(async () => {
  try {
    const res = await $fetch(`/api/gift-result?userId=${userId}`);
    if (res.success) {
      remainingRolls.value = res.remainingRolls;
      lastGift.value = res.lastGift;
      if (res.rolls.length > 0) {
        const lastRoll = res.rolls[res.rolls.length - 1];
        gift.value = lastRoll.gift;
        totalDice.value = lastRoll.total;
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// Roll dadu
const rollDice = async () => {
  if (rolling.value || remainingRolls.value <= 0) return;
  rolling.value = true;
  gift.value = null;

  let rolls = 15;
  const interval = setInterval(() => {
    dice1.value = Math.floor(Math.random() * 6) + 1;
    dice2.value = Math.floor(Math.random() * 6) + 1;
    rolls--;
    if (rolls <= 0) {
      clearInterval(interval);
      rolling.value = false;

      const total = dice1.value + dice2.value;
      totalDice.value = total;
      const selectedGift = gifts[total - 2];
      gift.value = selectedGift;

      // Simpan ke DB
      $fetch("/api/gift-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          userId,
          dice1: dice1.value,
          dice2: dice2.value,
          total,
          gift: selectedGift,
        },
      })
        .then((res) => {
          if (res.success) {
            remainingRolls.value = res.remainingRolls; // langsung pakai dari API
            lastGift.value = res.lastGift; // update hadiah terakhir juga
          } else {
            remainingRolls.value = 0;
          }
        })

        .catch((err) => console.error(err));
    }
  }, 100);
};
</script>

<style scoped>
.dice-container {
  perspective: 800px;
}

.dice {
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.2s;
}

.dice.rolling {
  animation: shake 1s ease-in-out;
}

@keyframes shake {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(20deg) scale(1.1);
  }
  50% {
    transform: rotate(-20deg) scale(1.1);
  }
  75% {
    transform: rotate(10deg) scale(1.05);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pop {
  animation: pop 0.5s ease;
}
</style>
