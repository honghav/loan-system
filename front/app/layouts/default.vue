<template>
  <div
    class="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"
  >
    <!-- Sidebar -->
    <aside
      class="sticky top-0 h-screen bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 shadow-sm overflow-hidden z-40 relative group/sidebar"
      :class="[
        isSidebarOpen
          ? 'border-r border-slate-200 dark:border-slate-800 opacity-100'
          : 'border-r-0 opacity-0 pointer-events-none'
      ]"
      :style="{
        width: isSidebarOpen ? `${sidebarWidth}px` : '0px',
        transition: isResizing ? 'none' : 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
      }"
    >
      <div
        class="h-full flex flex-col justify-between shrink-0 overflow-hidden"
        :style="{ width: `${sidebarWidth}px` }"
      >
        <!-- Sidebar Header & Logo -->
        <div class="flex-1 flex flex-col min-h-0">
          <div
            class="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0"
              >
                <UIcon name="i-lucide-landmark" class="w-6 h-6" />
              </div>
              <div class="min-w-0">
                <h2
                  class="font-bold text-lg leading-tight text-slate-900 dark:text-white tracking-tight truncate"
                >
                  Loan<span class="text-primary">System </span>
                </h2>
                <p
                  class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate"
                >
                  Management
                </p>
              </div>
            </div>

            <!-- Hide Button in Sidebar Header -->
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-panel-left-close"
              size="sm"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer shrink-0"
              title="Hide sidebar"
              aria-label="Hide sidebar"
              @click="toggleSidebar"
            />
          </div>

          <!-- Navigation Section -->
          <nav class="p-4 space-y-1.5 overflow-y-auto flex-1">
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
                class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
              />
              <span class="whitespace-nowrap">{{ $t(`nav.${module.value?.toLowerCase()}`, module.name) }}</span>
            </NuxtLink>
          </nav>
        </div>

        <!-- Sidebar Footer User Profile Card -->
        <div class="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <NuxtLink
            to="/dashbord/profile"
            class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 cursor-pointer group"
            title="View & Edit Profile"
          >
            <div
              class="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200"
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
                class="text-sm font-semibold text-slate-900 dark:text-white truncate leading-snug group-hover:text-primary transition-colors duration-200"
              >
                {{ currentUserData?.Name || "User" }}
              </h4>
              <p
                class="text-xs text-slate-500 dark:text-slate-400 capitalize truncate"
              >
                {{ currentUserData?.Role || "Guest" }}
              </p>
            </div>
            <UIcon
              name="i-lucide-chevron-right"
              class="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- Drag Handle to Resize Sidebar Width -->
      <div
        v-if="isSidebarOpen"
        class="absolute top-0 right-0 w-2 h-full cursor-col-resize z-50 transition-colors flex items-center justify-center select-none group/resizer"
        :class="[
          isResizing
            ? 'bg-primary/20 dark:bg-primary/30'
            : 'hover:bg-primary/10 dark:hover:bg-primary/20'
        ]"
        title="Drag to resize sidebar (double-click to reset)"
        @mousedown.prevent="startResize"
        @dblclick="resetSidebarWidth"
      >
        <div
          class="w-0.5 h-8 rounded-full transition-all duration-200"
          :class="[
            isResizing
              ? 'bg-primary h-12 shadow-xs'
              : 'bg-slate-300 dark:bg-slate-700 group-hover/resizer:bg-primary/70 group-hover/resizer:h-10'
          ]"
        />
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar Header -->
      <header
        class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between shadow-xs sticky top-0 z-30"
      >
        <!-- Page Context / Title & Toggle Button -->
        <div class="flex items-center gap-3">
          <!-- Toggle Sidebar Button -->
          <UButton
            color="neutral"
            variant="ghost"
            :icon="isSidebarOpen ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
            size="sm"
            class="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
            :title="isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'"
            :class="isSidebarOpen ? 'hidden' : 'block'"
            :aria-label="isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'"
            @click="toggleSidebar"
          />
          <h1
            class="text-lg font-bold text-slate-900 dark:text-white capitalize"
          >
            {{ $t(`nav.${route.name ? String(route.name).toLowerCase() : 'dashboard'}`, currentPageTitle) }}
          </h1>
        </div>

        <!-- Right Action Controls -->
        <div class="flex items-center gap-4">
          <!-- Language Switcher -->
          <div
            class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <UIcon name="i-lucide-globe" class="w-4 h-4 text-slate-400" />
            <select
              :value="locale"
              @change="setLocale(($event.target as HTMLSelectElement).value)"
              class="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="KH" class="bg-white dark:bg-slate-900">ខ្មែរ (KH)</option>
              <option value="EN" class="bg-white dark:bg-slate-900">English (EN)</option>
              <option value="CH" class="bg-white dark:bg-slate-900">中文 (CH)</option>
            </select>
          </div>

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
            {{ $t('common.logout') }}
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
import { UserRole } from "~/model_dto/auth/user_enum.dto";
import { moduleData } from "~/model_dto/module_page";

const route = useRoute();
const router = useRouter();
const { locale, setLocale } = useI18n();
// Filter modules by user role (e.g. hide logger, size_data, and cloudflear_storage if not developer)
const modulePage = computed(() => {
  const currentRole = (currentUserData.value?.Role || "").toLowerCase();
  return moduleData.filter((module) => {
    if (module.roles && module.roles.length > 0) {
      return module.roles.some((r) => String(r).toLowerCase() === currentRole);
    }
    return true;
  });
});
const { activeLayoutId, setLayout, LAYOUT_OPTIONS } = useLayoutContainer(1);
const token = useAuthToken();

// Resizable sidebar state and logic
const DEFAULT_SIDEBAR_WIDTH = 256;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 480;

const sidebarWidth = useState<number>("sidebarWidth", () => DEFAULT_SIDEBAR_WIDTH);
const isResizing = ref(false);

const startResize = (e: MouseEvent) => {
  e.preventDefault();
  isResizing.value = true;
  document.body.style.userSelect = "none";
  document.body.style.cursor = "col-resize";

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (!isResizing.value) return;
    const newWidth = Math.min(
      Math.max(moveEvent.clientX, MIN_SIDEBAR_WIDTH),
      MAX_SIDEBAR_WIDTH
    );
    sidebarWidth.value = newWidth;
  };

  const onMouseUp = () => {
    isResizing.value = false;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    if (import.meta.client) {
      localStorage.setItem("sidebar_width", String(sidebarWidth.value));
    }
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

const resetSidebarWidth = () => {
  sidebarWidth.value = DEFAULT_SIDEBAR_WIDTH;
  if (import.meta.client) {
    localStorage.removeItem("sidebar_width");
  }
};

// Sidebar visibility state
const isSidebarOpen = useState<boolean>("isSidebarOpen", () => true);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(async () => {
  if (import.meta.client) {
    const saved = localStorage.getItem("sidebar_width");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
        sidebarWidth.value = parsed;
      }
    }
  }

  if (token.value) {
    await getCurrentUserService(token.value as string);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
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
    case "user_register":
      return "i-lucide-user-plus";
    case "logger":
      return "i-lucide-database";
    case "size_data":
      return "i-lucide-box";
    case "cloudflear_storage":
      return "i-lucide-cloud";
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
