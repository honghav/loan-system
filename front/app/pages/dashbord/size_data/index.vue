<template>
  <div class="w-full space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2.5"
        >
          <span class="i-lucide-hard-drive w-7 h-7 text-primary-500" />
          Database & Storage Analytics
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Monitor real-time database table sizes, row counts, data vs index
          metrics, and storage files.
        </p>
      </div>

      <div class="flex items-center gap-3 text-black">
        <span
          v-if="lastRefreshedAt"
          class="text-xs text-neutral-400 font-mono hidden sm:inline-block"
        >
          Updated: {{ lastRefreshedAt }}
        </span>

        <button
          @click="fetchData"
          :disabled="isSizeDataLoading"
          class="px-4 py-2 text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          <span
            :class="[
              'i-lucide-refresh-cw w-4 h-4',
              isSizeDataLoading ? 'animate-spin' : '',
            ]"
          />
          Refresh Metrics
        </button>
      </div>
    </div>

    <!-- KPI Summary Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Combined Storage -->
      <div
        class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
      >
        <div class="flex items-center justify-between">
          <span
            class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Total Combined Size
          </span>
          <div
            class="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400"
          >
            <span class="i-lucide-pie-chart w-5 h-5" />
          </div>
        </div>
        <div>
          <p
            class="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white"
          >
            {{ sizeDataState?.summary.formattedCombinedSize || "0 B" }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono">
            DB + Storage Files
          </p>
        </div>
      </div>

      <!-- Database Total Size -->
      <div
        class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
      >
        <div class="flex items-center justify-between">
          <span
            class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            PostgreSQL Database
          </span>
          <div
            class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
          >
            <span class="i-lucide-database w-5 h-5" />
          </div>
        </div>
        <div>
          <p
            class="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white"
          >
            {{ sizeDataState?.database.formattedTotalSize || "0 B" }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono">
            {{ sizeDataState?.database.tables.length || 0 }} Active Tables
          </p>
        </div>
      </div>

      <!-- Storage Folder Size -->
      <div
        class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
      >
        <div class="flex items-center justify-between">
          <span
            class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Storage Folder Files
          </span>
          <div
            class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
          >
            <span class="i-lucide-folder-archive w-5 h-5" />
          </div>
        </div>
        <div>
          <p
            class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400"
          >
            {{ sizeDataState?.storage.formattedTotalSize || "0 B" }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono">
            {{ sizeDataState?.storage.totalFiles || 0 }} Stored Files
          </p>
        </div>
      </div>

      <!-- Image Attachments -->
      <div
        class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3"
      >
        <div class="flex items-center justify-between">
          <span
            class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
          >
            Image Records
          </span>
          <div
            class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
          >
            <span class="i-lucide-image w-5 h-5" />
          </div>
        </div>
        <div>
          <p
            class="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white"
          >
            {{
              (sizeDataState?.summary.customerImagesCount || 0) +
              (sizeDataState?.summary.userImagesCount || 0)
            }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono">
            Customers: {{ sizeDataState?.summary.customerImagesCount || 0 }} |
            Users: {{ sizeDataState?.summary.userImagesCount || 0 }}
          </p>
        </div>
      </div>
    </div>

    <!-- DATABASE TABLES FULL EXPLORER SECTION -->
    <div
      class="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5"
    >
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4"
      >
        <div>
          <h3
            class="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2"
          >
            <span class="i-lucide-table-properties w-5 h-5 text-blue-500" />
            Database Tables Explorer
          </h3>
          <p class="text-xs text-neutral-400 mt-0.5">
            Full list of all database tables with total relation size, row
            count, data size, and index size.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Search input for tables -->
          <div class="relative w-full sm:w-64">
            <UInput
              v-model="dbTableSearchQuery"
              icon="i-lucide-search"
              placeholder="Search table name..."
              size="xs"
            />
          </div>

          <!-- View Mode Toggle for Tables -->
          <div
            class="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
          >
            <button
              @click="dbTableViewMode = 'table'"
              :class="[
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1',
                dbTableViewMode === 'table'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400',
              ]"
            >
              <span class="i-lucide-table w-3.5 h-3.5" /> Detailed Table
            </button>
            <button
              @click="dbTableViewMode = 'cards'"
              :class="[
                'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1',
                dbTableViewMode === 'cards'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400',
              ]"
            >
              <span class="i-lucide-layout-grid w-3.5 h-3.5" /> Cards View
            </button>
          </div>
        </div>
      </div>

      <!-- DETAILED TABLE VIEW -->
      <div
        v-if="dbTableViewMode === 'table'"
        class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800"
      >
        <table class="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr
              class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold"
            >
              <th class="p-3.5 text-center w-12">#</th>
              <th class="p-3.5">Table Name</th>
              <th class="p-3.5 text-right">Row Count</th>
              <th class="p-3.5 text-right">Data Size</th>
              <th class="p-3.5 text-right">Index Size</th>
              <th class="p-3.5 text-right">Total Relation Size</th>
              <th class="p-3.5 w-44">DB Share (%)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <tr
              v-for="(table, idx) in filteredDbTables"
              :key="table.tableName"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors"
            >
              <td
                class="p-3.5 text-center font-bold text-neutral-400 dark:text-neutral-600"
              >
                {{ idx + 1 }}
              </td>
              <td class="p-3.5 font-bold text-neutral-900 dark:text-white">
                <div class="flex items-center gap-2">
                  <span class="i-lucide-database w-4 h-4 text-blue-500" />
                  <span>{{ table.tableName }}</span>
                </div>
              </td>
              <td class="p-3.5 text-right font-bold text-neutral-700 dark:text-neutral-300">
                <span
                  class="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  {{ table.rowCount.toLocaleString() }} rows
                </span>
              </td>
              <td class="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                {{ table.formattedDataSize || "-" }}
              </td>
              <td class="p-3.5 text-right text-amber-600 dark:text-amber-400 font-semibold">
                {{ table.formattedIndexSize || "-" }}
              </td>
              <td class="p-3.5 text-right font-extrabold text-blue-600 dark:text-blue-400">
                {{ table.formattedSize }}
              </td>
              <td class="p-3.5">
                <div class="space-y-1">
                  <div
                    class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden"
                  >
                    <div
                      class="bg-blue-500 h-full rounded-full transition-all duration-500"
                      :style="{
                        width: `${getTablePercent(table.totalSizeBytes)}%`,
                      }"
                    />
                  </div>
                  <span class="text-[10px] text-neutral-400 block text-right">
                    {{ getTablePercent(table.totalSizeBytes).toFixed(1) }}%
                  </span>
                </div>
              </td>
            </tr>

            <tr v-if="filteredDbTables.length === 0">
              <td
                colspan="7"
                class="p-8 text-center text-neutral-400 dark:text-neutral-500"
              >
                No database tables found matching search query.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CARDS VIEW -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="table in filteredDbTables"
          :key="table.tableName"
          class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-3"
        >
          <div class="flex items-center justify-between text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="i-lucide-database w-4 h-4 text-blue-500" />
              <span class="font-bold text-neutral-900 dark:text-white">
                {{ table.tableName }}
              </span>
            </div>
            <span
              class="font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
            >
              {{ table.formattedSize }}
            </span>
          </div>

          <div
            class="grid grid-cols-3 gap-2 text-[11px] font-mono p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800"
          >
            <div>
              <span class="text-neutral-400 block text-[10px]">Rows</span>
              <span class="font-bold text-neutral-800 dark:text-neutral-200">
                {{ table.rowCount }}
              </span>
            </div>
            <div>
              <span class="text-neutral-400 block text-[10px]">Data</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">
                {{ table.formattedDataSize || "-" }}
              </span>
            </div>
            <div>
              <span class="text-neutral-400 block text-[10px]">Index</span>
              <span class="font-semibold text-amber-600 dark:text-amber-400">
                {{ table.formattedIndexSize || "-" }}
              </span>
            </div>
          </div>

          <div class="space-y-1">
            <div
              class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden"
            >
              <div
                class="bg-blue-500 h-full rounded-full transition-all duration-500"
                :style="{
                  width: `${getTablePercent(table.totalSizeBytes)}%`,
                }"
              />
            </div>
            <div
              class="flex justify-between text-[10px] font-mono text-neutral-400"
            >
              <span>Share of Database</span>
              <span>{{ getTablePercent(table.totalSizeBytes).toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Storage Subfolders Breakdown & Storage Files Gallery -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Storage Subfolders Breakdown -->
      <div
        class="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="i-lucide-folder-tree w-5 h-5 text-emerald-500" />
            <h3 class="font-bold text-base text-neutral-900 dark:text-white">
              Storage Folders
            </h3>
          </div>
          <span
            class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono"
          >
            {{ sizeDataState?.storage.folders.length || 0 }} Folders
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="folder in sizeDataState?.storage.folders"
            :key="folder.folderName"
            class="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-800/80 space-y-2"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="i-lucide-folder w-4 h-4 text-amber-500" />
                <span
                  class="font-bold text-neutral-800 dark:text-neutral-200 font-mono"
                >
                  /storage/{{ folder.folderName }}
                </span>
              </div>
              <div class="flex items-center gap-3 font-mono">
                <span class="text-neutral-400"
                  >{{ folder.fileCount }} files</span
                >
                <span
                  class="font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300"
                >
                  {{ folder.formattedSize }}
                </span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div
              class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden"
            >
              <div
                class="bg-emerald-500 h-full rounded-full transition-all duration-500"
                :style="{
                  width: `${getFolderPercent(folder.totalSizeBytes)}%`,
                }"
              />
            </div>
          </div>

          <div
            v-if="!sizeDataState?.storage.folders.length"
            class="py-8 text-center text-xs text-neutral-400"
          >
            No storage folders found.
          </div>
        </div>
      </div>

      <!-- STORAGE FILES & IMAGE GALLERY -->
      <div
        class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5"
      >
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4"
        >
          <div>
            <h3
              class="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2"
            >
              <span class="i-lucide-files w-5 h-5 text-primary-500" />
              Storage Image & File Gallery
            </h3>
            <p class="text-xs text-neutral-400 mt-0.5">
              Inspect backend image uploads and assets stored in core storage.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Folder Filter -->
            <select
              v-model="selectedFolder"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 focus:outline-none"
            >
              <option value="ALL">All Folders</option>
              <option
                v-for="f in availableFolders"
                :key="f"
                :value="f"
              >
                /{{ f }}
              </option>
            </select>

            <!-- Extension Filter -->
            <select
              v-model="selectedExtension"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 focus:outline-none"
            >
              <option value="ALL">All Formats</option>
              <option value="IMAGES">Images Only</option>
              <option
                v-for="ext in availableExtensions"
                :key="ext"
                :value="ext"
              >
                .{{ ext.toUpperCase() }}
              </option>
            </select>

            <!-- Search Input -->
            <div class="relative w-full sm:w-44">
              <UInput
                v-model="fileSearchQuery"
                icon="i-lucide-search"
                placeholder="Search files..."
                size="xs"
              />
            </div>

            <!-- View Switcher -->
            <div
              class="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
            >
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400',
                ]"
              >
                <span class="i-lucide-layout-grid w-3.5 h-3.5" /> Grid
              </button>
              <button
                @click="viewMode = 'table'"
                :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1',
                  viewMode === 'table'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                    : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400',
                ]"
              >
                <span class="i-lucide-table w-3.5 h-3.5" /> Table
              </button>
            </div>
          </div>
        </div>

        <!-- GRID VIEW GALLERY -->
        <div
          v-if="viewMode === 'grid'"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div
            v-for="file in filteredFiles"
            :key="file.relativePath"
            class="group rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-200 flex flex-col"
          >
            <!-- Thumbnail -->
            <div
              class="relative h-36 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden cursor-pointer"
              @click="openImagePreview(file)"
            >
              <img
                v-if="isImageFile(file.extension)"
                :src="getImagePath(file.relativePath)"
                :alt="file.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImgError"
              />
              <div
                v-else
                class="flex flex-col items-center justify-center p-4 text-neutral-400"
              >
                <span class="i-lucide-file-text w-9 h-9 opacity-60 mb-1" />
                <span class="text-[10px] uppercase font-bold font-mono">{{
                  file.extension
                }}</span>
              </div>

              <!-- Badges -->
              <div
                class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold"
              >
                {{ file.formattedSize }}
              </div>

              <div
                class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary-500/80 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase"
              >
                {{ file.folder }}
              </div>
            </div>

            <!-- Content -->
            <div class="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div class="space-y-0.5">
                <p
                  class="text-xs font-bold text-neutral-900 dark:text-white truncate font-mono"
                  :title="file.name"
                >
                  {{ file.name }}
                </p>
                <p class="text-[11px] text-neutral-400 font-mono truncate">
                  {{ file.relativePath }}
                </p>
              </div>

              <div
                class="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400 font-mono"
              >
                <span>{{ formatDate(file.modifiedAt) }}</span>
                <button
                  @click.stop="copyToClipboard(getFileUrl(file.relativePath))"
                  title="Copy Image URL"
                  class="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <span class="i-lucide-copy w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="filteredFiles.length === 0"
            class="col-span-full py-12 text-center text-neutral-400 flex flex-col items-center justify-center space-y-2"
          >
            <span class="i-lucide-folder-open w-10 h-10 opacity-30" />
            <p class="text-xs font-semibold text-neutral-500">
              No files found.
            </p>
          </div>
        </div>

        <!-- TABLE VIEW GALLERY -->
        <div v-else class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
          <table class="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr
                class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold"
              >
                <th class="p-3 w-14 text-center">Preview</th>
                <th class="p-3">File Name</th>
                <th class="p-3">Folder</th>
                <th class="p-3 text-right">Size</th>
                <th class="p-3">Format</th>
                <th class="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr
                v-for="file in filteredFiles"
                :key="file.relativePath"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors"
              >
                <td class="p-2 text-center">
                  <div
                    class="w-8 h-8 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center cursor-pointer border border-neutral-200 dark:border-neutral-700"
                    @click="openImagePreview(file)"
                  >
                    <img
                      v-if="isImageFile(file.extension)"
                      :src="getImagePath(file.relativePath)"
                      class="w-full h-full object-cover"
                      @error="handleImgError"
                    />
                    <span
                      v-else
                      class="i-lucide-file-text w-4 h-4 text-neutral-400"
                    />
                  </div>
                </td>
                <td class="p-3 font-bold text-neutral-900 dark:text-white">
                  {{ file.name }}
                </td>
                <td class="p-3">
                  <span
                    class="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold"
                  >
                    {{ file.folder }}
                  </span>
                </td>
                <td class="p-3 text-right font-bold text-neutral-900 dark:text-white">
                  {{ file.formattedSize }}
                </td>
                <td class="p-3 uppercase font-semibold text-neutral-500">
                  .{{ file.extension }}
                </td>
                <td class="p-3 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      @click="openImagePreview(file)"
                      title="Preview"
                      class="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <span class="i-lucide-eye w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="copyToClipboard(getFileUrl(file.relativePath))"
                      title="Copy URL"
                      class="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <span class="i-lucide-copy w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="filteredFiles.length === 0">
                <td colspan="6" class="p-6 text-center text-neutral-400">
                  No files match filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Image Modal Preview -->
    <div
      v-if="selectedPreviewFile"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="selectedPreviewFile = null"
    >
      <div
        class="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6"
      >
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h3 class="font-bold text-lg text-neutral-900 dark:text-white font-mono">
              {{ selectedPreviewFile.name }}
            </h3>
            <p class="text-xs text-neutral-400 font-mono">
              {{ selectedPreviewFile.relativePath }}
            </p>
          </div>
          <button
            @click="selectedPreviewFile = null"
            class="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <span class="i-lucide-x w-5 h-5" />
          </button>
        </div>

        <!-- Preview Image Container -->
        <div
          class="max-h-[60vh] bg-neutral-950 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-neutral-800"
        >
          <img
            v-if="isImageFile(selectedPreviewFile.extension)"
            :src="getImagePath(selectedPreviewFile.relativePath)"
            :alt="selectedPreviewFile.name"
            class="max-h-[50vh] max-w-full object-contain rounded"
          />
          <div v-else class="py-12 flex flex-col items-center text-neutral-400">
            <span class="i-lucide-file-text w-16 h-16 mb-2" />
            <p class="text-sm font-bold uppercase font-mono">
              {{ selectedPreviewFile.extension }} File
            </p>
          </div>
        </div>

        <!-- Details Bar -->
        <div
          class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono p-3 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800"
        >
          <div>
            <span class="text-neutral-400 block">File Size</span>
            <span class="font-bold text-neutral-900 dark:text-white">
              {{ selectedPreviewFile.formattedSize }}
            </span>
          </div>
          <div>
            <span class="text-neutral-400 block">Folder</span>
            <span class="font-bold text-neutral-900 dark:text-white uppercase">
              {{ selectedPreviewFile.folder }}
            </span>
          </div>
          <div>
            <span class="text-neutral-400 block">Format</span>
            <span class="font-bold text-neutral-900 dark:text-white uppercase">
              .{{ selectedPreviewFile.extension }}
            </span>
          </div>
          <div>
            <span class="text-neutral-400 block">Modified</span>
            <span class="font-bold text-neutral-900 dark:text-white">
              {{ formatDate(selectedPreviewFile.modifiedAt) }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            @click="copyToClipboard(getFileUrl(selectedPreviewFile.relativePath))"
            class="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-2"
          >
            <span class="i-lucide-copy w-4 h-4" /> Copy URL
          </button>
          <a
            :href="getFileUrl(selectedPreviewFile.relativePath)"
            target="_blank"
            class="px-4 py-2 text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center gap-2"
          >
            <span class="i-lucide-external-link w-4 h-4" /> Open Original
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import {
  getSizeDataService,
  sizeDataState,
  isSizeDataLoading,
  type StorageFileDTO,
} from "~/model_dto/size_data/get_size_data.dto";

const config = useRuntimeConfig();

const viewMode = ref<"grid" | "table">("grid");
const dbTableViewMode = ref<"table" | "cards">("table");
const dbTableSearchQuery = ref("");
const fileSearchQuery = ref("");
const selectedFolder = ref("ALL");
const selectedExtension = ref("ALL");
const selectedPreviewFile = ref<StorageFileDTO | null>(null);
const lastRefreshedAt = ref<string>("");

async function fetchData() {
  await getSizeDataService();
  lastRefreshedAt.value = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const filteredDbTables = computed(() => {
  let list = sizeDataState.value?.database.tables || [];

  if (dbTableSearchQuery.value.trim()) {
    const q = dbTableSearchQuery.value.toLowerCase().trim();
    list = list.filter((t) => t.tableName.toLowerCase().includes(q));
  }

  return list;
});

const availableFolders = computed(() => {
  if (!sizeDataState.value?.storage.folders) return [];
  return sizeDataState.value.storage.folders.map((f) => f.folderName);
});

const availableExtensions = computed(() => {
  if (!sizeDataState.value?.storage.files) return [];
  const set = new Set<string>();
  sizeDataState.value.storage.files.forEach((f) => {
    if (f.extension) set.add(f.extension.toLowerCase());
  });
  return Array.from(set).sort();
});

const filteredFiles = computed(() => {
  let list = sizeDataState.value?.storage.files || [];

  if (selectedFolder.value !== "ALL") {
    list = list.filter((f) => f.folder === selectedFolder.value);
  }

  if (selectedExtension.value === "IMAGES") {
    list = list.filter((f) => isImageFile(f.extension));
  } else if (selectedExtension.value !== "ALL") {
    list = list.filter(
      (f) => f.extension.toLowerCase() === selectedExtension.value.toLowerCase(),
    );
  }

  if (fileSearchQuery.value.trim()) {
    const q = fileSearchQuery.value.toLowerCase().trim();
    list = list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.relativePath.toLowerCase().includes(q) ||
        f.folder.toLowerCase().includes(q),
    );
  }

  return list;
});

function getFileUrl(relativePath: string): string {
  if (!relativePath) return "";
  if (relativePath.startsWith("http")) return relativePath;
  const baseUrl = (config.public.baseUrl || "http://localhost:3000").replace(
    /\/+$/,
    "",
  );
  const cleanPath = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  return `${baseUrl}${cleanPath}`;
}

function isImageFile(ext: string): boolean {
  if (!ext) return false;
  const imageExts = ["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp", "ico"];
  return imageExts.includes(ext.toLowerCase());
}

function getTablePercent(bytes: number): number {
  const total = sizeDataState.value?.database.totalSizeBytes || 1;
  return Math.min(100, Math.max(2, (bytes / total) * 100));
}

function getFolderPercent(bytes: number): number {
  const total = sizeDataState.value?.storage.totalSizeBytes || 1;
  return Math.min(100, Math.max(2, (bytes / total) * 100));
}

function openImagePreview(file: StorageFileDTO) {
  selectedPreviewFile.value = file;
}

function handleImgError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (img) {
    img.style.display = "none";
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    Swal.fire({
      title: "Copied!",
      text: "Image URL copied to clipboard.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
}

onMounted(async () => {
  await fetchData();
});
</script>