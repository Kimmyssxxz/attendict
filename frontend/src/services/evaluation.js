import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function createClientEvaluation(payload) {
  const evaluationsRef = collection(db, 'client_evaluations')

  const services = Array.isArray(payload.servicesAvailed)
    ? payload.servicesAvailed
    : (payload.serviceAvailed ? [payload.serviceAvailed] : [])

  const docPayload = {
    logbookId: payload.logbookId || null,
    clientInfo: payload.clientInfo || null,
    serviceAvailed: services[0] || null,
    servicesAvailed: services,
    overallExperience: payload.overallExperience,
    satisfaction: {
      staffAssistance: payload.satisfaction?.staffAssistance,
      speedOfService: payload.satisfaction?.speedOfService,
      clarityOfInstructions: payload.satisfaction?.clarityOfInstructions,
      qualityOfService: payload.satisfaction?.qualityOfService,
      overallCustomerExperience: payload.satisfaction?.overallCustomerExperience,
    },
    concernResolved: payload.concernResolved,
    improvements: payload.improvements || '',
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(evaluationsRef, docPayload)
  return docRef.id
}
