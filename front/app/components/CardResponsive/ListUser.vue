<template>
  <div
    class="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all duration-200 space-y-3"
  >
    <!-- Top Row: Avatar, User Info & Status -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Avatar -->
        <div
          class="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700 shadow-inner"
        >
          <img
            v-if="displayImage"
            :src="getImagePath(displayImage)"
            :alt="displayName"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            :class="[
              'w-full h-full flex items-center justify-center font-bold text-sm',
              avatarBg,
            ]"
          >
            {{ initials }}
          </div>
        </div>

        <!-- Name & Username -->
        <div class="min-w-0">
          <h4 class="font-bold text-sm text-neutral-900 dark:text-white truncate leading-snug">
            {{ displayName }}
          </h4>
          <p class="text-xs text-neutral-400 dark:text-neutral-500 font-mono truncate mt-0.5">
            @{{ displayUsername }}
          </p>
        </div>
      </div>

      <!-- Status Indicator Badge -->
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 capitalize border"
        :class="
          isStatusActive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
            : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
        "
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="isStatusActive ? 'bg-emerald-500' : 'bg-neutral-400'"
        />
        {{ isStatusActive ? 'Active' : 'Inactive' }}
      </span>
    </div>

    <!-- Middle Row: Role & Login Method Badges -->
    <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
      <!-- Role Badge -->
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize"
        :class="roleBadgeClass"
      >
        <UIcon :name="roleIcon" class="w-3.5 h-3.5" />
        {{ displayRole }}
      </span>

      <!-- Login Method -->
      <span
        v-if="displayMethod"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 capitalize"
      >
        <UIcon name="i-lucide-key-round" class="w-3 h-3 text-neutral-400" />
        {{ displayMethod }}
      </span>
    </div>

    <!-- Bottom Row: Contact Information -->
    <div
      v-if="hasContactInfo"
      class="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400"
    >
      <!-- Phone Number -->
      <div v-if="displayPhone" class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span class="truncate font-mono">{{ displayPhone }}</span>
        </div>
        <a
          :href="`tel:${displayPhone}`"
          class="text-primary hover:underline text-[11px] font-semibold shrink-0"
        >
          Call
        </a>
      </div>

      <!-- Telegram -->
      <div v-if="displayTelegram" class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0 text-sky-600 dark:text-sky-400">
          <UIcon name="i-lucide-send" class="w-3.5 h-3.5 text-sky-500 shrink-0" />
          <span class="truncate">{{ formattedTelegram }}</span>
        </div>
        <a
          :href="`https://t.me/${cleanTelegramUsername}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sky-500 hover:underline text-[11px] font-semibold shrink-0"
        >
          Open Chat
        </a>
      </div>

      <!-- Google / Email Account -->
      <div v-if="displayEmail" class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
          <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span class="truncate">{{ displayEmail }}</span>
        </div>
        <a
          :href="`mailto:${displayEmail}`"
          class="text-primary hover:underline text-[11px] font-semibold shrink-0"
        >
          Email
        </a>
      </div>

      <!-- Generic Contact Fallback -->
      <div v-if="!displayPhone && !displayTelegram && !displayEmail && displayContect" class="flex items-center gap-2">
        <UIcon name="i-lucide-contact" class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span class="truncate">{{ displayContect }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GetCurrentUserDTO } from "~/model_dto/auth/get_current_user.dto";

interface Props {
  user?: GetCurrentUserDTO;
  name?: string;
  userName?: string;
  role?: string;
  image?: string;
  phone?: string;
  telegram?: string;
  email?: string;
  contect?: string;
  method?: string;
  status?: boolean | string;
}

const props = withDefaults(defineProps<Props>(), {
  userName: "",
  role: "guest",
  contect: "",
  method: "username",
  status: true,
});

// Normalized fields supporting both :user="user" and individual props
const displayName = computed(() => props.user?.Name || props.name || props.userName || "Unnamed User");
const displayUsername = computed(() => props.user?.Username || props.userName || "no_username");
const displayRole = computed(() => props.user?.Role || props.role || "guest");
const displayImage = computed(() => props.user?.Image || props.image || "");
const displayPhone = computed(() => props.user?.Phone || props.phone || "");
const displayTelegram = computed(() => props.user?.TelegramUsername || props.telegram || "");
const displayEmail = computed(() => props.user?.GoogleAccount || props.email || "");
const displayContect = computed(() => props.contect);
const displayMethod = computed(() => props.user?.LoginType || props.method || "username");

// Status normalization (supports boolean or string 'active'/'inactive')
const isStatusActive = computed(() => {
  if (typeof props.status === "boolean") return props.status;
  const statusStr = (props.user?.Status || String(props.status) || "").toLowerCase();
  return statusStr === "active" || statusStr === "true" || !statusStr;
});

// Contact presence check
const hasContactInfo = computed(
  () => !!(displayPhone.value || displayTelegram.value || displayEmail.value || displayContect.value)
);

// Telegram helpers
const formattedTelegram = computed(() => {
  const tg = displayTelegram.value.trim();
  return tg.startsWith("@") ? tg : `@${tg}`;
});

const cleanTelegramUsername = computed(() => displayTelegram.value.replace(/^@/, "").trim());

// Initials & Background Colors
const initials = computed(() => {
  const source = displayName.value || displayUsername.value || "U";
  return source.trim().substring(0, 2).toUpperCase();
});

const avatarBg = computed(() => {
  const colors = [
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
  ];
  const charCode = (displayName.value || "U").charCodeAt(0);
  return colors[charCode % colors.length];
});

// Role Styling
const roleBadgeClass = computed(() => {
  switch (displayRole.value?.toLowerCase()) {
    case "admin":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
    case "developer":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800";
    case "manager":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    case "hr":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    case "it":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
});

const roleIcon = computed(() => {
  switch (displayRole.value?.toLowerCase()) {
    case "admin":
      return "i-lucide-shield-check";
    case "developer":
      return "i-lucide-code-2";
    case "manager":
      return "i-lucide-briefcase";
    case "hr":
      return "i-lucide-users";
    case "it":
      return "i-lucide-cpu";
    default:
      return "i-lucide-user";
  }
});
</script>