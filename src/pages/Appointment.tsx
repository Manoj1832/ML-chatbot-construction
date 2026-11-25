import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { sendAppointmentEmail } from "@/lib/emailjs";
import { sendAppointmentViaWhatsApp } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/config/site";
import { SITE_CONTENT } from "@/data/site-content";
import { BrandIcon } from "@/components/common/BrandIcon";
import { trackEvent } from "@/lib/telemetry";
import {
  appointmentSchema,
  validateWithSchema,
  type AppointmentInput,
  type FieldErrors,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const Appointment = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendMethod, setSendMethod] = useState<"email" | "whatsapp">("whatsapp");
  const [serviceValue, setServiceValue] = useState("");
  const [errors, setErrors] = useState<FieldErrors<AppointmentInput>>({});
  const { appointmentPage } = SITE_CONTENT;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const raw = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      location: String(formData.get("location") ?? ""),
      service: serviceValue || String(formData.get("service") ?? ""),
      date: String(formData.get("date") ?? ""),
      time: String(formData.get("time") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    const validation = validateWithSchema(appointmentSchema, raw);
    if (!validation.success) {
      setErrors(validation.errors);
      trackEvent({
        event: "form_validation_error",
        metadata: { form: "appointment", fields: Object.keys(validation.errors).length },
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      trackEvent({
        event: "form_submit",
        metadata: { form: "appointment", method: sendMethod, service: validation.data.service },
      });

      if (sendMethod === "email") {
        await sendAppointmentEmail(validation.data);
        toast({
          title: "Appointment Request Sent",
          description: "Our engineering team will contact you shortly to confirm.",
        });
        formEl.reset();
        setServiceValue("");
      } else {
        sendAppointmentViaWhatsApp(validation.data);
        toast({
          title: "Opening WhatsApp",
          description: "Continue in WhatsApp to send your appointment request.",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit appointment request. Please try WhatsApp or phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-[#FFFFFF]">
      {/* Header */}
      <section className="py-10 md:py-16 bg-[#F5F5F5] border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">{appointmentPage.eyebrow}</p>
            <h1
              className="font-display font-semibold text-[#111111] mb-3"
              style={{ fontSize: "var(--text-hero)" }}
            >
              {appointmentPage.headline}
            </h1>
            <p className="text-sm md:text-base text-[#444444] leading-relaxed">
              {appointmentPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Form & Details */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <p className="eyebrow mb-1.5">{appointmentPage.panelEyebrow}</p>
                <h2 className="font-display font-semibold text-xl md:text-2xl text-[#111111] mb-2">
                  {appointmentPage.panelTitle}
                </h2>
                <p className="text-sm text-[#444444] leading-relaxed">
                  {appointmentPage.panelDesc}
                </p>
              </div>

              <div className="border-t border-[#EAEAEA] pt-5 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 border border-[#EAEAEA] bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <BrandIcon name="phone" className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#777777] mb-1.5">Phone</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] bg-[#111111] text-[#FFFFFF] hover:bg-[#222222] transition-colors"
                      >
                        Call Primary
                      </a>
                      <a
                        href={`tel:${SITE_CONFIG.contact.secondaryPhoneTel}`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium uppercase tracking-[0.08em] border border-[#EAEAEA] text-[#111111] hover:border-[#111111] transition-colors"
                      >
                        Call Secondary
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 border border-[#EAEAEA] bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <BrandIcon name="contact-mail" className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#777777] mb-0.5">Email</p>
                    <a
                      href={`mailto:${SITE_CONFIG.contact.email}`}
                      className="text-sm font-medium text-[#111111] hover:underline break-all"
                    >
                      {SITE_CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 border border-[#EAEAEA] bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <BrandIcon name="location-pin" className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#777777] mb-0.5">Service Region</p>
                    <p className="text-sm font-medium text-[#111111]">{SITE_CONFIG.contact.officeAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 border border-[#EAEAEA] bg-[#F5F5F5] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#777777] mb-0.5">Hours</p>
                    <p className="text-sm font-medium text-[#111111]">{SITE_CONFIG.contact.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="border border-[#EAEAEA] bg-[#FFFFFF] p-5 md:p-8 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAEAEA] pb-4">
                  <h2 className="font-display font-semibold text-xl text-[#111111]">
                    {appointmentPage.formTitle}
                  </h2>

                  <div className="inline-grid grid-cols-2 border border-[#EAEAEA] shrink-0">
                    <button
                      type="button"
                      onClick={() => setSendMethod("whatsapp")}
                      className={cn(
                        "h-9 px-3 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors",
                        sendMethod === "whatsapp"
                          ? "bg-[#111111] text-[#FFFFFF]"
                          : "bg-[#FFFFFF] text-[#444444] hover:bg-[#F5F5F5]"
                      )}
                    >
                      <BrandIcon name="whatsapp" invert={sendMethod === "whatsapp"} className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendMethod("email")}
                      className={cn(
                        "h-9 px-3 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors border-l border-[#EAEAEA]",
                        sendMethod === "email"
                          ? "bg-[#111111] text-[#FFFFFF]"
                          : "bg-[#FFFFFF] text-[#444444] hover:bg-[#F5F5F5]"
                      )}
                    >
                      <BrandIcon name="contact-mail" invert={sendMethod === "email"} className="w-3.5 h-3.5" />
                      Email
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.name)}
                    className="h-10 rounded-sm"
                  />
                  {errors.name && (
                    <p className="text-xs text-[#111111] font-medium">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">Mobile (10-digit) *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="98765 43210"
                      aria-invalid={Boolean(errors.phone)}
                      className="h-10 rounded-sm"
                    />
                    {errors.phone && (
                      <p className="text-xs text-[#111111] font-medium">{errors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className="h-10 rounded-sm"
                    />
                    {errors.email && (
                      <p className="text-xs text-[#111111] font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="location" className="text-xs">Plot Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., RS Puram, Coimbatore"
                      aria-invalid={Boolean(errors.location)}
                      className="h-10 rounded-sm"
                    />
                    {errors.location && (
                      <p className="text-xs text-[#111111] font-medium">{errors.location}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="service" className="text-xs">Service Required *</Label>
                    <Select name="service" value={serviceValue} onValueChange={setServiceValue}>
                      <SelectTrigger id="service" className="h-10 rounded-sm">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="turnkey">Residential House Construction</SelectItem>
                        <SelectItem value="commercial">Commercial / PEB Construction</SelectItem>
                        <SelectItem value="architectural">Architectural &amp; Vaastu Design</SelectItem>
                        <SelectItem value="structural">Structural Engineering</SelectItem>
                        <SelectItem value="interior">Interior Works</SelectItem>
                        <SelectItem value="approval">DTCP / Plan Approval</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-xs text-[#111111] font-medium">{errors.service}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-xs">Preferred Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      aria-invalid={Boolean(errors.date)}
                      className="h-10 rounded-sm"
                    />
                    {errors.date && (
                      <p className="text-xs text-[#111111] font-medium">{errors.date}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="time" className="text-xs">Preferred Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      aria-invalid={Boolean(errors.time)}
                      className="h-10 rounded-sm"
                    />
                    {errors.time && (
                      <p className="text-xs text-[#111111] font-medium">{errors.time}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs">Plot Brief (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Plot dimensions (e.g., 30x40), facing, or floors..."
                    rows={3}
                    className="rounded-sm"
                  />
                </div>

                <Button type="submit" size="default" className="w-full md:h-11" disabled={isSubmitting}>
                  {sendMethod === "email" ? (
                    <>
                      <BrandIcon name="contact-mail" invert className="w-4 h-4" />
                      {isSubmitting ? "Submitting..." : "Submit via Email"}
                    </>
                  ) : (
                    <>
                      <BrandIcon name="whatsapp" invert className="w-4 h-4" />
                      {isSubmitting ? "Opening..." : "Submit via WhatsApp"}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
