<template>
  <NuxtLayout>
    <NuxtPage />
    <UToaster />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import "aos/dist/aos.css";

const config = useRuntimeConfig();
const route = useRoute();
const { locale } = useI18n();

const siteUrl = config.public.appUrl;

onMounted(async () => {
  const { default: AOS } = (await import("aos")) as any;
  useFCMListener();
  AOS.init();
  AOS.refresh();
});

useHead({
  htmlAttrs: {
    lang: locale.value,
    class: "light",
  },
  link: [
    {
      rel: "canonical",
      href: `${siteUrl}${route.path}`,
    },
  ],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        name: "PAPA FOOD",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
      }),
    },
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: "PAPA FOOD",
        url: siteUrl,
        publisher: {
          "@id": `${siteUrl}#organization`,
        },
      }),
    },
  ],
});
</script>
