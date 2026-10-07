// // #sym:profileModuleKey - profile sidebar menu; recomputes when locale changes
export const useProfileModuleKey = () => {
    const { t} = useI18n();
    
    return computed(() => {
        // reference `locale.value` so this computed recalculates on locale change
        return [
            {
                key: 'profile_info',
                name: t('profile_info'),
                icon: 'i-lucide-user',
            },
            {
                key: 'address',
                name: t('address'),
                icon: 'i-lucide-map-pin',
            },
            {
                key: 'change_password',
                name: t('change_password'),
                icon: 'i-lucide-lock-keyhole',
            },
            {
                key: 'order',
                name: t('order'),
                icon: 'i-lucide-package',
            },
            {
                key: 'favorite',
                name: t('favorite'),
                icon: 'i-lucide-heart',
            }
        ];
    });
};