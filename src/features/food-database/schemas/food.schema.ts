import { z } from "zod"

const requiredNutrition = z
  .number({ error: "Enter a valid number." })
  .finite("Enter a finite number.")
  .min(0, "Value cannot be negative.")

const optionalNutrition = z
    .number({ error: "Enter a valid number." })
    .finite("Enter a finite number.")
    .min(0, "Value cannot be negative.")
    .nullable()

export const foodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Food name must contain at least 2 characters.")
    .max(150, "Food name must contain at most 150 characters.")
    .refine((value) => !/[\u0000-\u001f\u007f]/.test(value), "Food name contains unsupported characters."),
  brand: z.string().trim().max(100, "Brand must contain at most 100 characters."),
  category: z
    .string()
    .trim()
    .min(2, "Category must contain at least 2 characters.")
    .max(80, "Category must contain at most 80 characters."),
  barcode: z
    .string()
    .trim()
    .refine((value) => value === "" || /^[0-9]{8,14}$/.test(value), "Barcode must contain 8 to 14 digits."),
  calories: requiredNutrition.max(900, "Calories cannot exceed 900 per 100 g."),
  protein: requiredNutrition.max(100, "Protein cannot exceed 100 g per 100 g."),
  carbohydrates: requiredNutrition.max(100, "Carbohydrates cannot exceed 100 g per 100 g."),
  fat: requiredNutrition.max(100, "Fat cannot exceed 100 g per 100 g."),
  fiber: optionalNutrition.refine((value) => value === null || value <= 100, "Fiber cannot exceed 100 g per 100 g."),
  sugar: optionalNutrition.refine((value) => value === null || value <= 100, "Sugar cannot exceed 100 g per 100 g."),
  sodium: optionalNutrition.refine((value) => value === null || value <= 100000, "Sodium cannot exceed 100,000 mg per 100 g."),
  servingSize: z.literal(100),
  servingUnit: z.literal("g"),
})

export const foodIdSchema = z.uuid("Invalid food identifier.")

export const foodSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .max(80, "Search must contain at most 80 characters.")
    .regex(/^[\p{L}\p{N} &'\-.]*$/u, "Search contains unsupported characters."),
  category: z.string().trim().max(80).optional(),
  source: z.enum(["all", "system", "custom", "open_food_facts"]).default("all"),
})

export const openFoodFactsResponseSchema = z.object({
  hits: z.array(
    z.object({
      code: z.string().nullish(),
      product_name: z.string().nullish(),
      brands: z.array(z.string()).nullish(),
      categories: z.string().nullish(),
      nutriments: z
        .object({
          "energy-kcal_100g": z.number().finite().optional(),
          proteins_100g: z.number().finite().optional(),
          carbohydrates_100g: z.number().finite().optional(),
          fat_100g: z.number().finite().optional(),
          fiber_100g: z.number().finite().optional(),
          sugars_100g: z.number().finite().optional(),
          sodium_100g: z.number().finite().optional(),
        })
        .nullish(),
    }),
  ),
})

export type ValidatedFoodInput = z.output<typeof foodSchema>
