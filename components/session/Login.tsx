/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { useState } from "react";
import Register from "./Register";
import { signIn } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Icons } from "../icons/Icons";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 8 characters",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const [login, setlogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.ok) {
          toast({
            description: "Login",
          });
          router.refresh();
        }
        if (callback?.error) {
          toast({
            variant: "destructive",
            description: callback.error,
          });
        }
      })
      .catch((e) => {
        toast({
          variant: "destructive",
          description: e.message,
        });
      })
      .finally(() => {
        form.reset();
        setIsLoading(false);
      });
  }

  const toggle = () => {
    setlogin(!login);
  };

  return (
    <div className="flex flex-col w-full gap-y-4 basis-1/2">
      <div className="grid grid-cols-2 gap-6">
        <Button
          variant="outline"
          onClick={() => void signIn("github")}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button variant="outline">
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-default-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      {login ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
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
      ) : (
        <Register />
      )}
      <div className="mt-4 text-white/80 text-center font-light">
        <div className="flex flex-row items-center gap-2 justify-center">
          {login ? (
            <>
              <div>First time using KyOuka ?</div>
              <div
                onClick={toggle}
                className="text-[#128C7E] cursor-pointer hover:underline"
              >
                Create an account
              </div>
            </>
          ) : (
            <>
              <div>All ready have an account ?</div>
              <div
                onClick={toggle}
                className="text-[#128C7E] cursor-pointer hover:underline"
              >
                Log in
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
