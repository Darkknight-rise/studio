'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter and useSearchParams

// Define Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  role: z.enum(['Donor', 'Receiver', 'NGO'], { required_error: 'Please select a role.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as 'Donor' | 'Receiver' | 'NGO' | null;


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: initialRole || undefined, // Pre-fill role if passed in query params
      city: '',
    },
  });

   React.useEffect(() => {
    // Update default role if query param changes after initial load
    if (initialRole && form.getValues('role') !== initialRole) {
      form.setValue('role', initialRole);
    }
  }, [initialRole, form]);

  // TODO: Implement actual registration logic
  // - Generate a unique user ID
  // - Store user data in Firestore (users collection: { id, name, role, city })
  // - Store user ID locally (e.g., localStorage) for MVP pseudo-auth
  // - Redirect user to appropriate dashboard based on role
  async function onSubmit(values: FormData) {
     // Simulate API call / Firestore write
    console.log('Registering user:', values);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Simulate generating user ID and storing locally (replace with actual logic)
    const userId = `user_${Date.now()}`;
    try {
        localStorage.setItem('foodConnectUserId', userId);
        localStorage.setItem('foodConnectUserRole', values.role);
        localStorage.setItem('foodConnectUserName', values.name);
        localStorage.setItem('foodConnectUserCity', values.city);
    } catch (error) {
        console.error("Could not access localStorage:", error);
         toast({
          title: 'Registration Failed',
          description: 'Could not save user details locally. Please enable cookies/localStorage.',
          variant: 'destructive',
        });
        return; // Stop execution if localStorage fails
    }


    toast({
      title: 'Registration Successful!',
      description: `Welcome, ${values.name}! You are registered as a ${values.role}.`,
    });

    // Redirect to the appropriate dashboard
    switch (values.role) {
      case 'Donor':
        router.push('/donor');
        break;
      case 'Receiver':
        router.push('/receiver');
        break;
      case 'NGO':
        router.push('/ngo');
        break;
      default:
        router.push('/'); // Fallback to homepage
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-start min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Join FoodConnect</CardTitle>
          <CardDescription>Register to start donating or receiving food.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name / Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe or Hope Foundation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Register As</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Donor">Donor (Individual/Business)</SelectItem>
                        <SelectItem value="Receiver">Receiver (Individual in Need)</SelectItem>
                        <SelectItem value="NGO">NGO (Organization)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Chennai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#FFA726] hover:bg-[#FB8C00] text-white" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
