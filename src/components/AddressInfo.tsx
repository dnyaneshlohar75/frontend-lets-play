import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { LuFilePen } from "react-icons/lu";

export default function AddressInfo() {
  const { user } = JSON.parse(localStorage.getItem("session") as string);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Address</h1>
        <Button
          onPress={onOpen}
          startContent={<LuFilePen />}
          size="sm"
          variant="bordered"
          color="primary"
          radius="sm"
          className="border-1"
        >
          Change
        </Button>
      </div>

      <div className="my-4 space-y-4">
        <div className="grid grid-cols-3">
          <div>
            <h1 className="text-gray-600 text-xs font-semibold">Address</h1>
            <p>{user?.address || "-"}</p>
          </div>

          <div>
            <h1 className="text-gray-600 text-xs font-semibold">City/State</h1>
            <p>{user?.city || "-"}</p>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm" size="xl">
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="">
                <div>
                  <h1 className="font-bold text-lg">
                    Edit Address
                  </h1>
                  <p className="text-gray-700 text-sm font-light">
                    Update your details to keep your profile up-to-date.
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                <Form className="w-full space-y-6 my-2">
                    <Textarea
                      placeholder="Address"
                      label="Address"
                      radius="sm"
                      labelPlacement="outside"
                      variant="flat"
                      defaultValue={user?.address}
                      errorMessage="Address is required"
                      isRequired
                    />
                  <div className="grid grid-cols-2 w-full gap-4">
                    <Input
                      placeholder="City/State"
                      label="City/State"
                      radius="sm"
                      labelPlacement="outside"
                      variant="flat"
                      defaultValue={user?.city}
                      errorMessage="City/State is required"
                      isRequired
                    />
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  radius="sm"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  radius="sm"
                  onPress={onClose}
                  className="text-white"
                >
                  Save changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
