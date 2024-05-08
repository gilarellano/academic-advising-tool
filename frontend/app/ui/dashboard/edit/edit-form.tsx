// create-form.tsx
"use client";

import { useState, useEffect } from "react";
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
import { updateUser } from "@/lib/action";
import { checkEmail } from "@/lib/action";
import { SystemUser } from "@/lib/definitions";

const RoleSchema = z.enum(["admin", "student", "advisor"]);
const BASE_URL = "http://localhost:3001";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email({ message: "Invalid email format" }),
  role: z.enum(["admin", "student", "advisor"], {
    invalid_type_error: "Please select role type",
  }),
  password: z.string()
});

interface UserFormProps{
  user: SystemUser;
}

export function UserForm({ user }: UserFormProps) {
  const [originalEmail, setOriginalEmail] = useState(user.email);

  // Define your form.
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      id: user.userID,
      name: user.name,
      email: user.email,
      role: user.role,
      password: "default",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserSchema>) {
    console.log("Values: ", values);
    //form.clearErrors();
    try {
      if (values.email !== originalEmail) {
        const emailInUse = await checkEmail(values.email);
        if (emailInUse) {
          form.setError("email", {
            type: "manual",
            message: "Email already in use.",
          });
          return;
        }
      }

      const user = updateUser(values.id, values);
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
                <Input placeholder={user.name} {...field} />
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
                <Input placeholder={user.email} {...field} />
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
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={user.role}/>
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
                <Input type="password" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-4" type="submit">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
