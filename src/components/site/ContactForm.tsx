import { CONTACT_EMAIL, GOOGLE_FORM_EMBED_URL, GOOGLE_FORM_URL } from "@/config";
import { btn } from "./ui";

// Enquiries are collected by our Google Form. Google renders the form light,
// so the frame keeps a white surface even when the site is in dark mode.
export function ContactForm() {
  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-md border bg-form-surface">
        <iframe
          title="Work with VertiStrat enquiry form"
          src={GOOGLE_FORM_EMBED_URL}
          loading="lazy"
          className="block h-[1150px] w-full border-0 md:h-[1000px]"
        >
          Loading…
        </iframe>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={btn.primary}
        >
          Open the form in a new tab ↗
        </a>
        <p className="text-sm text-muted-foreground">
          Or email us at{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  );
}
