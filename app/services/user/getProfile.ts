"use server";

import { currentProfile } from "@/lib/current-profile";

export const getProfile = async () => {
  const profile = await currentProfile();

  if (!profile) {
    throw new Error("You must be logged in to do that");
  }

  return profile;
};
