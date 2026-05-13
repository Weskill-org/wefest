/**
 * Razorpay Checkout helper. Loads the script lazily and opens checkout.
 */
declare global {
  interface Window { Razorpay?: any }
}

let scriptLoading: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("client only"));
  if (window.Razorpay) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { scriptLoading = null; reject(new Error("Failed to load Razorpay")); };
    document.head.appendChild(s);
  });
  return scriptLoading;
}

export interface OpenCheckoutOptions {
  keyId: string;
  orderId: string;
  amount: number; // paise
  currency: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess: (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout(opts: OpenCheckoutOptions) {
  await loadRazorpayScript();
  if (!window.Razorpay) throw new Error("Razorpay SDK not available");
  const rzp = new window.Razorpay({
    key: opts.keyId,
    order_id: opts.orderId,
    amount: opts.amount,
    currency: opts.currency,
    name: opts.name,
    description: opts.description,
    prefill: opts.prefill,
    theme: { color: "#7c3aed" },
    handler: opts.onSuccess,
    modal: { ondismiss: opts.onDismiss },
  });
  rzp.open();
}
