import { createClient } from "@/lib/supabase/server";

export const getSession = async () => {
  const supabase = await createClient(); // Await the client creation
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(); // Destructure correctly

    if (error || !user) {
      console.error("Session error:", error);
      return null;
    }

    const { data: userData } = await supabase
      .from("User")
      .select("*")
      .eq("email", user.email!)
      .single();

    if (!userData) {
      return null;
    }

    return {
      userId: userData.id,
      user: { ...user, username: userData.username },
    };
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};
