import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const BACKEND_ENDPOINT = "http://localhost:5000/api";

export default function SignUp() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setLoading] = useState(false);

  async function handleLogin(e) {
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
      console.log("[ERROR]: ", (error instanceof Error) && error?.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        onPress={onOpen}
        className="px-4 py-2 rounded-md"
        color="success"
        size="sm"
        variant="light"
      >
        Create an account
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm" size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-semibold text-gray-900 p-4 border-b">
                <h1 className="font-bold text-lg">Create a new account</h1>
              </ModalHeader>

              <ModalBody className="p-4">
                <form
                  onSubmit={handleLogin}
                  method="POST"
                  className="space-y-6"
                >
                  <div className="space-y-14">
                    <Input
                      name="name"
                      label="Full Name"
                      labelPlacement="outside"
                      placeholder="John Doe"
                      radius="sm"
                      isRequired
                    />

                    <Input
                      name="emailId"
                      label="Email address"
                      labelPlacement="outside"
                      placeholder="name@compnay.com"
                      radius="sm"
                      isRequired
                    />
                    
                    <Input
                      name="username"
                      label="Username"
                      labelPlacement="outside"
                      placeholder="username"
                      radius="sm"
                      isRequired
                    />

                    <Input
                      type="password"
                      name="password"
                      label="Password"
                      labelPlacement="outside"
                      placeholder="Ex., Pass@123"
                      radius="sm"
                      isRequired
                    />
                  </div>

                  <Button
                    isLoading={isLoading}
                    type="submit"
                    className="w-full text-white font-semibold"
                    color="success"
                    radius="sm"
                  >
                    Create an account
                  </Button>

                  <Button
                    type="button"
                    className="w-full"
                    variant="bordered"
                    startContent={<FcGoogle />}
                  >
                    Continue with google
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
