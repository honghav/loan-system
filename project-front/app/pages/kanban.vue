<template>
  <div class="space-y-6">
    <!-- Kanban Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
          <span class="material-symbols-outlined text-[16px] text-[#4cd7f6]">view_kanban</span>
          <span>Sprint Workflow Board</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Task Kanban Board</h1>
      </div>

      <!-- Actions & Project Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
        <select
          v-model="selectedProjectId"
          class="h-9 px-3 bg-[#141b2b] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#4cd7f6] transition-all w-full sm:w-auto"
          @change="loadTasks"
        >
          <option value="">All Active Projects</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>

        <button
          @click="openCreateTaskModal"
          class="flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-white font-semibold text-xs hover:opacity-95 transition-all shadow-md active:scale-95 shrink-0"
        >
          <span class="material-symbols-outlined text-[16px]">add</span>
          <span>New Task</span>
        </button>
      </div>
    </div>

    <!-- Mobile Column Tab Switcher (Visible on mobile screens) -->
    <div class="md:hidden flex items-center gap-1.5 p-1 bg-[#141b2b] rounded-xl border border-[#232a3a] overflow-x-auto max-w-full">
      <button
        type="button"
        @click="mobileActiveColumn = 'ALL'"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
        :class="mobileActiveColumn === 'ALL' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#908fa0] hover:text-white'"
      >
        All ({{ tasks.length }})
      </button>
      <button
        v-for="col in columns"
        :key="col.status"
        type="button"
        @click="mobileActiveColumn = col.status"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
        :class="mobileActiveColumn === col.status ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#908fa0] hover:text-white'"
      >
        <span class="w-2 h-2 rounded-full" :class="col.color"></span>
        <span>{{ col.title.split(' ')[0] }} ({{ getTasksByStatus(col.status).length }})</span>
      </button>
    </div>

    <!-- Kanban Columns Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
      <!-- Column component helper loop -->
      <div
        v-for="col in displayedColumns"
        :key="col.status"
        class="bg-[#141b2b]/90 border border-[#232a3a] rounded-2xl p-4 flex flex-col gap-4 min-h-[350px] sm:min-h-[500px] shadow-xl"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 border-b border-[#232a3a]">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" :class="col.color"></span>
            <span class="text-xs font-bold text-white tracking-wider uppercase">{{ col.title }}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-[#191f2f] text-[11px] font-mono text-[#c7c4d7] border border-[#232a3a]">
            {{ getTasksByStatus(col.status).length }}
          </span>
        </div>

        <!-- Task Cards Container -->
        <div class="space-y-3 flex-1 overflow-y-auto max-h-[550px] sm:max-h-[650px] pr-1">
          <div v-if="!getTasksByStatus(col.status).length" class="py-8 text-center text-xs text-[#908fa0] italic">
            No tasks in {{ col.title }}
          </div>

          <div
            v-for="task in getTasksByStatus(col.status)"
            :key="task.id"
            class="p-4 rounded-xl bg-[#070e1d] border border-[#232a3a] hover:border-[#8083ff]/40 transition-all space-y-3 group shadow-md"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded" :class="getPriorityClass(task.priority)">
                {{ task.priority }}
              </span>
              <button
                @click="deleteTask(task.id)"
                class="text-[#908fa0] hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-0.5"
                title="Delete task"
              >
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>

            <h4 class="text-xs font-semibold text-white leading-snug">{{ task.title }}</h4>
            <p v-if="task.description" class="text-[11px] text-[#908fa0] line-clamp-2">{{ task.description }}</p>

            <div class="pt-2 border-t border-[#232a3a] flex items-center justify-between gap-2 text-[10px] text-[#908fa0]">
              <span class="truncate max-w-[100px] sm:max-w-[120px]">{{ task.project?.name || 'Project' }}</span>
              <!-- Status Movement Quick Action -->
              <select
                :value="task.status"
                class="bg-[#141b2b] text-[#4cd7f6] text-[10px] rounded px-1.5 py-0.5 border border-[#232a3a] focus:outline-none"
                @change="changeTaskStatus(task.id, ($event.target as HTMLSelectElement).value as TaskStatus)"
              >
                <option value="TODO">→ TODO</option>
                <option value="IN_PROGRESS">→ WIP</option>
                <option value="IN_REVIEW">→ REVIEW</option>
                <option value="DONE">→ DONE</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="isCreateTaskModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="w-full max-w-lg bg-[#141b2b] border border-[#232a3a] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 my-8">
        <div class="flex items-center justify-between border-b border-[#232a3a] pb-3">
          <h3 class="text-base font-bold text-white flex items-center gap-2">
            <span class="material-symbols-outlined text-[#8083ff]">add_task</span>
            <span>Create New Task</span>
          </h3>
          <button @click="isCreateTaskModalOpen = false" class="text-[#908fa0] hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="handleCreateTask" class="space-y-3.5">
          <div>
            <label class="block text-xs text-[#c7c4d7] mb-1">Target Project *</label>
            <select
              v-model="newTask.projectId"
              required
              class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            >
              <option value="" disabled>Select a project</option>
              <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs text-[#c7c4d7] mb-1">Task Title *</label>
            <input
              v-model="newTask.title"
              required
              type="text"
              placeholder="e.g. Implement TypeORM entity migration"
              class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            />
          </div>

          <div>
            <label class="block text-xs text-[#c7c4d7] mb-1">Description</label>
            <textarea
              v-model="newTask.description"
              rows="3"
              placeholder="Technical requirement summary..."
              class="w-full p-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-[#c7c4d7] mb-1">Initial Column</label>
              <select v-model="newTask.status" class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]">
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-[#c7c4d7] mb-1">Priority</label>
              <select v-model="newTask.priority" class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#8083ff]">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-[#232a3a]">
            <button type="button" @click="isCreateTaskModalOpen = false" class="text-xs text-[#c7c4d7] px-3 py-1.5">Cancel</button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-5 py-2 bg-gradient-to-r from-[#8083ff] to-[#4cd7f6] text-white text-xs font-semibold rounded-xl hover:opacity-95 disabled:opacity-50"
            >
              {{ isSubmitting ? 'Creating...' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { TaskStatus, TaskPriority, type TaskDto } from '~/model_dto/task.dto';
import type { ProjectDto } from '~/model_dto/project.dto';
import { useProjectService } from '~/composables/useProjectService';
import { useTaskService } from '~/composables/useTaskService';

useSeoMeta({ title: 'Task Kanban Board - PPM' });

const route = useRoute();
const projectService = useProjectService();
const taskService = useTaskService();

const projects = ref<ProjectDto[]>([]);
const tasks = ref<TaskDto[]>([]);
const selectedProjectId = ref<string>((route.query.projectId as string) || '');
const isCreateTaskModalOpen = ref(false);
const isSubmitting = ref(false);
const mobileActiveColumn = ref<string>('ALL');

const newTask = ref({
  projectId: '',
  title: '',
  description: '',
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
});

const columns = [
  { status: TaskStatus.TODO, title: 'To-Do Queue', color: 'bg-[#908fa0]' },
  { status: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-[#8083ff]' },
  { status: TaskStatus.IN_REVIEW, title: 'In Review', color: 'bg-[#4cd7f6]' },
  { status: TaskStatus.DONE, title: 'Done / Verified', color: 'bg-[#4edea3]' },
];

const displayedColumns = computed(() => {
  if (mobileActiveColumn.value === 'ALL') {
    return columns;
  }
  return columns.filter((c) => c.status === mobileActiveColumn.value);
});

const openCreateTaskModal = () => {
  if (!newTask.value.projectId && projects.value.length) {
    newTask.value.projectId = selectedProjectId.value || projects.value[0].id;
  }
  isCreateTaskModalOpen.value = true;
};

const loadProjects = async () => {
  try {
    const res = await projectService.getProjects({ limit: 100 });
    projects.value = res.data;
    if (!selectedProjectId.value && projects.value.length) {
      newTask.value.projectId = projects.value[0].id;
    }
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
};

const loadTasks = async () => {
  try {
    if (selectedProjectId.value) {
      const res = await taskService.getTasksByProject(selectedProjectId.value, { limit: 100 });
      tasks.value = res.data;
    } else {
      // Aggregate tasks across all active projects
      if (!projects.value.length) await loadProjects();
      const taskPromises = projects.value.map((p) =>
        taskService.getTasksByProject(p.id, { limit: 50 }).catch(() => ({ data: [] }))
      );
      const results = await Promise.all(taskPromises);
      tasks.value = results.flatMap((r) => r.data);
    }
  } catch (err) {
    console.error('Failed to load tasks:', err);
  }
};

const getTasksByStatus = (status: TaskStatus) => {
  return tasks.value.filter((t) => t.status === status);
};

const changeTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  try {
    await taskService.updateTaskStatus(taskId, { status: newStatus });
    const target = tasks.value.find((t) => t.id === taskId);
    if (target) {
      target.status = newStatus;
    }
  } catch (err) {
    console.error('Failed to update task status:', err);
    loadTasks();
  }
};

const deleteTask = async (taskId: string) => {
  if (!confirm('Are you sure you want to delete this task?')) return;
  try {
    await taskService.deleteTask(taskId);
    tasks.value = tasks.value.filter((t) => t.id !== taskId);
  } catch (err) {
    console.error('Failed to delete task:', err);
  }
};

const handleCreateTask = async () => {
  if (!newTask.value.title.trim() || !newTask.value.projectId) return;
  try {
    isSubmitting.value = true;
    await taskService.createTask(newTask.value.projectId, {
      title: newTask.value.title,
      description: newTask.value.description,
      status: newTask.value.status,
      priority: newTask.value.priority,
    });
    isCreateTaskModalOpen.value = false;
    newTask.value = {
      projectId: selectedProjectId.value || (projects.value[0]?.id ?? ''),
      title: '',
      description: '',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    };
    loadTasks();
  } catch (err) {
    alert('Failed to create task');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  await loadProjects();
  await loadTasks();
});

const getPriorityClass = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.URGENT: return 'bg-red-950 text-red-400 border border-red-800';
    case TaskPriority.HIGH: return 'bg-orange-950 text-orange-400 border border-orange-800';
    case TaskPriority.MEDIUM: return 'bg-[#191f2f] text-[#4cd7f6] border border-[#232a3a]';
    default: return 'bg-[#191f2f] text-[#908fa0] border border-[#232a3a]';
  }
};
</script>
