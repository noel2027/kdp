import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const faqs = [
  {
    question: "How do I access my dashboard?",
    answer: "Use the Sign In modal and enter the email address linked to your account profile.",
  },
  {
    question: "What if my email is not registered?",
    answer: "The application will show a message informing you that the address is not registered. Please contact the administrator.",
  },
  {
    question: "What happens if my account is suspended?",
    answer: "You will receive a message explaining that your account has been suspended and should contact the administrator.",
  },
  {
    question: "Can I create my own account publicly?",
    answer: "No. User registration is handled by the admin dashboard only.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#302e29]">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <section className="border-b border-[#e6e2da] pb-10 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#77736c]">Help</p>
          <h1 className="mt-4 font-serif text-4xl font-normal tracking-tight text-[#302e29] sm:text-5xl">Frequently asked questions</h1>
        </section>

        <section className="grid gap-12 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">Common questions</p>
            <dl className="mt-6 border-t border-[#e6e2da]">
              {faqs.map((item) => (
                <div key={item.question} className="border-b border-[#e6e2da] py-6">
                  <dt className="font-serif text-xl text-[#302e29]">{item.question}</dt>
                  <dd className="mt-3 max-w-2xl leading-7 text-[#706c64]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-t border-[#e6e2da] pt-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#77736c]">Get in touch</p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-[#302e29]">Contact and support</h2>
            <dl className="mt-6 divide-y divide-[#e6e2da] border-t border-[#e6e2da]">
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.16em] text-[#8e8a82]">Email</dt>
                <dd className="mt-2 font-medium text-[#514e47]">support@kdplus.demo</dd>
              </div>
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.16em] text-[#8e8a82]">Hours</dt>
                <dd className="mt-2 font-medium text-[#514e47]">Mon–Fri • 9am–6pm</dd>
              </div>
              <div className="py-5">
                <dt className="text-xs uppercase tracking-[0.16em] text-[#8e8a82]">Support</dt>
                <dd className="mt-2 font-medium text-[#514e47]">Account and publishing guidance</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
