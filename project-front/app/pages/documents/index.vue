<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232a3a] pb-5">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
          <span class="material-symbols-outlined text-[16px] text-[#8083ff]">description</span>
          <span>Knowledge & Architecture Vault</span>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Technical Documents</h1>
        <p class="text-xs text-[#908fa0] mt-0.5">Centralized architecture docs, system specifications, PRDs, and project notes.</p>
      </div>

      <!-- Action Button -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="openCreateModal"
          class="flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-white font-semibold text-xs hover:opacity-95 shadow-[0_0_15px_rgba(128,131,255,0.3)] transition-all active:scale-95"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          <span>New Document</span>
        </button>
      </div>
    </div>

    <!-- Telemetry & Metrics Ribbon -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div class="p-3.5 sm:p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex items-center gap-3 shadow-lg">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8083ff]/15 text-[#c0c1ff] border border-[#8083ff]/30 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[18px] sm:text-[20px]">library_books</span>
        </div>
        <div class="min-w-0">
          <div class="text-[10px] sm:text-[11px] text-[#908fa0] font-medium truncate">Total Documents</div>
          <div class="text-base sm:text-lg font-bold text-white font-mono">{{ documents.length }}</div>
        </div>
      </div>

      <div class="p-3.5 sm:p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex items-center gap-3 shadow-lg">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#4cd7f6]/15 text-[#4cd7f6] border border-[#4cd7f6]/30 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[18px] sm:text-[20px]">folder</span>
        </div>
        <div class="min-w-0">
          <div class="text-[10px] sm:text-[11px] text-[#908fa0] font-medium truncate">Active Projects</div>
          <div class="text-base sm:text-lg font-bold text-white font-mono">{{ projects.length }}</div>
        </div>
      </div>

      <div class="p-3.5 sm:p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex items-center gap-3 shadow-lg">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[18px] sm:text-[20px]">article</span>
        </div>
        <div class="min-w-0">
          <div class="text-[10px] sm:text-[11px] text-[#908fa0] font-medium truncate">With Content</div>
          <div class="text-base sm:text-lg font-bold text-white font-mono">{{ docsWithContentCount }}</div>
        </div>
      </div>

      <div class="p-3.5 sm:p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex items-center gap-3 shadow-lg">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-[18px] sm:text-[20px]">search_check</span>
        </div>
        <div class="min-w-0">
          <div class="text-[10px] sm:text-[11px] text-[#908fa0] font-medium truncate">Filtered Results</div>
          <div class="text-base sm:text-lg font-bold text-white font-mono">{{ filteredDocuments.length }}</div>
        </div>
      </div>
    </div>

    <!-- Filters & Search Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] shadow-lg">
      <div class="flex flex-1 flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
        <!-- Project Selector Filter -->
        <div class="relative w-full sm:w-56 shrink-0">
          <select
            v-model="selectedProjectId"
            class="w-full h-9 pl-3 pr-8 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff] transition-all truncate"
            @change="handleProjectChange"
          >
            <option value="">All Projects ({{ projects.length }})</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>

        <!-- Real-time Search Box -->
        <div class="relative w-full sm:flex-1">
          <span class="material-symbols-outlined absolute left-3 top-2 text-[#908fa0] text-[18px]">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search documents by title, summary, or content..."
            class="w-full h-9 pl-9 pr-8 bg-[#070e1d] text-white placeholder-[#908fa0] text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff] transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-2 text-[#908fa0] hover:text-white"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      <!-- View Switcher -->
      <div class="flex items-center gap-1.5 p-1 rounded-xl bg-[#070e1d] border border-[#232a3a] shrink-0 self-end sm:self-auto">
        <button
          type="button"
          @click="viewMode = 'grid'"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :class="viewMode === 'grid' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#908fa0] hover:text-white'"
        >
          <span class="material-symbols-outlined text-[16px]">grid_view</span>
          <span class="hidden sm:inline">Grid</span>
        </button>
        <button
          type="button"
          @click="viewMode = 'list'"
          class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          :class="viewMode === 'list' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#908fa0] hover:text-white'"
        >
          <span class="material-symbols-outlined text-[16px]">view_list</span>
          <span class="hidden sm:inline">List</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-16 text-center space-y-3">
      <div class="w-10 h-10 border-2 border-[#8083ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-[#908fa0]">Loading document catalog from V2 Core API...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!filteredDocuments.length"
      class="p-16 text-center rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-4 shadow-xl"
    >
      <div class="w-16 h-16 rounded-2xl bg-[#191f2f] text-[#908fa0] border border-[#232a3a] flex items-center justify-center mx-auto">
        <span class="material-symbols-outlined text-3xl">note_stack</span>
      </div>
      <div class="space-y-1">
        <h3 class="text-base font-bold text-white">No documents found</h3>
        <p class="text-xs text-[#908fa0] max-w-sm mx-auto">
          {{ searchQuery ? 'No documents match your search term. Try another query.' : 'There are no documentation records yet. Create your first document to start cataloging architecture specs!' }}
        </p>
      </div>
      <button
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-[#8083ff] text-white text-xs font-semibold hover:bg-[#c0c1ff] hover:text-[#0d0096] transition-all"
      >
        <span class="material-symbols-outlined text-[16px]">add</span>
        <span>Create First Document</span>
      </button>
    </div>

    <!-- Grid View Mode -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="doc in filteredDocuments"
        :key="doc.id"
        class="p-6 rounded-2xl bg-[#141b2b] border border-[#232a3a] hover:border-[#8083ff]/60 transition-all flex flex-col justify-between shadow-xl group space-y-4"
      >
        <div class="space-y-3">
          <!-- Top Tag & Project Badge -->
          <div class="flex items-center justify-between gap-2">
            <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191f2f] text-[#c0c1ff] border border-[#232a3a] text-[10px] font-semibold truncate max-w-[200px]">
              <span class="material-symbols-outlined text-[13px] text-[#8083ff]">folder</span>
              <span class="truncate">{{ getProjectName(doc.projectId) }}</span>
            </span>

            <span
              v-if="doc.content"
              class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-[12px]">markdown</span>
              <span>Markdown</span>
            </span>
          </div>

          <!-- Document Title & Description -->
          <div class="cursor-pointer" @click="openReaderModal(doc)">
            <h3 class="text-base font-bold text-white group-hover:text-[#c0c1ff] transition-colors line-clamp-1">
              {{ doc.name }}
            </h3>
            <p class="text-xs text-[#c7c4d7] line-clamp-2 mt-1.5 min-h-[36px]">
              {{ doc.description || 'No summary provided for this document.' }}
            </p>
          </div>
        </div>

        <!-- Footer Meta & Actions -->
        <div class="pt-3 border-t border-[#232a3a] space-y-3">
          <div class="flex items-center justify-between text-[11px] text-[#908fa0]">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">schedule</span>
              <span>{{ formatDate(doc.updatedAt || doc.createdAt) }}</span>
            </span>
            <span v-if="doc.content" class="text-[10px] font-mono text-[#4cd7f6]">
              ~{{ getWordCount(doc.content) }} words
            </span>
          </div>

          <div class="flex items-center justify-between gap-2 pt-1">
            <button
              type="button"
              @click="openReaderModal(doc)"
              class="flex-1 flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg bg-[#191f2f] hover:bg-[#8083ff]/20 text-[#c0c1ff] hover:text-white border border-[#232a3a] text-xs font-semibold transition-all"
            >
              <span class="material-symbols-outlined text-[15px]">menu_book</span>
              <span>Read Spec</span>
            </button>

            <button
              type="button"
              @click="openEditModal(doc)"
              class="w-8 h-8 rounded-lg bg-[#191f2f] hover:bg-[#2e3545] text-[#c7c4d7] hover:text-white border border-[#232a3a] flex items-center justify-center transition-colors"
              title="Edit document"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>

            <button
              type="button"
              @click="handleDeleteDocument(doc)"
              class="w-8 h-8 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-red-200 border border-red-900/30 flex items-center justify-center transition-colors"
              title="Delete document"
            >
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- List / Table View Mode -->
    <div v-else class="rounded-2xl bg-[#141b2b] border border-[#232a3a] overflow-hidden shadow-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-[#c7c4d7]">
          <thead class="bg-[#070e1d] text-[10px] font-bold uppercase tracking-wider text-[#908fa0] border-b border-[#232a3a]">
            <tr>
              <th class="px-5 py-3.5">Document Title</th>
              <th class="px-5 py-3.5">Project</th>
              <th class="px-5 py-3.5">Description Summary</th>
              <th class="px-5 py-3.5">Body</th>
              <th class="px-5 py-3.5">Last Updated</th>
              <th class="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#232a3a]">
            <tr
              v-for="doc in filteredDocuments"
              :key="doc.id"
              class="hover:bg-[#191f2f]/60 transition-colors"
            >
              <td class="px-5 py-4 font-bold text-white cursor-pointer hover:text-[#c0c1ff]" @click="openReaderModal(doc)">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px] text-[#8083ff]">description</span>
                  <span>{{ doc.name }}</span>
                </div>
              </td>
              <td class="px-5 py-4">
                <span class="px-2 py-0.5 rounded bg-[#191f2f] text-[#c0c1ff] border border-[#232a3a] font-medium text-[11px]">
                  {{ getProjectName(doc.projectId) }}
                </span>
              </td>
              <td class="px-5 py-4 text-[#908fa0] max-w-xs truncate">
                {{ doc.description || '—' }}
              </td>
              <td class="px-5 py-4">
                <span v-if="doc.content" class="px-2 py-0.5 rounded text-[10px] font-mono bg-[#4edea3]/15 text-[#4edea3]">
                  {{ getWordCount(doc.content) }} words
                </span>
                <span v-else class="text-[#908fa0] text-[10px]">None</span>
              </td>
              <td class="px-5 py-4 text-[#908fa0] whitespace-nowrap">
                {{ formatDate(doc.updatedAt || doc.createdAt) }}
              </td>
              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    @click="openReaderModal(doc)"
                    class="p-1.5 rounded-lg text-[#c0c1ff] hover:bg-[#8083ff]/20 transition-colors"
                    title="View / Read"
                  >
                    <span class="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                  <button
                    @click="openEditModal(doc)"
                    class="p-1.5 rounded-lg text-[#c7c4d7] hover:text-white hover:bg-[#2e3545] transition-colors"
                    title="Edit"
                  >
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    @click="handleDeleteDocument(doc)"
                    class="p-1.5 rounded-lg text-red-400 hover:text-red-200 hover:bg-red-950/40 transition-colors"
                    title="Delete"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Document Modal -->
    <div
      v-if="isFormModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div class="w-full max-w-2xl bg-[#141b2b] border border-[#232a3a] rounded-2xl p-6 shadow-2xl space-y-5 my-8">
        <div class="flex items-center justify-between border-b border-[#232a3a] pb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#8083ff]/20 text-[#c0c1ff] border border-[#8083ff]/30 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">
                {{ editingDocumentId ? 'edit_note' : 'post_add' }}
              </span>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">
                {{ editingDocumentId ? 'Edit Document' : 'Create New Document' }}
              </h3>
              <p class="text-[11px] text-[#908fa0]">Fill in technical specs and document content below.</p>
            </div>
          </div>
          <button
            @click="isFormModalOpen = false"
            class="text-[#908fa0] hover:text-white transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="handleSubmitForm" class="space-y-4">
          <!-- Parent Project Selector -->
          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1.5">
              Parent Project <span class="text-red-400">*</span>
            </label>
            <select
              v-model="formPayload.projectId"
              required
              :disabled="!!editingDocumentId"
              class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff] disabled:opacity-60"
            >
              <option value="" disabled>Select a project...</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>

          <!-- Document Title -->
          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1.5">
              Document Title <span class="text-red-400">*</span>
            </label>
            <input
              v-model="formPayload.name"
              required
              type="text"
              placeholder="e.g. System Architecture & High-Level Design"
              class="w-full h-10 px-3 bg-[#070e1d] text-white placeholder-[#908fa0] text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            />
          </div>

          <!-- Short Description -->
          <div>
            <label class="block text-xs font-semibold text-[#c7c4d7] mb-1.5">
              Brief Summary / Abstract
            </label>
            <input
              v-model="formPayload.description"
              type="text"
              placeholder="e.g. Technical overview of microservices, database schemas, and networking"
              class="w-full h-10 px-3 bg-[#070e1d] text-white placeholder-[#908fa0] text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            />
          </div>

          <!-- Document Content Area (with Markdown Toolbar and Preview Toggle) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-[#c7c4d7]">
                Document Content (Markdown Supported)
              </label>

              <!-- Editor / Preview Mode Tabs -->
              <div class="flex items-center gap-1 p-0.5 rounded-lg bg-[#070e1d] border border-[#232a3a]">
                <button
                  type="button"
                  @click="contentMode = 'edit'"
                  class="px-2.5 py-1 rounded text-[11px] font-medium transition-all"
                  :class="contentMode === 'edit' ? 'bg-[#8083ff] text-white' : 'text-[#908fa0] hover:text-white'"
                >
                  Editor
                </button>
                <button
                  type="button"
                  @click="contentMode = 'preview'"
                  class="px-2.5 py-1 rounded text-[11px] font-medium transition-all"
                  :class="contentMode === 'preview' ? 'bg-[#8083ff] text-white' : 'text-[#908fa0] hover:text-white'"
                >
                  Preview
                </button>
              </div>
            </div>

            <!-- Markdown Quick Toolbar (Only shown in Editor mode) -->
            <div
              v-if="contentMode === 'edit'"
              class="flex flex-wrap items-center gap-1 p-1.5 bg-[#070e1d] rounded-t-xl border border-b-0 border-[#232a3a]"
            >
              <button
                type="button"
                @click="insertMarkdown('# ')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs font-mono text-[#c7c4d7] hover:text-white transition-colors"
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                @click="insertMarkdown('## ')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs font-mono text-[#c7c4d7] hover:text-white transition-colors"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                @click="insertMarkdown('**', '**')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs font-bold text-[#c7c4d7] hover:text-white transition-colors"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                @click="insertMarkdown('*', '*')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs italic text-[#c7c4d7] hover:text-white transition-colors"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                @click="insertMarkdown('```\n', '\n```')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs font-mono text-[#4cd7f6] hover:text-white transition-colors"
                title="Code block"
              >
                &lt;/&gt;
              </button>
              <button
                type="button"
                @click="insertMarkdown('- ')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs text-[#c7c4d7] hover:text-white transition-colors"
                title="List item"
              >
                • List
              </button>
              <button
                type="button"
                @click="insertMarkdown('> ')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs text-[#c7c4d7] hover:text-white transition-colors"
                title="Quote"
              >
                Quote
              </button>
              <button
                type="button"
                @click="insertMarkdown('[Link Title](', ')')"
                class="px-2 py-1 rounded bg-[#191f2f] hover:bg-[#2e3545] text-xs text-[#c7c4d7] hover:text-white transition-colors"
                title="Hyperlink"
              >
                Link
              </button>
            </div>

            <!-- Content Textarea -->
            <textarea
              v-if="contentMode === 'edit'"
              ref="contentEditorRef"
              v-model="formPayload.content"
              rows="10"
              placeholder="Write specifications, architecture diagrams, or technical documentation here..."
              class="w-full p-3.5 bg-[#070e1d] text-white font-mono text-xs rounded-b-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff] transition-all resize-y"
            ></textarea>

            <!-- Live Markdown Preview -->
            <div
              v-else
              class="w-full p-4 min-h-[240px] max-h-[360px] overflow-y-auto bg-[#070e1d] rounded-xl border border-[#232a3a] text-xs space-y-2 text-[#dce2f7]"
            >
              <div v-if="!formPayload.content?.trim()" class="text-[#908fa0] italic text-center py-8">
                No content entered yet. Switch to Editor to write.
              </div>
              <div v-else class="prose prose-invert prose-xs max-w-none whitespace-pre-wrap font-sans">
                {{ formPayload.content }}
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-[#908fa0] px-1">
              <span>Supports full markdown notation</span>
              <span class="font-mono">~{{ getWordCount(formPayload.content || '') }} words / {{ (formPayload.content || '').length }} chars</span>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#232a3a]">
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="px-4 py-2 text-xs font-medium text-[#c7c4d7] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-white text-xs font-semibold hover:opacity-95 transition-all disabled:opacity-50"
            >
              <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ isSubmitting ? 'Saving...' : editingDocumentId ? 'Update Document' : 'Create Document' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reader / Detail Slide-Over Modal -->
    <div
      v-if="activeReadingDoc"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div class="w-full max-w-3xl bg-[#141b2b] border border-[#232a3a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Reader Header -->
        <div class="p-6 border-b border-[#232a3a] flex items-start justify-between gap-4 bg-[#070e1d]/80">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-lg bg-[#8083ff]/15 text-[#c0c1ff] border border-[#8083ff]/30 text-[10px] font-semibold flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">folder</span>
                <span>{{ getProjectName(activeReadingDoc.projectId) }}</span>
              </span>
              <span class="text-[11px] text-[#908fa0]">
                Updated {{ formatDate(activeReadingDoc.updatedAt || activeReadingDoc.createdAt) }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">
              {{ activeReadingDoc.name }}
            </h2>
            <p v-if="activeReadingDoc.description" class="text-xs text-[#c7c4d7]">
              {{ activeReadingDoc.description }}
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              @click="copyContentToClipboard(activeReadingDoc.content || '')"
              class="flex items-center gap-1 h-8 px-3 rounded-lg bg-[#191f2f] hover:bg-[#2e3545] text-[#c0c1ff] border border-[#232a3a] text-xs font-medium transition-colors"
              title="Copy markdown content"
            >
              <span class="material-symbols-outlined text-[15px]">
                {{ hasCopied ? 'check' : 'content_copy' }}
              </span>
              <span>{{ hasCopied ? 'Copied!' : 'Copy' }}</span>
            </button>

            <button
              type="button"
              @click="switchToEditFromReader(activeReadingDoc)"
              class="flex items-center gap-1 h-8 px-3 rounded-lg bg-[#8083ff]/20 hover:bg-[#8083ff]/40 text-[#c0c1ff] border border-[#8083ff]/40 text-xs font-medium transition-colors"
            >
              <span class="material-symbols-outlined text-[15px]">edit</span>
              <span>Edit</span>
            </button>

            <button
              type="button"
              @click="activeReadingDoc = null"
              class="w-8 h-8 rounded-lg bg-[#191f2f] hover:bg-[#2e3545] text-[#908fa0] hover:text-white flex items-center justify-center transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- Reader Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-4">
          <div v-if="activeReadingDoc.content" class="p-5 rounded-xl bg-[#070e1d] border border-[#232a3a]">
            <pre class="font-sans whitespace-pre-wrap text-xs text-[#dce2f7] leading-relaxed select-text">{{ activeReadingDoc.content }}</pre>
          </div>

          <div v-else class="p-12 text-center text-xs text-[#908fa0] space-y-2">
            <span class="material-symbols-outlined text-3xl">notes</span>
            <p>This document currently has no markdown or text body.</p>
            <button
              @click="switchToEditFromReader(activeReadingDoc)"
              class="text-[#8083ff] hover:underline font-semibold"
            >
              Add specifications now
            </button>
          </div>
        </div>

        <!-- Reader Footer -->
        <div class="p-4 px-6 border-t border-[#232a3a] bg-[#070e1d]/50 flex items-center justify-between text-[11px] text-[#908fa0]">
          <span class="font-mono text-[10px] text-[#908fa0]">ID: {{ activeReadingDoc.id }}</span>
          <span v-if="activeReadingDoc.content" class="font-mono text-[#4edea3]">
            ~{{ getWordCount(activeReadingDoc.content) }} words
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { DocumentDto } from '~/model_dto/document.dto';
import type { ProjectDto } from '~/model_dto/project.dto';
import { useProjectService } from '~/composables/useProjectService';
import { useDocumentService } from '~/composables/useDocumentService';

useSeoMeta({
  title: 'Technical Documents & Specs - PPM',
  description: 'Project documentation, system architecture, and PRDs catalog.',
});

const projectService = useProjectService();
const documentService = useDocumentService();

const projects = ref<ProjectDto[]>([]);
const documents = ref<DocumentDto[]>([]);
const selectedProjectId = ref<string>('');
const searchQuery = ref<string>('');
const viewMode = ref<'grid' | 'list'>('grid');
const loading = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

// Modal states
const isFormModalOpen = ref<boolean>(false);
const editingDocumentId = ref<string | null>(null);
const contentMode = ref<'edit' | 'preview'>('edit');
const activeReadingDoc = ref<DocumentDto | null>(null);
const hasCopied = ref<boolean>(false);
const contentEditorRef = ref<HTMLTextAreaElement | null>(null);

const formPayload = ref({
  projectId: '',
  name: '',
  description: '',
  content: '',
});

// Computed properties
const docsWithContentCount = computed(() => {
  return documents.value.filter((d) => d.content && d.content.trim().length > 0).length;
});

const filteredDocuments = computed(() => {
  return documents.value.filter((doc) => {
    // Project filter
    if (selectedProjectId.value && doc.projectId !== selectedProjectId.value) {
      return false;
    }
    // Search query filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchName = doc.name.toLowerCase().includes(q);
      const matchDesc = doc.description?.toLowerCase().includes(q) ?? false;
      const matchContent = doc.content?.toLowerCase().includes(q) ?? false;
      return matchName || matchDesc || matchContent;
    }
    return true;
  });
});

// Helpers
const getProjectName = (projectId: string) => {
  const p = projects.value.find((item) => item.id === projectId);
  return p ? p.name : 'Unknown Project';
};

const getWordCount = (text: string) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Data Loaders
const loadProjects = async () => {
  try {
    const res = await projectService.getProjects({ limit: 100 });
    projects.value = res.data;
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
};

const loadAllDocuments = async () => {
  loading.value = true;
  try {
    if (selectedProjectId.value) {
      const res = await documentService.getDocumentsByProject(selectedProjectId.value, { limit: 100 });
      documents.value = res.data;
    } else {
      // Aggregate across all projects
      if (!projects.value.length) {
        await loadProjects();
      }
      const docPromises = projects.value.map((p) =>
        documentService.getDocumentsByProject(p.id, { limit: 50 }).catch(() => ({ data: [] }))
      );
      const results = await Promise.all(docPromises);
      documents.value = results.flatMap((r) => r.data);
    }
  } catch (err) {
    console.error('Failed to load documents:', err);
  } finally {
    loading.value = false;
  }
};

const handleProjectChange = () => {
  loadAllDocuments();
};

// Form Actions
const openCreateModal = () => {
  editingDocumentId.value = null;
  formPayload.value = {
    projectId: selectedProjectId.value || (projects.value[0]?.id ?? ''),
    name: '',
    description: '',
    content: '',
  };
  contentMode.value = 'edit';
  isFormModalOpen.value = true;
};

const openEditModal = (doc: DocumentDto) => {
  editingDocumentId.value = doc.id;
  formPayload.value = {
    projectId: doc.projectId,
    name: doc.name,
    description: doc.description || '',
    content: doc.content || '',
  };
  contentMode.value = 'edit';
  isFormModalOpen.value = true;
};

const handleSubmitForm = async () => {
  if (!formPayload.value.name.trim() || !formPayload.value.projectId) return;

  isSubmitting.value = true;
  try {
    if (editingDocumentId.value) {
      await documentService.updateDocument(editingDocumentId.value, {
        name: formPayload.value.name,
        description: formPayload.value.description,
        content: formPayload.value.content,
      });
    } else {
      await documentService.createDocument(formPayload.value.projectId, {
        name: formPayload.value.name,
        description: formPayload.value.description,
        content: formPayload.value.content,
      });
    }

    isFormModalOpen.value = false;
    await loadAllDocuments();
  } catch (err) {
    alert('Failed to save document. Please check console.');
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteDocument = async (doc: DocumentDto) => {
  if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) return;

  try {
    await documentService.deleteDocument(doc.id);
    documents.value = documents.value.filter((d) => d.id !== doc.id);
  } catch (err) {
    alert('Failed to delete document.');
    console.error(err);
  }
};

// Reader Actions
const openReaderModal = (doc: DocumentDto) => {
  activeReadingDoc.value = doc;
  hasCopied.value = false;
};

const switchToEditFromReader = (doc: DocumentDto) => {
  activeReadingDoc.value = null;
  openEditModal(doc);
};

const copyContentToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    hasCopied.value = true;
    setTimeout(() => {
      hasCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Clipboard copy failed', err);
  }
};

// Markdown Helper
const insertMarkdown = (prefix: string, suffix: string = '') => {
  const textarea = contentEditorRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const original = formPayload.value.content || '';
  const selected = original.substring(start, end);

  const replacement = prefix + selected + suffix;
  formPayload.value.content =
    original.substring(0, start) + replacement + original.substring(end);

  // Restore cursor
  nextTick(() => {
    textarea.focus();
    textarea.setSelectionRange(
      start + prefix.length,
      start + prefix.length + selected.length
    );
  });
};

onMounted(async () => {
  await loadProjects();
  await loadAllDocuments();
});
</script>
