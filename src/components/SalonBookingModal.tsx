import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Check, Loader2 } from "lucide-react";

const SERVICES = [
  { name: "Haircut & Styling", duration: "45 min", price: "₹3,499" },
  { name: "Hair Colour & Highlights", duration: "90 min", price: "₹9,499" },
  { name: "Blow Dry & Treatment", duration: "30 min", price: "₹2,799" },
  { name: "Manicure & Pedicure", duration: "60 min", price: "₹4,499" },
  { name: "Facial Treatment", duration: "50 min", price: "₹4,999" },
  { name: "Full Body Massage", duration: "60 min", price: "₹6,499" },
  { name: "Bridal Package", duration: "3 hours", price: "₹19,999" },
  { name: "Express Makeup", duration: "25 min", price: "₹3,199" },
];

export function SalonBookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createBooking = useMutation(api.bookings.createBooking);
  const [step, setStep] = useState<"select" | "form" | "success">("select");
  const [selectedService, setSelectedService] = useState<string>("");
  const [form, setForm] = useState({
    date: "",
    time: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      navigate("/auth?returnTo=/");
      return;
    }
    setIsSubmitting(true);
    try {
      await createBooking({
        userId: user._id,
        userName: user.name ?? "Guest",
        userEmail: user.email ?? "",
        service: selectedService,
        date: form.date,
        time: form.time,
        phone: form.phone,
        notes: form.notes || undefined,
      });
      setStep("success");
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("select");
    setSelectedService("");
    setForm({ date: "", time: "", phone: "", notes: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-[480px] rounded-[18px] p-0 overflow-hidden">
        {step === "success" ? (
          <div className="flex flex-col items-center gap-3 px-8 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-50">
              <Check className="size-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">You're all set!</h3>
            <p className="text-[13px] leading-relaxed text-[#666]">
              We've received your appointment request. You'll get a confirmation
              via email shortly.
            </p>
            <Button
              className="mt-1 rounded-full bg-[#c96b8b] text-[13px] text-white hover:bg-[#b85d7c]"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-5 pt-5">
              <DialogTitle className="text-[15px] font-medium">
                {step === "select"
                  ? "Pick a Service"
                  : "Book Your Appointment"}
              </DialogTitle>
            </DialogHeader>

            {step === "select" ? (
              <div className="px-5 pb-5">
                <div className="mt-2 grid gap-1.5">
                  {SERVICES.map((service) => (
                    <button
                      key={service.name}
                      className={`flex items-center justify-between rounded-[8px] border px-3.5 py-2.5 text-left transition-all ${
                        selectedService === service.name
                          ? "border-[#c96b8b] bg-[#c96b8b]/5"
                          : "border-border hover:border-border/80 hover:bg-muted/30"
                      }`}
                      onClick={() => setSelectedService(service.name)}
                    >
                      <div>
                        <p className="text-[13px] font-medium">
                          {service.name}
                        </p>
                        <p className="text-[10px] text-[#999]">
                          {service.duration}
                        </p>
                      </div>
                      <span className="text-[13px] font-medium text-[#c96b8b]">
                        {service.price}
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  className="mt-3 w-full rounded-full bg-[#c96b8b] text-[13px] text-white hover:bg-[#b85d7c]"
                  disabled={!selectedService}
                  onClick={() => setStep("form")}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="px-5 pb-5">
                <div className="mt-2 flex items-center gap-2 rounded-[8px] bg-muted/40 px-3 py-2">
                  <span className="text-[13px] font-medium">
                    {selectedService}
                  </span>
                  <button
                    className="ml-auto text-[11px] text-[#c96b8b] hover:underline"
                    onClick={() => setStep("select")}
                  >
                    Change
                  </button>
                </div>

                <div className="mt-3 grid gap-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="mb-0.5 block text-[10px] text-[#999]">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                        className="rounded-[8px] text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="mb-0.5 block text-[10px] text-[#999]">
                        Time
                      </label>
                      <Input
                        type="time"
                        value={form.time}
                        onChange={(e) =>
                          setForm({ ...form, time: e.target.value })
                        }
                        className="rounded-[8px] text-[13px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-0.5 block text-[10px] text-[#999]">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="rounded-[8px] text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-[10px] text-[#999]">
                      Notes (optional)
                    </label>
                    <Input
                      placeholder="Any preferences..."
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      className="rounded-[8px] text-[13px]"
                    />
                  </div>
                </div>

                <Button
                  className="mt-3 w-full rounded-full bg-[#c96b8b] text-[13px] text-white hover:bg-[#b85d7c]"
                  disabled={!form.date || !form.time || !form.phone || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  )}
                  {isSubmitting ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
