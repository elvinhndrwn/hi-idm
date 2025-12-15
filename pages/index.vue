<template>
  <div class="space-bg min-h-screen relative overflow-hidden">
    <Starfield />
    <HeaderSection />
    <CounterSection />
    <StarCather />
    <FlipCard />
    <PhotoboothSection />
    <DicePicker />
    <CoupleMessage />
    <MyHopeSection />
  </div>
</template>

<script setup>
import Starfield from "@/components/Starfield.client.vue";
import HeaderSection from "@/components/sections/HeaderSection.vue";
import CounterSection from "@/components/sections/CounterSection.vue";
import StarCather from "@/components/sections/StarCather.vue";
import FlipCard from "@/components/sections/FlipCard.vue";
import PhotoboothSection from "@/components/sections/PhotoboothSection.vue";
import DicePicker from "~/components/sections/DicePicker.vue";
import CoupleMessage from "~/components/sections/CoupleMessage.vue";
import MyHopeSection from "~/components/sections/MyHopeSection.vue";
</script>
