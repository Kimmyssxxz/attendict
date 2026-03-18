import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

export async function createAttendanceNote(payload) {
  const notesRef = collection(db, 'intern_attendance_notes')

  const docPayload = {
    internId: payload.internId || null,
    action: payload.action || null, // 'in' or 'out'
    session: payload.session || null,
    note: payload.note || '',
    date: payload.date || null,
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(notesRef, docPayload)
  return docRef.id
}
