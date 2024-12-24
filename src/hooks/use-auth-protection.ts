import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useAuthProtection = () => {
  const router = useRouter();

  const protectAction = (
    user: { id?: string } | null,
    action: () => void,
    actionName: string = "perform this action",
  ) => {
    console.log(user?.id);

    if (!user?.id) {
      toast.error(`Please sign in to ${actionName}`);
      router.push("/auth");
      return false;
    }
    action();
    return true;
  };

  return { protectAction };
};
