// create-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/select";
import { createUser } from "@/lib/action";
import { checkEmail } from "@/lib/action";
import { SystemUser } from "@/lib/definitions";

const RoleSchema = z.enum(["admin", "student", "advisor"]);
const BASE_URL = "http://localhost:3001";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Invalid email format" }),
  role: z.enum(["admin", "student", "advisor"], {
    invalid_type_error: "Please select role type",
  }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

interface UserFormProps{
  user: SystemUser;
}

export function UserForm({ user }: UserFormProps) {

  // Define your form.
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      email: "",
      role: "student",
      password: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserSchema>) {
    try {
      // Want to check if the email exists before attempting to create
      const emailInUse = await checkEmail(values.email);
      if (emailInUse) {
        form.setError("email", {
          type: "manual",
          message: "Email already in use.",
        });
        return;
      }
      const user = createUser(values);
      console.log("User created:", user);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-lg rounded-lg border p-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  defaultValue={user.name}
                  placeholder="John Doe"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input 
                  defaultValue={user.email}
                  placeholder="student@chapman.edu" 
                  />
              </FormControl>
              {/* Show error message if email field has an error */}
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue defaultValue={user.role} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
