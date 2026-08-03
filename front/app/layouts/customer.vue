<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
    <!-- Top Customer Navbar Header -->
    <header class="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo & Branding -->
    
          <div>
            <h1 class="text-base font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
              Loan System
            </h1>
            <p class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Customer Portal
            </p>
          </div>

        <!-- Right Side Stats / Actions -->
        <div class="flex items-center gap-3 text-xs">
            Dashboard
        </div>
      </div>
    </header>

    <!-- Main Page Content Slot -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 py-6 bg-white dark:bg-neutral-900 text-center text-xs text-neutral-500">
      <div class="max-w-7xl mx-auto px-4">
        &copy; {{ new Date().getFullYear() }} Loan System Customer Portal. All rights reserved.
      </div>
    </footer>
  </div>
</template>