<template>
  <div class="min-h-screen flex items-center justify-center bg-white-900 px-4 py-8">
    <div
      class="mx-auto w-full"
      style="max-width: 1340px; aspect-ratio: 5 / 3; height: min(800px, 100vh - 2rem);"
    >
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">NEW DICT ORMIN LOGBOOK</h1>
        <p class="text-sm text-gray-600">Department of Information and Communications Technology</p>
      </div>

      <!-- Main Form Card -->
      <div class="w-full h-full bg-white rounded-3xl shadow-xl p-8 overflow-auto">
        <form @submit.prevent="submitForm" class="space-y-6">
          
          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              placeholder="Enter your full name"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
            />
            <p v-if="validationErrors.fullName" class="text-red-500 text-xs mt-1">{{ validationErrors.fullName }}</p>
          </div>

          <!-- Age and Gender Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="age" class="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                id="age"
                v-model="form.age"
                type="number"
                placeholder="Enter age"
                min="1"
                max="150"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
              />
              <p v-if="validationErrors.age" class="text-red-500 text-xs mt-1">{{ validationErrors.age }}</p>
            </div>

            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                id="gender"
                v-model="form.gender"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">LGBTQIA+</option>
              </select>
              <p v-if="validationErrors.gender" class="text-red-500 text-xs mt-1">{{ validationErrors.gender }}</p>
            </div>
          </div>

          <!-- Mobile Number and Email Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="mobileNumber" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="mobileNumber"
                v-model="form.mobileNumber"
                type="tel"
                placeholder="+63 912 345 6789"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
              />
             
              <p v-if="validationErrors.mobileNumber" class="text-red-500 text-xs mt-1">{{ validationErrors.mobileNumber }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition placeholder-gray-400"
              />
              <p v-if="validationErrors.email" class="text-red-500 text-xs mt-1">{{ validationErrors.email }}</p>
            </div>
          </div>

          <!-- City and Barangay Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <select
                id="city"
                v-model="form.city"
                @change="form.barangay = ''"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
              >
                <option value="">Select city/municipality</option>
                <option value="Baco">Baco</option>
                <option value="Bansud">Bansud</option>
                <option value="Bongabong">Bongabong</option>
                <option value="Bulalacao">Bulalacao</option>
                <option value="Calapan City">Calapan City</option>
                <option value="Gloria">Gloria</option>
                <option value="Mansalay">Mansalay</option>
                <option value="Naujan">Naujan</option>
                <option value="Pinamalayan">Pinamalayan</option>
                <option value="Pola">Pola</option>
                <option value="Puerto Galera">Puerto Galera</option>
                <option value="San Teodoro">San Teodoro</option>
                <option value="Socorro">Socorro</option>
                <option value="Victoria">Victoria</option>
              </select>
              <p v-if="validationErrors.city" class="text-red-500 text-xs mt-1">{{ validationErrors.city }}</p>
            </div>

            <div>
              <label for="barangay" class="block text-sm font-medium text-gray-700 mb-2">
                Barangay
              </label>
              <select
                id="barangay"
                v-model="form.barangay"
                :disabled="!form.city"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700"
              >
                <option value="">Select barangay</option>
                <option v-for="barangay in availableBarangays" :key="barangay" :value="barangay">
                  {{ barangay }}
                </option>
              </select>
              <p v-if="validationErrors.barangay" class="text-red-500 text-xs mt-1">{{ validationErrors.barangay }}</p>
            </div>
          </div>

          <!-- Service Selection -->
          <div>
            <label for="service" class="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                v-for="opt in serviceOptions"
                :key="opt"
                class="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
              >
                <input
                  v-model="form.services"
                  type="checkbox"
                  class="h-4 w-4"
                  :value="opt"
                />
                <span class="text-sm text-gray-700">{{ opt }}</span>
              </label>
            </div>
            <p v-if="validationErrors.service" class="text-red-500 text-xs mt-1">{{ validationErrors.service }}</p>
          </div>

          <!-- Sector -->
          <div>
            <label for="sector" class="block text-sm font-medium text-gray-700 mb-2">
              Sector
            </label>
            <select
              id="sector"
              v-model="form.sector"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition text-gray-700"
            >
              <option value="">Select sector</option>
              <option value="Person with disability (PWD)">Person with disability (PWD)</option>
              <option value="Senior Citizen">Senior Citizen</option>
              <option value="Women">Women</option>
              <option value="Out-Of-School Youth and Adults (OSYA)">Out-Of-School Youth and Adults (OSYA)</option>
              <option value="Overseas Filipino Workers (OFW)">Overseas Filipino Workers (OFW)</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="MSME's">MSME's</option>
              <option value="Indigenous People">Indigenous People</option>
              <option value="Government Workers - Local">Government Workers - Local</option>
              <option value="Government Workers - National">Government Workers - National</option>
              <option value="Other">Other</option>
            </select>
            <p v-if="validationErrors.sector" class="text-red-500 text-xs mt-1">{{ validationErrors.sector }}</p>
          </div>

          <!-- Data Privacy -->
          <div class="flex items-start gap-3 pt-4">
            <input
              id="dataPrivacy"
              v-model="form.dataPrivacy"
              type="checkbox"
              class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer accent-blue-600"
            />
            <label for="dataPrivacy" class="text-sm text-gray-700 cursor-pointer">
              In compliance with the
              <button
                type="button"
                class="text-blue-600 font-semibold hover:underline"
                @click.stop="showDataPrivacyModal = true"
              >
                Data Privacy Act of 2012 (RA 10173)
              </button>
              by providing your personal information in this form, you voluntarily authorize DICT to collect, process, and store your data for official documentation, service monitoring, reporting, and related government transactions. All information collected will be treated with strict confidentiality and will only be used for legitimate purposes in connection with the services you availed. Your data will not be shared with unauthorized parties and will be protected in accordance with applicable data privacy and security regulations.
            </label>
          </div>
          <p v-if="validationErrors.dataPrivacy" class="text-red-500 text-xs mt-2">{{ validationErrors.dataPrivacy }}</p>

          <!-- Agreement Confirmation -->
          <div>
           
            <div class="flex flex-col sm:flex-row gap-3">
              <label class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50">
                <input class="h-4 w-4" type="radio" name="agreement" value="yes" v-model="form.agreementConfirmation" />
                <span class="text-sm text-gray-700">I confirm that I have read, understood, and agreed to the Data Privacy Agreement stated above.</span>
              </label>
            </div>
            <p v-if="validationErrors.agreementConfirmation" class="text-red-500 text-xs mt-2">{{ validationErrors.agreementConfirmation }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-6">
            <button
              type="submit"
              :disabled="!isFormComplete || submitting"
              class="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mt-6 bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded"
        >
          <p class="font-semibold">✕ Submission failed</p>
          <p class="text-sm mt-1">{{ errorMessage }}</p>
        </div>

        <!-- Success Message -->
        <div
          v-if="showSuccess"
          class="mt-6 bg-green-100 border-l-4 border-green-600 text-green-700 p-4 rounded"
        >
          <p class="font-semibold">✓ Information submitted successfully!</p>
        </div>
      </div>
    </div>

    <!-- Data Privacy Modal -->
    <Transition name="fade">
      <div v-if="showDataPrivacyModal" class="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto pointer-events-auto">
          <!-- Modal Header with Close Button -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sticky top-0 flex items-center justify-between">
            <h3 class="text-2xl font-bold">Data Privacy Act of 2012 (RA 10173)</h3>
            <button
              @click="showDataPrivacyModal = false"
              class="text-white hover:bg-blue-800 rounded-lg p-1 transition"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->

          <div class="p-6 space-y-4 text-gray-700">
            <div>
            <h4 class="font-bold text-blue-900 mb-2">Privacy Notice</h4>
              <p class="text-sm leading-relaxed">
                In compliance with Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012,
                the Department of Information and Communications Technology (DICT) Oriental Mindoro is committed to
                protecting your personal data and upholding your right to privacy. All personal information
                collected through this Client Log Book system shall be processed in a lawful, fair, and
                transparent manner.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-blue-900 mb-2">Collection of Personal Information</h4>
              <p class="text-sm leading-relaxed">
                The system collects personal data including your full name, age, gender, contact number,
                email address, city, barangay, and details of the services you availed. The collection
                of such information is necessary to properly document client transactions, monitor
                service utilization, and generate official reports required for government operations.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-blue-900 mb-2">Purpose and Legal Basis of Processing</h4>
              <p class="text-sm leading-relaxed">
                Your personal data is processed for legitimate government purposes including service
                facilitation, client profiling, internal record-keeping, performance evaluation, and
                improvement of public service delivery. Processing is based on your voluntary consent
                and in accordance with applicable laws and regulations.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-blue-900 mb-2">Data Protection and Security Measures</h4>
              <p class="text-sm leading-relaxed">
                DICT Oriental Mindoro implements appropriate organizational, physical, and technical safeguards to ensure
                the confidentiality, integrity, and availability of your personal data. Access to the
                information is limited only to authorized personnel. Measures are in place to protect
                against unauthorized access, disclosure, alteration, or destruction of data.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-blue-900 mb-2">Data Sharing and Retention</h4>
              <p class="text-sm leading-relaxed">
                Personal data shall not be disclosed to unauthorized third parties. Information may only
                be shared when required by law, by authorized government agencies, or as necessary for
                official reporting. Data will be retained only for as long as necessary to fulfill the
                stated purposes and in accordance with government record-keeping policies.
              </p>
            </div>

            <div>
              <h4 class="font-bold text-blue-900 mb-2">Rights of the Data Subject</h4>
              <p class="text-sm leading-relaxed">
                As a data subject, you have the right to be informed, to access, to correct inaccurate
                information, to object to processing, to request erasure or blocking of your data,
                and to file a complaint with the National Privacy Commission in case of violation of
                your data privacy rights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createClientLogbookEntry } from '../../services/logbook'

const form = ref({
  fullName: '',
  age: '',
  gender: '',
  mobileNumber: '',
  email: '',
  city: '',
  barangay: '',
  sector: '',
  services: [] as string[],
  dataPrivacy: false,
  agreementConfirmation: '' as '' | 'yes' | 'no',
})

const showDataPrivacyModal = ref(false)
const showSuccess = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const validationErrors = ref<Record<string, string>>({})

const router = useRouter()

const serviceOptions = [
  'Free Public Wi-Fi',
  'Training',
  'Inquiry',
  'Coordination',
  'Free Printing',
  'Free Scanning',
  'Free ICT Equipment Usage',
  'SIM Card Registration Assistance',
  'eGov PH App Assistance',
  'Co-Working Space',
  'Examination',
  'Online Government Services (NBI, DFA, PSA etc.)',
]

const barangayData = {
  'Baco': ['Alag', 'Bangkatan', 'Baras', 'Bayanan', 'Burbuli', 'Catwiran I', 'Catwiran II', 'Dulangan I', 'Dulangan II', 'Lantuyang', 'Lumangbayan', 'Malapad', 'Mangangan I', 'Mangangan II', 'Mayabig', 'Pambisan', 'Poblacion', 'Pulantubig', 'Putican-Cabulo', 'San Andres', 'San Ignacio', 'Santa Cruz', 'Santa Rosa I', 'Santa Rosa II', 'Tabon-Tabon', 'Tagumpay', 'Water'],
  'Bansud': ['Alcadesma', 'Bato', 'Conrazon', 'Malo', 'Manihala', 'Pag-asa', 'Poblacion', 'Proper Bansud', 'Proper Tiguisan', 'Rosacara', 'Salcedo', 'Sumagui', 'Villa Pag-asa'],
  'Bongabong': ['Anilao', 'Aplaya', 'Bagong Bayan I', 'Bagong Bayan II', 'Batangan', 'Bukal', 'Camantigue', 'Carmundo', 'Cawayan', 'Dayhagan', 'Formon', 'Hagan', 'Hagupit', 'Ipil', 'Kaligtasan', 'Labasan', 'Labonan', 'Libertad', 'Lisap', 'Luna', 'Malitbog', 'Mapang', 'Masaguisi', 'Mina de Oro', 'Morente', 'Ogbot', 'Orconuma', 'Poblacion', 'Pulosahi', 'Sagana', 'San Isidro', 'San Jose', 'San Juan', 'Sigange', 'Sta. Cruz', 'Tawas'],
  'Bulalacao': ['Bagong Sikat', 'Balatasan', 'Benli', 'Cabugao', 'Cambunang', 'Campaasan', 'Liwagao', 'Maasin', 'Maujao', 'Milagrosa', 'Nasukob', 'Poblacion', 'San Francisco', 'San Isidro', 'San Juan', 'San Roque'],
  'Calapan City': ['Balingayan', 'Balite', 'Baruyan', 'Batino', 'Bayanan I', 'Bayanan II', 'Biga', 'Bondoc', 'Bucayao', 'Buhuan', 'Bulusan', 'Calero', 'Camansihan', 'Camilmil', 'Canubing I', 'Canubing II', 'Comunal', 'Guinobatan', 'Gulod', 'Gutad', 'Ibaba East', 'Ibaba West', 'Ilaya', 'Lalud', 'Lazareto', 'Libis', 'Lumangbayan', 'Mahal Na Pangalan', 'Maidlang', 'Malad', 'Malamig', 'Managpi', 'Masipit', 'Nag-Iba I', 'Nag-Iba II', 'Navotas', 'Pachoca', 'Palhi', 'Panggalaan', 'Parang', 'Patas', 'Personas', 'Putingtubig', 'San Antonio', 'San Raphael (Salong)', 'San Vicente Central', 'San Vicente East', 'San Vicente North', 'San Vicente South', 'San Vicente West', 'Sapul', 'Silonay', 'Sta. Cruz', 'Sta. Isabel', 'Santa Maria Village', 'Santa Rita', 'Santo Niño', 'Suqui', 'Tawagan', 'Tawiran', 'Tibag', 'Wawa'],
  'Gloria': ['Agsalin', 'Agos', 'Alma Villa', 'Andres Bonifacio', 'Balete', 'Banus', 'Banutan', 'Buong Lupa', 'Bulaklakan', 'Gaudencio Antonino', 'Guimbonan', 'Kawit', 'Lucio Laurel', 'Macario Adriatico', 'Malamig', 'Malayong', 'Maligaya', 'Malubay', 'Manguyang', 'Maragooc', 'Mirayan', 'Narra', 'Papandungin', 'San Antonio', 'Santa Maria', 'Santa Theresa', 'Tambong'],
  'Mansalay': ['Balugo', 'B. del Mundo', 'Bonbon', 'Budburan', 'Cabalwa', 'Don Pedro', 'Maliwanag', 'Manaul', 'Panaytayan', 'Poblacion', 'Roma', 'Sta. Brigida', 'Santa Maria', 'Sta. Teresita', 'Villa Celestial', 'Wasig', 'Waygan'],
  'Naujan': ['Poblacion I', 'Poblacion II', 'Poblacion III', 'Adrialuna', 'Andres Ylagan', 'Antipolo', 'Apitong', 'Arangin', 'Aurora', 'Bacungan', 'Bagong Buhay', 'Balite', 'Bancuro', 'Banuton', 'Barcenaga', 'Bayani', 'Buhangin', 'Caburo', 'Concepcion', 'Dao', 'Del Pilar', 'Estrella', 'Evangelista', 'Gamao', 'General Esco', 'Herrera', 'Inarawan', 'Kalinisan', 'Laguna', 'Mabini', 'Magtibay', 'Mahabang Parang', 'Malaya', 'Malinao', 'Malvar', 'Masagana', 'Masaguing', 'Melgar A', 'Melgar B', 'Metolza', 'Montelago', 'Montemayor', 'Motoderazo', 'Mulawin', 'Nag-Iba 1', 'Nag-Iba 2', 'Pagkakaisa', 'Paitan', 'Paniquian', 'Pinagsabangan 1', 'Pinagsabangan 2', 'Piñahan', 'Sampaguita', 'San Agustin 1', 'San Agustin 2', 'San Andres', 'San Antonio', 'San Carlos', 'San Isidro', 'San Jose', 'San Luis', 'San Nicolas', 'San Pedro', 'Sta. Cruz', 'Sta. Isabel', 'Sta. Maria', 'Santiago', 'Sto. Niño', 'Tagumpay', 'Tigkan'],
  'Pinamalayan': ['Anoling', 'Bacungan', 'Bangbang', 'Banilad', 'Buli', 'Cacawan', 'Calingag', 'Delrazon', 'Guinhawa', 'Inclanay', 'Lumambayan', 'Malaya', 'Maliancog', 'Maningcol', 'Marayos', 'Marfrancisco', 'Nabuslot', 'Pagalagala', 'Palayan', 'Pambisan Malaki', 'Pambisan Maliit', 'Pangao', 'Papag', 'Parang', 'Poblacion', 'Putinggapi', 'San Isidro', 'San Pedro', 'Santo Nino', 'Tabionan', 'Talabaan', 'Tanauan', 'Tarawa', 'Tumapon', 'Villa Maligaya'],
  'Pola': ['Bacawan', 'Bacungan', 'Batuhan', 'Bayanan', 'Beriara', 'Budburan', 'Cabugao Banahaw', 'Dagum', 'Ilaya', 'Labaan', 'Linawahan', 'Mabini', 'Magdugo', 'Manoot', 'Pag-asa', 'Palanas', 'Poblacion', 'San Vicente', 'Song-of-India', 'Sto. Nino', 'Tabora', 'Tarik'],
  'Puerto Galera': ['Aninuan', 'Baclayan', 'Balatero', 'Dulangan', 'Palangan', 'Sabang', 'San Antonio', 'San Isidro', 'Santo Niño', 'Sinandigan', 'Tabinay', 'Villaflor', 'Poblacion'],
  'San Teodoro': ['Zone I', 'Zone II', 'Zone III', 'Zone IV', 'Calao', 'Cawayan', 'Kay-Ibabao', 'Salingcomot'],
  'Socorro': ['Batong Dalig', 'Bayuin', 'Bugtong Na Tuog', 'Calocmoy', 'Calubayan', 'Catiningan', 'Epiz', 'Happy Valley', 'La Fortuna', 'Leuteboro I', 'Leuteboro II', 'Mabuhay I', 'Mabuhay II', 'Malugay', 'Maria Concepcion', 'Matungao', 'Monteverde', 'Pasi I', 'Pasi II', 'Santo Domingo', 'Subaan', 'Villareal', 'Zone I', 'Zone II', 'Zone III', 'Zone IV'],
  'Victoria': ['Alcate', 'Antonino', 'Babangonan', 'Bagong Buhay', 'Bagong Silang', 'Bambanin', 'Bethel', 'Canaan', 'Concepcion', 'Duongan', 'Leido', 'Loyal', 'Mabini', 'Macatoc', 'Malabo', 'Merit', 'Ordovilla', 'Pakyas', 'Poblacion I', 'Poblacion II', 'Poblacion III', 'Poblacion IV', 'Sampaguita', 'San Antonio', 'San Cristobal', 'San Gabriel', 'San Gelacio', 'San Isidro', 'San Juan', 'San Narciso', 'Urdaneta', 'Villa Cerveza'],
}

const availableBarangays = computed(() => {
  return barangayData[form.value.city] || []
})

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length === 11 || cleanPhone.length === 12
}

const validateForm = () => {
  validationErrors.value = {}

  if (!form.value.fullName.trim()) {
    validationErrors.value.fullName = 'Please indicate the correct spelling of your Full Name'
  }

  if (!form.value.age) {
    validationErrors.value.age = 'Age is required'
  } else if (Number(form.value.age) < 1 || Number(form.value.age) > 150) {
    validationErrors.value.age = 'Please enter a valid age'
  }

  if (!form.value.gender) {
    validationErrors.value.gender = 'Gender is required'
  }

  if (!form.value.mobileNumber.trim()) {
    validationErrors.value.mobileNumber = 'Phone number is required'
  } else if (!validatePhoneNumber(form.value.mobileNumber)) {
    validationErrors.value.mobileNumber = 'Enter a valid Philippine mobile number (11 digits)'
  }

  if (!form.value.email.trim()) {
    validationErrors.value.email = 'Email is required'
  } else if (!validateEmail(form.value.email)) {
    validationErrors.value.email = 'Enter a valid email address'
  }

  if (!form.value.city) {
    validationErrors.value.city = 'City is required'
  }

  if (!form.value.barangay) {
    validationErrors.value.barangay = 'Barangay is required'
  }

  if (!form.value.sector) {
    validationErrors.value.sector = 'Sector is required'
  }

  if (!form.value.services || form.value.services.length === 0) {
    validationErrors.value.service = 'Please select at least one service'
  }

  if (!form.value.dataPrivacy) {
    validationErrors.value.dataPrivacy = 'You must agree to the Data Privacy Act to continue'
  }

  if (form.value.agreementConfirmation !== 'yes') {
    validationErrors.value.agreementConfirmation = 'Please confirm that you have read and understood the agreement'
  }

  return Object.keys(validationErrors.value).length === 0
}

const isFormComplete = computed(() => {
  return form.value.fullName.trim() &&
         form.value.age &&
         form.value.gender &&
         form.value.mobileNumber.trim() &&
         form.value.email.trim() &&
         form.value.city &&
         form.value.barangay &&
         form.value.sector &&
         form.value.services.length > 0 &&
         form.value.dataPrivacy &&
         form.value.agreementConfirmation === 'yes' &&
         validateEmail(form.value.email) &&
         validatePhoneNumber(form.value.mobileNumber)
})

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  errorMessage.value = ''
  showSuccess.value = false
  submitting.value = true

  try {
    const id = await createClientLogbookEntry({
      fullName: form.value.fullName,
      age: Number(form.value.age),
      gender: form.value.gender,
      contactNumber: form.value.mobileNumber,
      emailAddress: form.value.email,
      address: `${form.value.barangay}, ${form.value.city}`,
      city: form.value.city,
      barangay: form.value.barangay,
      sector: form.value.sector,
      serviceAvailed: form.value.services,
      dataPrivacyConsent: form.value.dataPrivacy,
      agreementConfirmed: form.value.agreementConfirmation === 'yes',
    })

    try {
      sessionStorage.setItem('evaluation_logbookId', id)
      sessionStorage.setItem('evaluation_services', JSON.stringify(form.value.services || []))
    } catch (_) {
      // ignore
    }

    await router.push({
      path: '/client/evaluation'
    })
  } catch (e: any) {
    console.error('Submission failed:', e)
    errorMessage.value = e?.message || 'Failed to save logbook entry to Firestore.'
  } finally {
    submitting.value = false
  }
}

const clearForm = () => {
  form.value = {
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    email: '',
    city: '',
    barangay: '',
    sector: '',
    services: [],
    dataPrivacy: false,
    agreementConfirmation: '',
  }
  validationErrors.value = {}
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

