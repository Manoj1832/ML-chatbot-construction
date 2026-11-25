import { useState } from "react";
import { Instagram, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/lib/emailjs";
import { sendContactViaWhatsApp } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/config/site";
import { SITE_CONTENT } from "@/data/site-content";
import { BrandIcon } from "@/components/common/BrandIcon";
import { trackEvent } from "@/lib/telemetry";
import {
  contactSchema,
  validateWithSchema,
  type ContactInput,
  type FieldErrors,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendMethod, setSendMethod] = useState<"email" | "whatsapp">("whatsapp");
  const [errors, setErrors] = useState<FieldErrors<ContactInput>>({});
  const { contactPage } = SITE_CONTENT;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const raw = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const validation = validateWithSchema(contactSchema, raw);
    if (!validation.success) {
      setErrors(validation.errors);
      trackEvent({ event: "form_validation_error", metadata: { form: "contact", fields: Object.keys(validation.errors).length } });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      trackEvent({ event: "form_submit", metadata: { form: "contact", method: sendMethod } });
      if (sendMethod === "email") {
        await sendContactEmail(validation.data);
        toast({
          title: "Inquiry Sent",
          description: "Our engineer will get back to you shortly.",
        });
        formEl.reset();
      } else {
        sendContactViaWhatsApp(validation.data);
        toast({
          title: "Opening WhatsApp",
          description: "Continue in WhatsApp to send your inquiry.",
        });
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try WhatsApp or phone.",
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
            <p className="eyebrow mb-2">{contactPage.eyebrow}</p>
            <h1
              className="font-display font-semibold text-[#111111] mb-3"
              style={{ fontSize: "var(--text-hero)" }}
            >
              {contactPage.headline}
            </h1>
            <p className="text-sm md:text-base text-[#444444] leading-relaxed">
              {contactPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 md:py-16 border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Leadership & Channels */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                {SITE_CONFIG.leadership.map((leader) => (
                  <div
                    key={leader.name}
                    className="border border-[#EAEAEA] bg-[#F5F5F5] p-4 flex items-center gap-3.5"
                  >
                    <img
                      src={leader.image}
                      alt={leader.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 object-cover border border-[#EAEAEA] shrink-0"
                    />
                    <div>
                      <h2 className="font-display font-semibold text-sm md:text-base text-[#111111]">
                        {leader.name}
                      </h2>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#777777] mt-0.5">
                        {leader.role}
                      </p>
                    </div>
                  </div>
                ))}
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
                    <Instagram className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#777777] mb-0.5">Instagram</p>
                    <a
                      href={SITE_CONFIG.contact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#111111] hover:underline"
                    >
                      {SITE_CONFIG.contact.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Clean Inquiry Box */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="border border-[#EAEAEA] bg-[#FFFFFF] p-5 md:p-8 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAEAEA] pb-4">
                  <div>
                    <h2 className="font-display font-semibold text-xl text-[#111111]">
                      {contactPage.formTitle}
                    </h2>
                    <p className="text-xs text-[#777777] mt-0.5">
                      {contactPage.formSubtitle}
                    </p>
                  </div>

                  {/* Compact Channel Toggle */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? "firstName-err" : undefined}
                      className="h-10 rounded-sm"
                    />
                    {errors.firstName && (
                      <p id="firstName-err" className="text-xs text-[#111111] font-medium">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      aria-invalid={Boolean(errors.lastName)}
                      aria-describedby={errors.lastName ? "lastName-err" : undefined}
                      className="h-10 rounded-sm"
                    />
                    {errors.lastName && (
                      <p id="lastName-err" className="text-xs text-[#111111] font-medium">{errors.lastName}</p>
                    )}
                  </div>
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
                      aria-describedby={errors.phone ? "phone-err" : undefined}
                      className="h-10 rounded-sm"
                    />
                    {errors.phone && (
                      <p id="phone-err" className="text-xs text-[#111111] font-medium">{errors.phone}</p>
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
                      aria-describedby={errors.email ? "email-err" : undefined}
                      className="h-10 rounded-sm"
                    />
                    {errors.email && (
                      <p id="email-err" className="text-xs text-[#111111] font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs">Project Type &amp; Location *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., G+1 Home in RS Puram, Coimbatore"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? "subject-err" : undefined}
                    className="h-10 rounded-sm"
                  />
                  {errors.subject && (
                    <p id="subject-err" className="text-xs text-[#111111] font-medium">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs">Plot Details / Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Plot size (e.g., 30x40), facing, floors, or timeline"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-err" : undefined}
                    className="rounded-sm"
                  />
                  {errors.message && (
                    <p id="message-err" className="text-xs text-[#111111] font-medium">{errors.message}</p>
                  )}
                </div>

                <Button type="submit" size="default" className="w-full md:h-11" disabled={isSubmitting}>
                  {sendMethod === "email" ? (
                    <>
                      <Send className="w-4 h-4" />
                      {isSubmitting ? "Sending..." : "Send via Email"}
                    </>
                  ) : (
                    <>
                      <BrandIcon name="whatsapp" invert className="w-4 h-4" />
                      {isSubmitting ? "Opening..." : "Send via WhatsApp"}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-10 md:py-14 bg-[#F5F5F5]">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="eyebrow mb-1.5">Service Area</p>
          <h2 className="font-display font-semibold text-xl md:text-2xl text-[#111111] mb-4">
            Coimbatore &amp; Salem, Tamil Nadu
          </h2>
          <div className="border border-[#EAEAEA] bg-[#FFFFFF] aspect-[16/9] md:aspect-[16/7] overflow-hidden">
            <iframe
              title="Adithya Constructions service region — Coimbatore, Tamil Nadu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125511.19949764838!2d76.83987694999999!3d11.0168445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
