<template>
  <div class="w-full space-y-6 pb-12">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2.5">
            <span class="i-lucide-cloud text-amber-500 w-7 h-7" />
            Cloudflare R2 Storage Dashboard
          </h1>
          <span
            v-if="metricsState"
            :class="[
              'px-2.5 py-0.5 text-xs font-bold font-mono rounded-full border',
              metricsState.cfStorageStatus === 'ok'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
                : metricsState.cfStorageStatus === 'partial'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800'
                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800'
            ]"
          >
            STATUS: {{ metricsState.cfStorageStatus.toUpperCase() }}
          </span>
        </div>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Real-time metrics, folder storage distributions, file counts, and Cloudflare operations.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <span v-if="lastRefreshedAt" class="text-xs text-neutral-400 font-mono hidden sm:inline-block">
          Updated: {{ lastRefreshedAt }}
        </span>

        <!-- <button
          @click="fetchMetrics"
          :disabled="isLoading"
          class="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          <span :class="['i-lucide-refresh-cw w-4 h-4', isLoading ? 'animate-spin' : '']" />
          Refresh Storage Data
        </button> -->
      </div>
    </div>

    <!-- Warning Alert if operational API token missing -->
    <div
      v-if="metricsState?.cfStorageWarning"
      class="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-amber-800 dark:text-amber-300 text-xs"
    >
      <span class="i-lucide-alert-triangle w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <span class="font-bold">Configuration Notice: </span>
        {{ metricsState.cfStorageWarning }}
      </div>
    </div>

    <!-- KPI Summary Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Bucket Size -->
      <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Bucket Size
          </span>
          <div class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <span class="i-lucide-pie-chart w-5 h-5" />
          </div>
        </div>
        <div>
          <p class="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white">
            {{ metricsState?.cfStorageBucketSizeFormatted || "0 B" }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono truncate" :title="metricsState?.cfStorageBucketName">
            Bucket: {{ metricsState?.cfStorageBucketName || "N/A" }}
          </p>
        </div>
      </div>

      <!-- Total Folders Count -->
      <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Total Folders
          </span>
          <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <span class="i-lucide-folder-tree w-5 h-5" />
          </div>
        </div>
        <div>
          <p class="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white">
            {{ folderList.length }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono">
            Structured Directories
          </p>
        </div>
      </div>

      <!-- Total Stored Files / Objects -->
      <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Total Objects
          </span>
          <div class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <span class="i-lucide-files w-5 h-5" />
          </div>
        </div>
        <div>
          <p class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            {{ metricsState?.cfStorageObjectCount || 0 }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono">
            Files in Storage
          </p>
        </div>
      </div>

      <!-- Cloudflare Operations -->
      <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            R2 API Operations
          </span>
          <div class="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <span class="i-lucide-activity w-5 h-5" />
          </div>
        </div>
        <div>
          <p class="text-2xl font-extrabold font-mono text-neutral-900 dark:text-white">
            {{ (metricsState?.cfStorageClassAOperations || 0) + (metricsState?.cfStorageClassBOperations || 0) }}
          </p>
          <p class="text-xs text-neutral-400 mt-1 font-mono">
            Class A: {{ metricsState?.cfStorageClassAOperations || 0 }} | Class B: {{ metricsState?.cfStorageClassBOperations || 0 }}
          </p>
        </div>
      </div>
    </div>

    <!-- MAIN CHART SECTION (PIE & BAR CHARTS) -->
    <div class="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h3 class="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
            <span v-if="chartMetricMode === 'size'" class="i-lucide-pie-chart w-5 h-5 text-amber-500" />
            <span v-else class="i-lucide-bar-chart-3 w-5 h-5 text-amber-500" />
            {{ chartMetricMode === 'size' ? 'Bucket Storage Size Pie Chart' : 'Cloudflare R2 Analytics Bar Chart' }}
          </h3>
          <p class="text-xs text-neutral-400 mt-0.5">
            {{ chartMetricMode === 'size' ? 'Pie chart breakdown of storage occupied by each folder.' : 'Visual comparison of file counts and operations.' }}
          </p>
        </div>

        <!-- Metric Switcher Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs">
            <button
              @click="chartMetricMode = 'size'"
              :class="[
                'px-3 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5',
                chartMetricMode === 'size'
                  ? 'bg-amber-500 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              ]"
            >
              <span class="i-lucide-pie-chart w-3.5 h-3.5" />
              Bucket Size (Pie Chart)
            </button>

            <button
              @click="chartMetricMode = 'files'"
              :class="[
                'px-3 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5',
                chartMetricMode === 'files'
                  ? 'bg-amber-500 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              ]"
            >
              <span class="i-lucide-file-stack w-3.5 h-3.5" />
              File Count per Folder
            </button>

            <button
              @click="chartMetricMode = 'ops'"
              :class="[
                'px-3 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5',
                chartMetricMode === 'ops'
                  ? 'bg-amber-500 text-white shadow-sm font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              ]"
            >
              <span class="i-lucide-activity w-3.5 h-3.5" />
              Operations Breakdown
            </button>
          </div>
        </div>
      </div>

      <!-- Chart Rendering Container -->
      <div class="relative h-80 w-full pt-2 flex items-center justify-center">
        <!-- Render Pie Chart for Storage Size -->
        <Pie v-if="chartMetricMode === 'size'" :data="pieChartData" :options="pieChartOptions" />
        <!-- Render Bar Chart for Files & Operations -->
        <Bar v-else :data="activeChartData" :options="activeChartOptions" />
      </div>
    </div>

    <!-- FOLDERS AND FILES EXPLORER -->
    <div class="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-5">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h3 class="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
            <span class="i-lucide-folder-tree w-5 h-5 text-blue-500" />
            Folder & Files Directory
          </h3>
          <p class="text-xs text-neutral-400 mt-0.5">
            Browse files organized by their respective R2 folder paths.
          </p>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search folders or files..."
            class="w-full px-3 py-1.5 text-xs font-mono rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      <!-- Folder Cards List -->
      <div class="space-y-4">
        <div
          v-for="folder in filteredFolders"
          :key="folder.cfStoragePath"
          class="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-850/50 overflow-hidden space-y-3"
        >
          <!-- Folder Header -->
          <div
            @click="toggleFolderExpand(folder.cfStoragePath)"
            class="p-4 bg-neutral-100/80 dark:bg-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-neutral-200/60 dark:hover:bg-neutral-750 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'i-lucide-chevron-right w-4 h-4 text-neutral-400 transition-transform duration-200',
                  expandedFolders.has(folder.cfStoragePath) ? 'rotate-90' : ''
                ]"
              />
              <div class="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <span class="i-lucide-folder w-5 h-5" />
              </div>
              <div>
                <h4 class="font-bold text-sm text-neutral-900 dark:text-white font-mono">
                  /{{ folder.cfStoragePath }}
                </h4>
                <p class="text-xs text-neutral-400 font-mono">
                  Name: {{ folder.cfStorageName }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-xs font-mono">
              <span class="px-2.5 py-1 rounded-lg bg-neutral-200/80 dark:bg-neutral-700/80 text-neutral-700 dark:text-neutral-300">
                {{ folder.cfStorageFileCount }} {{ folder.cfStorageFileCount === 1 ? 'file' : 'files' }}
              </span>
              <span class="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold">
                {{ folder.cfStorageTotalSizeFormatted }}
              </span>
            </div>
          </div>

          <!-- Files Table inside Expanded Folder -->
          <div v-if="expandedFolders.has(folder.cfStoragePath)" class="p-4 pt-1">
            <div v-if="folder.cfStorageFiles && folder.cfStorageFiles.length > 0" class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table class="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr class="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                    <th class="p-3">File Name</th>
                    <th class="p-3">Key / Path</th>
                    <th class="p-3 text-right">Size</th>
                    <th class="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800 bg-white/60 dark:bg-neutral-900/60">
                  <tr
                    v-for="file in folder.cfStorageFiles"
                    :key="file.cfStorageKey"
                    class="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
                  >
                    <td class="p-3 font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span class="i-lucide-file-text w-4 h-4 text-amber-500 shrink-0" />
                      <span class="truncate max-w-xs" :title="file.cfStorageName">{{ file.cfStorageName }}</span>
                    </td>
                    <td class="p-3 text-neutral-500 dark:text-neutral-400 truncate max-w-xs font-mono">
                      {{ file.cfStorageKey }}
                    </td>
                    <td class="p-3 text-right font-bold text-neutral-800 dark:text-neutral-200">
                      {{ file.cfStorageSizeFormatted }}
                    </td>
                    <td class="p-3 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <a
                          v-if="file.cfStorageUrl"
                          :href="file.cfStorageUrl"
                          target="_blank"
                          class="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                          title="Open URL"
                        >
                          <span class="i-lucide-external-link w-3.5 h-3.5" />
                        </a>
                        <button
                          v-if="file.cfStorageUrl"
                          @click="copyUrl(file.cfStorageUrl)"
                          class="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                          title="Copy Link"
                        >
                          <span class="i-lucide-copy w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="py-6 text-center text-xs text-neutral-400 font-mono">
              No direct files in this directory level.
            </div>
          </div>
        </div>

        <div v-if="filteredFolders.length === 0" class="py-12 text-center text-neutral-400 font-mono">
          No folders found matching search query.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '~/composables/apiFetchTwo'
import { mapperCloudFlearMetrics, type R2MetricsDTO, type R2FolderItemDTO, metricsResponse, fetchMetricCloudflearService } from '~/model_dto/cloudflear/model.dto'
import Swal from 'sweetalert2'

// Import vue-chartjs and Chart.js modules
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  type ChartOptions,
  type ChartData
} from 'chart.js'

// Register Chart.js elements including ArcElement for Pie Chart
ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)

// Reactive States
const isLoading = ref<boolean>(false)
const lastRefreshedAt = ref<string>('')
const chartMetricMode = ref<'size' | 'files' | 'ops'>('size')
const searchQuery = ref<string>('')
const expandedFolders = ref<Set<string>>(new Set())

// Main Metrics State DTO
const metricsState = ref<R2MetricsDTO | null>(null)

// Fallback Mock Data for demonstration
// const mockMetrics = computed(() => {
//   if (metricsResponse.value) {
//     mapperCloudFlearMetrics(metricsResponse.value)
//   }
//   return null
// })

// // Fetch Metrics from Backend Endpoint
// const fetchMetrics = async () => {
//   isLoading.value = true
//   try {
//     const res: any = await apiFetch('GET', 'v1/cloudflare/r2-dashboard')
//     if (res && res.success && res.data) {
//       metricsState.value = mapperCloudFlearMetrics(res.data)
//     } else {
//       metricsState.value = mockMetrics
//     }
//   } catch (err) {
//     console.warn('Backend Cloudflare API not reachable or returned error, using fallback dashboard view:', err)
//     metricsState.value = mockMetrics
//   } finally {
//     isLoading.value = false
//     lastRefreshedAt.value = new Date().toLocaleTimeString()
//     // Auto expand first folder by default
//     if (metricsState.value?.cfStorageFolders?.length) {
//       expandedFolders.value.add(metricsState.value.cfStorageFolders[0].cfStoragePath)
//     }
//   }
// }

// Computed Folder List
const folderList = computed<R2FolderItemDTO[]>(() => {
  return metricsState.value?.cfStorageFolders || []
})

// Filtered Folders based on search query
const filteredFolders = computed<R2FolderItemDTO[]>(() => {
  if (!searchQuery.value.trim()) return folderList.value
  const q = searchQuery.value.toLowerCase()
  return folderList.value.filter(
    (f) =>
      f.cfStoragePath.toLowerCase().includes(q) ||
      f.cfStorageName.toLowerCase().includes(q) ||
      f.cfStorageFiles?.some((file) => file.cfStorageName.toLowerCase().includes(q) || file.cfStorageKey.toLowerCase().includes(q))
  )
})

// Toggle Folder Expansion
const toggleFolderExpand = (path: string) => {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path)
  } else {
    expandedFolders.value.add(path)
  }
}

// Copy URL helper
const copyUrl = (url?: string) => {
  if (!url) return
  navigator.clipboard.writeText(url)
  Swal.fire({
    title: 'URL Copied!',
    text: 'Link copied to clipboard.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  })
}

// Pie Chart Data Configuration for Bucket Size
const pieChartData = computed<ChartData<'pie'>>(() => {
  const folders = folderList.value
  const palette = [
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#f97316', // Orange
  ]

  return {
    labels: folders.map((f) => f.cfStorageName || f.cfStoragePath),
    datasets: [
      {
        label: 'Folder Storage Size (MB)',
        backgroundColor: folders.map((_, i) => palette[i % palette.length]),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        hoverOffset: 8,
        data: folders.map((f) => parseFloat((f.cfStorageTotalSizeBytes / (1024 * 1024)).toFixed(2)))
      }
    ]
  }
})

// Pie Chart Options for Bucket Size
const pieChartOptions = computed<ChartOptions<'pie'>>(() => {
  const totalMB = folderList.value.reduce((acc, f) => acc + (f.cfStorageTotalSizeBytes / (1024 * 1024)), 0)

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            size: 12
          },
          padding: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw) || 0
            const percentage = totalMB > 0 ? ((value / totalMB) * 100).toFixed(1) : '0'
            return ` ${context.label}: ${value} MB (${percentage}%)`
          }
        }
      }
    }
  }
})

// Dynamic Bar Chart Data Configuration (for Files & Operations)
const activeChartData = computed<ChartData<'bar'>>(() => {
  const folders = folderList.value

  if (chartMetricMode.value === 'files') {
    return {
      labels: folders.map((f) => f.cfStorageName || f.cfStoragePath),
      datasets: [
        {
          label: 'File Count per Folder',
          backgroundColor: '#10b981', // Emerald-500
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: '#059669',
          data: folders.map((f) => f.cfStorageFileCount)
        }
      ]
    }
  } else {
    // Operations Breakdown
    return {
      labels: ['Class A (Put / Upload / List)', 'Class B (Get / Download / Head)'],
      datasets: [
        {
          label: 'API Request Count',
          backgroundColor: ['#8b5cf6', '#3b82f6'],
          borderColor: ['#7c3aed', '#2563eb'],
          borderWidth: 1,
          borderRadius: 8,
          data: [
            metricsState.value?.cfStorageClassAOperations || 0,
            metricsState.value?.cfStorageClassBOperations || 0
          ]
        }
      ]
    }
  }
})

// Dynamic Bar Chart Options
const activeChartOptions = computed<ChartOptions<'bar'>>(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (chartMetricMode.value === 'files') {
              return ` File Count: ${context.raw} files`
            } else {
              return ` Operations Count: ${context.raw} requests`
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.15)'
        },
        ticks: {
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            size: 11
          }
        }
      }
    }
  }
})

onMounted(async () => {
  // await fetchMetrics()
  await fetchMetricCloudflearService()
})
</script>