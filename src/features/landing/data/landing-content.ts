import { BookOpenCheck, Droplets, LockKeyhole, Search, Utensils, Weight } from "lucide-react"

export const metrics = [
  { label: "Calories today", value: "1,847", unit: "kcal" },
  { label: "Protein tracked", value: "142", unit: "g" },
  { label: "Water logged", value: "2.1", unit: "L" },
  { label: "Latest weight", value: "92.4", unit: "kg" },
]

export const features = [
  { title: "Simple meal logging", description: "Record meals and their foods in a focused flow built for everyday use.", icon: Utensils },
  { title: "Practical food search", description: "Search Open Food Facts or create private foods that belong only to your account.", icon: Search },
  { title: "Focused daily summaries", description: "Review calories, protein, carbohydrates and fat from the meals you recorded.", icon: BookOpenCheck },
  { title: "Hydration tracking", description: "Log water throughout the day and see your daily total in one place.", icon: Droplets },
  { title: "Weight history", description: "Keep a clear, dated record of your measurements and review how they change.", icon: Weight },
  { title: "Private account and user-owned data", description: "Secure authentication and account-level ownership keep each person’s records separate.", icon: LockKeyhole },
]

export const steps = [
  { title: "Create your account", description: "Register securely, complete your profile and choose the units and appearance you prefer." },
  { title: "Log food and habits", description: "Add meals, find foods, record water and save weight measurements as your day unfolds." },
  { title: "Review the day", description: "See your recorded calories, macros, meals, hydration and latest weight from a clear dashboard." },
]

export const audiences = [
  { title: "People losing weight", description: "Build an honest record of meals and daily habits to support informed personal choices." },
  { title: "People supporting muscle gain", description: "Keep protein, carbohydrates, fat and total calories easy to review each day." },
  { title: "People building healthier eating habits", description: "Make food, water and weight tracking a simple, repeatable part of everyday life." },
]
