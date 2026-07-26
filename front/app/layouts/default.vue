<template>
  <div class="grid grid-cols-7 container mx-auto">
    <div class="min-h-screen bg-gray-500">
      <div v-for="module in modulePage" :key="module.value">
        <NuxtLink
          :to="
            module.under_page === '..'
              ? `/${module.route}`
              : `/${module.under_page}/${module.route}`
          "
          class="h-8 flex items-center gap-4 px-3 my-2 rounded-lg cursor-pointer transition-all duration-200 animate-spring-slide-up hover:bg-primary/20 focus:bg-primary/30 focus:outline-none"
          exact-active-class="bg-primary/30"
        >
          <h4 class="font-medium text-white">
            {{ module.name }}
          </h4>
        </NuxtLink>
      </div>
    </div>
    <div class="col-span-6">
      <div
        class="w-full h-10 bg-secondary py-auto border-b-2 border-primary flex justify-end gap-5 px-25"
      >
        <select
          :value="activeLayoutId"
          @change="
            setLayout(Number(($event.target as HTMLSelectElement).value))
          "
          class="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option
            v-for="option in LAYOUT_OPTIONS"
            :key="option.layoutContainer"
            :value="option.layoutContainer"
          >
            Layout {{ option.layoutContainer }}
          </option>
        </select>
        <NuxtImg src="images/businessman.png" />
        <UButton label="Logout" />
      </div>
      <div class="min-h-screen p-8">
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
</template>
<script setup lang="ts">
import { moduleData } from "~/model_dto/module_page";
const route = useRoute();
const modulePage = computed(() => moduleData);
const { activeLayoutId, currentLayout, setLayout, LAYOUT_OPTIONS } =
  useLayoutContainer(1);
const colorMode = useColorMode();
const toggleTheme = () => {
  const newMode = colorMode.value === "dark" ? "light" : "dark";

  colorMode.preference = newMode;

  if (process.client) {
    localStorage.setItem("nuxt-color-mode", newMode);
  }
};
</script>
