export async function updatePassword(
  oldPassword: string,
  newPassword: string,
  token?: string
): Promise<void> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(
      `http://localhost:4000/api/auth/update-password`,
      {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update password");
    }
  } catch (error) {
    console.error(error);
  }
}
