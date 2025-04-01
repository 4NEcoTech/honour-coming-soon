import BusinessCard from "@/components/business-card";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-100">
      <BusinessCard
        name="John Jacob"
        title="Founder & CEO"
        company="4N ECOTECH"
        education={{
          degree: "BA, Visual Communication",
          institution: "IIT Delhi",
        }}
        contact={{
          phone: "8861597163",
          email: "johnjacob@email.com",
          website: "www.website.com",
        }}
        socialLinks={{
          facebook: "https://facebook.com/johnjacob",
          instagram: "https://instagram.com/johnjacob",
          twitter: "https://twitter.com/johnjacob",
          linkedin: "https://linkedin.com/in/johnjacob",
          hcj: "https://hcj.com/johnjacob",
        }}
        profileImage="/placeholder.svg?height=300&width=300"
        qrValue="https://www.website.com/johnjacob"
      />
    </main>
  )
}

