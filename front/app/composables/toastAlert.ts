export const useToastAlert = () => {
  const toast = useToast();
  // Messae
  const showTaost = (
    title: string,
    icon: string = "i-lucide-wifi",
    duration = 3000,
    color:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error"
      | "info" = "primary",
  ) => {
    toast.add({
      title,
      icon,
      color,
      duration,
      ui: {
        root: "bg-secondary border-2 border-secondary",
      },
    });
  };

  // Avatar Alert
  const avatarTaost = async (
    title: string,
    description: string,
    avatar?: string,
    path?: string,
    duration = 3000,
    color:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "error"
      | "info" = "primary",
    url?: boolean,
  ) => {
    const { fallbackImage } = useImageError();

    const getAvatarSrc = async () => {
      if (!avatar) return fallbackImage;

      const src = url ? `${url}/${path}/${avatar}` : getImagePath(avatar, path);

      return new Promise<string>((resolve) => {
        const img = new Image();

        img.onload = () => resolve(src);
        img.onerror = () => resolve(fallbackImage);

        img.src = src;
      });
    };

    const avatarSrc = await getAvatarSrc();
    toast.add({
      title,
      avatar: {
        src: String(avatarSrc),
        alt: title,
      },
      description: description,
      duration,
      color,
      ui: {
        root: "bg-secondary border-2 border-secondary",
        avatar: "bg-white",
      },
    });
  };

  return { showTaost, avatarTaost };
};
