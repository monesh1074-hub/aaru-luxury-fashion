import { toast } from "react-hot-toast"

export const Toast = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        borderRadius: "0px",
        background: "#FAF8F5",
        color: "#1A1A1A",
        border: "1px solid #E8E0D6",
        fontSize: "13px",
        fontFamily: "var(--font-dmsans)",
        letterSpacing: "0.05em",
      },
      iconTheme: {
        primary: "#5D8A6A",
        secondary: "#FAF8F5",
      },
    }),
  error: (message: string) =>
    toast.error(message, {
      style: {
        borderRadius: "0px",
        background: "#FAF8F5",
        color: "#1A1A1A",
        border: "1px solid #E8E0D6",
        fontSize: "13px",
        fontFamily: "var(--font-dmsans)",
        letterSpacing: "0.05em",
      },
      iconTheme: {
        primary: "#C0514B",
        secondary: "#FAF8F5",
      },
    }),
  info: (message: string) =>
    toast(message, {
      style: {
        borderRadius: "0px",
        background: "#FAF8F5",
        color: "#1A1A1A",
        border: "1px solid #E8E0D6",
        fontSize: "13px",
        fontFamily: "var(--font-dmsans)",
        letterSpacing: "0.05em",
      },
    }),
}
