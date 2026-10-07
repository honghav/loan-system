<template>
  <div class="space-y-8">
    <!-- Breadcrumb & Actions Header -->
    <div class="flex items-center justify-between border-b border-[#232a3a] pb-5">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs text-[#908fa0]">
          <NuxtLink to="/projects" class="hover:text-white flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Projects</span>
          </NuxtLink>
          <span>/</span>
          <span class="text-[#c0c1ff] font-medium">{{ project?.name || 'Loading...' }}</span>
        </div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <span>{{ project?.name }}</span>
          <span v-if="project" class="text-xs px-2.5 py-0.5 rounded-full font-semibold" :class="getStatusClass(project.status)">
            {{ project.status }}
          </span>
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/kanban?projectId=${route.params.id}`"
          class="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/40 hover:bg-[#4cd7f6] hover:text-black font-semibold text-xs transition-all"
        >
          <span class="material-symbols-outlined text-[16px]">view_kanban</span>
          <span>Open Kanban Board</span>
        </NuxtLink>
        <button
          @click="handleDeleteProject"
          class="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900 hover:text-white text-xs font-medium transition-colors"
        >
          <span class="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-12 text-center text-xs text-[#908fa0]">
      Loading project specifications and features...
    </div>

    <div v-else-if="project" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left 2 Cols: Features Breakdown -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#c0c1ff]">account_tree</span>
            <h2 class="text-lg font-bold text-white">Feature Breakdown</h2>
          </div>
          <button
            @click="isCreateFeatureModalOpen = true"
            class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#8083ff] text-white text-xs font-semibold hover:bg-[#c0c1ff] hover:text-[#0d0096] transition-all"
          >
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>Add Feature</span>
          </button>
        </div>

        <div v-if="!features.length" class="p-8 rounded-2xl bg-[#141b2b] border border-[#232a3a] text-center space-y-2">
          <span class="material-symbols-outlined text-3xl text-[#908fa0]">account_tree</span>
          <p class="text-xs text-[#c7c4d7]">No feature breakdown created for this project yet.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="feat in features"
            :key="feat.id"
            class="p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-3"
          >
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                <span>{{ feat.name }}</span>
              </h3>
              <span class="text-[10px] px-2 py-0.5 rounded bg-[#191f2f] text-[#4cd7f6] font-semibold border border-[#232a3a]">
                {{ feat.status }}
              </span>
            </div>
            <p class="text-xs text-[#c7c4d7]">{{ feat.description || 'No summary specified.' }}</p>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Project Metadata & Overview -->
      <div class="space-y-6">
        <div class="p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-4 shadow-xl">
          <h3 class="text-sm font-bold text-white border-b border-[#232a3a] pb-3">Project Telemetry</h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between">
              <span class="text-[#908fa0]">Progress Score:</span>
              <span class="text-[#4edea3] font-mono font-bold">{{ project.progress?.progress ?? 0 }}%</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#908fa0]">Total Tasks:</span>
              <span class="text-white font-bold">{{ project.progress?.totalTasks ?? 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#908fa0]">Completed Tasks:</span>
              <span class="text-[#4edea3] font-bold">{{ project.progress?.completedTasks ?? 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#908fa0]">Priority Level:</span>
              <span class="text-[#4cd7f6] font-bold">{{ project.priority }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Feature Modal -->
    <div v-if="isCreateFeatureModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="w-full max-w-md bg-[#141b2b] border border-[#232a3a] rounded-2xl p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-bold text-white">Add New Feature</h3>
        <form @submit.prevent="handleCreateFeature" class="space-y-3">
          <input
            v-model="newFeature.name"
            required
            type="text"
            placeholder="Feature Name (e.g. Authentication Module)"
            class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a]"
          />
          <textarea
            v-model="newFeature.description"
            rows="3"
            placeholder="Feature details & scope..."
            class="w-full p-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a]"
          ></textarea>
          <div class="flex justify-end gap-3 pt-3 border-t border-[#232a3a]">
            <button type="button" @click="isCreateFeatureModalOpen = false" class="text-xs text-[#c7c4d7]">Cancel</button>
            <button type="submit" class="px-4 py-1.5 bg-[#8083ff] text-white rounded-lg text-xs font-semibold">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ProjectDto } from '~/model_dto/project.dto';
import type { FeatureDto } from '~/model_dto/feature.dto';
import { useProjectService } from '~/composables/useProjectService';
import { useFeatureService } from '~/composables/useFeatureService';

const route = useRoute();
const router = useRouter();
const projectService = useProjectService();
const featureService = useFeatureService();

const project = ref<ProjectDto | null>(null);
const features = ref<FeatureDto[]>([]);
const loading = ref(true);
const isCreateFeatureModalOpen = ref(false);

const newFeature = ref({ name: '', description: '' });

const loadProjectDetails = async () => {
  const id = route.params.id as string;
  try {
    loading.value = true;
    project.value = await projectService.getProjectById(id);
    const featRes = await featureService.getFeaturesByProject(id);
    features.value = featRes.data;
  } catch (err) {
    console.error('Error loading project:', err);
  } finally {
    loading.value = false;
  }
};

const handleCreateFeature = async () => {
  if (!newFeature.value.name.trim() || !project.value) return;
  try {
    await featureService.createFeature(project.value.id, {
      name: newFeature.value.name,
      description: newFeature.value.description,
    });
    isCreateFeatureModalOpen.value = false;
    newFeature.value = { name: '', description: '' };
    loadProjectDetails();
  } catch (err) {
    alert('Failed to create feature');
  }
};

const handleDeleteProject = async () => {
  if (!project.value || !confirm(`Delete project "${project.value.name}"?`)) return;
  try {
    await projectService.deleteProject(project.value.id);
    router.push('/projects');
  } catch (err) {
    alert('Failed to delete project');
  }
};

onMounted(() => {
  loadProjectDetails();
});

const getStatusClass = (status: string) => {
  return status === 'COMPLETED' ? 'bg-[#4edea3]/20 text-[#4edea3]' : 'bg-[#8083ff]/20 text-[#c0c1ff]';
};
</script>
