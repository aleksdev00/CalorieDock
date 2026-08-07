export type ProfileGoal = "weight_loss" | "maintenance" | "weight_gain"
export type UnitSystem = "metric" | "imperial"

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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

