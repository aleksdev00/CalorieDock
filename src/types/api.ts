export interface ApiError {
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
}

export type ActionResult<TData> =
  | {
      success: true
      data: TData
    }
  | {
      success: false
      error: ApiError
    }
