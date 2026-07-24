import { mapperProfile, type ProfileDTO, type ProfileResponseDTO, type UpdateProfileDTO } from '~/model_dto/profile.dto';
import { getCurrentUserServer, updateUserProfileServer} from '~~/server/authServer'

export const currentUser = ref<ProfileDTO | null>(null);
export const updateLoadingProfile = ref(false)
export async function getProfile(token: string, accLang: string) {
    try{
        const res = await getCurrentUserServer(undefined, token, accLang);
        
        return currentUser.value = mapperProfile(res.data.user);
        
        
    } catch (error) {
        console.error("Error fetching profile:", error)
        throw error
    }
}
export async function updateProfileService(paylod: UpdateProfileDTO , token: string, accLang: string) {
    const { showTaost } = useToastAlert()
    try{
        updateLoadingProfile.value = true
        const res = await updateUserProfileServer(paylod, token, accLang);
        showTaost(
      "Update Profile success",
      "i-lucide-user",
      3000,
    )
        return currentUser.value = mapperProfile(res.data.user);
    } catch (error) {
        updateLoadingProfile.value = true
        updateLoadingProfile.value = true
        console.error("Error fetching profile:", error)
        throw error
    } finally{
        updateLoadingProfile.value = false
        await getProfile(token, accLang)
    }
}

export const userProfile = computed(() => currentUser.value);
