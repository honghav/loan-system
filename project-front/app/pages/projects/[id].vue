<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Breadcrumb & Actions Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232a3a] pb-5">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-xs text-[#908fa0]">
          <NuxtLink to="/projects" class="hover:text-white flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Projects</span>
          </NuxtLink>
          <span>/</span>
          <span class="text-[#c0c1ff] font-medium truncate max-w-[200px] sm:max-w-none">{{ project?.name || 'Loading...' }}</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 flex-wrap">
          <span>{{ project?.name }}</span>
          <span v-if="project" class="text-xs px-2.5 py-0.5 rounded-full font-semibold" :class="getStatusClass(project.status)">
            {{ project.status }}
          </span>
        </h1>
      </div>

      <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
        <NuxtLink
          :to="`/kanban?projectId=${route.params.id}`"
          class="flex items-center gap-2 h-9 px-3.5 sm:px-4 rounded-xl bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/40 hover:bg-[#4cd7f6] hover:text-black font-semibold text-xs transition-all"
        >
          <span class="material-symbols-outlined text-[16px]">view_kanban</span>
          <span>Open Kanban</span>
        </NuxtLink>
        <button
          @click="handleDeleteProject"
          class="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900 hover:text-white text-xs font-medium transition-colors"
          title="Delete project"
        >
          <span class="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-12 text-center text-xs text-[#908fa0]">
      Loading project specifications, features, and documents...
    </div>

    <div v-else-if="project" class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Left 2 Cols: Features & Documents Navigation -->
      <div class="lg:col-span-2 space-y-5 sm:space-y-6">
        <!-- Tab Switcher -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232a3a] pb-3">
          <div class="flex items-center gap-1.5 p-1 bg-[#141b2b] rounded-xl border border-[#232a3a] overflow-x-auto max-w-full">
            <button
              type="button"
              @click="activeTab = 'features'"
              class="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              :class="activeTab === 'features' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#908fa0] hover:text-white'"
            >
              <span class="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Features ({{ features.length }})</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'documents'"
              class="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              :class="activeTab === 'documents' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#908fa0] hover:text-white'"
            >
              <span class="material-symbols-outlined text-[16px]">description</span>
              <span>Docs ({{ documents.length }})</span>
            </button>
          </div>

          <!-- Quick Context Action Button -->
          <button
            v-if="activeTab === 'features'"
            @click="isCreateFeatureModalOpen = true"
            class="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-[#8083ff] text-white text-xs font-semibold hover:bg-[#c0c1ff] hover:text-[#0d0096] transition-all self-start sm:self-auto"
          >
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>Add Feature</span>
          </button>
          <button
            v-else
            @click="isCreateDocModalOpen = true"
            class="flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-white text-xs font-semibold hover:opacity-95 shadow-sm transition-all self-start sm:self-auto"
          >
            <span class="material-symbols-outlined text-[16px]">add</span>
            <span>New Document</span>
          </button>
        </div>

        <!-- FEATURES TAB CONTENT -->
        <div v-if="activeTab === 'features'" class="space-y-4">
          <div v-if="!features.length" class="p-8 sm:p-10 rounded-2xl bg-[#141b2b] border border-[#232a3a] text-center space-y-2">
            <span class="material-symbols-outlined text-3xl text-[#908fa0]">account_tree</span>
            <p class="text-xs text-[#c7c4d7]">No feature breakdown created for this project yet.</p>
          </div>

          <div v-else class="space-y-3 sm:space-y-4">
            <div
              v-for="feat in features"
              :key="feat.id"
              class="p-4 sm:p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-2.5 shadow-lg"
            >
              <div class="flex items-center justify-between gap-2">
                <h3 class="text-sm font-bold text-white flex items-center gap-2 truncate">
                  <span class="w-2 h-2 rounded-full bg-[#4edea3] shrink-0"></span>
                  <span class="truncate">{{ feat.name }}</span>
                </h3>
                <span class="text-[10px] px-2 py-0.5 rounded bg-[#191f2f] text-[#4cd7f6] font-semibold border border-[#232a3a] shrink-0">
                  {{ feat.status }}
                </span>
              </div>
              <p class="text-xs text-[#c7c4d7]">{{ feat.description || 'No summary specified.' }}</p>
            </div>
          </div>
        </div>

        <!-- DOCUMENTS TAB CONTENT -->
        <div v-else-if="activeTab === 'documents'" class="space-y-4">
          <div v-if="!documents.length" class="p-8 sm:p-10 rounded-2xl bg-[#141b2b] border border-[#232a3a] text-center space-y-3">
            <span class="material-symbols-outlined text-4xl text-[#908fa0]">note_stack</span>
            <p class="text-xs text-[#c7c4d7]">No documents or architecture specs created for this project yet.</p>
            <button
              @click="isCreateDocModalOpen = true"
              class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#8083ff] text-white text-xs font-semibold hover:bg-[#c0c1ff] hover:text-[#0d0096] transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
              <span>Create First Document</span>
            </button>
          </div>

          <div v-else class="space-y-3 sm:space-y-4">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="p-4 sm:p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] hover:border-[#8083ff]/50 transition-all space-y-3 shadow-lg"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1 min-w-0">
                  <h3 class="text-sm font-bold text-white flex items-center gap-2 truncate">
                    <span class="material-symbols-outlined text-[18px] text-[#8083ff] shrink-0">description</span>
                    <span class="truncate">{{ doc.name }}</span>
                  </h3>
                  <p class="text-xs text-[#c7c4d7] line-clamp-2">
                    {{ doc.description || 'No summary provided.' }}
                  </p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    @click="activeReadingDoc = doc"
                    class="h-7 px-2.5 rounded-lg bg-[#191f2f] hover:bg-[#8083ff]/20 text-[#c0c1ff] text-xs font-medium border border-[#232a3a] flex items-center gap-1 transition-all"
                  >
                    <span class="material-symbols-outlined text-[14px]">menu_book</span>
                    <span class="hidden xs:inline">Read</span>
                  </button>
                  <button
                    type="button"
                    @click="handleDeleteDocument(doc)"
                    class="w-7 h-7 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 flex items-center justify-center transition-colors"
                  >
                    <span class="material-symbols-outlined text-[15px]">delete</span>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-[#908fa0] pt-2 border-t border-[#232a3a]">
                <span>Updated {{ formatDate(doc.updatedAt || doc.createdAt) }}</span>
                <span v-if="doc.content" class="text-[#4cd7f6] font-mono">
                  ~{{ getWordCount(doc.content) }} words
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Project Metadata & Overview -->
      <div class="space-y-6">
        <div class="p-4 sm:p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-4 shadow-xl">
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
              <span class="text-white font-bold">{{ project.progress?.completedTasks ?? 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#908fa0]">Technical Docs:</span>
              <span class="text-[#c0c1ff] font-bold">{{ documents.length }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#908fa0]">Features Scoped:</span>
              <span class="text-white font-bold">{{ features.length }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-3 shadow-xl">
          <h3 class="text-sm font-bold text-white border-b border-[#232a3a] pb-3">Quick Navigation</h3>
          <div class="flex flex-col gap-2">
            <NuxtLink
              to="/documents"
              class="flex items-center justify-between p-2.5 rounded-xl bg-[#070e1d] hover:bg-[#191f2f] text-xs text-[#c7c4d7] hover:text-white transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#8083ff]">description</span>
                <span>Open Documents Vault</span>
              </span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </NuxtLink>
            <NuxtLink
              to="/kanban"
              class="flex items-center justify-between p-2.5 rounded-xl bg-[#070e1d] hover:bg-[#191f2f] text-xs text-[#c7c4d7] hover:text-white transition-colors"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#4cd7f6]">view_kanban</span>
                <span>Sprint Kanban Board</span>
              </span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Feature Modal -->
    <div v-if="isCreateFeatureModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-md bg-[#141b2b] border border-[#232a3a] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-8">
        <h3 class="text-base font-bold text-white">Add Feature</h3>
        <form @submit.prevent="handleCreateFeature" class="space-y-3">
          <input
            v-model="newFeature.name"
            required
            type="text"
            placeholder="Feature Name (e.g. Authentication Module)"
            class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
          />
          <textarea
            v-model="newFeature.description"
            rows="3"
            placeholder="Feature details & scope..."
            class="w-full p-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
          ></textarea>
          <div class="flex justify-end gap-3 pt-3 border-t border-[#232a3a]">
            <button type="button" @click="isCreateFeatureModalOpen = false" class="text-xs text-[#c7c4d7] px-3 py-1.5">Cancel</button>
            <button type="submit" class="px-4 py-1.5 bg-[#8083ff] text-white rounded-xl text-xs font-semibold">Create</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Document Modal (Direct in Project) -->
    <div v-if="isCreateDocModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-xl bg-[#141b2b] border border-[#232a3a] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-8">
        <div class="flex items-center justify-between border-b border-[#232a3a] pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[#8083ff]">post_add</span>
            <span>New Technical Document</span>
          </h3>
          <button @click="isCreateDocModalOpen = false" class="text-[#908fa0] hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="handleCreateDocument" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1">Document Title *</label>
            <input
              v-model="newDocument.name"
              required
              type="text"
              placeholder="e.g. Architecture Overview & ERD"
              class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1">Summary / Abstract</label>
            <input
              v-model="newDocument.description"
              type="text"
              placeholder="Brief summary of document content..."
              class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1">Content (Markdown Supported)</label>
            <textarea
              v-model="newDocument.content"
              rows="6"
              placeholder="# Heading\n\nWrite details or technical specifications here..."
              class="w-full p-3 bg-[#070e1d] text-white font-mono text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t border-[#232a3a]">
            <button type="button" @click="isCreateDocModalOpen = false" class="text-xs text-[#c7c4d7] px-3 py-1.5">Cancel</button>
            <button
              type="submit"
              :disabled="isSubmittingDoc"
              class="px-5 py-2 bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-white rounded-xl text-xs font-semibold hover:opacity-95 disabled:opacity-50"
            >
              {{ isSubmittingDoc ? 'Creating...' : 'Save Document' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Quick Document Reader Modal -->
    <div v-if="activeReadingDoc" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div class="w-full max-w-2xl bg-[#141b2b] border border-[#232a3a] rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col my-8">
        <div class="flex items-start justify-between border-b border-[#232a3a] pb-3 gap-3">
          <div class="min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-white truncate">{{ activeReadingDoc.name }}</h3>
            <p v-if="activeReadingDoc.description" class="text-xs text-[#908fa0] mt-0.5 line-clamp-2">{{ activeReadingDoc.description }}</p>
          </div>
          <button @click="activeReadingDoc = null" class="text-[#908fa0] hover:text-white shrink-0">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 rounded-xl bg-[#070e1d] border border-[#232a3a]">
          <pre v-if="activeReadingDoc.content" class="font-sans whitespace-pre-wrap text-xs text-[#dce2f7] leading-relaxed select-text">{{ activeReadingDoc.content }}</pre>
          <div v-else class="text-center text-xs text-[#908fa0] py-8">No content body in this document.</div>
        </div>

        <div class="flex justify-end pt-2">
          <button @click="activeReadingDoc = null" class="px-4 py-1.5 rounded-xl bg-[#191f2f] hover:bg-[#232a3a] text-xs text-white">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ProjectDto } from '~/model_dto/project.dto';
import type { FeatureDto } from '~/model_dto/feature.dto';
import type { DocumentDto } from '~/model_dto/document.dto';
import { useProjectService } from '~/composables/useProjectService';
import { useFeatureService } from '~/composables/useFeatureService';
import { useDocumentService } from '~/composables/useDocumentService';

const route = useRoute();
const router = useRouter();
const projectService = useProjectService();
const featureService = useFeatureService();
const documentService = useDocumentService();

const project = ref<ProjectDto | null>(null);
const features = ref<FeatureDto[]>([]);
const documents = ref<DocumentDto[]>([]);
const loading = ref(true);
const activeTab = ref<'features' | 'documents'>('features');

// Feature modal
const isCreateFeatureModalOpen = ref(false);
const newFeature = ref({ name: '', description: '' });

// Document modal & reader
const isCreateDocModalOpen = ref(false);
const isSubmittingDoc = ref(false);
const activeReadingDoc = ref<DocumentDto | null>(null);
const newDocument = ref({ name: '', description: '', content: '' });

const getWordCount = (text: string) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const loadProjectDetails = async () => {
  const id = route.params.id as string;
  try {
    loading.value = true;
    project.value = await projectService.getProjectById(id);
    const featRes = await featureService.getFeaturesByProject(id);
    features.value = featRes.data;

    // Load documents for this project
    const docRes = await documentService.getDocumentsByProject(id);
    documents.value = docRes.data;
  } catch (err) {
    console.error('Error loading project details:', err);
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

const handleCreateDocument = async () => {
  if (!newDocument.value.name.trim() || !project.value) return;
  try {
    isSubmittingDoc.value = true;
    await documentService.createDocument(project.value.id, {
      name: newDocument.value.name,
      description: newDocument.value.description,
      content: newDocument.value.content,
    });
    isCreateDocModalOpen.value = false;
    newDocument.value = { name: '', description: '', content: '' };
    loadProjectDetails();
  } catch (err) {
    alert('Failed to create document');
  } finally {
    isSubmittingDoc.value = false;
  }
};

const handleDeleteDocument = async (doc: DocumentDto) => {
  if (!confirm(`Delete document "${doc.name}"?`)) return;
  try {
    await documentService.deleteDocument(doc.id);
    documents.value = documents.value.filter((d) => d.id !== doc.id);
  } catch (err) {
    alert('Failed to delete document');
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
