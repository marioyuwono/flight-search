
export interface IAmadeusResponseError {
  description: Array<{
    status: number
    code: number
    title: string
    detail: string
    source: any
  }>
  code: string
}
