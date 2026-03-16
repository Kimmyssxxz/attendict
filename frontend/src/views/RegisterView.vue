<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
    <div class="flex w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden relative max-h-[90vh]">
      
      <!-- Header links (Top right) & Logo (Top left) -->
      <div class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 bg-white/80 backdrop-blur-sm">
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
      <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gray-50 p-12 overflow-hidden">
        <!-- Decorative background blur/shapes -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
        
        <!-- Central Circular Graphic area -->
        <div class="relative w-[28rem] h-[28rem] bg-orange-50 rounded-full flex items-center justify-center shadow-sm border border-orange-100 z-10">
          <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://path-to-lottie.lottie" />
        </div>
      </div>

      <!-- Right Side Form -->
      <div class="w-full lg:w-1/2 flex items-start justify-center p-8 sm:p-12 z-10 pt-28 pb-12 overflow-y-auto">
        <div class="w-full max-w-xl">
          <h1 class="text-3xl font-normal text-gray-900 mb-2">Welcome to <span class="text-red-500 font-medium">DICT</span>!</h1>
          <p class="text-gray-500 mb-8 mt-2 text-sm leading-relaxed">
            To keep connected with us please create an account with your personal information.
          </p>

          <form @submit.prevent="handleRegister" class="flex flex-col space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </span>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Username"
                />
              </div>

              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Email"
                />
              </div>

              <div class="relative">
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="First Name"
                />
              </div>

              <div class="relative">
                <input
                  id="middleName"
                  v-model="form.middleName"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Middle Name (Optional)"
                />
              </div>

              <div class="relative">
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Last Name"
                />
              </div>

              <div class="relative">
                <select
                  id="role"
                  v-model="form.role"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors bg-white text-gray-500"
                >
                  <option disabled value="">Select role</option>
                  <option value="student" class="text-black">Student / Intern</option>
                  <option value="staff" class="text-black">Staff</option>
                </select>
              </div>

              <div class="relative sm:col-span-2">
                <input
                  id="position"
                  v-model="form.position"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Position"
                />
              </div>

              <div class="relative sm:col-span-2">
                <input
                  id="assignedOffice"
                  v-model="form.assignedOffice"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Assigned Office / Company"
                />
              </div>

              <div v-if="form.role === 'student'" class="relative sm:col-span-2">
                <input
                  id="schoolOrUniversity"
                  v-model="form.schoolOrUniversity"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="School / University"
                />
              </div>

              <div v-if="form.role === 'student'" class="relative">
                <input
                  id="ojtRequiredHours"
                  v-model.number="form.ojtRequiredHours"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="OJT Required Hours"
                />
              </div>
              
              <div v-if="form.role === 'student'" class="hidden sm:block"></div> <!-- Empty grid cell for alignment -->

              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Password"
                />
              </div>

              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  type="password"
                  required
                  class="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div>
               <button type="submit" class="w-auto px-8 py-3 mt-4 bg-blue-500 text-white font-medium rounded-full cursor-pointer transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                 Create Account
               </button>
            </div>
          </form>

          <div class="mt-8 text-sm text-gray-500 flex items-center gap-1">
            Already Registers, <router-link to="/" class="text-blue-500 hover:underline font-medium">Sign in?</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

export default {
  name: 'RegisterView',
  components: {
    DotLottieVue
  },
  data() {
    return {
      form: {
        username: '',
        firstName: '',
        email: '',
        middleName: '',
        lastName: '',
        role: '',
        position: '',
        assignedOffice: '',
        schoolOrUniversity: '',
        ojtRequiredHours: null,
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    async handleRegister() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      try {
        const docRef = await addDoc(collection(db, 'users'), {
          username: this.form.username,
          firstName: this.form.firstName,
          email: this.form.email,
          middleName: this.form.middleName,
          lastName: this.form.lastName,
          role: this.form.role,
          position: this.form.position,
          assignedOffice: this.form.assignedOffice,
          schoolOrUniversity: this.form.schoolOrUniversity || '',
          ojtRequiredHours: this.form.ojtRequiredHours ?? null,
          // Default attendance tagging fields so admin table shows Normal Hours
          tagging: 'Normal Hours',
          todayAmTag: 'Normal Hours',
          todayPmTag: 'Normal Hours',
          password: this.form.password
        });

        console.log('Registration saved with ID:', docRef.id);
        alert('Registration successful!');
        // e.g. this.$router.push('/auth/intern/login');
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please check your inputs.');
      }
    }
  }
};
</script>

