import { render, screen } from "@testing-library/react";

import { ContactForm } from "@/components/site/ContactForm";
import { CONTACT_EMAIL, GOOGLE_FORM_EMBED_URL, GOOGLE_FORM_URL } from "@/config";

describe("Contact form delivery", () => {
  it("embeds the Google Form and links out to it in a new tab", () => {
    render(<ContactForm />);

    expect(screen.getByTitle("Work with VertiStrat enquiry form")).toHaveAttribute("src", GOOGLE_FORM_EMBED_URL);

    const openForm = screen.getByRole("link", { name: /open the form in a new tab/i });
    expect(openForm).toHaveAttribute("href", GOOGLE_FORM_URL);
    expect(openForm).toHaveAttribute("target", "_blank");
    expect(openForm).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.getByRole("link", { name: CONTACT_EMAIL })).toHaveAttribute("href", `mailto:${CONTACT_EMAIL}`);
  });
});
