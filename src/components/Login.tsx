import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@heroui/react";

import { LuLogIn } from "react-icons/lu";

const BACKEND_ENDPOINT ="http://localhost:5000/api";

export default function Login() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
      e.preventDefault();

      const formdata = new FormData(e.target);
      const username = formdata.get("username")?.valueOf() as string;
      const password = formdata.get("password")?.valueOf() as string;
  
      console.log({username, password});

      setLoading(true);
  
      try {
          const endpoint = await fetch(`${BACKEND_ENDPOINT}/user/auth/login`, {
              method: "POST",
              body: JSON.stringify({
                  username: username.trim(),
                  password: password.trim()
              }),
              headers: { "Content-Type": "application/json" },
          });
  
          const response = await endpoint.json();
  
          console.log({response});
  
          if (!response.token) {
              console.log("[ERROR]: Response has no parameter token");
              return;
          }
  
          localStorage.setItem("session", JSON.stringify({
              token: response?.token,
              user: response?.user,
              isLoggedIn: true
          }));
  
          navigate("/user/profile");
      } catch (error) {
          console.log("[ERROR]: " + error?.message);
      } finally {
        setLoading(false);
      }
  }

  return (
    <div>
      <Button
        onPress={onOpen}
        className="px-4 py-2 rounded-md border-1"
        color="success"
        size="sm"
        variant="bordered"
        startContent={<LuLogIn size={20} />}
      >
        Log in
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm" size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-semibold text-gray-900 p-4 border-b">
                <h1 className = "font-bold text-lg">Sign in to your account</h1>
              </ModalHeader>

              <ModalBody className="p-4">
                <form onSubmit={handleLogin} method="POST" className="space-y-6">
                    <div className="space-y-14">
                      <Input
                        name="username"
                        label = "Email address or username"
                        labelPlacement="outside"
                        placeholder="name@compnay.com"
                        radius="sm"
                        isRequired
                      />

                      <Input
                        type="password"
                        name="password"
                        label = "Password"
                        labelPlacement="outside"
                        placeholder="Ex., Pass@123"
                        radius="sm"
                        isRequired
                      />
                    </div>
                      <div className="flex items-center justify-between my-4">
                        <Checkbox><span className="text-sm text-gray-700">Remember me</span></Checkbox>
                        <Link to="/" className="text-sm text-blue-800 font-medium">Forgot password?</Link>
                      </div>

                  <Button
                    isLoading = {isLoading}
                    type="submit"
                    className="w-full text-white font-semibold"
                    color="success"
                    radius="sm"
                  >
                    Sign in
                  </Button>

                  {/* <Button
                    type="button"
                    className="w-full"
                    variant="bordered"
                    startContent = {<FcGoogle />}
                  >
                    Continue with google
                  </Button> */}
                  <h1 className="text-sm text-gray-700">Don’t have an account yet? <Link to = "/" className="text-green-500 font-medium">Sign up</Link></h1>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
