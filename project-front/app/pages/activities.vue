<template>
  <div class="space-y-6">
    <!-- Activity Audit Log Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232a3a] pb-5">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
          <span class="material-symbols-outlined text-[16px] text-[#4cd7f6]">history_toggle_off</span>
          <span>Audit Log Pipeline</span>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Activity Audit Trail</h1>
      </div>

      <!-- Project Filter -->
      <select
        v-model="selectedProjectId"
        class="h-9 px-3 bg-[#141b2b] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#4cd7f6]"
        @change="loadActivities"
      >
        <option value="">Select Project</option>
        <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-12 text-center text-xs text-[#908fa0]">
      Querying activity audit log feed...
    </div>

    <!-- Empty State -->
    <div v-else-if="!activities.length" class="p-12 text-center rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-2">
      <span class="material-symbols-outlined text-4xl text-[#908fa0]">manage_search</span>
      <p class="text-xs text-[#c7c4d7]">
        {{ selectedProjectId ? 'No activity events recorded for this project yet.' : 'Select a project above to inspect audit events.' }}
      </p>
    </div>

    <!-- Timeline Audit List -->
    <div v-else class="space-y-4">
      <div
        v-for="act in activities"
        :key="act.id"
        class="p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] hover:border-[#4cd7f6]/40 transition-all flex items-start gap-4 shadow-lg"
      >
        <div class="w-10 h-10 rounded-xl bg-[#191f2f] border border-[#232a3a] flex items-center justify-center text-[#c0c1ff] shrink-0">
          <span class="material-symbols-outlined text-[20px]">{{ getActivityIcon(act.action) }}</span>
        </div>

        <div class="flex-1 min-w-0 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white uppercase tracking-wider">{{ act.action.replace(/_/g, ' ') }}</span>
            <span class="text-[11px] text-[#908fa0] font-mono">{{ formatDate(act.createdAt) }}</span>
          </div>
          <p class="text-xs text-[#c7c4d7]">{{ act.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ActivityDto } from '~/model_dto/activity.dto';
import type { ProjectDto } from '~/model_dto/project.dto';
import { useProjectService } from '~/composables/useProjectService';
import { useActivityService } from '~/composables/useActivityService';

useSeoMeta({ title: 'Activity Audit Trail - PPM' });

const projectService = useProjectService();
const activityService = useActivityService();

const projects = ref<ProjectDto[]>([]);
const activities = ref<ActivityDto[]>([]);
const selectedProjectId = ref<string>('');
const loading = ref(false);

const loadProjects = async () => {
  try {
    const res = await projectService.getProjects({ limit: 50 });
    projects.value = res.data;
    if (projects.value.length) {
      selectedProjectId.value = projects.value[0].id;
      loadActivities();
    }
  } catch (err) {
    console.error(err);
  }
};

const loadActivities = async () => {
  if (!selectedProjectId.value) return;
  try {
    loading.value = true;
    const res = await activityService.getProjectActivities(selectedProjectId.value);
    activities.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProjects();
});

const getActivityIcon = (action: string) => {
  if (action.includes('PROJECT')) return 'folder';
  if (action.includes('FEATURE')) return 'account_tree';
  if (action.includes('TASK')) return 'check_box';
  return 'notifications';
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>
