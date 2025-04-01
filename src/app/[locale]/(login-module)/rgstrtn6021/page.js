
'use client'
import CreatePassword from '@/components/create-password';
import Otp from '@/components/otp';
import { useRouter, useSearchParams } from 'next/navigation';
import RegistrationWithCredentialForm from './RegistrationWithCredentialForm';

const Page = () => {
  const router = useRouter()

  const searchParams = useSearchParams();

  // Get the current step from the query params
  const step = Number(searchParams.get('step') || 1);

    // Function to navigate to the next step
  const goToNextStep = () => {
    const nextStep = step + 1;
    router.push(`?step=${nextStep}`, { shallow: true });
  };

    const completeForm = () => {
    // Perform any final submission logic here
    console.log("Form completed");
    router.push(router.pathname, undefined, { shallow: true });
  };

  console.log("step",step)
  return (
    <>
    { Number(step) === 1 &&(<RegistrationWithCredentialForm goToNextStep={goToNextStep}/>)}
    { Number(step) === 2 &&(<Otp goToNextStep={goToNextStep}/>)}
    { Number(step) === 3 &&(<CreatePassword completeForm={completeForm}/>)}
      </>
  );
};

export default Page;
