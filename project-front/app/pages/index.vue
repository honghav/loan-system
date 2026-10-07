<template>
  <div class="space-y-8">
    <!-- Header Briefing / Telemetry Overview Bar -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2 text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
          <span class="w-2 h-2 rounded-full bg-[#4edea3]"></span>
          <span>Telemetry Pipeline • Active Sync</span>
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Executive Operations Deck</h1>
        <p class="text-xs text-[#c7c4d7]">Real-time compilation of distributed repositories, priority queues, and sprint velocities.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchDashboardData"
          class="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#191f2f] hover:bg-[#232a3a] text-white text-xs font-medium border border-[#232a3a] transition-all"
        >
          <span class="material-symbols-outlined text-[16px]" :class="{ 'animate-spin': loading }">refresh</span>
          <span>Sync Data</span>
        </button>
        <NuxtLink
          to="/projects"
          class="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#8083ff] hover:bg-[#c0c1ff] hover:text-[#0d0096] text-white text-xs font-semibold shadow-lg transition-all"
        >
          <span class="material-symbols-outlined text-[16px]">folder</span>
          <span>View All Projects</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Error Alert if backend DB connection is off -->
    <div v-if="errorMsg" class="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-red-400">warning</span>
        <span>{{ errorMsg }}</span>
      </div>
      <button @click="fetchDashboardData" class="px-3 py-1 bg-red-900/60 hover:bg-red-800 text-white rounded-lg">Retry</button>
    </div>

    <!-- Top Key Metric Cards Grid (4 Top Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      <!-- Card 1: Active Projects -->
      <div class="relative overflow-hidden rounded-2xl bg-[#191f2f]/70 border border-[#232a3a] p-5 flex flex-col justify-between shadow-xl hover:border-[#8083ff]/40 transition-all">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] uppercase tracking-wider font-semibold text-[#908fa0]">Active Projects</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-white">{{ stats?.projectStats?.activeProjects ?? 0 }}</span>
              <span class="text-xs text-[#8083ff] font-medium">/ {{ stats?.projectStats?.totalProjects ?? 0 }} Total</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-[#8083ff]/20 flex items-center justify-center text-[#c0c1ff]">
            <span class="material-symbols-outlined text-[22px]">folder_special</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#232a3a] flex items-center justify-between text-xs">
          <span class="text-[#4edea3] flex items-center gap-1 font-medium">
            <span class="material-symbols-outlined text-[14px]">trending_up</span>
            {{ stats?.projectStats?.completedProjects ?? 0 }} Completed
          </span>
          <span class="text-[#c7c4d7]">{{ stats?.projectStats?.planningProjects ?? 0 }} Planning</span>
        </div>
      </div>

      <!-- Card 2: Task Scoped -->
      <div class="rounded-2xl bg-[#191f2f]/70 border border-[#232a3a] p-5 flex flex-col justify-between shadow-xl hover:border-[#4cd7f6]/40 transition-all">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] uppercase tracking-wider font-semibold text-[#908fa0]">Task Scoped</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-white">{{ stats?.taskStats?.totalTasks ?? 0 }}</span>
              <span class="text-xs text-[#4cd7f6] font-medium">{{ stats?.taskStats?.completedTasks ?? 0 }} Done</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-[#4cd7f6]/20 flex items-center justify-center text-[#4cd7f6]">
            <span class="material-symbols-outlined text-[22px]">checklist</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#232a3a] grid grid-cols-3 gap-2 text-[11px]">
          <div class="flex items-center gap-1.5 text-[#c7c4d7]">
            <span class="w-2 h-2 rounded-full bg-[#908fa0]"></span>
            <span>TODO: {{ stats?.taskStats?.todoTasks ?? 0 }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-[#c0c1ff]">
            <span class="w-2 h-2 rounded-full bg-[#8083ff]"></span>
            <span>WIP: {{ stats?.taskStats?.inProgressTasks ?? 0 }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-[#4edea3]">
            <span class="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span>DONE: {{ stats?.taskStats?.completedTasks ?? 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Card 3: Overdue Action Items -->
      <div class="rounded-2xl bg-[#191f2f]/70 border border-[#232a3a] p-5 flex flex-col justify-between shadow-xl hover:border-red-500/40 transition-all">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] uppercase tracking-wider font-semibold text-[#908fa0]">Overdue Items</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold" :class="(stats?.taskStats?.overdueTasks ?? 0) > 0 ? 'text-red-400' : 'text-white'">
                {{ stats?.taskStats?.overdueTasks ?? 0 }}
              </span>
              <span class="text-xs text-red-400 font-medium">Requires Attention</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
            <span class="material-symbols-outlined text-[22px]">warning</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#232a3a] flex items-center justify-between text-xs text-[#c7c4d7]">
          <span>Blocked Tasks:</span>
          <span class="text-red-400 font-bold">{{ stats?.taskStats?.blockedTasks ?? 0 }}</span>
        </div>
      </div>

      <!-- Card 4: Today's Tasks -->
      <div class="rounded-2xl bg-[#191f2f]/70 border border-[#232a3a] p-5 flex flex-col justify-between shadow-xl hover:border-[#4edea3]/40 transition-all">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] uppercase tracking-wider font-semibold text-[#908fa0]">Due Today</span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-white">{{ stats?.todayTasks?.length ?? 0 }}</span>
              <span class="text-xs text-[#4edea3] font-medium">Scheduled</span>
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-[#4edea3]/20 flex items-center justify-center text-[#4edea3]">
            <span class="material-symbols-outlined text-[22px]">today</span>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-[#232a3a] flex items-center justify-between text-xs text-[#c7c4d7]">
          <span>Upcoming (7 Days):</span>
          <span class="text-[#4edea3] font-bold">{{ stats?.upcomingTasks?.length ?? 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Active Projects & Overdue Tasks Dual Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column (2 Cols): Active Projects with Progress -->
      <div class="lg:col-span-2 space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#8083ff]">rocket_launch</span>
            <h2 class="text-lg font-bold text-white">Active Projects Velocity</h2>
          </div>
          <NuxtLink to="/projects" class="text-xs text-[#8083ff] hover:underline flex items-center gap-1">
            <span>View All Directory</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </NuxtLink>
        </div>

        <div v-if="loading" class="p-8 rounded-2xl bg-[#141b2b] text-center text-xs text-[#908fa0]">
          Loading operational telemetry...
        </div>

        <div v-else-if="!stats?.activeProjects?.length" class="p-8 rounded-2xl bg-[#141b2b] text-center border border-[#232a3a] text-xs text-[#908fa0]">
          No active projects found. Create a project to start tracking telemetry.
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="project in stats.activeProjects"
            :key="project.id"
            class="p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] hover:border-[#8083ff]/50 transition-all flex flex-col gap-4 shadow-lg group"
          >
            <div class="flex items-start justify-between">
              <div>
                <NuxtLink :to="`/projects/${project.id}`" class="text-base font-bold text-white group-hover:text-[#c0c1ff] transition-colors flex items-center gap-2">
                  <span>{{ project.name }}</span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold" :class="getPriorityClass(project.priority)">
                    {{ project.priority }}
                  </span>
                </NuxtLink>
                <p class="text-xs text-[#c7c4d7] line-clamp-1 mt-1">{{ project.description || 'No description specified' }}</p>
              </div>

              <NuxtLink :to="`/projects/${project.id}`" class="p-2 rounded-lg bg-[#191f2f] text-[#908fa0] hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[18px]">open_in_new</span>
              </NuxtLink>
            </div>

            <!-- Progress Bar -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#908fa0] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-[#4edea3]">task_alt</span>
                  {{ project.progress?.completedTasks ?? 0 }} of {{ project.progress?.totalTasks ?? 0 }} tasks completed
                </span>
                <span class="text-[#4edea3] font-mono font-bold">{{ project.progress?.progress ?? 0 }}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-[#2e3545] overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-[#8083ff] to-[#4edea3] rounded-full transition-all duration-500"
                  :style="{ width: `${project.progress?.progress ?? 0}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (1 Col): Overdue Tasks & Activity Stream -->
      <div class="space-y-6">
        <!-- Overdue Action Items List -->
        <div class="p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-4 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#232a3a] pb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-red-400 text-[18px]">priority_high</span>
              <h3 class="text-sm font-bold text-white">Overdue Priority Queue</h3>
            </div>
            <span class="px-2 py-0.5 rounded bg-red-950/60 text-red-400 text-[10px] font-mono font-bold">
              {{ stats?.overdueTasks?.length ?? 0 }} Tasks
            </span>
          </div>

          <div v-if="!stats?.overdueTasks?.length" class="py-4 text-center text-xs text-[#908fa0]">
            ✨ No overdue tasks! All sprint items on schedule.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="task in stats.overdueTasks"
              :key="task.id"
              class="p-3 rounded-xl bg-[#070e1d] border border-red-500/20 flex flex-col gap-1 text-xs"
            >
              <div class="flex items-center justify-between font-semibold text-white">
                <span class="line-clamp-1">{{ task.title }}</span>
                <span class="text-red-400 text-[10px] font-mono">{{ formatDate(task.dueDate) }}</span>
              </div>
              <div class="flex items-center justify-between text-[11px] text-[#908fa0]">
                <span>{{ task.project?.name || 'Project' }}</span>
                <span class="uppercase text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 font-bold">{{ task.priority }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="p-5 rounded-2xl bg-[#141b2b] border border-[#232a3a] space-y-4 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#232a3a] pb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[#4cd7f6] text-[18px]">history</span>
              <h3 class="text-sm font-bold text-white">Audit Trail Activity</h3>
            </div>
            <NuxtLink to="/activities" class="text-[11px] text-[#4cd7f6] hover:underline">View All</NuxtLink>
          </div>

          <div v-if="!stats?.recentActivities?.length" class="py-4 text-center text-xs text-[#908fa0]">
            No recent activity recorded.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="act in stats.recentActivities.slice(0, 5)"
              :key="act.id"
              class="flex items-start gap-3 text-xs"
            >
              <div class="w-7 h-7 rounded-lg bg-[#191f2f] border border-[#232a3a] flex items-center justify-center text-[#c0c1ff] shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-[14px]">{{ getActivityIcon(act.action) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white text-xs line-clamp-2">{{ act.description }}</p>
                <span class="text-[10px] text-[#908fa0]">{{ formatRelativeTime(act.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DashboardOverviewDto } from '~/model_dto/dashboard.dto';
import { useDashboardService } from '~/composables/useDashboardService';

useSeoMeta({
  title: 'Executive Operations Deck - PPM',
  description: 'Real-time telemetry and project velocity tracking.',
});

const dashboardService = useDashboardService();
const stats = ref<DashboardOverviewDto | null>(null);
const loading = ref(true);
const errorMsg = ref('');

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    errorMsg.value = '';
    stats.value = await dashboardService.getDashboardOverview();
  } catch (err: any) {
    console.error('Failed to load dashboard:', err);
    errorMsg.value = 'Unable to connect to Core Backend v2. Please ensure NestJS is running on http://localhost:3000.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'URGENT': return 'bg-red-950 text-red-400 border border-red-800';
    case 'HIGH': return 'bg-orange-950 text-orange-400 border border-orange-800';
    case 'MEDIUM': return 'bg-[#191f2f] text-[#4cd7f6] border border-[#232a3a]';
    default: return 'bg-[#191f2f] text-[#908fa0] border border-[#232a3a]';
  }
};

const getActivityIcon = (action: string) => {
  if (action.includes('PROJECT')) return 'folder';
  if (action.includes('FEATURE')) return 'account_tree';
  if (action.includes('TASK')) return 'check_box';
  return 'notifications';
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatRelativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
</script>
