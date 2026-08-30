import type { Ref } from "vue";

export interface FileChangeOptions {
  /** Target Vue Ref or state property to set the base64 string to */
  targetRef?: Ref<string> | { value: string };
  /** Maximum file size limit in MB (default: 2) */
  maxSizeMB?: number;
  /** Custom callback when file is converted to base64 */
  onSuccess?: (base64String: string, file: File) => void;
  /** Custom callback on error */
  onError?: (error: string) => void;
}

/**
 * Global file change event handler to validate and convert local files into Base64 strings.
 *
 * Usage examples:
 * 1. Callback mode: onFileChange(event, (base64) => formState.cusImage = base64)
 * 2. Ref target mode: onFileChange(event, cusImageRef)
 * 3. Options mode: onFileChange(event, { onSuccess: (b64) => ..., maxSizeMB: 5 })
 * 4. Async mode: const b64 = await onFileChange(event)
 */
export default function onFileChange(
  e: Event | File,
  targetOrOptions?: Ref<string> | ((base64: string) => void) | FileChangeOptions,
  maxSizeMBParam: number = 2
): Promise<string | null> {
  const file = e instanceof File ? e : (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return Promise.resolve(null);

  let targetRef: Ref<string> | undefined;
  let onSuccess: ((base64: string, file: File) => void) | undefined;
  let onError: ((err: string) => void) | undefined;
  let maxSizeMB = maxSizeMBParam;

  if (targetOrOptions) {
    if (typeof targetOrOptions === "function") {
      onSuccess = targetOrOptions;
    } else if (typeof targetOrOptions === "object" && "value" in targetOrOptions) {
      targetRef = targetOrOptions as Ref<string>;
    } else if (typeof targetOrOptions === "object") {
      targetRef = targetOrOptions.targetRef as Ref<string>;
      onSuccess = targetOrOptions.onSuccess;
      onError = targetOrOptions.onError;
      if (targetOrOptions.maxSizeMB !== undefined) {
        maxSizeMB = targetOrOptions.maxSizeMB;
      }
    }
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    const errorMsg = `Please select an image smaller than ${maxSizeMB}MB.`;
    try {
      const toast = useToast();
      toast.add({
        title: "File Too Large",
        description: errorMsg,
        color: "error",
      });
    } catch {
      console.warn("Toast warning:", errorMsg);
    }
    if (onError) onError(errorMsg);
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = (event.target?.result as string) || "";
      if (targetRef) {
        targetRef.value = base64String;
      }
      if (onSuccess) {
        onSuccess(base64String, file);
      }
      try {
        const toast = useToast();
        toast.add({
          title: "Image Processed",
          description: "Image successfully encoded to Base64 format.",
          color: "success",
        });
      } catch {
        // Ignore if toast unavailable
      }
      resolve(base64String);
    };
    reader.onerror = (error) => {
      console.error("Error reading file: ", error);
      if (onError) onError("Failed to read file.");
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
}