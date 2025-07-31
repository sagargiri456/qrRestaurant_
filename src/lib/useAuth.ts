import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function registerRestaurant(
  name: string,
  email: string,
  password: string,
  category: string
) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

  await setDoc(doc(db, "restaurants", uid), {
    name,
    email,
    category,
    createdAt: new Date().toISOString(),
  });

  return uid;
}

export async function loginRestaurant(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user.uid;
}
