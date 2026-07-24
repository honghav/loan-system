<!-- <script setup>
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import ScrollTrigger from "gsap/ScrollTrigger";

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
});
</script> -->

<template>
  <div class="grid grid-cols-8">
    <div class="min-h-screen bg-gray-500"></div>
    <div class="col-span-7">
      <div class="w-full h-10 bg-secondary py-auto border-b-2 border-primary">
        <!-- <Navbar /> -->
      </div>
      <div class="mt-10 md:mt-20 min-h-200">
        <slot />
      </div>
    </div>
  </div>
  <div class="mt-10 md:mt-20 relative">
    <div
      class="flex justify-end rounded-full mx-5 bottom-20 right-5 z-100 fixed"
    >
      <UColorModeButton
        size="xl"
        unchecked-icon="i-lucide-sun"
        checked-icon="i-lucide-moon"
        default-value
        :ui="{
          base: 'bg-secondary text-secondary rounded-full  data-[state=checked]:bg-white border border-secondary  ring-0',
        }"
      />
    </div>
    <!-- <Footer /> -->
  </div>
  <!-- <div class="fixed z-100 bottom-10 right-10 sm:hidden"> -->
  <!-- <ToolTip /> -->
  <!-- </div> -->
</template>
<script setup lang="ts">
async function toggleWithRipple(e: MouseEvent) {
  document.documentElement.style.setProperty("--click-x", `${e.clientX}px`);
  document.documentElement.style.setProperty("--click-y", `${e.clientY}px`);

  if (!document.startViewTransition) {
    toggleTheme();
    return;
  }

  document.startViewTransition(toggleTheme);
}
// const { toggleDarkMode } = useTheme();
const colorMode = useColorMode();

const toggleTheme = () => {
  const newMode = colorMode.value === "dark" ? "light" : "dark";

  colorMode.preference = newMode;

  if (process.client) {
    localStorage.setItem("nuxt-color-mode", newMode);
  }
};
</script>
