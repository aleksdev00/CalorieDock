import { z } from "zod"

export const mealIdSchema = z.uuid("Invalid meal identifier.")
export const mealItemIdSchema = z.uuid("Invalid meal item identifier.")

export const mealSchema = z.object({
  name: z.string().trim().min(2, "Meal name must contain at least 2 characters.").max(100, "Meal name must contain at most 100 characters.").refine((value) => !/[\u0000-\u001f\u007f]/.test(value), "Meal name contains unsupported characters."),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  consumedAt: z.iso.datetime({ local: true, error: "Enter a valid meal date and time." }),
})

export const mealItemSchema = z.object({
  foodReference: z.string().trim().min(1, "Select a food.").max(120, "Invalid food reference."),
  quantityGrams: z.number({ error: "Enter a valid quantity." }).finite().positive("Quantity must be greater than zero.").max(100000, "Quantity is too large."),
})

export const updateMealItemSchema = z.object({
  quantityGrams: mealItemSchema.shape.quantityGrams,
})

export type ValidatedMealInput = z.output<typeof mealSchema>
export type ValidatedMealItemInput = z.output<typeof mealItemSchema>
