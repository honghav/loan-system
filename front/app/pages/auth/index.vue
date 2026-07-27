<template>
  <div
    class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6"
    >
      <!-- Header -->
      <div class="text-center space-y-2">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2"
        >
          <UIcon
            :name="authForm ? 'i-lucide-user-plus' : 'i-lucide-log-in'"
            class="w-6 h-6"
          />
        </div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          {{ authForm ? "Create an Account" : "Welcome Back" }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{
            authForm
              ? "Fill in your details to register"
              : "Enter your credentials to access your account"
          }}
        </p>
      </div>

      <!-- Mode Toggle Switch -->
      <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          type="button"
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
          :class="
            !authForm
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          "
          @click="authForm = false"
        >
          Sign In
        </button>
        <button
          type="button"
          class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer"
          :class="
            authForm
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          "
          @click="authForm = true"
        >
          Register
        </button>
      </div>

      <!-- Register Form -->
      <UForm
        v-if="authForm"
        :state="startRegister"
        class="space-y-4"
        @submit="onSubmit"
      >
        <!-- Profile Image -->
        <UFormField
          label="Profile Image"
          name="regiImage"
          class="flex flex-col gap-1"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0"
            >
              <img
                v-if="startRegister.regiImage"
                :src="startRegister.regiImage"
                alt="Avatar Preview"
                class="w-full h-full object-cover"
              />
              <UIcon
                v-else
                name="i-lucide-user"
                class="w-6 h-6 text-slate-400"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              class="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              @change="handleImageUpload"
            />
          </div>
        </UFormField>

        <!-- Full Name -->
        <UFormField
          label="Full Name"
          name="regiName"
          required
          class="flex flex-col gap-1"
        >
          <UInput
            v-model="startRegister.regiName"
            placeholder="e.g. John Doe"
            icon="i-lucide-user"
            class="w-full"
          />
        </UFormField>

        <!-- Phone Number -->
        <UFormField
          label="Phone Number"
          name="regiPhone"
          required
          class="flex flex-col gap-1"
        >
          <UInput
            v-model="startRegister.regiPhone"
            placeholder="e.g. +85512345678"
            icon="i-lucide-phone"
            class="w-full"
          />
        </UFormField>

        <!-- Username -->
        <UFormField
          label="Username"
          name="regiUsername"
          required
          class="flex flex-col gap-1"
        >
          <UInput
            v-model="startRegister.regiUsername"
            placeholder="e.g. john_doe"
            icon="i-lucide-at-sign"
            class="w-full"
          />
        </UFormField>

        <!-- Telegram Username -->
        <UFormField
          label="Telegram Username"
          name="regiTelegramUsername"
          required
          class="flex flex-col gap-1"
        >
          <UInput
            v-model="startRegister.regiTelegramUsername"
            placeholder="e.g. @john_doe"
            icon="i-lucide-send"
            class="w-full"
          />
        </UFormField>

        <!-- Password -->
        <UFormField
          label="Password"
          name="regiPassword"
          required
          class="flex flex-col gap-1"
        >
          <UInput
            v-model="startRegister.regiPassword"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          color="primary"
          block
          icon="i-lucide-user-plus"
          :loading="loadingAuth"
          class="mt-6 py-2.5 font-semibold shadow-md cursor-pointer"
        >
          Register Account
        </UButton>
      </UForm>

      <!-- Login Form -->
      <UForm v-else :state="startLogin" class="space-y-4" @submit="onSubmit">
        <!-- Username -->
        <UFormField
          label="Username"
          name="loginUsername"
          required
          class="flex flex-col gap-1"
        >
          <UInput
            v-model="startLogin.loginUsername"
            placeholder="e.g. john_doe"
            icon="i-lucide-at-sign"
            class="w-full"
          />
        </UFormField>

        <!-- Password -->
        <UFormField
          label="Password"
          name="loginPassword"
          required
          class="flex flex-col gap-1"
        >
          <UInput
            v-model="startLogin.loginPassword"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loadingAuth"
          icon="i-lucide-log-in"
          class="mt-6 py-2.5 font-semibold shadow-md cursor-pointer"
        >
          Sign In
        </UButton>
      </UForm>

      <!-- Footer Toggle Link -->
      <div
        class="text-center pt-2 border-t border-slate-100 dark:border-slate-800"
      >
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{
            authForm ? "Already have an account?" : "Don't have an account yet?"
          }}
          <button
            type="button"
            class="font-medium text-primary hover:underline ml-1 cursor-pointer"
            @click="authForm = !authForm"
          >
            {{ authForm ? "Sign in" : "Create one" }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  loadingAuth,
  loginService,
  registerService,
  type LoginDTO,
  type RegisterDTO,
} from "~/model_dto/auth/auth.dto";
import {
  LoginType,
  UserRole,
  UserStatus,
} from "~/model_dto/auth/user_enum.dto";

definePageMeta({
  layout: false,
});

const authForm = ref(false);

const startRegister = reactive<RegisterDTO>({
  regiLoginType: LoginType.USERNAME,
  regiRole: UserRole.DEVELOPER,
  regiStatus: UserStatus.ACTIVE,
  regiName: "",
  regiUsername: "",
  regiTelegramUsername: "",
  regiPhone: "",
  regiPassword: "",
  regiImage: "",
});

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

const startLogin = reactive<LoginDTO>({
  loginUsername: "",
  loginPassword: "",
  loginLoginType: LoginType.USERNAME,
});

function onSubmit() {
  if (authForm.value) {
    registerService(startRegister);
  } else {
    loginService(startLogin);
  }
}
</script>
