import AddressInfo from "@/components/AddressInfo";
import PersonalInfo from "@/components/PersonalInfo";
import ProfilePictureUploader from "@/components/ProfilePictureUploader";
import { Button } from "@heroui/button";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { LuFilePen, LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = JSON.parse(localStorage.getItem("session") as string);
  const session = JSON.parse(localStorage.getItem("session") as string);

  // useEffect(() => {
  //   if(!session || session?.isLoggedIn) {
  //     return navigate("/");
  //   }
  // }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex w-full flex-col border-b">
      <div>
        <header>
          <h1 className="font-semibold text-2xl text-gray-900">User Profile</h1>
          <p className="text-gray-700">
            This is some information about the user.
          </p>
        </header>
        <main className="my-6 space-y-6">
          <div className="flex items-center justify-between gap-6 border rounded-lg p-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="w-24 h-24 overflow-hidden rounded-full">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      user?.profileImageUrl ||
                      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                    }
                    alt={user?.name}
                    title={user?.name}
                  />
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-xl">{user?.name}</h1>
                <h1 className="text-xs text-gray-700">@{user?.username}</h1>
              </div>
            </div>

            <Button
              onPress={onOpen}
              startContent={<LuFilePen />}
              size="sm"
              variant="bordered"
              color="primary"
              radius="sm"
              className="border-1"
            >
              Change picture
            </Button>
          </div>

          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            radius="sm"
            size="xl"
          >
            <ModalContent className="">
              {(onClose) => (
                <>
                  <ModalHeader className="">
                    <div>
                      <h1 className="font-bold text-lg">
                        Upload an profile picture
                      </h1>
                      <p className="text-gray-700 text-sm font-light">
                        Update your details to keep your profile up-to-date.
                      </p>
                    </div>
                  </ModalHeader>

                  <ModalBody>
                    <ProfilePictureUploader />
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>

          {/* PERSONAL INFO */}
          <PersonalInfo />

          {/* ADDRESS */}
          <AddressInfo />

          <div className="grid grid-cols-2 gap-5">
            <h1 className="font-medium">User Since</h1>
            <p>
              {new Date(user?.createdAt).toLocaleDateString("EN-IN", {
                timeZone: "Asia/Kolkata",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
