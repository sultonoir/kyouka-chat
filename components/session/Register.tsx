/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import React from "react";
import { useToast } from "../ui/use-toast";
import { api } from "@/lib/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const registerSchema = z.object({
  name: z.string(),
  username: z.string().min(6),
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 8 characters",
  }),
});

const Register = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  const { mutate, isLoading } = api.user.postRegister.useMutation({
    onSuccess: () => {
      form.reset();
      toast({
        description: "Account Created",
      });
    },
    onError: (e) => {
      toast({
        variant: "destructive",
        description: e.message,
      });
    },
  });

  const onRegister = (values: z.infer<typeof registerSchema>) => {
    mutate({
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onRegister)}
        className="flex flex-col gap-y-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="text"
                  placeholder="Full name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="Username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
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
                <Input
                  disabled={isLoading}
                  type="password"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-bgmess hover:bg-bgmess/80"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default Register;
