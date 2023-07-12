import { AxiosError } from "axios"
import { toast } from "react-hot-toast"

type Callback<T> = (values: T) => Promise<void> | void
type Options = {
  success?: string
  error?: string
}
export const trySubmit =
  <T>(callback: Callback<T>, opt?: Options) =>
  async (values: T) => {
    const toastId = toast.loading("Loading...")
    try {
      await callback(values)
      toast.success(opt?.success || "Success.", { id: toastId })
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError)
        toast.error(opt?.error || error.response?.data || error.message, { id: toastId })
      else if (error instanceof Error) toast.error(opt?.error || error.message, { id: toastId })
      else if (typeof error == "string") toast.error(error, { id: toastId })
      else toast.error("Something went wrong.", { id: toastId })
    }
  }
