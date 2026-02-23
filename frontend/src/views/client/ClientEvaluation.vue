<template>
  <div class="min-h-screen bg-slate-50 px-4 py-8">
    <div class="mx-auto w-full max-w-3xl">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-slate-900">Client Service Evaluation</h1>
        <p class="mt-2 text-sm text-slate-600">
          We value your feedback! Please take a moment to evaluate the service you received from DICT.
        </p>
      </div>

      <div class="bg-white rounded-3xl shadow-xl p-8">
        <form class="space-y-8" @submit.prevent="submitEvaluation">
          <div v-if="client" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div class="text-sm font-semibold text-slate-800">Client</div>
            <div class="mt-1 text-sm text-slate-700">
              <span class="font-medium">Name:</span>
              <span class="ml-2">{{ client.fullName }}</span>
            </div>
            <div class="mt-1 text-sm text-slate-700" v-if="client.age !== undefined && client.age !== null">
              <span class="font-medium">Age:</span>
              <span class="ml-2">{{ client.age }}</span>
            </div>
          </div>

          <div v-else-if="loadingClient" class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Loading client info...
          </div>

          <div v-else-if="logbookLoadError" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {{ logbookLoadError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">1. Service availed</label>
            <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div v-if="form.servicesAvailed.length > 0" class="flex flex-wrap gap-2">
                <span
                  v-for="svc in form.servicesAvailed"
                  :key="svc"
                  class="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1 text-sm text-slate-700"
                >
                  {{ svc }}
                </span>
              </div>
              <div v-else class="text-sm text-slate-600">
                Unable to load service information from the logbook.
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">2. How would you rate your overall experience?</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label v-for="opt in overallExperienceOptions" :key="opt" class="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
                <input class="h-4 w-4" type="radio" name="overallExperience" :value="opt" v-model="form.overallExperience" />
                <span class="text-sm text-slate-700">{{ opt }}</span>
              </label>
            </div>
            <p v-if="validationErrors.overallExperience" class="text-red-500 text-xs mt-1">{{ validationErrors.overallExperience }}</p>
          </div>

          <div>
            <div class="text-sm font-medium text-slate-700">3. How satisfied are you with the following?</div>
            <div class="text-xs text-slate-500 mt-1">Rate from 1 (Very Dissatisfied) to 5 (Very Satisfied)</div>

            <div class="mt-4 space-y-5">
              <div v-for="q in satisfactionQuestions" :key="q.key">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div class="text-sm text-slate-700">{{ q.label }}</div>
                  <div class="flex items-center gap-1">
                    <button
                      v-for="n in 5"
                      :key="n"
                      type="button"
                      class="p-1 rounded hover:bg-slate-100 transition"
                      @click="setSatisfactionRating(q.key, n)"
                      :aria-label="'Rate ' + n + ' out of 5'"
                      :aria-pressed="form.satisfaction[q.key] === n"
                    >
                      <svg
                        class="h-7 w-7"
                        viewBox="0 0 20 20"
                        :fill="n <= form.satisfaction[q.key] ? '#f59e0b' : 'none'"
                        :stroke="n <= form.satisfaction[q.key] ? '#f59e0b' : '#94a3b8'"
                        stroke-width="1.5"
                      >
                        <path
                          stroke-linejoin="round"
                          d="M10 1.6l2.66 5.39 5.95.86-4.31 4.2 1.02 5.92L10 15.19 4.68 17.97l1.02-5.92-4.31-4.2 5.95-.86L10 1.6z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p v-if="validationErrors[q.key]" class="text-red-500 text-xs mt-1">{{ validationErrors[q.key] }}</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">4. Was your concern resolved?</label>
            <div class="flex flex-wrap gap-3">
              <label v-for="opt in concernResolvedOptions" :key="opt" class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
                <input class="h-4 w-4" type="radio" name="concernResolved" :value="opt" v-model="form.concernResolved" />
                <span class="text-sm text-slate-700">{{ opt }}</span>
              </label>
            </div>
            <p v-if="validationErrors.concernResolved" class="text-red-500 text-xs mt-1">{{ validationErrors.concernResolved }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">5. How can we improve our service?</label>
            <textarea
              v-model.trim="form.improvements"
              rows="5"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-300"
              placeholder="Your suggestions..."
            />
          </div>

          <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded">
            <p class="font-semibold">✕ Submission failed</p>
            <p class="text-sm mt-1">{{ errorMessage }}</p>
          </div>

          <div v-if="success" class="bg-green-100 border-l-4 border-green-600 text-green-700 p-4 rounded">
            <p class="font-semibold">✓ Thank you! Evaluation submitted successfully.</p>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Submitting...' : 'Submit Evaluation' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createClientEvaluation } from '../../services/evaluation'
import { getClientLogbookEntryById } from '../../services/logbook'

const route = useRoute()
const router = useRouter()

const logbookIdRef = ref('')
const servicesFromStorageRef = ref<string[]>([])

const readNavigationContext = () => {
  const qLogbookId = String(route.query.logbookId || '')
  if (qLogbookId) {
    logbookIdRef.value = qLogbookId
    return
  }

  try {
    const storedId = sessionStorage.getItem('evaluation_logbookId')
    const storedServicesRaw = sessionStorage.getItem('evaluation_services')

    if (storedId) logbookIdRef.value = storedId
    if (storedServicesRaw) {
      const parsed = JSON.parse(storedServicesRaw)
      servicesFromStorageRef.value = Array.isArray(parsed) ? parsed : []
    }

    sessionStorage.removeItem('evaluation_logbookId')
    sessionStorage.removeItem('evaluation_services')
  } catch (_) {
    // ignore
  }
}

const logbookId = computed(() => logbookIdRef.value)

const submitting = ref(false)
const errorMessage = ref('')
const success = ref(false)

const loadingClient = ref(false)
const client = ref<any>(null)
const logbookLoadError = ref('')

const overallExperienceOptions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor']
const concernResolvedOptions = ['Yes', 'No', 'Partially']

const satisfactionQuestions = [
  { key: 'staffAssistance', label: 'Staff assistance and professionalism' },
  { key: 'speedOfService', label: 'Speed of service' },
  { key: 'clarityOfInstructions', label: 'Clarity of instructions given' },
  { key: 'qualityOfService', label: 'Quality of the service provided' },
  { key: 'overallCustomerExperience', label: 'Overall customer experience' },
] as const

const form = reactive({
  servicesAvailed: ([] as string[]),
  overallExperience: '',
  satisfaction: {
    staffAssistance: 0,
    speedOfService: 0,
    clarityOfInstructions: 0,
    qualityOfService: 0,
    overallCustomerExperience: 0
  },
  concernResolved: '',
  improvements: ''
})

const hydrateFromLogbook = async () => {
  logbookLoadError.value = ''
  client.value = null

  if (!logbookId.value) {
    logbookLoadError.value = 'Logbook reference is missing. Please go back and submit the logbook first.'
    return
  }

  loadingClient.value = true
  try {
    const entry = await getClientLogbookEntryById(logbookId.value)
    if (!entry) {
      logbookLoadError.value = 'Unable to load logbook information. If this keeps happening, Firestore read permissions may be blocked.'
      return
    }

    const entryAny: any = entry
    client.value = entryAny
    const services = Array.isArray(entryAny?.servicesAvailed)
      ? entryAny.servicesAvailed
      : (entryAny?.serviceAvailed ? [entryAny.serviceAvailed] : [])

    if (services.length > 0) {
      form.servicesAvailed = services
    }
  } catch (e) {
    client.value = null
    logbookLoadError.value = 'Unable to load logbook information. If this keeps happening, Firestore read permissions may be blocked.'
  } finally {
    loadingClient.value = false
  }
}

onMounted(() => {
  readNavigationContext()
  if (servicesFromStorageRef.value.length > 0) {
    form.servicesAvailed = servicesFromStorageRef.value
  }
  hydrateFromLogbook()
})
watch(
  () => route.query.logbookId,
  () => {
    readNavigationContext()
    hydrateFromLogbook()
  }
)

const validationErrors = reactive<Record<string, string>>({})

const setSatisfactionRating = (
  key: keyof typeof form.satisfaction,
  rating: number
) => {
  form.satisfaction[key] = rating
  if (validationErrors[key]) {
    delete validationErrors[key]
  }
}

const validate = () => {
  Object.keys(validationErrors).forEach((k) => delete validationErrors[k])

  const requireRating = (key: string, value: number) => {
    if (!value || value < 1 || value > 5) validationErrors[key] = 'Please select a rating (1-5).'
  }

  if (!form.overallExperience) validationErrors.overallExperience = 'Please select an option.'

  requireRating('staffAssistance', form.satisfaction.staffAssistance)
  requireRating('speedOfService', form.satisfaction.speedOfService)
  requireRating('clarityOfInstructions', form.satisfaction.clarityOfInstructions)
  requireRating('qualityOfService', form.satisfaction.qualityOfService)
  requireRating('overallCustomerExperience', form.satisfaction.overallCustomerExperience)

  if (!form.concernResolved) validationErrors.concernResolved = 'Please select an option.'

  return Object.keys(validationErrors).length === 0
}
    
const submitEvaluation = async () => {
  errorMessage.value = ''
  success.value = false

  if (!validate()) return

  try {
    submitting.value = true
    await createClientEvaluation({
      logbookId: logbookId.value || null,
      clientInfo: {
        fullName: client.value?.fullName || null,
        age: client.value?.age ?? null,
        gender: client.value?.gender || null,
        contactNumber: client.value?.contactNumber || null,
        emailAddress: client.value?.emailAddress || null,
        city: client.value?.city || null,
        barangay: client.value?.barangay || null,
        address: client.value?.address || null,
      },
      servicesAvailed: form.servicesAvailed,
      overallExperience: form.overallExperience,
      satisfaction: {
        staffAssistance: form.satisfaction.staffAssistance,
        speedOfService: form.satisfaction.speedOfService,
        clarityOfInstructions: form.satisfaction.clarityOfInstructions,
        qualityOfService: form.satisfaction.qualityOfService,
        overallCustomerExperience: form.satisfaction.overallCustomerExperience
      },
      concernResolved: form.concernResolved,
      improvements: form.improvements
    })

    success.value = true
    setTimeout(() => {
      router.push('/client/logbook')
    }, 1200)
  } catch (e: any) {
    const code = e?.code ? ` (${e.code})` : ''
    errorMessage.value = (e?.message ? `${e.message}${code}` : '') || `Failed to save evaluation to Firestore.${code}`
  } finally {
    submitting.value = false
  }
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

