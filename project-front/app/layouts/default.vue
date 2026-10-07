<template>
  <div class="min-h-screen bg-[#0c1322] text-[#dce2f7] font-sans antialiased selection:bg-[#8083ff] selection:text-white">
    <!-- Fixed Top Header -->
    <header class="fixed top-0 left-0 right-0 h-16 z-50 bg-[#0c1322]/90 backdrop-blur-xl border-b border-[#232a3a] shadow-lg">
      <div class="w-full h-full px-6 flex items-center justify-between gap-4">
        <!-- Logo & Title -->
        <NuxtLink to="/" class="flex items-center gap-3 min-w-[220px] group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8083ff] to-[#4cd7f6] flex items-center justify-center text-white shadow-[0_0_15px_rgba(128,131,255,0.4)] group-hover:scale-105 transition-transform">
            <span class="material-symbols-outlined text-[22px]">rocket_launch</span>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-lg text-white tracking-tight leading-none group-hover:text-[#c0c1ff] transition-colors">PPM</span>
            <span class="text-[10px] text-[#908fa0] uppercase tracking-widest font-semibold mt-0.5">Personal Project Manager</span>
          </div>
        </NuxtLink>

        <!-- Search Bar -->
        <div class="flex-1 max-w-lg hidden md:flex items-center">
          <div class="relative w-full flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-[#908fa0] pointer-events-none text-[18px]">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tasks, projects, telemetry..."
              class="w-full h-10 pl-10 pr-16 bg-[#070e1d] text-[#dce2f7] placeholder-[#908fa0] text-xs rounded-lg border border-[#232a3a] focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all shadow-inner"
              @keydown.enter="handleSearch"
            />
            <kbd class="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#2e3545] text-[#c7c4d7] text-[10px] font-mono border border-[#464554]">⌘K</kbd>
          </div>
        </div>

        <!-- Right Quick Status & Actions -->
        <div class="flex items-center gap-3">
          <!-- Backend API Health Badge -->
          <div class="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#141b2b] border border-[#232a3a] text-[#4edea3] text-xs font-medium">
            <span class="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span>API v2.0 Connected</span>
          </div>

          <!-- New Project Button -->
          <button
            type="button"
            class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#8083ff] text-white font-medium text-xs hover:bg-[#c0c1ff] hover:text-[#0d0096] transition-all shadow-[0_0_12px_rgba(128,131,255,0.3)] active:scale-95"
            @click="isCreateProjectModalOpen = true"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>New Project</span>
          </button>

          <!-- User Avatar -->
          <div class="w-9 h-9 rounded-full bg-[#191f2f] border border-[#232a3a] flex items-center justify-center text-[#c0c1ff]">
            <span class="material-symbols-outlined text-[20px]">person</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Fixed Left Sidebar Navigation -->
    <aside class="fixed left-0 top-16 bottom-0 w-64 bg-[#070e1d]/90 backdrop-blur-xl border-r border-[#232a3a] z-40 flex flex-col justify-between py-4 shadow-xl">
      <div class="flex flex-col gap-4 px-4">
        <div class="px-2 pt-1">
          <span class="text-[10px] font-bold uppercase tracking-widest text-[#908fa0]">Navigation</span>
        </div>
        <nav class="flex flex-col gap-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-3 py-2.5 rounded-xl transition-all text-xs font-medium"
            :class="[
              route.path === item.path
                ? 'bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/40 shadow-sm font-semibold'
                : 'text-[#c7c4d7] hover:bg-[#191f2f] hover:text-white'
            ]"
          >
            <span class="material-symbols-outlined mr-3 text-[20px]" :class="route.path === item.path ? 'text-[#c0c1ff]' : 'text-[#908fa0]'">{{ item.icon }}</span>
            <span>{{ item.title }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Telemetry Footer Widget -->
      <div class="px-4 flex flex-col gap-3">
        <div class="p-3.5 rounded-xl bg-[#141b2b] border border-[#232a3a] flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs text-[#c7c4d7]">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-[#4cd7f6]">memory</span>
              Memory Usage
            </span>
            <span class="text-[#4edea3] font-mono font-semibold">64%</span>
          </div>
          <div class="w-full h-1.5 rounded-full bg-[#2e3545] overflow-hidden">
            <div class="h-full bg-gradient-to-r from-[#4cd7f6] to-[#4edea3] rounded-full w-[64%]"></div>
          </div>
        </div>
        <div class="flex items-center justify-between px-2 text-[11px] text-[#908fa0]">
          <span>PPM Core v2.0</span>
          <span class="text-[#4edea3] font-medium">● Stable</span>
        </div>
      </div>
    </aside>

    <!-- Main Workspace Content -->
    <div class="pl-64">
      <main class="relative pt-16 w-full min-h-screen bg-[#0c1322]">
        <!-- Ambient Backdrop Glow Spots -->
        <div class="relative w-full">
          <div class="absolute -top-12 left-1/4 w-96 h-96 bg-[#8083ff]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div class="absolute top-48 right-12 w-80 h-80 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        </div>
        
        <div class="p-6 md:p-8">
          <slot />
        </div>
      </main>
    </div>

    <!-- Quick Project Creation Modal -->
    <div v-if="isCreateProjectModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="w-full max-w-lg bg-[#141b2b] border border-[#232a3a] rounded-2xl p-6 shadow-2xl space-y-5">
        <div class="flex items-center justify-between border-b border-[#232a3a] pb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#c0c1ff]">add_circle</span>
            <h3 class="text-lg font-bold text-white">Create New Project</h3>
          </div>
          <button @click="isCreateProjectModalOpen = false" class="text-[#908fa0] hover:text-white transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="handleCreateProject" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1">Project Name *</label>
            <input
              v-model="newProject.name"
              required
              type="text"
              placeholder="e.g. NextGen Microservices Platform"
              class="w-full h-10 px-3 bg-[#070e1d] text-white placeholder-[#908fa0] text-xs rounded-lg border border-[#232a3a] focus:outline-none focus:border-[#c0c1ff]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1">Description</label>
            <textarea
              v-model="newProject.description"
              rows="3"
              placeholder="Brief summary of project scope & objectives..."
              class="w-full p-3 bg-[#070e1d] text-white placeholder-[#908fa0] text-xs rounded-lg border border-[#232a3a] focus:outline-none focus:border-[#c0c1ff]"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-[#c7c4d7] mb-1">Initial Status</label>
              <select
                v-model="newProject.status"
                class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a] focus:outline-none focus:border-[#c0c1ff]"
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#c7c4d7] mb-1">Priority</label>
              <select
                v-model="newProject.priority"
                class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a] focus:outline-none focus:border-[#c0c1ff]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#232a3a]">
            <button
              type="button"
              @click="isCreateProjectModalOpen = false"
              class="px-4 py-2 text-xs font-medium text-[#c7c4d7] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-5 py-2 rounded-lg bg-[#8083ff] text-white text-xs font-semibold hover:bg-[#c0c1ff] hover:text-[#0d0096] transition-all disabled:opacity-50"
            >
              {{ isSubmitting ? 'Creating...' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ProjectStatus, ProjectPriority } from '~/model_dto/project.dto';
import { useProjectService } from '~/composables/useProjectService';

const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
const isCreateProjectModalOpen = ref(false);
const isSubmitting = ref(false);

const projectService = useProjectService();

const newProject = ref({
  name: '',
  description: '',
  status: ProjectStatus.PLANNING,
  priority: ProjectPriority.MEDIUM,
});

const navItems = [
  { path: '/', title: 'Dashboard', icon: 'dashboard' },
  { path: '/projects', title: 'Projects', icon: 'folder' },
  { path: '/kanban', title: 'Task Kanban', icon: 'view_kanban' },
  { path: '/activities', title: 'Activity Audit', icon: 'history_toggle_off' },
];

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/projects', query: { search: searchQuery.value } });
  }
};

const handleCreateProject = async () => {
  if (!newProject.value.name.trim()) return;
  try {
    isSubmitting.value = true;
    const created = await projectService.createProject({
      name: newProject.value.name,
      description: newProject.value.description,
      status: newProject.value.status,
      priority: newProject.value.priority,
    });
    isCreateProjectModalOpen.value = false;
    newProject.value = {
      name: '',
      description: '',
      status: ProjectStatus.PLANNING,
      priority: ProjectPriority.MEDIUM,
    };
    // Navigate to projects page or refresh
    router.push(`/projects/${created.id}`);
  } catch (err: any) {
    alert(err?.data?.message || 'Failed to create project. Ensure backend is running.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
