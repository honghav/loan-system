<template>
    <article class="container ">
        <!-- <div class="">{{ productDetailRoute.params.slug }}</div> -->
        <section class="w-full h-140 p-10 flex gap-5 rounded-2xl bg-[#FFFFFF] shadow-lg my-10 ">
            <NuxtImg :src="productDetails?.image" class="w-120 h-120 " />

            <section class="w-175 flex flex-col gap-y-3 ">
                <div class="flex ../../../app/constants/controller/product/Product
                <figure v-if=" Number(productDetails?.discount)> 0"
                    class=" bg-[#FF8A00] text-white px-3 py-1 rounded-md flex items-center justify-center">
                    <p class="text-xs">{{ productDetails?.discount }}% OFF</p>
                    </figure>
                    <UButton variant="soft" icon="i-lucide-heart"
                        class="h-10 w-10 text-center  text-black rounded-full shadow-md p-2.5" :ui="{
                            base: 'bg-white '
                        }" />
                </div>

                <p class="">{{ productDetails?.category.cate_name }}</p>
                <h2 class=" font-bold">{{ productDetails?.name }}</h2>
                <p class="text-gray-500">{{ productDetails?.description }}</p>
                <!-- Rate Star -->
                <div class="flex items-center gap-2">
                    <div class="flex gap-1">
                        <div v-for="i in 5" :key="i" :class="i <= (productDetails?.rate ?? 0)
                            ? 'text-yellow-400'
                            : 'text-gray-100'
                            ">
                            <UIcon name="streamline-block:content-star" size="20" />
                        </div>
                    </div>
                </div>
                <!-- <hr class="border-gray-300" /> -->
                <div class="flex gap-2 items-end">
                    <h2 class=" text-red-500">${{ productDetails?.final_price }}</h2>
                    <h3 class="text-gray-500 line-through">${{ productDetails?.final_price }}</h3>
                </div>
                <hr class="border-gray-300" />
                <div class="w-full bg-[#EDEDED] text-[#6B7280] max-h-30 p-5 rounded-2xl flex flex-col gap-1">
                    <p>Product Code: <span class="text-secondary">{{ productDetails?.code }}</span></p>
                    <p>Availability Stock: <span class="text-secondary">{{ productDetails?.stock }} units</span></p>
                    <p>Delivery Time: <span class="text-secondary">1-2 days</span></p>
                </div>
                <hr class="border-gray-300" />
                <div class="mt-7.5 flex gap-5 items-center justify-start">
                    <h3>QTY</h3>
                    <UInputNumber v-model="value" :min="1" :ui="{
                        root: 'w-32 ',
                        base: 'border-0 rounded-lg text-secondary p-1 h-14 ',
                        increment: 'bg-primary/10 m-2.5 h-8 w-8 text-secondary rounded-lg text-lg text-center ',
                        decrement: 'bg-primary/10 m-2.5 h-8 w-8 text-secondary rounded-lg text-lg',
                        // leadingIcon: 'text-secondary',
                        // trailingIcon: 'text-secondary',
                    }" />
                    <UButton variant="solid" class="h-14 px-5 text-primary rounded-lg" :ui="{
                        base: 'bg-white text-primary border-2 border-primary hover:bg-primary/10'
                    }">
                        <span class="flex items-center gap-2">
                            <UIcon name="i-lucide-shopping-cart" size="20" />
                            Add to Cart
                        </span>
                    </UButton>
                    <UButton variant="solid" class="h-14 px-5 text-white rounded-lg" :ui="{
                        base: 'bg-primary hover:bg-primary/90'
                    }">
                        <span class="flex items-center gap-2">
                            <UIcon name="i-lucide-shopping-cart" size="20" />
                            Buy Now
                        </span>
                    </UButton>
                </div>
            </section>
        </section>

        <!-- Product Related -->
        <h1 class="my-5">Product Related</h1>
        <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <!-- <div class="" v-for="pro in productRelated" :key="pro.id">
                <ProductCard :id="pro.id" :image="pro.image" :name="pro.name" :category="pro.category.cate_name"
                    :final-price="pro.final_price" :first-price="pro.first_price" :rating="pro.rate"
                    :wish_list="pro.wish_list" :discount="pro.discount" :u/>
            </div> -->
        </section>
    </article>

</template>
<script setup lang="ts">
import { productList } from '../../constants/controller/product/Product';

const value = ref(1)
export function getProductById(id: number | string) {
    const pid = Number(id);
    return productList.find((product) => product.id === pid);
}


// const { goHome } = useNavigation()
// SEO Meta
useSeoMeta({
    title: `Product Details  - PAPA FOOD`,
    ogTitle: "PAPA FOOD - Quality Products at the Best Prices",
    description:
        "Shop quality products at PAPA FOOD. Discover great deals, browse our latest collections, and enjoy a smooth online shopping experience.",
    ogDescription:
        "PAPA FOOD offers quality products, exclusive deals, and a secure online shopping experience.",
});
</script>
