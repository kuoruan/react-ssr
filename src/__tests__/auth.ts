import auth from "@/auth";

test("test auth", () => {
  expect(auth.isAuthenticated).toBe(false);
});
