<template>
  <div class="space-y-6">
    <!-- Kanban Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#908fa0] uppercase tracking-wider font-semibold">
          <span class="material-symbols-outlined text-[16px] text-[#4cd7f6]">view_kanban</span>
          <span>Sprint Workflow Board</span>
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Task Kanban Board</h1>
      </div>

      <!-- Actions & Project Filter -->
      <div class="flex items-center gap-3">
        <select
          v-model="selectedProjectId"
          class="h-9 px-3 bg-[#141b2b] text-white text-xs rounded-xl border border-[#232a3a] focus:outline-none focus:border-[#4cd7f6]"
          @change="loadTasks"
        >
          <option value="">All Active Projects</option>
          <option v-for="p in projects" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>

        <button
          @click="isCreateTaskModalOpen = true"
          class="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#8083ff] text-white font-semibold text-xs hover:bg-[#c0c1ff] hover:text-[#0d0096] transition-all shadow-md"
        >
          <span class="material-symbols-outlined text-[16px]">add</span>
          <span>New Task</span>
        </button>
      </div>
    </div>

    <!-- Kanban Columns Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
      <!-- Column component helper loop -->
      <div
        v-for="col in columns"
        :key="col.status"
        class="bg-[#141b2b]/90 border border-[#232a3a] rounded-2xl p-4 flex flex-col gap-4 min-h-[500px]"
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
        <div class="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
          <div
            v-for="task in getTasksByStatus(col.status)"
            :key="task.id"
            class="p-4 rounded-xl bg-[#070e1d] border border-[#232a3a] hover:border-[#8083ff]/40 transition-all space-y-3 group shadow-md"
          >
            <div class="flex items-start justify-between">
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded" :class="getPriorityClass(task.priority)">
                {{ task.priority }}
              </span>
              <button @click="deleteTask(task.id)" class="text-[#908fa0] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>

            <h4 class="text-xs font-semibold text-white leading-snug">{{ task.title }}</h4>
            <p v-if="task.description" class="text-[11px] text-[#908fa0] line-clamp-2">{{ task.description }}</p>

            <div class="pt-2 border-t border-[#232a3a] flex items-center justify-between text-[10px] text-[#908fa0]">
              <span class="truncate max-w-[120px]">{{ task.project?.name || 'Project' }}</span>
              <!-- Status Movement Quick Action -->
              <select
                :value="task.status"
                class="bg-[#141b2b] text-[#4cd7f6] text-[10px] rounded px-1.5 py-0.5 border border-[#232a3a] focus:outline-none"
                @change="changeTaskStatus(task.id, ($event.target as HTMLSelectElement).value as TaskStatus)"
              >
                <option value="TODO">Move: TODO</option>
                <option value="IN_PROGRESS">Move: IN_PROGRESS</option>
                <option value="IN_REVIEW">Move: IN_REVIEW</option>
                <option value="DONE">Move: DONE</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Task Modal -->
    <div v-if="isCreateTaskModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div class="w-full max-w-lg bg-[#141b2b] border border-[#232a3a] rounded-2xl p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-bold text-white">Create New Task</h3>
        <form @submit.prevent="handleCreateTask" class="space-y-3">
          <div>
            <label class="block text-xs text-[#c7c4d7] mb-1">Target Project *</label>
            <select
              v-model="newTask.projectId"
              required
              class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a]"
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
              class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a]"
            />
          </div>

          <div>
            <label class="block text-xs text-[#c7c4d7] mb-1">Description</label>
            <textarea
              v-model="newTask.description"
              rows="2"
              placeholder="Technical requirement summary..."
              class="w-full p-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a]"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-[#c7c4d7] mb-1">Initial Column</label>
              <select v-model="newTask.status" class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a]">
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-[#c7c4d7] mb-1">Priority</label>
              <select v-model="newTask.priority" class="w-full h-10 px-3 bg-[#070e1d] text-white text-xs rounded-lg border border-[#232a3a]">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-[#232a3a]">
            <button type="button" @click="isCreateTaskModalOpen = false" class="text-xs text-[#c7c4d7]">Cancel</button>
            <button type="submit" class="px-5 py-2 bg-[#8083ff] text-white text-xs font-semibold rounded-lg">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

const loadProjects = async () => {
  try {
    const res = await projectService.getProjects({ limit: 100 });
    projects.value = res.data;
    if (!selectedProjectId.value && projects.value.length) {
      newTask.value.projectId = projects.value[0].id;
    }
  } catch (err) {
    console.error(err);
  }
};

const loadTasks = async () => {
  try {
    if (selectedProjectId.value) {
      const res = await taskService.getTasksByProject(selectedProjectId.value, { limit: 100 });
      tasks.value = res.data;
    } else {
      // Fetch tasks across projects by querying first project or handling list
      if (projects.value.length) {
        const res = await taskService.getTasksByProject(projects.value[0].id, { limit: 100 });
        tasks.value = res.data;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const getTasksByStatus = (status: TaskStatus) => {
  return tasks.value.filter((t) => t.status === status);
};

const changeTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  try {
    await taskService.updateTaskStatus(taskId, newStatus);
    loadTasks();
  } catch (err) {
    alert('Failed to update task status');
  }
};

const handleCreateTask = async () => {
  if (!newTask.value.projectId || !newTask.value.title.trim()) return;
  try {
    await taskService.createTask(newTask.value.projectId, {
      title: newTask.value.title,
      description: newTask.value.description,
      status: newTask.value.status,
      priority: newTask.value.priority,
    });
    isCreateTaskModalOpen.value = false;
    newTask.value.title = '';
    newTask.value.description = '';
    loadTasks();
  } catch (err) {
    alert('Failed to create task');
  }
};

const deleteTask = async (taskId: string) => {
  if (!confirm('Delete task?')) return;
  try {
    await taskService.deleteTask(taskId);
    loadTasks();
  } catch (err) {
    alert('Failed to delete task');
  }
};

onMounted(async () => {
  await loadProjects();
  loadTasks();
});

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'URGENT': return 'bg-red-950 text-red-400';
    case 'HIGH': return 'bg-orange-950 text-orange-400';
    case 'MEDIUM': return 'bg-[#191f2f] text-[#4cd7f6]';
    default: return 'bg-[#191f2f] text-[#908fa0]';
  }
};
</script>
