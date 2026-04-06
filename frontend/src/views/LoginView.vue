<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
    <div class="flex w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden relative min-h-[600px]">
      
      <!-- Header links (Top right) & Logo (Top left) -->
      <div class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div class="flex items-center gap-2 font-bold text-xl text-blue-600">
          <img src="/DICTlogo1.png" alt="Logo" class="h-8 w-auto object-contain hidden sm:block"/>
          <span class="text-gray-800">DICT</span>
        </div>
        <div class="flex gap-4 text-sm font-medium items-center">
          <router-link to="/" class="text-gray-500 hover:text-blue-600">Log In</router-link>
          <router-link to="/auth/register" class="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition-colors shadow-sm">Sign Up</router-link>
        </div>
      </div>

      <!-- Left Side Illustration -->
      <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gray-50 p-12">
        <!-- Decorative background blur/shapes -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
        
        <!-- Central Circular Graphic area -->
        <div class="relative w-[28rem] h-[28rem] bg-orange-50 rounded-full flex items-center justify-center shadow-sm border border-orange-100 z-10">
          <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://lottie.host/6ad83ae1-839d-473d-98ae-3918a1a36e92/vId07eA74k.json" />
        </div>
      </div>

      <!-- Right Side Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 z-10 pt-24">
        <div class="w-full max-w-md">
          <h1 class="text-4xl font-normal text-gray-900 mb-2">Welcome to <span class="text-red-500 font-medium">DICT</span>!</h1>
          <p class="text-gray-500 mb-8 mt-4 text-sm leading-relaxed">
            To keep connected with us please login with your personal information by username and password.
          </p>

          <form @submit.prevent="handleLogin" class="flex flex-col space-y-5">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input
                type="text"
                id="username"
                v-model="username"
                required
                placeholder="Username"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                placeholder="Password"
                class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
               <button type="submit" class="w-auto px-8 py-3 mt-4 bg-blue-500 text-white font-medium rounded-full cursor-pointer transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                 Login
               </button>
            </div>
          </form>

          <div class="mt-8 text-sm text-gray-500 flex items-center gap-1">
            New here, <router-link to="/auth/register" class="text-blue-500 hover:underline font-medium">Create an account?</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

export default {
  name: 'LoginView',
  components: {
    DotLottieVue
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      console.log('Login attempt started for user:', this.username);
      try {
        console.log('Sending request to backend...');
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        console.log('Response received status:', response.status);

        if (!response.ok) {
          let details = '';
          try {
            const errData = await response.json();
            details = errData?.message ? ` - ${errData.message}` : '';
          } catch {
            // ignore
          }
          throw new Error(`Login failed (${response.status})${details}`);
        }

        const data = await response.json();
        const user = data.user;
        console.log('User data received:', user);

        if (!user || !user.role) {
          console.error('Missing user or role in response');
          throw new Error('Invalid login response');
        }

        console.log('Redirecting based on role:', user.role);
        if (user.role === 'student' || user.role === 'intern') {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('internUser', JSON.stringify(user));
          this.$router.push({ name: 'InternDashboard' });
        } else if (user.role === 'staff') {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('staffUser', JSON.stringify(user));
          this.$router.push({ name: 'StaffDashboard' });
        } else {
          console.error('Unhandled role type:', user.role);
          throw new Error('This login page is only for intern and staff accounts.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert(error?.message || 'Login failed. Please check your credentials.');
      }
    },
  },
};
</script>

<style scoped>
</style>
