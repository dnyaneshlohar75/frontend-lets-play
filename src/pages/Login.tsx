import { Button, Form, Input } from "@heroui/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  
  const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:5000/api";

  const handleLogin = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formdata = new FormData(e?.target);
    const username = formdata.get("username")?.valueOf() as string;
    const password = formdata.get("password")?.valueOf() as string;

    if(!username || !password) {
      alert("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await endpoint.json();

      console.log({ response });

      if (!response.token) {
        console.log("[ERROR]: Response has no parameter token");
        return;
      }

      localStorage.setItem("session", JSON.stringify({
          token: response?.token,
          user: response?.user,
          isLoggedIn: true,
        })
      );

      navigate("/");
    } catch (error) {
      console.log("[ERROR]:", (error instanceof Error) && error?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-10">
        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-10">
          Welcome back! <span className="text-blue-700">Let's Play</span>
        </h1>

        <Form className="gap-y-6" method="post" onSubmit={handleLogin}>
          <Input
            placeholder="name@company.com"
            radius="sm"
            label="Email address or username"
            type="text"
            name="username"
            labelPlacement="outside"
            isRequired
          />

          <Input
            placeholder="8 characters minimum"
            type="password"
            radius="sm"
            className="w-full"
            autoComplete="current-password"
            label="Password"
            name="password"
            labelPlacement="outside"
            isRequired
          />

          <div className="flex justify-end items-end w-full">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-700 font-medium underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            radius="sm"
            className="rounded-md bg-blue-700 text-white w-full"
            type="submit"
            isLoading = {isLoading}
          >
            Sign in
          </Button>
        </Form>

        <p className="text-gray-700 text-sm text-center">
          You don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="underline text-gray-900 font-semibold"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
