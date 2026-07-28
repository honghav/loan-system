<template>
  <div class="w-full space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Audit Log Monitoring & Analytics
          </h1>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            24h Auto-Retention Active
          </span>
        </div>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Monitor real-time request traces, top URL endpoints, HTTP methods, and manage 24h retention cleanup.
        </p>
      </div>

      <!-- Quick Action Controls -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Auto Refresh Toggle -->
        <button
          @click="toggleAutoRefresh"
          :class="[
            'px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2',
            autoRefresh
              ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/30'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
          ]"
        >
          <span
            :class="[
              'i-lucide-rotate-cw w-4 h-4',
              autoRefresh ? 'animate-spin text-primary-500' : ''
            ]"
          />
          {{ autoRefresh ? 'Auto (5s)' : 'Auto Off' }}
        </button>

        <!-- Refresh Button -->
        <UButton
          icon="i-lucide-refresh-cw"
          color="neutral"
          variant="outline"
          size="md"
          :loading="isAuditLogLoading"
          @click="fetchAuditLogs"
        >
          Refresh
        </UButton>

        <!-- Purge >24h Logs Button -->
        <UButton
          icon="i-lucide-history"
          color="neutral"
          variant="soft"
          size="md"
          @click="handleDelete24hLogs"
        >
          Purge >24h
        </UButton>

        <!-- Clear All Logs Button -->
        <UButton
          icon="i-lucide-trash-2"
          color="rose"
          variant="soft"
          size="md"
          @click="handleClearAllLogs"
        >
          Clear All Logs
        </UButton>
      </div>
    </div>

    <!-- Top 3 Analytics & KPI Overview Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top 3 URL Paths Card -->
      <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="i-lucide-trending-up w-5 h-5 text-primary-500" />
            <h3 class="text-sm font-bold text-neutral-900 dark:text-white">Top 3 URL Endpoints</h3>
          </div>
          <span class="text-xs text-neutral-400 font-medium">Most Called</span>
        </div>

        <div v-if="top3Urls.length === 0" class="py-6 text-center text-xs text-neutral-400">
          No request traces recorded yet.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="(item, index) in top3Urls"
            :key="item.url"
            class="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/80 space-y-1.5"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 overflow-hidden">
                <span
                  class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold"
                  :class="[
                    index === 0 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                    index === 1 ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200' :
                    'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                  ]"
                >
                  #{{ index + 1 }}
                </span>
                <span class="font-mono font-semibold text-neutral-800 dark:text-neutral-200 truncate" :title="item.url">
                  {{ item.url }}
                </span>
              </div>
              <span class="font-mono font-bold text-neutral-900 dark:text-white">
                {{ item.count }} req
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div
                class="bg-primary-500 h-full rounded-full transition-all duration-500"
                :style="{ width: `${item.percentage}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Top HTTP Methods Card -->
      <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="i-lucide-bar-chart-3 w-5 h-5 text-indigo-500" />
            <h3 class="text-sm font-bold text-neutral-900 dark:text-white">HTTP Method Distribution</h3>
          </div>
          <span class="text-xs text-neutral-400 font-medium">Breakdown</span>
        </div>

        <div v-if="topMethods.length === 0" class="py-6 text-center text-xs text-neutral-400">
          No HTTP method stats available.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="m in topMethods"
            :key="m.method"
            class="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800/80"
          >
            <div class="flex items-center gap-2.5">
              <span
                class="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase border"
                :class="getMethodBadgeClass(m.method)"
              >
                {{ m.method }}
              </span>
              <span class="text-xs text-neutral-500 font-medium">{{ m.percentage }}%</span>
            </div>
            <span class="font-mono font-bold text-xs text-neutral-900 dark:text-white">
              {{ m.count }} calls
            </span>
          </div>
        </div>
      </div>

      <!-- Quick KPI Counters Card -->
      <div class="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-neutral-900 dark:text-white">Health & Latency Overview</h3>
          <span class="text-xs text-neutral-400 font-medium">Summary</span>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
            <span class="text-[11px] font-semibold uppercase text-emerald-600 dark:text-emerald-400">Success Rate</span>
            <p class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{{ successRate }}%</p>
          </div>

          <div class="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
            <span class="text-[11px] font-semibold uppercase text-rose-600 dark:text-rose-400">Errors (4xx/5xx)</span>
            <p class="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{{ errorCount }}</p>
          </div>

          <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
            <span class="text-[11px] font-semibold uppercase text-amber-600 dark:text-amber-400">Avg Latency</span>
            <p class="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">{{ avgLatency }}ms</p>
          </div>

          <div class="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
            <span class="text-[11px] font-semibold uppercase text-indigo-600 dark:text-indigo-400">SQL Executed</span>
            <p class="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">{{ totalSqlQueries }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search by URL path, method, or status..."
          class="w-full"
          size="md"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Method Selector Pills -->
        <div class="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold">
          <button
            v-for="m in ['ALL', 'GET', 'POST', 'PUT', 'DELETE']"
            :key="m"
            @click="setMethodFilter(m)"
            :class="[
              'px-2.5 py-1.5 rounded-lg transition-all',
              selectedMethod === m
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-bold'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'
            ]"
          >
            {{ m }}
          </button>
        </div>

        <!-- Status Filter -->
        <select
          v-model="selectedStatusGroup"
          class="px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="ALL">All Status Codes</option>
          <option value="2XX">2xx Success</option>
          <option value="4XX">4xx Client Error</option>
          <option value="5XX">5xx Server Error</option>
        </select>

        <!-- Limit Selector -->
        <select
          v-model="limit"
          @change="fetchAuditLogs"
          class="px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option :value="10">10 per page</option>
          <option :value="20">20 per page</option>
          <option :value="50">50 per page</option>
        </select>
      </div>
    </div>

    <!-- Data Table Container -->
    <div class="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full min-w-max table-auto text-left border-collapse">
          <thead>
            <tr class="border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <th class="px-6 py-4 w-28">Method</th>
              <th class="px-6 py-4 w-28">Status</th>
              <th class="px-6 py-4">URL Path</th>
              <th class="px-6 py-4 w-32 text-center">Duration</th>
              <th class="px-6 py-4 w-36 text-center">SQL Queries</th>
              <th class="px-6 py-4 w-44">Timestamp</th>
              <th class="px-6 py-4 w-28 text-center">Action</th>
            </tr>
          </thead>
          <tbody v-if="isAuditLogLoading" class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <tr v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg" /></td>
              <td class="px-6 py-4"><div class="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg" /></td>
              <td class="px-6 py-4"><div class="h-4 w-64 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>
              <td class="px-6 py-4"><div class="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" /></td>
              <td class="px-6 py-4"><div class="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded mx-auto" /></td>
              <td class="px-6 py-4"><div class="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" /></td>
              <td class="px-6 py-4"><div class="h-8 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg mx-auto" /></td>
            </tr>
          </tbody>
          <tbody v-else-if="filteredAuditLogs.length === 0" class="divide-y divide-neutral-100 dark:divide-neutral-800">
            <tr>
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center space-y-3">
                  <div class="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                    <span class="i-lucide-file-text w-8 h-8" />
                  </div>
                  <p class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    No Audit Logs Found
                  </p>
                  <p class="text-xs text-neutral-500 max-w-sm">
                    No request traces match your criteria or no audit logs recorded yet.
                  </p>
                  <UButton size="xs" color="primary" variant="ghost" @click="resetFilters">
                    Reset Filters
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else class="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
            <tr
              v-for="log in filteredAuditLogs"
              :key="log.logId"
              class="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors group cursor-pointer"
              @click="openInspectModal(log)"
            >
              <!-- Method Badge -->
              <td class="px-6 py-3.5">
                <span
                  class="px-2.5 py-1 rounded-lg text-[11px] font-extrabold tracking-wide uppercase border"
                  :class="getMethodBadgeClass(log.logMethod)"
                >
                  {{ log.logMethod }}
                </span>
              </td>

              <!-- Status Code -->
              <td class="px-6 py-3.5">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border"
                  :class="getStatusBadgeClass(log.logStatusCode)"
                >
                  <span :class="getStatusIcon(log.logStatusCode)" class="w-3.5 h-3.5" />
                  {{ log.logStatusCode }}
                </span>
              </td>

              <!-- URL Path -->
              <td class="px-6 py-3.5">
                <span class="font-mono text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ log.logUrl }}
                </span>
              </td>

              <!-- Duration -->
              <td class="px-6 py-3.5 text-center font-mono">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                  :class="getDurationBadgeClass(log.logDurationMs)"
                >
                  {{ log.logDurationMs }}ms
                </span>
              </td>

              <!-- SQL Queries Count -->
              <td class="px-6 py-3.5 text-center">
                <span
                  v-if="log.logSqlQueries && log.logSqlQueries.length > 0"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                >
                  <span class="i-lucide-zap w-3 h-3 text-indigo-500" />
                  {{ log.logSqlQueries.length }} queries
                </span>
                <span v-else class="text-neutral-400 font-mono text-[11px]">
                  0
                </span>
              </td>

              <!-- Timestamp -->
              <td class="px-6 py-3.5 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                {{ formatDate(log.logCreatedAt) }}
              </td>

              <!-- Action -->
              <td class="px-6 py-3.5 text-center" @click.stop>
                <UButton
                  icon="i-lucide-search"
                  size="xs"
                  color="primary"
                  variant="soft"
                  label="Inspect"
                  @click="openInspectModal(log)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="px-6 py-4 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div>
          Showing <span class="font-bold text-neutral-900 dark:text-white">{{ filteredAuditLogs.length }}</span> of <span class="font-bold text-neutral-900 dark:text-white">{{ auditLogMeta.total || auditLogData.length }}</span> logs
        </div>

        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-chevron-left"
            size="xs"
            color="neutral"
            variant="outline"
            :disabled="page <= 1"
            @click="prevPage"
          >
            Prev
          </UButton>
          <span class="px-3 py-1 font-semibold rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white">
            Page {{ page }} of {{ auditLogMeta.lastPage || 1 }}
          </span>
          <UButton
            icon="i-lucide-chevron-right"
            size="xs"
            color="neutral"
            variant="outline"
            :disabled="page >= auditLogMeta.lastPage"
            @click="nextPage"
          >
            Next
          </UButton>
        </div>
      </div>
    </div>

    <!-- Inspector Detail UModal -->
    <UModal v-model="isInspectModalOpen" size="xl">
      <div v-if="selectedInspectLog" class="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase border"
                :class="getMethodBadgeClass(selectedInspectLog.logMethod)"
              >
                {{ selectedInspectLog.logMethod }}
              </span>
              <span
                class="px-2.5 py-0.5 rounded text-xs font-bold border"
                :class="getStatusBadgeClass(selectedInspectLog.logStatusCode)"
              >
                {{ selectedInspectLog.logStatusCode }}
              </span>
              <span class="font-mono text-sm font-bold text-neutral-900 dark:text-white break-all">
                {{ selectedInspectLog.logUrl }}
              </span>
            </div>
            <p class="text-xs text-neutral-400 font-mono">
              Trace ID: {{ selectedInspectLog.logId }} • {{ formatDate(selectedInspectLog.logCreatedAt) }}
            </p>
          </div>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="isInspectModalOpen = false"
          />
        </div>

        <!-- Inner Filter / Tab Selector inside Inspector UModal -->
        <div class="flex flex-wrap items-center justify-between border-b border-neutral-200 dark:border-neutral-800 gap-4 text-xs font-semibold pb-3">
          <div class="flex items-center gap-4">
            <button
              v-for="tab in ['overview', 'requestBody', 'responseBody', 'sqlQueries', 'raw']"
              :key="tab"
              @click="inspectActiveTab = tab"
              :class="[
                'pb-1 transition-all capitalize border-b-2',
                inspectActiveTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              ]"
            >
              {{ tab === 'sqlQueries' ? `SQL Queries (${selectedInspectLog.logSqlQueries?.length || 0})` : tab }}
            </button>
          </div>

          <!-- Quick Copy Action -->
          <UButton
            icon="i-lucide-copy"
            size="xs"
            color="neutral"
            variant="outline"
            label="Copy Log JSON"
            @click="copyText(JSON.stringify(selectedInspectLog, null, 2))"
          />
        </div>

        <!-- Tab 1: Overview -->
        <div v-if="inspectActiveTab === 'overview'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
            <span class="text-xs font-semibold text-neutral-400 uppercase">Execution Latency</span>
            <p class="text-lg font-bold font-mono text-neutral-900 dark:text-white">{{ selectedInspectLog.logDurationMs }} ms</p>
          </div>
          <div class="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
            <span class="text-xs font-semibold text-neutral-400 uppercase">Database Queries Executed</span>
            <p class="text-lg font-bold font-mono text-neutral-900 dark:text-white">{{ selectedInspectLog.logSqlQueries?.length || 0 }} statements</p>
          </div>
          <div class="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 space-y-1 md:col-span-2">
            <span class="text-xs font-semibold text-neutral-400 uppercase">Full Endpoint URL</span>
            <p class="text-sm font-mono text-neutral-900 dark:text-white break-all">{{ selectedInspectLog.logUrl }}</p>
          </div>
        </div>

        <!-- Tab 2: Request Body -->
        <div v-else-if="inspectActiveTab === 'requestBody'" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span>HTTP Request Payload Data</span>
            <UButton
              icon="i-lucide-copy"
              size="xs"
              color="neutral"
              variant="ghost"
              label="Copy Request"
              @click="copyText(JSON.stringify(selectedInspectLog.logRequestBody, null, 2))"
            />
          </div>
          <pre class="p-4 rounded-xl bg-neutral-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-neutral-800 max-h-96">{{ selectedInspectLog.logRequestBody ? JSON.stringify(selectedInspectLog.logRequestBody, null, 2) : '// No Request Body' }}</pre>
        </div>

        <!-- Tab 3: Response Body -->
        <div v-else-if="inspectActiveTab === 'responseBody'" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span>HTTP Response Payload Data</span>
            <UButton
              icon="i-lucide-copy"
              size="xs"
              color="neutral"
              variant="ghost"
              label="Copy Response"
              @click="copyText(JSON.stringify(selectedInspectLog.logResponseBody, null, 2))"
            />
          </div>
          <pre class="p-4 rounded-xl bg-neutral-950 text-sky-400 font-mono text-xs overflow-x-auto border border-neutral-800 max-h-96">{{ selectedInspectLog.logResponseBody ? JSON.stringify(selectedInspectLog.logResponseBody, null, 2) : '// No Response Body' }}</pre>
        </div>

        <!-- Tab 4: SQL Queries -->
        <div v-else-if="inspectActiveTab === 'sqlQueries'" class="space-y-4">
          <div v-if="selectedInspectLog.logSqlQueries?.length > 1">
            <UInput
              v-model="sqlSearchQuery"
              icon="i-lucide-search"
              placeholder="Filter SQL statements by keyword..."
              size="xs"
              class="w-full"
            />
          </div>

          <div v-if="!filteredModalSqlQueries || filteredModalSqlQueries.length === 0" class="p-6 text-center text-xs text-neutral-400">
            No SQL queries match the filter.
          </div>

          <div
            v-for="(q, idx) in filteredModalSqlQueries"
            :key="idx"
            class="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2"
          >
            <div class="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span class="text-amber-400 font-bold">#{{ idx + 1 }} Query Statement</span>
              <span v-if="q.duration" class="text-neutral-500">{{ q.duration }}ms</span>
            </div>
            <pre class="font-mono text-xs text-purple-300 whitespace-pre-wrap break-all">{{ q.sql }}</pre>
            <div v-if="q.parameters && q.parameters.length > 0" class="text-[11px] font-mono text-neutral-400 border-t border-neutral-800/80 pt-2">
              <span class="text-neutral-500">Parameters:</span> {{ JSON.stringify(q.parameters) }}
            </div>
          </div>
        </div>

        <!-- Tab 5: Raw JSON -->
        <div v-else-if="inspectActiveTab === 'raw'" class="space-y-2">
          <pre class="p-4 rounded-xl bg-neutral-950 text-neutral-300 font-mono text-xs overflow-x-auto border border-neutral-800 max-h-96">{{ JSON.stringify(selectedInspectLog, null, 2) }}</pre>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Swal from 'sweetalert2'
import {
  getAuditLogService,
  clearAllAuditLogsService,
  delete24hAuditLogsService,
  auditLogData,
  auditLogMeta,
  isAuditLogLoading,
  type GetAuditLogDTO,
} from '~/model_dto/logger/get_audit_log.dto'

// Local State
const page = ref<number>(1)
const limit = ref<number>(20)
const searchQuery = ref<string>('')
const selectedMethod = ref<string>('ALL')
const selectedStatusGroup = ref<string>('ALL')
const autoRefresh = ref<boolean>(false)
let timerId: any = null

// Modal Inspect State
const isInspectModalOpen = ref<boolean>(false)
const selectedInspectLog = ref<GetAuditLogDTO | null>(null)
const inspectActiveTab = ref<string>('overview')
const sqlSearchQuery = ref<string>('')

// Fetch Service
const fetchAuditLogs = async () => {
  await getAuditLogService(page.value, limit.value, selectedMethod.value)
}

const setMethodFilter = (m: string) => {
  selectedMethod.value = m
  page.value = 1
  fetchAuditLogs()
}

// Delete & Clear Handlers
const handleClearAllLogs = async () => {
  const result = await Swal.fire({
    title: 'Clear All Audit Logs?',
    text: 'Are you sure you want to permanently delete all recorded audit logs?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Clear All',
    cancelButtonText: 'Cancel',
    customClass: {
      confirmButton: 'bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl mx-1',
      cancelButton: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold px-4 py-2 rounded-xl mx-1',
    },
    buttonsStyling: false,
  })

  if (result.isConfirmed) {
    const success = await clearAllAuditLogsService()
    if (success) {
      Swal.fire({
        title: 'Cleared!',
        text: 'All audit logs have been successfully deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }
}

const handleDelete24hLogs = async () => {
  const result = await Swal.fire({
    title: 'Purge Logs Older Than 24 Hours?',
    text: 'This will remove all audit logs created more than 24 hours ago.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Purge >24h Logs',
    cancelButtonText: 'Cancel',
    customClass: {
      confirmButton: 'bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 rounded-xl mx-1',
      cancelButton: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold px-4 py-2 rounded-xl mx-1',
    },
    buttonsStyling: false,
  })

  if (result.isConfirmed) {
    const success = await delete24hAuditLogsService()
    if (success) {
      Swal.fire({
        title: 'Purged!',
        text: 'Audit logs older than 24 hours have been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }
}

// Computed Top 3 URL Paths
const top3Urls = computed(() => {
  if (!auditLogData.value.length) return []

  const counts: Record<string, number> = {}
  auditLogData.value.forEach((log) => {
    counts[log.logUrl] = (counts[log.logUrl] || 0) + 1
  })

  const sorted = Object.entries(counts)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const maxCount = sorted[0]?.count || 1
  return sorted.map((item) => ({
    ...item,
    percentage: Math.round((item.count / maxCount) * 100),
  }))
})

// Computed Top Methods Breakdown
const topMethods = computed(() => {
  if (!auditLogData.value.length) return []

  const counts: Record<string, number> = {}
  auditLogData.value.forEach((log) => {
    const m = log.logMethod?.toUpperCase() || 'UNKNOWN'
    counts[m] = (counts[m] || 0) + 1
  })

  const total = auditLogData.value.length
  return Object.entries(counts)
    .map(([method, count]) => ({
      method,
      count,
      percentage: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
})

// Computed Table Filtering
const filteredAuditLogs = computed(() => {
  return auditLogData.value.filter((log) => {
    const matchesSearch =
      !searchQuery.value ||
      log.logUrl.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.logMethod.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.logStatusCode.toString().includes(searchQuery.value)

    let matchesStatus = true
    if (selectedStatusGroup.value === '2XX') matchesStatus = log.logStatusCode >= 200 && log.logStatusCode < 300
    else if (selectedStatusGroup.value === '4XX') matchesStatus = log.logStatusCode >= 400 && log.logStatusCode < 500
    else if (selectedStatusGroup.value === '5XX') matchesStatus = log.logStatusCode >= 500

    return matchesSearch && matchesStatus
  })
})

// Filter SQL Queries inside UModal
const filteredModalSqlQueries = computed(() => {
  if (!selectedInspectLog.value || !selectedInspectLog.value.logSqlQueries) return []
  if (!sqlSearchQuery.value) return selectedInspectLog.value.logSqlQueries

  return selectedInspectLog.value.logSqlQueries.filter((q) =>
    q.sql.toLowerCase().includes(sqlSearchQuery.value.toLowerCase()),
  )
})

// KPI Metrics Computed
const successCount = computed(() => auditLogData.value.filter((l) => l.logStatusCode >= 200 && l.logStatusCode < 400).length)
const errorCount = computed(() => auditLogData.value.filter((l) => l.logStatusCode >= 400).length)
const successRate = computed(() => (auditLogData.value.length ? Math.round((successCount.value / auditLogData.value.length) * 100) : 100))
const errorRate = computed(() => (auditLogData.value.length ? Math.round((errorCount.value / auditLogData.value.length) * 100) : 0))
const avgLatency = computed(() => {
  if (!auditLogData.value.length) return 0
  const sum = auditLogData.value.reduce((acc, curr) => acc + (curr.logDurationMs || 0), 0)
  return Math.round(sum / auditLogData.value.length)
})
const totalSqlQueries = computed(() => {
  return auditLogData.value.reduce((acc, curr) => acc + (curr.logSqlQueries?.length || 0), 0)
})

// Auto Refresh Toggle
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  if (autoRefresh.value) {
    timerId = setInterval(fetchAuditLogs, 5000)
  } else if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

// Modal Inspect Handler
const openInspectModal = (log: GetAuditLogDTO) => {
  selectedInspectLog.value = log
  inspectActiveTab.value = 'overview'
  sqlSearchQuery.value = ''
  isInspectModalOpen.value = true
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedMethod.value = 'ALL'
  selectedStatusGroup.value = 'ALL'
  page.value = 1
  fetchAuditLogs()
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
    fetchAuditLogs()
  }
}

const nextPage = () => {
  if (page.value < auditLogMeta.value.lastPage) {
    page.value++
    fetchAuditLogs()
  }
}

// Styling Helpers
const getMethodBadgeClass = (method: string) => {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    case 'POST':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'PUT':
      return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    case 'DELETE':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    case 'PATCH':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    default:
      return 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20'
  }
}

const getStatusBadgeClass = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  } else if (statusCode >= 500) {
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  }
  return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
}

const getStatusIcon = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) return 'i-lucide-check-circle-2 text-emerald-500'
  if (statusCode >= 400 && statusCode < 500) return 'i-lucide-alert-triangle text-amber-500'
  if (statusCode >= 500) return 'i-lucide-alert-octagon text-rose-500'
  return 'i-lucide-info text-blue-500'
}

const getDurationBadgeClass = (duration: number) => {
  if (duration < 100) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  if (duration < 300) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + date.toLocaleDateString()
  } catch {
    return dateStr
  }
}

// Lifecycle
onMounted(() => {
  fetchAuditLogs()
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>
