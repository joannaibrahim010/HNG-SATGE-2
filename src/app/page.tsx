"use client";
import { useTicketStore } from '@/store';
import LandingPage from "@/components/LandingPage";
import { RegistrationForm } from '@/components/RegistrationForm';
import { TicketPreview } from '@/components/TicketPreview';
import NavBar from '@/components/NavBar';



export default function HomePage() {
  const { step } = useTicketStore();

  return (
    <main className="container mx-auto px-4 py-6">
      <NavBar />
      {step === 1 && <LandingPage />}
      {step === 2 && <RegistrationForm />}
      {step === 3 && <TicketPreview />}
    </main>
  );
}

