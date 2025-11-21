"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const stripTags = (s) => String(s ?? "").replace(/<\/?[^>]+>/g, "");

const AuthForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (callbackUrl !== "/") {
        console.log(callbackUrl)
      setStatusMessage("Please sign in to continue");
    }
  }, [callbackUrl]);

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    setErrors("");
    setData({ email: "", password: "" });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setIsSubmitting(true);

    const email = stripTags(data.email);
    const password = stripTags(data.password);
    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: true,
          callbackUrl,
          email,
          password,
        });
        if (result?.error) {
          setErrors(result.error);
        }
      } else {
        // Registration logic can be added here
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.error) {
          setErrors(data.error);
        } else {
          // Automatically log in the user after successful registration
          const result = await signIn("credentials", {
            redirect: true,
            callbackUrl,
            email,
            password,
          });
          if (result?.error) {
            setErrors(result.error);
          }
        }
      }
    } catch (error) {
      setErrors("An unexpected error occurred. Please try again.");
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signFormContainer">
      <h1>{isLogin ? "Sign In" : "Register"}</h1>
      {statusMessage && <p className="statusMessage">{statusMessage}</p>}
      <form onSubmit={handleSubmit} className="authForm">
        <div className="formRow">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formRow">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>
        {errors && <p className="error">{errors}</p>}
        <button type="submit" disabled={isSubmitting || !data.email || !data.password}>
          {isSubmitting ? "Signing in..." : isLogin ? "Sign In" : "Register"}
        </button>
      </form>
      <div className="toggle">
        <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
        <button type="button" onClick={handleToggle}>
          {isLogin ? "Register" : "Sign In"}
        </button>
      </div>
      <div className="service-logins">
        <button className="service-btn" type="button" onClick={() => signIn("github")}>
        Sign in with GitHub
      </button>
      <button className="service-btn" type="button" onClick={() => signIn("google")}>
        Sign in with Google
      </button>
      </div>
      
    </div>
  );
};

export default AuthForm;
