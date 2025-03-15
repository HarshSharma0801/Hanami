"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerAffiliate, registerBrand } from "@/services/auth-service";

const BrandSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company_name: z.string().min(1, {
    message: "Company name is required.",
  }),
  website: z.string().min(1, {
    message: "Website is required.",
  }),
});

const AffiliateSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function Register() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("brand");
  const [isLoading, setIsLoading] = useState(false);

  const brandForm = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      company_name: "",
      website: "",
    },
  });

  const affiliateForm = useForm<z.infer<typeof AffiliateSchema>>({
    resolver: zodResolver(AffiliateSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  async function onBrandSubmit(values: z.infer<typeof BrandSchema>) {
    setIsLoading(true);
    try {
      const res = await registerBrand(values);
      if (res) {
        router.push("/login");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  async function onAffiliateSubmit(values: z.infer<typeof AffiliateSchema>) {
    setIsLoading(true);
    try {
      const res = await registerAffiliate(values);
      if (res) {
        router.push("/login");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md px-10 z-[100] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Choose your account type below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="brand"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="brand">Brand</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
          </TabsList>

          <TabsContent value="brand">
            <Form {...brandForm}>
              <form
                onSubmit={brandForm.handleSubmit(onBrandSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={brandForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={brandForm.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="www.example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register as Brand"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="affiliate">
            <Form {...affiliateForm}>
              <form
                onSubmit={affiliateForm.handleSubmit(onAffiliateSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={affiliateForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="yourusername" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={affiliateForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={affiliateForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register as Affiliate"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
