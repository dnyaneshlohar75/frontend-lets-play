import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
// import {
//   CalendarDate,
//   parseDate,
//   getLocalTimeZone,
//   today,
// } from "@internationalized/date";

import { LuUserPen } from "react-icons/lu";

export default function PersonalInfo() {
  const { user, token } = JSON.parse(localStorage.getItem("session") as string);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setLoading] = useState(false);

  const BACKEND_ENDPOINT = import.meta.env.BACKEND_ENDPOINT || "http://localhost:5000/api";

  async function updateUserDetails(e) {
    e.preventDefault();
    const formdata = new FormData(e.target);

    const firstName = formdata.get("firstName")?.valueOf() as string;
    const lastName = formdata.get("lastName")?.valueOf() as string;
    const emailAddress = formdata.get("emailAddress")?.valueOf() as string;
    const mobileNumber = formdata.get("mobileNumber")?.valueOf() as string;
    const gender = formdata.get("gender")?.valueOf() as string;

    setLoading(true);
    try {
      const api = await fetch(`${BACKEND_ENDPOINT}/user/${user?.userId}/update`, {
        method: "PUT",
        headers: {
          'Content-Type': "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName, lastName, emailAddress, gender, mobileNumber
        })
      })

      const response = await api.json();

      if(!response.isUpdate) {
        alert("Something went wrong");
        alert(response.error)
        return;
      }

      const updatedData = response.user;
      localStorage.setItem("session", JSON.stringify({ user: updatedData, token: response?.token, isLoggedIn: true }));

      alert("User details updated..");
    } catch(error) {
      console.log("[ERROR]:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-xl">Personal Information</h1>
        <Button
          onPress={onOpen}
          startContent={<LuUserPen />}
          size="sm"
          variant="bordered"
          color="primary"
          radius="sm"
          className="border-1"
        >
          Chnage
        </Button>
      </div>

      <div className="my-4 space-y-4">
        <div className="grid grid-cols-3">
          <div>
            <h1 className="text-gray-600 text-xs font-semibold">First Name</h1>
            <p>{user?.name.split(" ")[0]}</p>
          </div>

          <div>
            <h1 className="text-gray-600 text-xs font-semibold">Last Name</h1>
            <p>{user?.name.split(" ")[1]}</p>
          </div>
        </div>

        <div className="grid grid-cols-3">
          <div>
            <h1 className="text-gray-600 text-xs font-semibold">
              Email address
            </h1>
            <p>{user?.emailAddress}</p>
          </div>

          <div>
            <h1 className="text-gray-600 text-xs font-semibold">Phone</h1>
            <p>{user?.mobileNumber || "-"}</p>
          </div>
        </div>

        <div className="grid grid-cols-4">
          <div>
            <h1 className="text-gray-600 text-xs font-semibold">Username</h1>
            <p>{user?.username}</p>
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
                    Edit Personal Information
                  </h1>
                  <p className="text-gray-700 text-sm font-light">
                    Update your details to keep your profile up-to-date.
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                <div className="">
                  {/* <div className="">
                     <div>
                      <h1 className="text-gray-600 text-xs font-semibold">
                        First Name
                      </h1>
                      <p>{user?.name.split(" ")[0]}</p>
                    </div>

                    <div>
                      <h1 className="text-gray-600 text-xs font-semibold">
                        Last Name
                      </h1>
                      <p>{user?.name.split(" ")[1]}</p>
                    </div> 
                  </div> */}
                  <Form
                    onSubmit={updateUserDetails}
                    className="w-full space-y-6 my-2"
                  >
                    <div className="grid grid-cols-2 w-full gap-4">
                      <Input
                        placeholder="First name"
                        label="First Name"
                        radius="sm"
                        labelPlacement="outside"
                        variant="flat"
                        name="firstName"
                        defaultValue={user?.name.split(" ")[0]}
                        errorMessage="First name is required"
                        isRequired
                      />
                      <Input
                        placeholder="Last name"
                        label="Last Name"
                        radius="sm"
                        labelPlacement="outside"
                        name="lastName"
                        variant="flat"
                        defaultValue={user?.name.split(" ")[1]}
                        errorMessage="Last name is required"
                        isRequired
                      />
                    </div>
                    <div className="grid grid-cols-2 w-full gap-4">
                      <Input
                        placeholder="Email Address"
                        label="Email Address"
                        type="email"
                        radius="sm"
                        labelPlacement="outside"
                        name="emailAddress"
                        variant="flat"
                        className="w-full"
                        defaultValue={user?.emailAddress}
                        errorMessage="Email Address is required"
                        isRequired
                      />
                      <Input
                        placeholder="Phone number"
                        label="Phone number"
                        radius="sm"
                        labelPlacement="outside"
                        variant="flat"
                        className="w-full"
                        name="mobileNumber"
                        defaultValue={user?.mobileNumber}
                        errorMessage="Phone number is required"
                        isRequired
                      />
                    </div>
                    <div className="grid grid-cols-2 w-full gap-4">
                      <RadioGroup
                        label="Gender"
                        size="sm"
                        orientation="horizontal"
                        name="gender"
                      >
                        <Radio value="male" size="sm">
                          Male
                        </Radio>
                        <Radio value="female" size="sm">
                          Female
                        </Radio>
                      </RadioGroup>
                    </div>
                    {/* <DateInput
                      isRequired
                      labelPlacement="outside"
                      defaultValue={parseDate(user?.dateOfBirth)}
                      label={"Birth Date"}
                      placeholderValue={new CalendarDate(1995, 11, 6)}
                      maxValue={today(getLocalTimeZone())}
                    /> */}
                    <div className="flex justify-end w-full gap-4">
                      
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
                        isLoading = {isLoading}
                        color="primary"
                        size="sm"
                        radius="sm"
                        type="submit"
                        className="text-white"
                      >
                        {isLoading ? "Saving.." : "Save changes"}
                      </Button>
                      
                    </div>
                  </Form>
                </div>
              </ModalBody>
              {/* <ModalFooter>
                
              </ModalFooter> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
