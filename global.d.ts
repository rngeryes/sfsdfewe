// src/globals.d.ts
export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        openInvoice: (invoiceLink: string) => void
        onEvent: (event: string, callback: (data: any) => void) => void
        offEvent: (event: string, callback: (data: any) => void) => void
        initDataUnsafe: {
          user: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
          }
        }
      }
    }
  }
}
