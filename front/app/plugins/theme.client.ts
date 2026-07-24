// export default defineNuxtPlugin(() => {
//   const colorMode = useColorMode()

//   const saved = localStorage.getItem('theme')

//   if (saved) {
//     colorMode.preference = saved
//   }

//   watch(
//     () => colorMode.preference,
//     (newValue) => {
//       localStorage.setItem('theme', newValue)
//     },
//   )
// })