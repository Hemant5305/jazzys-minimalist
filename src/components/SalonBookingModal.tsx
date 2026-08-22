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
  { name: "Hair Color & Highlights", duration: "90 min", price: "₹9,499" },
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
      <DialogContent className="max-w-[520px] rounded-[20px] p-0 overflow-hidden">
        {step === "success" ? (
          <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-50">
              <Check className="size-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
            <p className="text-sm text-[#666]">
              We've received your appointment request. We'll confirm your booking
              via email shortly.
            </p>
            <Button
              className="mt-2 rounded-[6px] bg-[#c96b8b] text-white hover:bg-[#b85d7c]"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-lg font-medium">
                {step === "select"
                  ? "Choose a Service"
                  : "Book Your Appointment"}
              </DialogTitle>
            </DialogHeader>

            {step === "select" ? (
              <div className="px-6 pb-6">
                <div className="mt-2 grid gap-2">
                  {SERVICES.map((service) => (
                    <button
                      key={service.name}
                      className={`flex items-center justify-between rounded-[6px] border px-4 py-3 text-left transition-all ${
                        selectedService === service.name
                          ? "border-[#c96b8b] bg-[#c96b8b]/5"
                          : "border-border hover:border-border/80 hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedService(service.name)}
                    >
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-[11px] text-[#666]">
                          {service.duration}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-[#c96b8b]">
                        {service.price}
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  className="mt-4 w-full rounded-[6px] bg-[#c96b8b] text-white hover:bg-[#b85d7c]"
                  disabled={!selectedService}
                  onClick={() => setStep("form")}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="px-6 pb-6">
                <div className="mt-2 flex items-center gap-2 rounded-[6px] bg-muted/50 px-3 py-2">
                  <span className="text-sm font-medium">
                    {selectedService}
                  </span>
                  <button
                    className="ml-auto text-[11px] text-[#c96b8b] hover:underline"
                    onClick={() => setStep("select")}
                  >
                    Change
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-[#666]">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                        className="rounded-[6px]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium text-[#666]">
                        Preferred Time
                      </label>
                      <Input
                        type="time"
                        value={form.time}
                        onChange={(e) =>
                          setForm({ ...form, time: e.target.value })
                        }
                        className="rounded-[6px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-[#666]">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="rounded-[6px]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-[#666]">
                      Additional Notes (optional)
                    </label>
                    <Input
                      placeholder="Any preferences or requests..."
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      className="rounded-[6px]"
                    />
                  </div>
                </div>

                <Button
                  className="mt-4 w-full rounded-[6px] bg-[#c96b8b] text-white hover:bg-[#b85d7c]"
                  disabled={!form.date || !form.time || !form.phone || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : null}
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
