<template>
  <div class="max-w-7xl mx-auto space-y-6 pb-12">
    <!-- Page Header & Action Bar -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0"
        >
          <UIcon name="i-lucide-users" class="w-6 h-6" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              User Management
            </h1>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
            >
              {{ filteredUsers.length }} Users
            </span>
          </div>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            View system user accounts, roles, and register new members.
          </p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Search Input -->
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search by name, username, phone..."
          class="w-full sm:w-64"
          size="md"
        />

        <!-- Role Filter Dropdown -->
        <select
          v-model="selectedRoleFilter"
          class="h-9 px-3 border rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="developer">Developer</option>
          <option value="manager">Manager</option>
          <option value="hr">HR</option>
          <option value="it">IT</option>
          <option value="client">Client</option>
        </select>

        <!-- Register New User Button (Opens Form Modal) -->
        <UButton
          label="Register New User"
          icon="i-lucide-user-plus"
          color="primary"
          size="md"
          class="font-semibold shadow-md shadow-primary/20 cursor-pointer"
          @click="openRegisterModal"
        />
      </div>
    </div>

    <!-- Success Feedback Notification (After Registration) -->
    <div
      v-if="registerSuccess"
      class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start justify-between gap-3 text-emerald-800 dark:text-emerald-300 transition-all duration-300 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h4 class="font-semibold text-sm">User Registered Successfully!</h4>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            {{ successMessage }}
          </p>
        </div>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-x"
        class="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
        @click="registerSuccess = false"
      />
    </div>

    <!-- Desktop Users Data Table Container (Visible on tablets & desktops) -->
    <div
      class="hidden md:block overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full min-w-max table-auto text-left border-collapse">
          <thead>
            <tr
              class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/75 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
            >
              <th class="px-6 py-4">User</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Contact Details</th>
              <th class="px-6 py-4">Login Method</th>
              <th class="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            <tr
              v-for="user in filteredUsers"
              :key="user.Id"
              class="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors duration-150 text-neutral-700 dark:text-neutral-300"
            >
              <!-- User Profile & Name -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-700"
                  >
                    <img
                      v-if="user.Image"
                      :src="getImagePath(user.Image)"
                      :alt="user.Name"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      :class="['w-full h-full flex items-center justify-center font-bold text-xs', getAvatarBg(user.Name)]"
                    >
                      {{ getInitials(user.Name || user.Username) }}
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                      {{ user.Name || "Unnamed User" }}
                    </h4>
                    <p class="text-xs text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                      @{{ user.Username || "no_username" }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Role Badge -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize"
                  :class="getRoleBadgeClass(user.Role)"
                >
                  <UIcon :name="getRoleIcon(user.Role)" class="w-3.5 h-3.5" />
                  {{ user.Role || "guest" }}
                </span>
              </td>

              <!-- Contact Info -->
              <td class="px-6 py-4 space-y-1">
                <div v-if="user.Phone" class="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <UIcon name="i-lucide-phone" class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{{ user.Phone }}</span>
                </div>
                <div v-if="user.TelegramUsername" class="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400">
                  <UIcon name="i-lucide-send" class="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{{ user.TelegramUsername.startsWith("@") ? user.TelegramUsername : `@${user.TelegramUsername}` }}</span>
                </div>
                <div v-if="user.GoogleAccount" class="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <UIcon name="i-lucide-mail" class="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{{ user.GoogleAccount }}</span>
                </div>
                <span v-if="!user.Phone && !user.TelegramUsername && !user.GoogleAccount" class="text-xs text-neutral-400">—</span>
              </td>

              <!-- Login Method -->
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 capitalize">
                  {{ user.LoginType || "username" }}
                </span>
              </td>

              <!-- Status Badge -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize"
                  :class="user.Status === 'active' || !user.Status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' : 'bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="user.Status === 'active' || !user.Status ? 'bg-emerald-500' : 'bg-neutral-400'" />
                  {{ user.Status || "active" }}
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-neutral-400">
                <div class="flex flex-col items-center justify-center space-y-2">
                  <UIcon name="i-lucide-users" class="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
                  <p class="text-sm font-medium">No users found matching your search.</p>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    label="Reset Filters"
                    @click="searchQuery = ''; selectedRoleFilter = 'all'"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile Responsive Cards Container (Visible on mobile screens) -->
    <div class="block md:hidden space-y-3.5">
      <CardResponsiveListUser
        v-for="user in filteredUsers"
        :key="user.Id"
        :user="user"
      />

      <!-- Mobile Empty State -->
      <div
        v-if="filteredUsers.length === 0"
        class="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center text-neutral-400 space-y-2"
      >
        <UIcon name="i-lucide-users" class="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700" />
        <p class="text-sm font-medium">No users found matching your search.</p>
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          label="Reset Filters"
          @click="searchQuery = ''; selectedRoleFilter = 'all'"
        />
      </div>
    </div>

    <!-- Register New User Modal Dialog -->
    <UModal
      :dismissible="true"
      v-model:open="isRegisterModalOpen"
      title="Register New User"
      :ui="{
        content:
          'sm:max-w-3xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-y-auto max-h-[90vh]',
      }"
    >
      <template #body>
        <!-- Modal Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start justify-between gap-3 text-red-800 dark:text-red-300 text-xs"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-x"
            @click="errorMessage = ''"
          />
        </div>

        <UForm :state="startRegister" class="space-y-6" @submit="onSubmit">
          <!-- Step 1: Profile Image -->
          <div>
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <UIcon name="i-lucide-camera" class="w-4 h-4 text-primary" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                1. Profile Photo
              </h3>
            </div>

            <div class="flex items-center gap-5 p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/50">
              <div
                class="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 shadow-inner"
              >
                <img
                  v-if="startRegister.regiImage"
                  :src="startRegister.regiImage"
                  alt="Avatar Preview"
                  class="w-full h-full object-cover"
                />
                <UIcon v-else name="i-lucide-user" class="w-7 h-7 text-neutral-400" />
              </div>

              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2.5">
                  <label
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm cursor-pointer transition-all"
                  >
                    <UIcon name="i-lucide-upload" class="w-3.5 h-3.5" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleImageUpload"
                    />
                  </label>
                  <UButton
                    v-if="startRegister.regiImage"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-trash-2"
                    class="text-red-500 hover:text-red-600"
                    @click="startRegister.regiImage = ''"
                  >
                    Remove
                  </UButton>
                </div>
                <p class="text-[11px] text-neutral-400">
                  Recommended square format (Max 5MB).
                </p>
              </div>
            </div>
          </div>

          <!-- Step 2: Personal Details -->
          <div>
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <UIcon name="i-lucide-user-check" class="w-4 h-4 text-primary" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                2. Personal Information
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Full Name" name="regiName" required class="flex flex-col gap-1 text-xs">
                <UInput
                  v-model="startRegister.regiName"
                  placeholder="e.g. John Doe"
                  icon="i-lucide-user"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Phone Number" name="regiPhone" required class="flex flex-col gap-1 text-xs">
                <UInput
                  v-model="startRegister.regiPhone"
                  placeholder="e.g. +855 12 345 678"
                  icon="i-lucide-phone"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Telegram Username" name="regiTelegramUsername" class="flex flex-col gap-1 text-xs">
                <UInput
                  v-model="startRegister.regiTelegramUsername"
                  placeholder="e.g. @john_doe"
                  icon="i-lucide-send"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Google / Email Account" name="regiGoogleAccount" class="flex flex-col gap-1 text-xs">
                <UInput
                  v-model="startRegister.regiGoogleAccount"
                  placeholder="e.g. johndoe@gmail.com"
                  icon="i-lucide-mail"
                  class="w-full"
                />
              </UFormField>
            </div>
          </div>

          <!-- Step 3: Account Credentials -->
          <div>
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <UIcon name="i-lucide-key-round" class="w-4 h-4 text-primary" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                3. Credentials
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Username" name="regiUsername" required class="flex flex-col gap-1 text-xs">
                <UInput
                  v-model="startRegister.regiUsername"
                  placeholder="e.g. john_doe"
                  icon="i-lucide-at-sign"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Password" name="regiPassword" required class="flex flex-col gap-1 text-xs">
                <div class="relative w-full">
                  <UInput
                    v-model="startRegister.regiPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    icon="i-lucide-lock"
                    class="w-full pr-10"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    @click="showPassword = !showPassword"
                  >
                    <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
                  </button>
                </div>
              </UFormField>
            </div>
          </div>

          <!-- Step 4: Role Selection Cards -->
          <div>
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-shield" class="w-4 h-4 text-primary" />
                <h3 class="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  4. Assigned Role
                </h3>
              </div>
              <span class="text-xs text-neutral-400">
                Selected: <strong class="text-primary capitalize">{{ startRegister.regiRole }}</strong>
              </span>
            </div>

            <!-- Role Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
              <div
                v-for="role in roleOptions"
                :key="role.value"
                class="p-3 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col justify-between"
                :class="[
                  startRegister.regiRole === role.value
                    ? 'bg-primary/5 border-primary ring-2 ring-primary/20 shadow-xs'
                    : 'bg-white dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300'
                ]"
                @click="startRegister.regiRole = role.value"
              >
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <div
                      class="w-8 h-8 rounded-lg flex items-center justify-center"
                      :class="startRegister.regiRole === role.value ? 'bg-primary text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'"
                    >
                      <UIcon :name="role.icon" class="w-4 h-4" />
                    </div>
                    <UIcon
                      v-if="startRegister.regiRole === role.value"
                      name="i-lucide-check-circle"
                      class="w-4 h-4 text-primary"
                    />
                  </div>
                  <h4 class="font-bold text-xs text-neutral-900 dark:text-white">
                    {{ role.label }}
                  </h4>
                  <p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">
                    {{ role.description }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Login Method -->
            <div class="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/50">
              <UFormField label="Primary Login Method" name="regiLoginType" class="flex flex-col gap-1 text-xs">
                <select
                  v-model="startRegister.regiLoginType"
                  class="w-full h-9 px-3 border rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer"
                >
                  <option :value="LoginType.USERNAME">Username & Password</option>
                  <option :value="LoginType.PHONE_NUMBER">Phone Number</option>
                  <option :value="LoginType.EMAIL">Email Address</option>
                  <option :value="LoginType.TELEGRAM">Telegram</option>
                  <option :value="LoginType.GOOGLE">Google Account</option>
                </select>
              </UFormField>
            </div>
          </div>

          <!-- Actions Inside Modal -->
          <div class="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="sm"
              @click="isRegisterModalOpen = false"
            >
              Cancel
            </UButton>

            <UButton
              type="submit"
              color="primary"
              size="sm"
              icon="i-lucide-user-plus"
              :loading="isSubmitting"
              class="font-semibold shadow-md shadow-primary/20 cursor-pointer"
            >
              Confirm & Register
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { mapperRegister, registerService, type RegisterDTO } from "~/model_dto/auth/auth.dto";
import { getListUserService, listUserData } from "~/model_dto/auth/get_all_user";
import { LoginType, UserRole, UserStatus } from "~/model_dto/auth/user_enum.dto";

// Enforce developer or admin access
definePageMeta({
  middleware: "auth",
  roles: [UserRole.DEVELOPER, UserRole.ADMIN],
});

// UI states
const isRegisterModalOpen = ref(false);
const searchQuery = ref("");
const selectedRoleFilter = ref("all");
const showPassword = ref(false);
const isSubmitting = ref(false);
const registerSuccess = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Registration Form State
const startRegister = reactive<RegisterDTO>({
  regiLoginType: LoginType.USERNAME,
  regiRole: UserRole.ADMIN,
  regiStatus: UserStatus.ACTIVE,
  regiName: "",
  regiUsername: "",
  regiTelegramUsername: "",
  regiGoogleAccount: "",
  regiPhone: "",
  regiPassword: "",
  regiImage: "",
});

// Role catalog
const roleOptions = [
  {
    value: UserRole.ADMIN,
    label: "Administrator",
    description: "Full access to all modules, configurations, and permissions",
    icon: "i-lucide-shield-check",
  },
  {
    value: UserRole.DEVELOPER,
    label: "Developer",
    description: "Access to developer utilities, logger, storage, and size data",
    icon: "i-lucide-code-2",
  },
  {
    value: UserRole.MANAGER,
    label: "Manager",
    description: "Manage loan applications, customer approvals, and reports",
    icon: "i-lucide-briefcase",
  },
  {
    value: UserRole.HR,
    label: "HR",
    description: "Manage employee files, staff records, and internal accounts",
    icon: "i-lucide-users",
  },
  {
    value: UserRole.IT,
    label: "IT Support",
    description: "System maintenance, device integrations, and logging",
    icon: "i-lucide-cpu",
  },
  {
    value: UserRole.CLIENT,
    label: "Customer / Client",
    description: "Client portal access to view active loans and repayment",
    icon: "i-lucide-user",
  },
];

// Filtered user list computed property
const filteredUsers = computed(() => {
  let list = listUserData.value || [];

  // Filter by role
  if (selectedRoleFilter.value !== "all") {
    list = list.filter(
      (u) => (u.Role || "").toLowerCase() === selectedRoleFilter.value.toLowerCase()
    );
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      (u) =>
        (u.Name || "").toLowerCase().includes(q) ||
        (u.Username || "").toLowerCase().includes(q) ||
        (u.Phone || "").toLowerCase().includes(q) ||
        (u.TelegramUsername || "").toLowerCase().includes(q) ||
        (u.GoogleAccount || "").toLowerCase().includes(q)
    );
  }

  return list;
});

// Role badges styling
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

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name.trim().substring(0, 2).toUpperCase();
};

const getAvatarBg = (name?: string) => {
  const colors = [
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
  ];
  const charCode = (name || "U").charCodeAt(0);
  return colors[charCode % colors.length];
};

function openRegisterModal() {
  errorMessage.value = "";
  isRegisterModalOpen.value = true;
}

// Handle Profile Image Upload (Base64)
function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      startRegister.regiImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Reset Form fields
function resetForm() {
  startRegister.regiName = "";
  startRegister.regiUsername = "";
  startRegister.regiTelegramUsername = "";
  startRegister.regiGoogleAccount = "";
  startRegister.regiPhone = "";
  startRegister.regiPassword = "";
  startRegister.regiImage = "";
  startRegister.regiRole = UserRole.ADMIN;
  startRegister.regiLoginType = LoginType.USERNAME;
  startRegister.regiStatus = UserStatus.ACTIVE;
}

// Form Submission
async function onSubmit() {
  if (!startRegister.regiUsername || !startRegister.regiPassword || !startRegister.regiName) {
    errorMessage.value = "Please fill in all required fields (Name, Username, Password).";
    return;
  }

  try {
    isSubmitting.value = true;
    errorMessage.value = "";
    await registerService(startRegister);

    registerSuccess.value = true;
    successMessage.value = `Account "${startRegister.regiName || startRegister.regiUsername}" was created successfully with role "${startRegister.regiRole.toUpperCase()}".`;

    // Clear form and close modal
    resetForm();
    isRegisterModalOpen.value = false;

    // Refresh user list table
    await getListUserService();
  } catch (error: any) {
    const errorResponse = error?.data || error?.response?._data || error;
    const msg =
      errorResponse?.message?.[0] ||
      errorResponse?.message ||
      error?.message ||
      "An unexpected error occurred while registering the user.";
    errorMessage.value = msg;
    console.error("Register Error:", errorResponse);
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  await getListUserService();
});
</script>