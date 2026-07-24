<template>
  <div class="h-dvh overflow-hidden relative">
    <NuxtLink to="/">
      <img src="/favicon.svg" alt="Logo" width="120"
        class="mx-auto md:hidden absolute top-5 left-1/2 transform -translate-x-1/2 dark:invert dark:brightness-0">
    </NuxtLink>
    <slot />
    <!-- <ToggleSwitch class=" absolute -top-full right-0 md:bottom-15 md:left-5" /> -->
  </div>
</template>

<script lang="ts" setup>

</script>

<style></style>