import { getUserSettings, updateUserSettings } from "@/actions/user";
import { Input } from "@heroui/input";
import { Button, Form, Switch } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";

export default function Settings() {
  const [newPassword, setNewPassword] = useState("");
  const [reenteredPassword, seteeEnteredPassword] = useState("");
  const { user } = JSON.parse(localStorage.getItem("session") as string);

  const [isSelected, setIsSelected] = React.useState(true);

  const [passwordError, setPasswordError] = useState("");
  const [matchError, setMatchError] = useState("");

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const pattern = /^[A-Za-z]+(?=.*[0-9])(?=.*[!@#$%^&*])/;
    return minLength && pattern.test(password);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setNewPassword(pwd);

    if (!validatePassword(pwd)) {
      setPasswordError(
        "Password must be at least 8 characters, start with letters, and contain at least one number and one symbol."
      );
    } else {
      setPasswordError("");
    }

    // Also check match if reentered password is filled
    if (reenteredPassword && pwd !== reenteredPassword) {
      setMatchError("Passwords do not match.");
    } else {
      setMatchError("");
    }
  };

  const handleReenteredPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rePwd = e.target.value;
    seteeEnteredPassword(rePwd);

    if (newPassword !== rePwd) {
      setMatchError("Passwords do not match.");
    } else {
      setMatchError("");
    }
  };

  useEffect(() => {
    if (!user?.userId) return;

    const getUserSettingsById = async () => {
      const response = await getUserSettings(user.userId);
      setIsSelected(response?.userSettings?.emailService ?? false);
    };

    getUserSettingsById();
  }, [user]);

  const changeEmailServiceState = useCallback(async () => {
    if (!user?.userId) return;

    const response = await updateUserSettings(user.userId, "email", !isSelected);
    console.log({ response });

    setIsSelected(response?.userSettings?.emailService ?? false);
  }, [user, isSelected]);

  return (
    <div className="flex w-full flex-col">
      <div>
        <header>
          <h1 className="font-semibold text-2xl text-gray-900">
            User Settings
          </h1>
          <p className="text-gray-700">
            This is some information about the user.
          </p>
        </header>
        <main className="my-6 space-y-6">
          <div className="border rounded-lg p-4">
            <h1 className="font-semibold text-xl mb-8">Change password</h1>

            <Form className="gap-8">
              <div className="grid grid-cols-2 gap-6 w-full">
                <div className="col-span-2">
                  <Input
                    placeholder="********"
                    type="password"
                    radius="sm"
                    className="w-full"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    label="New Password"
                    name="password"
                    labelPlacement="outside"
                    isRequired
                    errorMessage=" "
                  />
                  {passwordError && (
                    <p className="text-xs text-red-600 mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <Input
                    placeholder="********"
                    type="password"
                    radius="sm"
                    className="w-full"
                    value={reenteredPassword}
                    onChange={handleReenteredPasswordChange}
                    label="Re-enter Password"
                    name="reenterPassword"
                    labelPlacement="outside"
                    isRequired
                    errorMessage=" "
                  />
                  {matchError && (
                    <p className="text-xs text-red-600 mt-1">{matchError}</p>
                  )}
                </div>
              </div>

              <Button
                radius="sm"
                className="rounded-md bg-blue-700 text-white"
                type="submit"
                // isLoading = {isLoading}
              >
                Change password
              </Button>
            </Form>
          </div>
          <div className="border rounded-lg p-4">
            <h1 className="font-semibold text-xl mb-8">
              Notification settings
            </h1>
            <Form className="gap-8">
              <div className="grid grid-cols-12 items-center w-full">
                <div className="col-span-11">
                  <h1 className="font-semibold text-gray-900 text-lg">
                    Enable Email Notifications
                  </h1>
                  <p className="text-sm text-gray-600">
                    Receive updates and important announcements directly to your
                    email.
                  </p>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Switch
                    size="sm"
                    isSelected={isSelected}
                    onValueChange={(e) => {
                      setIsSelected(e);
                      changeEmailServiceState();
                    }}
                  />
                </div>
              </div>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
