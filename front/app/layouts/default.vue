<template>
  <div
    class="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
  >
    <!-- Sidebar -->
    <aside
      class="sticky top-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 shadow-sm transition-all duration-300"
    >
      <!-- Sidebar Header & Logo -->
      <div>
        <div
          class="h-16 flex items-center gap-3 px-6 border-b border-slate-100 dark:border-slate-800"
        >
          <div
            class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20"
          >
            <UIcon name="i-lucide-landmark" class="w-6 h-6" />
          </div>
          <div>
            <h2
              class="font-bold text-lg leading-tight text-slate-900 dark:text-white tracking-tight"
            >
              Loan<span class="text-primary">System</span>
            </h2>
            <p
              class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest"
            >
              Management
            </p>
          </div>
        </div>

        <!-- Navigation Section -->
        <nav class="p-4 space-y-1.5">
          <p
            class="px-3 pb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
          >
            Navigation
          </p>
          <NuxtLink
            v-for="module in modulePage"
            :key="module.value"
            :to="
              module.under_page === '..'
                ? `/${module.route}`
                : `/${module.under_page}/${module.route}`
            "
            class="group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            exact-active-class="!bg-primary/10 !text-primary dark:!text-primary font-semibold shadow-xs"
          >
            <UIcon
              :name="getModuleIcon(module.value)"
              class="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            />
            <span>{{ module.name }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Sidebar Footer User Profile Card -->
      <div class="p-4 border-t border-slate-100 dark:border-slate-800">
        <div
          class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50"
        >
          <div
            class="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0"
          >
            <img
              v-if="currentUserData?.Image"
              :src="getImagePath(currentUserData?.Image)"
              alt="User Profile"
              class="w-full h-full object-cover"
            />
            <span v-else class="font-semibold text-sm text-primary">
              {{ userInitials }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <h4
              class="text-sm font-semibold text-slate-900 dark:text-white truncate leading-snug"
            >
              {{ currentUserData?.Name || "User" }}
            </h4>
            <p
              class="text-xs text-slate-500 dark:text-slate-400 capitalize truncate"
            >
              {{ currentUserData?.Role || "Guest" }}
            </p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar Header -->
      <header
        class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shadow-xs sticky top-0 z-30"
      >
        <!-- Page Context / Title -->
        <div class="flex items-center gap-2">
          <h1
            class="text-lg font-bold text-slate-900 dark:text-white capitalize"
          >
            {{ currentPageTitle }}
          </h1>
        </div>

        <!-- Right Action Controls -->
        <div class="flex items-center gap-4">
          <!-- Layout Container Switcher -->
          <div
            class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <UIcon name="i-lucide-layout" class="w-4 h-4 text-slate-400" />
            <select
              :value="activeLayoutId"
              @change="
                setLayout(Number(($event.target as HTMLSelectElement).value))
              "
              class="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option
                v-for="option in LAYOUT_OPTIONS"
                :key="option.layoutContainer"
                :value="option.layoutContainer"
                class="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              >
                Layout {{ option.layoutContainer }}
              </option>
            </select>
          </div>

          <!-- Color Mode Button -->
          <UColorModeButton
            size="md"
            unchecked-icon="i-lucide-sun"
            checked-icon="i-lucide-moon"
            class="rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          />

          <div class="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          <!-- Logout Button -->
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-log-out"
            size="sm"
            class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer font-medium"
            @click="handleLogout"
          >
            Logout
          </UButton>
        </div>
      </header>

      <!-- Main Slot Area -->
      <main class="flex-1 p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  currentUserData,
  getCurrentUserService,
} from "~/model_dto/auth/get_current_user.dto";
import { moduleData } from "~/model_dto/module_page";

const route = useRoute();
const router = useRouter();
const modulePage = computed(() => moduleData);
const { activeLayoutId, setLayout, LAYOUT_OPTIONS } = useLayoutContainer(1);
const token = useAuthToken();

onMounted(async () => {
  if (token.value) {
    await getCurrentUserService(token.value as string);
  }
});

// Icon mapping helper for navigation modules
const getModuleIcon = (value: string) => {
  switch (value?.toLowerCase()) {
    case "dashboard":
      return "i-lucide-layout-dashboard";
    case "customer":
      return "i-lucide-users";
    case "loan":
      return "i-lucide-banknote";
    case "payment":
      return "i-lucide-credit-card";
    case "report":
      return "i-lucide-file-bar-chart";
    case "logger":
      return "i-lucide-database";
    case "size_data":
      return "i-lucide-box";
    default:
      return "i-lucide-folder";
  }
};

// Derive page title from current route
const currentPageTitle = computed(() => {
  const name = route.name ? String(route.name) : route.path.split("/").pop();
  if (!name || name === "index") return "Dashboard";
  return name.replace(/-/g, " ");
});

// Computed user initials fallback
const userInitials = computed(() => {
  if (!currentUserData.value?.Name) return "U";
  return currentUserData.value.Name.substring(0, 2).toUpperCase();
});

// Handle Logout
const handleLogout = () => {
  token.value = null;
  router.push("/auth");
};
</script>
