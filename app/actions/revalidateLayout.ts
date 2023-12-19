"use server";

import { revalidatePath } from "next/cache";

export const revalidateLayout = async () => {
  revalidatePath("/(main)", "layout");
};
