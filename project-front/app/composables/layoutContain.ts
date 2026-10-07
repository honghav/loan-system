export type LayoutContainer = {
  layoutContainer: number;
};

// Available layout options
const LAYOUT_OPTIONS: LayoutContainer[] = [
  { layoutContainer: 1 },
  { layoutContainer: 2 },
  { layoutContainer: 3 },
];

export function useLayoutContainer(initialId: number = 1) {
  // Reactive state for the current active layout ID
  const activeLayoutId = ref<number | null>(initialId);

  // Computed getter to directly return the layout object or null
  const currentLayout = computed<LayoutContainer | null>(() => {
    return LAYOUT_OPTIONS.find((item) => item.layoutContainer === activeLayoutId.value) ?? null;
  });

  /**
   * Switches the active layout by ID
   */
  function setLayout(id: number | null): void {
    if (id === null) {
      activeLayoutId.value = null;
      return;
    }

    const exists = LAYOUT_OPTIONS.some((item) => item.layoutContainer === id);
    activeLayoutId.value = exists ? id : null;
  }

  return {
    LAYOUT_OPTIONS,
    activeLayoutId,
    currentLayout,
    setLayout,
  };
}