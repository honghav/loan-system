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
            View system user accounts, roles, manage profiles, and register new members.
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

    <!-- Success Feedback Notification (After Action) -->
    <div
      v-if="actionSuccess"
      class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start justify-between gap-3 text-emerald-800 dark:text-emerald-300 transition-all duration-300 shadow-sm animate-fade-in"
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h4 class="font-semibold text-sm">Action Completed Successfully!</h4>
          <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            {{ actionSuccessMessage }}
          </p>
        </div>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        icon="i-lucide-x"
        class="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 cursor-pointer"
        @click="actionSuccess = false"
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
              <th class="px-6 py-4 text-right">Actions</th>
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
                  :class="
                    user.Status === 'active' || !user.Status
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                      : user.Status === 'suspended'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="
                      user.Status === 'active' || !user.Status
                        ? 'bg-emerald-500'
                        : user.Status === 'suspended'
                        ? 'bg-amber-500'
                        : 'bg-neutral-400'
                    "
                  />
                  {{ user.Status || "active" }}
                </span>
              </td>

              <!-- Actions Column -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-key-round"
                    title="Change Password"
                    class="cursor-pointer text-neutral-500 hover:text-primary"
                    @click="openPasswordModal(user)"
                  />
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-activity"
                    title="Update Status"
                    class="cursor-pointer text-neutral-500 hover:text-amber-500"
                    @click="openStatusModal(user)"
                  />
                  <UButton
                    size="xs"
                    color="primary"
                    variant="subtle"
                    icon="i-lucide-pencil"
                    label="Edit"
                    class="cursor-pointer font-semibold"
                    @click="openEditModal(user)"
                  />
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-neutral-400">
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
        @edit="openEditModal"
        @change-password="openPasswordModal"
        @change-status="openStatusModal"
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

    <!-- ==================== MODALS ==================== -->

    <!-- 1. Register New User Modal Dialog -->
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
        <div
          v-if="modalErrorMessage"
          class="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start justify-between gap-3 text-red-800 dark:text-red-300 text-xs"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{{ modalErrorMessage }}</span>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-x"
            @click="modalErrorMessage = ''"
          />
        </div>

        <UForm :state="startRegister" class="space-y-6" @submit="onRegisterSubmit">
          <!-- Profile Photo -->
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
                      @change="handleRegisterImageUpload"
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

          <!-- Personal Details -->
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

          <!-- Credentials -->
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
                    :type="showRegisterPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    icon="i-lucide-lock"
                    class="w-full pr-10"
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    @click="showRegisterPassword = !showRegisterPassword"
                  >
                    <UIcon :name="showRegisterPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
                  </button>
                </div>
              </UFormField>
            </div>
          </div>

          <!-- Role Selection Cards -->
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

    <!-- 2. Edit User Information Modal Dialog -->
    <UModal
      :dismissible="true"
      v-model:open="isEditModalOpen"
      :title="`Edit User: ${selectedUser?.Name || selectedUser?.Username || 'Account'}`"
      :ui="{
        content:
          'sm:max-w-2xl rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-y-auto max-h-[90vh]',
      }"
    >
      <template #body>
        <div
          v-if="modalErrorMessage"
          class="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start justify-between gap-3 text-red-800 dark:text-red-300 text-xs"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{{ modalErrorMessage }}</span>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-x"
            @click="modalErrorMessage = ''"
          />
        </div>

        <form class="space-y-5" @submit.prevent="onUpdateUserSubmit">
          <!-- Profile Avatar Upload -->
          <div class="flex items-center gap-4 p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/50">
            <div
              class="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0"
            >
              <img
                v-if="editUserForm.image"
                :src="getImagePath(editUserForm.image)"
                alt="Avatar Preview"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center font-bold text-xs bg-primary/10 text-primary"
              >
                {{ getInitials(editUserForm.name || editUserForm.username) }}
              </div>
            </div>

            <div class="flex-1 space-y-1">
              <label
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 shadow-sm cursor-pointer transition-all"
              >
                <UIcon name="i-lucide-upload" class="w-3.5 h-3.5" />
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleEditImageUpload"
                />
              </label>
              <p class="text-[11px] text-neutral-400">
                Square format recommended (Max 5MB).
              </p>
            </div>
          </div>

          <!-- Basic Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormField label="Full Name" required class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="editUserForm.name"
                placeholder="e.g. John Doe"
                icon="i-lucide-user"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Username" class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="editUserForm.username"
                placeholder="e.g. john_doe"
                icon="i-lucide-at-sign"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Phone Number" class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="editUserForm.phone"
                placeholder="e.g. +855 12 345 678"
                icon="i-lucide-phone"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Google / Email Account" class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="editUserForm.googleAccount"
                placeholder="e.g. johndoe@gmail.com"
                icon="i-lucide-mail"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Telegram Username" class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="editUserForm.telegramUsername"
                placeholder="e.g. john_dev"
                icon="i-lucide-send"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Telegram Chat ID" class="flex flex-col gap-1 text-xs">
              <UInput
                v-model="editUserForm.telegramChatId"
                placeholder="e.g. 123456789"
                icon="i-lucide-hash"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- System Settings: Role, Status, Login Type -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/50">
            <UFormField label="Role" class="flex flex-col gap-1 text-xs">
              <select
                v-model="editUserForm.role"
                class="w-full h-9 px-2.5 border rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer"
              >
                <option :value="UserRole.ADMIN">Admin</option>
                <option :value="UserRole.DEVELOPER">Developer</option>
                <option :value="UserRole.MANAGER">Manager</option>
                <option :value="UserRole.HR">HR</option>
                <option :value="UserRole.IT">IT Support</option>
                <option :value="UserRole.CLIENT">Client</option>
              </select>
            </UFormField>

            <UFormField label="Account Status" class="flex flex-col gap-1 text-xs">
              <select
                v-model="editUserForm.status"
                class="w-full h-9 px-2.5 border rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer capitalize"
              >
                <option :value="UserStatus.ACTIVE">Active</option>
                <option :value="UserStatus.INACTIVE">Inactive</option>
                <option :value="UserStatus.SUSPENDED">Suspended</option>
                <option :value="UserStatus.DELETED">Deleted</option>
              </select>
            </UFormField>

            <UFormField label="Login Method" class="flex flex-col gap-1 text-xs">
              <select
                v-model="editUserForm.loginType"
                class="w-full h-9 px-2.5 border rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-xs font-medium cursor-pointer capitalize"
              >
                <option :value="LoginType.USERNAME">Username</option>
                <option :value="LoginType.PHONE_NUMBER">Phone</option>
                <option :value="LoginType.EMAIL">Email</option>
                <option :value="LoginType.TELEGRAM">Telegram</option>
                <option :value="LoginType.GOOGLE">Google</option>
              </select>
            </UFormField>
          </div>

          <!-- Buttons -->
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="sm"
              @click="isEditModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              size="sm"
              icon="i-lucide-save"
              :loading="isSubmitting"
              class="font-semibold shadow-md shadow-primary/20 cursor-pointer"
            >
              Save Changes
            </UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- 3. Change Password Modal Dialog -->
    <UModal
      :dismissible="true"
      v-model:open="isPasswordModalOpen"
      :title="`Change Password: ${selectedUser?.Name || selectedUser?.Username || 'User'}`"
      :ui="{
        content:
          'sm:max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-y-auto max-h-[90vh]',
      }"
    >
      <template #body>
        <div
          v-if="modalErrorMessage"
          class="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2"
        >
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0 text-red-500" />
          <span>{{ modalErrorMessage }}</span>
        </div>

        <form class="space-y-4" @submit.prevent="onChangePasswordSubmit">
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Set a new secure password for <strong class="text-neutral-900 dark:text-white">{{ selectedUser?.Name }}</strong> (@{{ selectedUser?.Username }}).
          </p>

          <UFormField label="New Password (min 8 chars)" required class="flex flex-col gap-1 text-xs">
            <div class="relative w-full">
              <UInput
                v-model="passwordForm.newPassword"
                :type="showPasswordInput ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-lucide-lock"
                class="w-full pr-10"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                @click="showPasswordInput = !showPasswordInput"
              >
                <UIcon :name="showPasswordInput ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="w-4 h-4" />
              </button>
            </div>
          </UFormField>

          <UFormField label="Confirm New Password" required class="flex flex-col gap-1 text-xs">
            <div class="relative w-full">
              <UInput
                v-model="passwordForm.confirmPassword"
                :type="showPasswordInput ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-lucide-check"
                class="w-full pr-10"
              />
            </div>
          </UFormField>

          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="sm"
              @click="isPasswordModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              size="sm"
              icon="i-lucide-key"
              :loading="isSubmitting"
              class="font-semibold shadow-md shadow-primary/20 cursor-pointer"
            >
              Update Password
            </UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- 4. Update Status Modal Dialog -->
    <UModal
      :dismissible="true"
      v-model:open="isStatusModalOpen"
      :title="`Update Account Status: ${selectedUser?.Name || selectedUser?.Username || 'User'}`"
      :ui="{
        content:
          'sm:max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-y-auto max-h-[90vh]',
      }"
    >
      <template #body>
        <div
          v-if="modalErrorMessage"
          class="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2"
        >
          <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0 text-red-500" />
          <span>{{ modalErrorMessage }}</span>
        </div>

        <div class="space-y-4">
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Select a new account status for <strong class="text-neutral-900 dark:text-white">{{ selectedUser?.Name }}</strong>:
          </p>

          <div class="space-y-2">
            <div
              v-for="st in statusOptions"
              :key="st.value"
              class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-150"
              :class="[
                selectedStatus === st.value
                  ? 'bg-primary/5 border-primary ring-2 ring-primary/20 shadow-xs'
                  : 'bg-white dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
              ]"
              @click="selectedStatus = st.value"
            >
              <div class="flex items-center gap-3">
                <span class="w-2.5 h-2.5 rounded-full" :class="st.dotClass" />
                <div>
                  <h4 class="text-xs font-bold text-neutral-900 dark:text-white capitalize">
                    {{ st.label }}
                  </h4>
                  <p class="text-[11px] text-neutral-400 mt-0.5">
                    {{ st.description }}
                  </p>
                </div>
              </div>
              <UIcon
                v-if="selectedStatus === st.value"
                name="i-lucide-check-circle"
                class="w-4 h-4 text-primary shrink-0"
              />
            </div>
          </div>

          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-3">
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              size="sm"
              @click="isStatusModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              type="button"
              color="primary"
              size="sm"
              icon="i-lucide-save"
              :loading="isSubmitting"
              class="font-semibold shadow-md shadow-primary/20 cursor-pointer"
              @click="onUpdateStatusSubmit"
            >
              Confirm Status
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { registerService, type RegisterDTO } from "~/model_dto/auth/auth.dto";
import { getListUserService, listUserData } from "~/model_dto/auth/get_all_user";
import { currentUserData, getCurrentUserService, type GetCurrentUserDTO } from "~/model_dto/auth/get_current_user.dto";
import { LoginType, UserRole, UserStatus } from "~/model_dto/auth/user_enum.dto";
import {
  updateUserService,
  updateUserStatusService,
  changeUserPasswordService,
} from "~/composables/useUserService";
import getImagePath from "~/composables/getImagePath";

// Enforce developer or admin access
definePageMeta({
  middleware: "auth",
  roles: [UserRole.DEVELOPER, UserRole.ADMIN],
});

// UI states
const isRegisterModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isStatusModalOpen = ref(false);

const searchQuery = ref("");
const selectedRoleFilter = ref("all");
const isSubmitting = ref(false);
const actionSuccess = ref(false);
const actionSuccessMessage = ref("");
const modalErrorMessage = ref("");

// Password visibility toggles
const showRegisterPassword = ref(false);
const showPasswordInput = ref(false);

// Currently selected user for Edit / Password / Status
const selectedUser = ref<GetCurrentUserDTO | null>(null);

// Status selection options
const statusOptions = [
  {
    value: UserStatus.ACTIVE,
    label: "Active",
    description: "Account is active and has normal access",
    dotClass: "bg-emerald-500",
  },
  {
    value: UserStatus.INACTIVE,
    label: "Inactive",
    description: "Account is inactive and cannot log in",
    dotClass: "bg-neutral-400",
  },
  {
    value: UserStatus.SUSPENDED,
    label: "Suspended",
    description: "Account is temporarily locked for review",
    dotClass: "bg-amber-500",
  },
  {
    value: UserStatus.DELETED,
    label: "Deleted",
    description: "Account marked as soft deleted",
    dotClass: "bg-rose-500",
  },
];
const selectedStatus = ref<UserStatus>(UserStatus.ACTIVE);

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

// Edit Form State
const editUserForm = reactive({
  name: "",
  username: "",
  phone: "",
  googleAccount: "",
  telegramUsername: "",
  telegramChatId: "",
  image: "",
  role: UserRole.DEVELOPER,
  loginType: LoginType.USERNAME,
  status: UserStatus.ACTIVE,
});

// Password Form State
const passwordForm = reactive({
  newPassword: "",
  confirmPassword: "",
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

  if (selectedRoleFilter.value !== "all") {
    list = list.filter(
      (u) => (u.Role || "").toLowerCase() === selectedRoleFilter.value.toLowerCase()
    );
  }

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

// Role styling helpers
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

// Modal Openers
function openRegisterModal() {
  modalErrorMessage.value = "";
  isRegisterModalOpen.value = true;
}

function openEditModal(user?: GetCurrentUserDTO) {
  if (!user) return;
  selectedUser.value = user;
  modalErrorMessage.value = "";

  editUserForm.name = user.Name || "";
  editUserForm.username = user.Username || "";
  editUserForm.phone = user.Phone || "";
  editUserForm.googleAccount = user.GoogleAccount || "";
  editUserForm.telegramUsername = user.TelegramUsername || "";
  editUserForm.telegramChatId = user.TelegramChatId || "";
  editUserForm.image = user.Image || "";
  editUserForm.role = (user.Role as UserRole) || UserRole.DEVELOPER;
  editUserForm.loginType = (user.LoginType as LoginType) || LoginType.USERNAME;
  editUserForm.status = (user.Status as UserStatus) || UserStatus.ACTIVE;

  isEditModalOpen.value = true;
}

function openPasswordModal(user?: GetCurrentUserDTO) {
  if (!user) return;
  selectedUser.value = user;
  modalErrorMessage.value = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
  isPasswordModalOpen.value = true;
}

function openStatusModal(user?: GetCurrentUserDTO) {
  if (!user) return;
  selectedUser.value = user;
  modalErrorMessage.value = "";
  selectedStatus.value = (user.Status as UserStatus) || UserStatus.ACTIVE;
  isStatusModalOpen.value = true;
}

// Image uploads
function handleRegisterImageUpload(event: Event) {
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

function handleEditImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      modalErrorMessage.value = "Image file size should not exceed 5MB";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      editUserForm.image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

// Reset register form
function resetRegisterForm() {
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

// 1. Submit Register Form
async function onRegisterSubmit() {
  if (!startRegister.regiUsername || !startRegister.regiPassword || !startRegister.regiName) {
    modalErrorMessage.value = "Please fill in all required fields (Name, Username, Password).";
    return;
  }

  try {
    isSubmitting.value = true;
    modalErrorMessage.value = "";
    await registerService(startRegister);

    actionSuccess.value = true;
    actionSuccessMessage.value = `Account "${startRegister.regiName || startRegister.regiUsername}" was registered successfully.`;

    resetRegisterForm();
    isRegisterModalOpen.value = false;
    await getListUserService();
  } catch (error: any) {
    const errorResponse = error?.data || error?.response?._data || error;
    modalErrorMessage.value =
      errorResponse?.message?.[0] ||
      errorResponse?.message ||
      error?.message ||
      "An unexpected error occurred while registering the user.";
  } finally {
    isSubmitting.value = false;
  }
}

// 2. Submit Update User Form
async function onUpdateUserSubmit() {
  if (!selectedUser.value?.Id) return;
  if (!editUserForm.name.trim()) {
    modalErrorMessage.value = "Name is required.";
    return;
  }

  try {
    isSubmitting.value = true;
    modalErrorMessage.value = "";

    await updateUserService(selectedUser.value.Id, {
      name: editUserForm.name.trim(),
      username: editUserForm.username.trim() || undefined,
      phone: editUserForm.phone.trim() || undefined,
      googleAccount: editUserForm.googleAccount.trim() || undefined,
      telegramUsername: editUserForm.telegramUsername.trim() || undefined,
      telegramChatId: editUserForm.telegramChatId.trim() || undefined,
      image: editUserForm.image || undefined,
      role: editUserForm.role,
      status: editUserForm.status,
      loginType: editUserForm.loginType,
    });

    actionSuccess.value = true;
    actionSuccessMessage.value = `User "${editUserForm.name}" was updated successfully.`;
    isEditModalOpen.value = false;

    // Refresh list and current user if updated self
    await getListUserService();
    if (selectedUser.value.Id === currentUserData.value?.Id) {
      await getCurrentUserService();
    }
  } catch (error: any) {
    const errorResponse = error?.data || error?.response?._data || error;
    modalErrorMessage.value =
      errorResponse?.message?.[0] ||
      errorResponse?.message ||
      error?.message ||
      "Failed to update user.";
  } finally {
    isSubmitting.value = false;
  }
}

// 3. Submit Change Password Form
async function onChangePasswordSubmit() {
  if (!selectedUser.value?.Id) return;
  if (!passwordForm.newPassword) {
    modalErrorMessage.value = "New password is required.";
    return;
  }
  if (passwordForm.newPassword.length < 8) {
    modalErrorMessage.value = "Password must be at least 8 characters long.";
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    modalErrorMessage.value = "Passwords do not match.";
    return;
  }

  try {
    isSubmitting.value = true;
    modalErrorMessage.value = "";

    await changeUserPasswordService(selectedUser.value.Id, {
      newPassword: passwordForm.newPassword,
    });

    actionSuccess.value = true;
    actionSuccessMessage.value = `Password for "${selectedUser.value.Name || selectedUser.value.Username}" was changed successfully.`;
    isPasswordModalOpen.value = false;
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (error: any) {
    const errorResponse = error?.data || error?.response?._data || error;
    modalErrorMessage.value =
      errorResponse?.message?.[0] ||
      errorResponse?.message ||
      error?.message ||
      "Failed to change password.";
  } finally {
    isSubmitting.value = false;
  }
}

// 4. Submit Update Status Form
async function onUpdateStatusSubmit() {
  if (!selectedUser.value?.Id) return;

  try {
    isSubmitting.value = true;
    modalErrorMessage.value = "";

    await updateUserStatusService(selectedUser.value.Id, selectedStatus.value);

    actionSuccess.value = true;
    actionSuccessMessage.value = `Status for "${selectedUser.value.Name || selectedUser.value.Username}" updated to "${selectedStatus.value.toUpperCase()}".`;
    isStatusModalOpen.value = false;

    await getListUserService();
    if (selectedUser.value.Id === currentUserData.value?.Id) {
      await getCurrentUserService();
    }
  } catch (error: any) {
    const errorResponse = error?.data || error?.response?._data || error;
    modalErrorMessage.value =
      errorResponse?.message?.[0] ||
      errorResponse?.message ||
      error?.message ||
      "Failed to update user status.";
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  await getListUserService();
});
</script>