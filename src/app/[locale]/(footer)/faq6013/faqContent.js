"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqContent({ faqs }) {
  if (!faqs?.length)
    return <p className="text-center text-gray-500">No FAQs found.</p>;

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="space-y-6">
          {faqs.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border rounded-lg shadow-sm overflow-hidden mb-4 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <AccordionTrigger className="flex justify-between items-center px-4 py-3 text-left font-medium text-gray-800 dark:text-gray-100">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 text-gray-600 dark:text-gray-300">
                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
