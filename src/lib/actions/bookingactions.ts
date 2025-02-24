import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

export const handleVerify = async (id: string, contact: string) => {
  const response = await fetch(
    "http://localhost:3000/api/bookings/verify-booking",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: id,
        contact: contact,
      }),
    }
  );

  if (!response.ok) {
    toast.error("Error finding booking", {
      description: "Try again with different code or email.",
    });
    return;
  }

  const data = await response.json();

  if (data.token) {
    return redirect("/booking-status");
  } else {
    toast("Error finding booking", {
      description: "Try again with different code or email.",
    });
  }
};
