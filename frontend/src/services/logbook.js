import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function createClientLogbookEntry(payload) {
  const entriesRef = collection(db, 'client_logbook')

  const services = Array.isArray(payload.serviceAvailed)
    ? payload.serviceAvailed
    : (payload.serviceAvailed ? [payload.serviceAvailed] : [])

  const docPayload = {
    fullName: payload.fullName,
    age: payload.age,
    gender: payload.gender,
    address: payload.address,
    city: payload.city,
    barangay: payload.barangay,
    sector: payload.sector || '',
    contactNumber: payload.contactNumber,
    emailAddress: payload.emailAddress,
    serviceAvailed: services[0] || '',
    servicesAvailed: services,
    dataPrivacyConsent: payload.dataPrivacyConsent,
    agreementConfirmed: payload.agreementConfirmed === true,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(entriesRef, docPayload)
  return docRef.id
}

export async function getClientLogbookEntryById(id) {
  if (!id) return null

  const docRef = doc(db, 'client_logbook', id)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}
