import React from "react";
import { toast } from "react-toastify";

import { useUserStore } from "../../../store/store";
import { updateUser } from "../../api/user";

import ProfileModal from "../../layout/ModalLayout/ProfileModal";

const Profile = ({ defaultProfileInputs }) => {
  const { userDetails, setUserDetails } = useUserStore((state) => ({
    userDetails: state.userDetails,
    setUserDetails: state.setUserDetails,
  }));

  async function updateProfile(password, fullName, email, closeBtnRef) {
    const isSuccess = await updateUser(
      userDetails.username,
      password,
      fullName,
      email
    );

    if (isSuccess) {
      setUserDetails();

      closeBtnRef.current.click();

      toast.dismiss();
      toast.success("Profile updated successfully!");
    }
  }

  return (
    <ProfileModal
      id="profilePrompt"
      title="Profile"
      inputId={{
        username: "username",
        password: "password",
        email: "email",
      }}
      updateProfile={updateProfile}
      defaultProfileInputs={defaultProfileInputs}
      userDetails={userDetails}
    />
  );
};

export default Profile;
