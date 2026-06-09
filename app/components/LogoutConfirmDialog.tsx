import { useState } from "react";
import { useRevalidator } from "react-router";
import { toast } from "sonner";
import { logoutUser } from "lib/appwrite/auth";
import { useUser } from "~/hooks/useCurrentUser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * LogoutConfirmDialog Component
 *
 * A reusable confirmation modal for logout action.
 * Handles the logout process and navigation.
 *
 * @param open - Controls whether the dialog is open
 * @param onOpenChange - Callback to update open state
 */
const LogoutConfirmDialog = ({
  open,
  onOpenChange,
}: LogoutConfirmDialogProps) => {
  const { setUser } = useUser();
  const revalidator = useRevalidator();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      setUser(null);
      onOpenChange(false);
      toast.success("Logged out successfully");
      revalidator.revalidate();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Are you sure you want to logout? You'll need to sign in again to
            access your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 pt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={isLoggingOut}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirmLogout}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutConfirmDialog;
