<template>
  <div class="space-y-6">
    <!-- Projects Directory Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
          <span class="material-symbols-outlined text-[16px] text-[#8083ff]">folder_open</span>
          <span>Repository Catalog</span>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Projects Directory</h1>
      </div>

      <!-- Filters & Actions -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-[#908fa0] text-[18px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="h-9 pl-9 pr-4 bg-[#141b2b] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            @input="debouncedSearch"
          />
        </div>

        <select
          v-model="selectedStatus"
          class="h-9 px-3 bg-[#141b2b] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
          @change="loadProjects"
        >
          <option value="">All Statuses</option>
          <option value="PLANNING">Planning</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-12 text-center text-xs text-[#908fa0]">
      Fetching projects directory...
    </div>

    <!-- Empty State -->
    <div v-else-if="!projects.length" class="p-12 text-center rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-3">
      <span class="material-symbols-outlined text-4xl text-[#908fa0]">folder_off</span>
      <p class="text-xs text-[#c7c4d7]">No projects match your filter or search criteria.</p>
    </div>

    <!-- Projects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="p-6 rounded-2xl bg-[#141b2b] border border-[#232a3a] hover:border-[#8083ff]/50 transition-all flex flex-col justify-between shadow-xl group space-y-5"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <span class="px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider" :class="getStatusBadgeClass(project.status)">
              {{ project.status.replace('_', ' ') }}
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="getPriorityClass(project.priority)">
              {{ project.priority }}
            </span>
          </div>

          <NuxtLink :to="`/projects/${project.id}`" class="block">
            <h3 class="text-base font-bold text-white group-hover:text-[#c0c1ff] transition-colors line-clamp-1">
              {{ project.name }}
            </h3>
            <p class="text-xs text-[#c7c4d7] line-clamp-2 mt-1 min-h-[36px]">
              {{ project.description || 'No detailed description provided.' }}
            </p>
          </NuxtLink>
        </div>

        <!-- Progress Summary & Footer -->
        <div class="space-y-3 pt-3 border-t border-[#232a3a]">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#908fa0]">Completion Progress</span>
              <span class="text-[#4edea3] font-mono font-bold">{{ project.progress?.progress ?? 0 }}%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-[#2e3545] overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#8083ff] to-[#4edea3] rounded-full transition-all duration-300"
                :style="{ width: `${project.progress?.progress ?? 0}%` }"
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-[#908fa0] pt-1">
            <span>{{ project.progress?.totalTasks ?? 0 }} Tasks Scoped</span>
            <NuxtLink :to="`/projects/${project.id}`" class="text-[#8083ff] hover:underline flex items-center gap-1 font-medium">
              <span>View Specs</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ProjectDto } from '~/model_dto/project.dto';
import { useProjectService } from '~/composables/useProjectService';

useSeoMeta({
  title: 'Projects Directory - PPM',
  description: 'Manage and review active repositories and projects.',
});

const projectService = useProjectService();
const projects = ref<ProjectDto[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedStatus = ref('');

const loadProjects = async () => {
  try {
    loading.value = true;
    const res = await projectService.getProjects({
      search: searchQuery.value || undefined,
      status: selectedStatus.value ? (selectedStatus.value as any) : undefined,
    });
    projects.value = res.data;
  } catch (err) {
    console.error('Failed to fetch projects:', err);
  } finally {
    loading.value = false;
  }
};

let searchTimer: any = null;
const debouncedSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    loadProjects();
  }, 300);
};

onMounted(() => {
  loadProjects();
});

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'IN_PROGRESS': return 'bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/30';
    case 'COMPLETED': return 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30';
    case 'PLANNING': return 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/30';
    case 'ON_HOLD': return 'bg-yellow-950/40 text-yellow-400 border border-yellow-800/40';
    default: return 'bg-[#191f2f] text-[#908fa0]';
  }
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'URGENT': return 'bg-red-950 text-red-400';
    case 'HIGH': return 'bg-orange-950 text-orange-400';
    case 'MEDIUM': return 'bg-[#191f2f] text-[#4cd7f6]';
    default: return 'bg-[#191f2f] text-[#908fa0]';
  }
};
</script>
