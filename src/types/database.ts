export type ProfileGoal = "weight_loss" | "maintenance" | "weight_gain"
export type UnitSystem = "metric" | "imperial"
export type FoodSource = "system" | "custom" | "open_food_facts"
export type MealType = "breakfast" | "lunch" | "dinner" | "snack"

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          date_of_birth: string | null
          goal: ProfileGoal | null
          unit_system: UnitSystem
          profile_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          date_of_birth?: string | null
          goal?: ProfileGoal | null
          unit_system?: UnitSystem
          profile_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          date_of_birth?: string | null
          goal?: ProfileGoal | null
          unit_system?: UnitSystem
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          id: string
          user_id: string | null
          name: string
          brand: string | null
          category: string
          barcode: string | null
          calories: number
          protein: number
          carbohydrates: number
          fat: number
          fiber: number | null
          sugar: number | null
          sodium: number | null
          serving_size: number
          serving_unit: "g"
          source: FoodSource
          external_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          brand?: string | null
          category: string
          barcode?: string | null
          calories: number
          protein: number
          carbohydrates: number
          fat: number
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          serving_size?: number
          serving_unit?: "g"
          source: FoodSource
          external_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          brand?: string | null
          category?: string
          barcode?: string | null
          calories?: number
          protein?: number
          carbohydrates?: number
          fat?: number
          fiber?: number | null
          sugar?: number | null
          sodium?: number | null
          serving_size?: number
          serving_unit?: "g"
        }
        Relationships: [
          {
            foreignKeyName: "foods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: { id: string; user_id: string; name: string; meal_type: MealType; consumed_at: string; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; name: string; meal_type: MealType; consumed_at: string; created_at?: string; updated_at?: string }
        Update: { name?: string; meal_type?: MealType; consumed_at?: string }
        Relationships: [{ foreignKeyName: "meals_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"] }]
      }
      meal_items: {
        Row: { id: string; meal_id: string; food_id: string | null; food_name: string; food_brand: string | null; food_source: FoodSource; external_id: string | null; quantity_grams: number; calories: number; protein: number; carbohydrates: number; fat: number; created_at: string }
        Insert: { id?: string; meal_id: string; food_id?: string | null; food_name: string; food_brand?: string | null; food_source: FoodSource; external_id?: string | null; quantity_grams: number; calories: number; protein: number; carbohydrates: number; fat: number; created_at?: string }
        Update: { food_id?: string | null; food_name?: string; food_brand?: string | null; food_source?: FoodSource; external_id?: string | null; quantity_grams?: number; calories?: number; protein?: number; carbohydrates?: number; fat?: number }
        Relationships: [
          { foreignKeyName: "meal_items_meal_id_fkey"; columns: ["meal_id"]; isOneToOne: false; referencedRelation: "meals"; referencedColumns: ["id"] },
          { foreignKeyName: "meal_items_food_id_fkey"; columns: ["food_id"]; isOneToOne: false; referencedRelation: "foods"; referencedColumns: ["id"] },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
