import { Button, Checkbox, Form, Input } from "@heroui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:5000/api";

export default function Signup() {
  const [isLoading, setLoading] = useState(false);
  
    async function handleSignup(e) {
      e.preventDefault();
  
      const formdata = new FormData(e.target);
      const username = formdata.get("username")?.valueOf() as string;
      const name = formdata.get("name")?.valueOf() as string;
      const emailId = formdata.get("emailId")?.valueOf() as string;
      const password = formdata.get("password")?.valueOf() as string;
  
      setLoading(true);
  
      try {
        const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/auth/register`, {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            username: username.trim(),
            emailId: emailId.trim(),
            password: password.trim(),
          }),
          headers: { "Content-Type": "application/json" },
        });
  
        const response = await endpoint.json();
  
        console.log({ response });
        alert("Accout created")
  
        if (!response.token) {
          console.log("[ERROR]: Response has no parameter token");
          return;
        }
  
      } catch (error) {
        console.log("[ERROR]: " + error?.message);
      } finally {
        setLoading(false);
      }
    }
  return (
    <div className="space-y-6">
      <main className="grid grid-cols-2 gap-x-10">
        <div className="h-screen p-16">
          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Get started with{" "}
            <span className="text-blue-700">Let's Play</span>
          </h1>
          <Form className="gap-y-6" onSubmit={handleSignup} method="post">
            <Input
              placeholder="name@company.com"
              radius="sm"
              label="Email address"
              type="email"
              name="emailId"
              labelPlacement="outside"
              isRequired
            />

            <div className="grid grid-cols-2 gap-6 w-full">
              <Input
                placeholder="Full Name"
                radius="sm"
                className="w-full"
                name="name"
                label="Full Name"
                labelPlacement="outside"
                isRequired
              />

              <Input
                placeholder="Username"
                radius="sm"
                className="w-full"
                label="Username"
                name="username"
                labelPlacement="outside"
                isRequired
              />
            </div>

            <Input
              placeholder="8 characters minimum"
              type="password"
              radius="sm"
              className="w-full"
              name="password"
              label="Password"
              labelPlacement="outside"
              isRequired
            />

            <div className="w-full mt-4 space-y-6 text-center">
              <Checkbox size="sm" color="primary" isRequired>
                By signing up, you agree to our{" "}
                <span className="font-semibold">Terms of use</span> and{" "}
                <span className="font-semibold">Privacy policy</span>.
              </Checkbox>

              <Button
                isLoading = {isLoading}
                radius="sm"
                type="submit"
                className="rounded-md bg-blue-700 text-white w-full"
              >
                Continue with email
              </Button>

              <div className="">
                {/* <p className="text-sm">
                  Also you can continue with{" "}
                  <Link className="underline text-blue-700 font-semibold cursor-pointer">
                    Google OAuth
                  </Link>
                </p> */}
              </div>

                <p className="text-gray-700 text-sm mt-4">
                  Already you have an account?{" "}
                  <Link to="/auth/login" className="underline text-gray-900 font-semibold cursor-pointer">
                    Signin
                  </Link>
                </p>

            </div>
          </Form>
        </div>
        <div className="h-screen bg-blue-700 p-16">
          <h1 className="text-2xl font-semibold text-white text-center">
            Whats Our Customers Says
          </h1>
        </div>
      </main>
    </div>
  );
}