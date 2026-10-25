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
          {{ authForm ? $t('auth.register_title') : $t('auth.login_title') }}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{
            authForm
              ? $t('auth.register_subtitle')
              : $t('auth.login_subtitle')
          }}
        </p>
      </div>

      <!-- Mode Toggle Switch -->
      <!-- <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
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
          {{ $t('auth.login_button') }}
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
      </div> -->



      <!-- Login Form -->
      <UForm  :state="startLogin" class="space-y-4" @submit="onSubmit">
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
        <p v-if="messageErrorAuth" class="bg-red-100 w-full p-2 border border-red-600 rounded-md text-center text-red-600 text-xs" >{{ messageErrorAuth }}</p>
      </UForm>

      <!-- Footer Toggle Link -->
      <div
        class="text-center pt-2 border-t border-slate-100 dark:border-slate-800"
      >
        <!-- <p class="text-xs text-slate-500 dark:text-slate-400">
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
        </p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  loadingAuth,
  loginService,
  messageErrorAuth,
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
  regiRole: UserRole.ADMIN,
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
       loginService(startLogin);
}

onMounted(() => {
  messageErrorAuth.value = "";
})
</script>
