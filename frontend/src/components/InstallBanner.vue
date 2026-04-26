<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform -translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-full opacity-0"
  >
    <div v-if="deferredPrompt" class="fixed top-0 left-0 right-0 z-[9999] p-3 pointer-events-none">
      <div class="max-w-md mx-auto bg-[#133e75] text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between pointer-events-auto border border-blue-400/20 backdrop-blur-md">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
            <img src="/4.png" alt="Attendict Logo" class="w-6 h-6 object-contain" />
          </div>
          <div>
            <h3 class="text-sm font-bold m-0 leading-tight">Install Attendict App</h3>
            <p class="text-[0.7rem] text-blue-100 m-0 mt-0.5">Quick access from your home screen</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="dismiss" 
            class="px-3 py-2 text-xs font-medium text-blue-200 hover:text-white bg-transparent border-none cursor-pointer transition-colors"
          >
            Later
          </button>
          <button 
            @click="install" 
            class="px-4 py-2 bg-[#fec13d] text-[#133e75] text-xs font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'InstallBanner',
  data() {
    return {
      deferredPrompt: null,
    };
  },
  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      console.log('beforeinstallprompt event fired');
    });

    window.addEventListener('appinstalled', () => {
      // Log install to analytics
      console.log('INSTALL: Success');
      this.deferredPrompt = null;
    });
  },
  methods: {
    async install() {
      if (!this.deferredPrompt) return;
      
      // Show the prompt
      this.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      
      // We've used the prompt, and can't use it again, throw it away
      this.deferredPrompt = null;
    },
    dismiss() {
      this.deferredPrompt = null;
    }
  }
};
</script>

<style scoped>
/* Ensure the banner stays above everything */
.fixed {
  isolation: isolate;
}
</style>
