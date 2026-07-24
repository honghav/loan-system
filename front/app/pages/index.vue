<template>
  <article
    class="w-full max-w-7xl mx-auto py-8 text-secondary space-y-10"
  ></article>
</template>
<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: "Home - PAPA FOOD",
  ogTitle: "PAPA FOOD - Quality Products at the Best Prices",
  description:
    "Shop quality products at PAPA FOOD. Discover great deals, browse our latest collections, and enjoy a smooth online shopping experience.",
  ogDescription:
    "PAPA FOOD offers quality products, exclusive deals, and a secure online shopping experience.",
});
useHead({
  title: "PAPA FOOD - Quality Products at the Best Prices",
  meta: [
    {
      name: "description",
      content:
        "PAPA FOOD offers high-quality products at affordable prices. Shop online, discover great deals, and enjoy a smooth shopping experience.",
    },
    {
      property: "og:title",
      content: "PAPA FOOD - Quality Products at the Best Prices",
    },
    {
      property: "og:description",
      content:
        "Shop at PAPA FOOD for quality products, exclusive deals, and a secure online shopping experience.",
    },
    {
      property: "og:image",
      content: "/seo.png",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      // content: config.public.appUrl,
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "PAPA FOOD - Quality Products at the Best Prices",
    },
    {
      name: "twitter:description",
      content:
        "Discover quality products and great deals at PAPA FOOD. Shop online with confidence.",
    },
    {
      name: "twitter:image",
      content: "/seo.png",
    },
  ],
  // link: [{ rel: "canonical", href: `${siteUrl}/` }],
  // script: [
  //   {
  //     type: "application/ld+json",
  //     innerHTML: JSON.stringify({
  //       "@context": "https://schema.org",
  //       "@type": "ItemList",
  //       itemListElement: [
  //         {
  //           "@type": "ListItem",
  //           position: 1,
  //           name: "Home",
  //           url: `${siteUrl}/`,
  //         },
  //         {
  //           "@type": "ListItem",
  //           position: 2,
  //           name: "Carts",
  //           url: `${siteUrl}/cart`,
  //         },
  //         {
  //           "@type": "ListItem",
  //           position: 3,
  //           name: "Catalog",
  //           url: `${siteUrl}/catalog`,
  //         },
  //         {
  //           "@type": "ListItem",
  //           position: 4,
  //           name: "Wish_list",
  //           url: `${siteUrl}/wish_list`,
  //         },
  //         {
  //           "@type": "ListItem",
  //           position: 5,
  //           name: "Profile",
  //           url: `${siteUrl}/profile`,
  //         },
  //         {
  //           "@type": "ListItem",
  //           position: 6,
  //           name: "Login",
  //           url: `${siteUrl}/login`,
  //         },
  //       ],
  //     }),
  //   },
  // ],
});
</script>

<style scoped>
/* Standard Cross-Browser Scrollbar Trimming Engine rules */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
