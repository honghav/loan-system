<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-16">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0"
        >
          <UIcon name="i-lucide-user" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            My Profile
          </h1>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your personal profile details and account security settings.
          </p>
        </div>
      </div>

      <NuxtLink to="/dashbord">
        <UButton
          label="Back to Dashboard"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="outline"
          size="sm"
          class="cursor-pointer"
        />
      </NuxtLink>
    </div>

    <!-- Feedback Alerts -->
    <div
      v-if="feedbackSuccess"
      class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start justify-between gap-3 text-emerald-800 dark:text-emerald-300 shadow-sm animate-fade-in"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h4 class="font-semibold text-sm">Success!</h4>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            {{ feedbackMessage }}
          </p>
        </div>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-x"
        @click="feedbackSuccess = false"
      />
    </div>

    <div
      v-if="feedbackError"
      class="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start justify-between gap-3 text-rose-800 dark:text-rose-300 shadow-sm animate-fade-in"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h4 class="font-semibold text-sm">Error</h4>
          <p class="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
            {{ feedbackError }}
          </p>
        </div>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-x"
        @click="feedbackError = ''"
      />
    </div>

    <!-- Profile Hero Card -->
    <div
      class="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm overflow-hidden"
    >
      <div class="h-28 bg-gradient-to-r from-primary/80 via-indigo-600/80 to-purple-600/80 relative" />
      <div class="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-14">
        <!-- Avatar & Details -->
        <div class="flex flex-col sm:flex-row sm:items-end gap-4">
          <div class="relative group w-24 h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-neutral-900 shadow-lg bg-white dark:bg-neutral-800 shrink-0">
            <img
              v-if="profileForm.image"
              :src="getImagePath(profileForm.image)"
              alt="Profile Avatar"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center font-bold text-2xl text-primary bg-primary/10"
            >
              {{ userInitials }}
            </div>

            <!-- Upload Avatar Overlay -->
            <label
              class="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
            >
              <UIcon name="i-lucide-camera" class="w-5 h-5 mb-1" />
              <span>Change</span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
              />
            </label>
          </div>

          <div class="space-y-1">
            <h2 class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white leading-tight">
              {{ currentUserData?.Name || "System User" }}
            </h2>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                @{{ currentUserData?.Username || "no_username" }}
              </span>
              <span class="text-neutral-300 dark:text-neutral-700">•</span>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize"
                :class="getRoleBadgeClass(currentUserData?.Role)"
              >
                <UIcon :name="getRoleIcon(currentUserData?.Role)" class="w-3 h-3" />
                {{ currentUserData?.Role || "guest" }}
              </span>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize"
                :class="
                  currentUserData?.Status === 'active' || !currentUserData?.Status
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                "
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="
                    currentUserData?.Status === 'active' || !currentUserData?.Status
                      ? 'bg-emerald-500'
                      : 'bg-neutral-400'
                  "
                />
                {{ currentUserData?.Status || "active" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Info Pills -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <div
            v-if="currentUserData?.LoginType"
            class="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5"
          >
            <UIcon name="i-lucide-key-round" class="w-3.5 h-3.5 text-neutral-400" />
            <span class="capitalize">Login: {{ currentUserData.LoginType }}</span>
          </div>

          <div
            v-if="currentUserData?.Id"
            class="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 font-mono text-[11px]"
            title="User UUID"
          >
            <UIcon name="i-lucide-fingerprint" class="w-3.5 h-3.5 text-neutral-400" />
            <span>{{ currentUserData.Id.substring(0, 8) }}...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Forms Section: Two Tabs / Columns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Update Profile Information (2 cols) -->
      <div
        class="lg:col-span-2 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6"
      >
        <div class="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <UIcon name="i-lucide-user-cog" class="w-5 h-5 text-primary" />
          <div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Personal Information
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Update your public display name, phone number, and Telegram handles.
            </p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="saveProfile">
          <!-- Full Name -->
          <UFormField label="Full Name / Display Name" required class="flex flex-col gap-1 text-xs">
            <UInput
              v-model="profileForm.name"
              placeholder="e.g. John Doe"
              icon="i-lucide-user"
              class="w-full"
            />
          </UFormField>

          <!-- Phone Number -->
          <UFormField label="Phone Number" class="flex flex-col gap-1 text-xs">
            <UInput
              v-model="profileForm.phone"
              placeholder="e.g. +855 12 345 678"
              icon="i-lucide-phone"
              class="w-full"
            />
          </UFormField>

          <!-- Telegram Username & Chat ID -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Telegram Username" class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="profileForm.telegramUsername"
                placeholder="e.g. john_doe"
                icon="i-lucide-send"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Telegram Chat ID" class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="profileForm.telegramChatId"
                placeholder="e.g. 123456789"
                icon="i-lucide-hash"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Telegram Linked Indicator -->
          <UFormField label="Telegram Linked Identifier" class="flex flex-col gap-1 text-xs">
            <UInput
              v-model="profileForm.telegramLinked"
              placeholder="e.g. true / linked handle"
              icon="i-lucide-link"
              class="w-full"
            />
          </UFormField>

          <!-- Submit Profile Button -->
          <div class="pt-4 flex items-center justify-end">
            <UButton
              type="submit"
              color="primary"
              icon="i-lucide-save"
              :loading="isSavingProfile"
              class="font-semibold shadow-md shadow-primary/20 cursor-pointer"
            >
              Save Profile Changes
            </UButton>
          </div>
        </form>
      </div>

      <!-- Right Column: Change Password (1 col) -->
      <div
        class="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6"
      >
        <div class="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <UIcon name="i-lucide-lock" class="w-5 h-5 text-primary" />
          <div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Change Password
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Ensure your account is using a strong password.
            </p>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="changePassword">
          <!-- Current Password -->
          <UFormField label="Current Password" class="flex flex-col gap-1 text-xs">
            <div class="relative w-full">
              <UInput
                v-model="passwordForm.currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-lucide-key"
                class="w-full pr-10"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <UIcon :name="showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
              </button>
            </div>
          </UFormField>

          <!-- New Password -->
          <UFormField label="New Password (min 8 chars)" required class="flex flex-col gap-1 text-xs">
            <div class="relative w-full">
              <UInput
                v-model="passwordForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-lucide-lock"
                class="w-full pr-10"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                @click="showNewPassword = !showNewPassword"
              >
                <UIcon :name="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
              </button>
            </div>
          </UFormField>

          <!-- Confirm Password -->
          <UFormField label="Confirm New Password" required class="flex flex-col gap-1 text-xs">
            <div class="relative w-full">
              <UInput
                v-model="passwordForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-lucide-check"
                class="w-full pr-10"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <UIcon :name="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
              </button>
            </div>
          </UFormField>

          <!-- Submit Password Button -->
          <div class="pt-4 flex items-center justify-end">
            <UButton
              type="submit"
              color="primary"
              icon="i-lucide-shield-check"
              :loading="isChangingPassword"
              class="w-full font-semibold shadow-md shadow-primary/20 cursor-pointer justify-center"
            >
              Update Password
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currentUserData, getCurrentUserService } from "~/model_dto/auth/get_current_user.dto";
import { updateProfileService, changeUserPasswordService } from "~/composables/useUserService";
import getImagePath from "~/composables/getImagePath";

definePageMeta({
  middleware: "auth",
});

// UI states
const isSavingProfile = ref(false);
const isChangingPassword = ref(false);
const feedbackSuccess = ref(false);
const feedbackMessage = ref("");
const feedbackError = ref("");

// Passwords visibility
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Forms
const profileForm = reactive({
  name: "",
  phone: "",
  telegramUsername: "",
  telegramChatId: "",
  telegramLinked: "",
  image: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Init form from currentUserData
const populateForm = () => {
  if (currentUserData.value) {
    profileForm.name = currentUserData.value.Name || "";
    profileForm.phone = currentUserData.value.Phone || "";
    profileForm.telegramUsername = currentUserData.value.TelegramUsername || "";
    profileForm.telegramChatId = currentUserData.value.TelegramChatId || "";
    profileForm.image = currentUserData.value.Image || "";
  }
};

watch(
  () => currentUserData.value,
  () => {
    populateForm();
  },
  { immediate: true }
);

const userInitials = computed(() => {
  const name = currentUserData.value?.Name || currentUserData.value?.Username || "U";
  return name.trim().substring(0, 2).toUpperCase();
});

// Handle Avatar upload
function handleAvatarUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      feedbackError.value = "Image size should not exceed 5MB.";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      profileForm.image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Save Profile
async function saveProfile() {
  if (!profileForm.name.trim()) {
    feedbackError.value = "Name is required.";
    return;
  }

  try {
    isSavingProfile.value = true;
    feedbackError.value = "";
    feedbackSuccess.value = false;

    const targetId = currentUserData.value?.Id || "me";
    await updateProfileService(targetId, {
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim() || undefined,
      telegramUsername: profileForm.telegramUsername.trim() || undefined,
      telegramChatId: profileForm.telegramChatId.trim() || undefined,
      telegramLinked: profileForm.telegramLinked.trim() || undefined,
      image: profileForm.image || undefined,
    });

    // Refresh current user data so header & sidebar update
    await getCurrentUserService();

    feedbackSuccess.value = true;
    feedbackMessage.value = "Your profile has been updated successfully.";
  } catch (error: any) {
    const errorResponse = error?.data || error?.response?._data || error;
    feedbackError.value =
      errorResponse?.message?.[0] ||
      errorResponse?.message ||
      error?.message ||
      "Failed to update profile.";
  } finally {
    isSavingProfile.value = false;
  }
}

// Change Password
async function changePassword() {
  if (!passwordForm.newPassword) {
    feedbackError.value = "New password is required.";
    return;
  }
  if (passwordForm.newPassword.length < 8) {
    feedbackError.value = "New password must be at least 8 characters long.";
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    feedbackError.value = "New password and Confirm password do not match.";
    return;
  }

  try {
    isChangingPassword.value = true;
    feedbackError.value = "";
    feedbackSuccess.value = false;

    const targetId = currentUserData.value?.Id || "me";
    await changeUserPasswordService(targetId, {
      currentPassword: passwordForm.currentPassword || undefined,
      newPassword: passwordForm.newPassword,
    });

    feedbackSuccess.value = true;
    feedbackMessage.value = "Password changed successfully.";

    // Reset password inputs
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (error: any) {
    const errorResponse = error?.data || error?.response?._data || error;
    feedbackError.value =
      errorResponse?.message?.[0] ||
      errorResponse?.message ||
      error?.message ||
      "Failed to change password. Please check your current password.";
  } finally {
    isChangingPassword.value = false;
  }
}

// Helper badge styling
const getRoleBadgeClass = (role?: string) => {
  switch (role?.toLowerCase()) {
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
};

const getRoleIcon = (role?: string) => {
  switch (role?.toLowerCase()) {
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
};

onMounted(async () => {
  await getCurrentUserService();
  populateForm();
});
</script>
