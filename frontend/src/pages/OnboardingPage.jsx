import React from 'react'
import useAuthUser  from '../hooks/useAuthUser';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api.js';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from "react";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { CameraIcon } from "lucide-react";




const OnboardingPage = () => {

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();


  const [formState, setFormState] = React.useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || "",
    location: authUser?.location || "",
    birthday: authUser?.birthday || "",
    profession: authUser?.profession || ""
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  })
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  }
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

  const handleProfilePicFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState((prev) => ({ ...prev, profilePic: reader.result }));
      toast.success("Photo added — submit to save your profile.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Upload or random avatar */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <label className="btn btn-outline btn-sm cursor-pointer">
                  <CameraIcon className="size-4 mr-2" />
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicFile}
                  />
                </label>
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent btn-sm">
                  <ShuffleIcon className="size-4 mr-2" />
                  Random avatar
                </button>
              </div>
              <p className="text-xs text-center opacity-60 max-w-sm">
                Uploads are stored with your profile (max 2MB). Use a square image for best results.
              </p>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* BIRTHDAY */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Birthday</span>
              </label>
              <input
                type="date"
                name="birthday"
                value={formState.birthday}
                onChange={(e) => setFormState({ ...formState, birthday: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>


            {/* PROFESSION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profession</span>
              </label>
              <input
                type="text"
                name="profession"
                placeholder="Enter your profession"
                value={formState.profession}
                onChange={(e) => setFormState({ ...formState, profession: e.target.value })}
                className="input input-bordered w-full"
              />
            </div>


            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div >
    </div >
  );
};
export default OnboardingPage;