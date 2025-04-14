"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FaqContent from "../faqContent";

export default function FAQCategoryPage() {
  const { category } = useParams();
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      const res = await fetch(`/api/hcj/v1/hcjArET60131fetchFaq?category=${category}`);
      const json = await res.json();
      setFaqs(json.data || []);
    };
    fetchFaqs();
  }, [category]);

  return <FaqContent faqs={faqs} />;
}
