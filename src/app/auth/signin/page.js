import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import Wrapper from "@/components/Wrapper"

const SignInPage = () => {
  return (
    <Wrapper>
        <Suspense fallback={<div>Loading...</div>}>
            <AuthForm />
        </Suspense>
    </Wrapper>
    
  );
};

export default SignInPage;
