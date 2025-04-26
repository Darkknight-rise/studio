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
import { Textarea } from '@/components/ui/textarea'; // Use Textarea for description
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Utensils, Package, History } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define Zod schema for food listing form
const foodListingSchema = z.object({
  foodType: z.string().min(2, { message: 'Food type must be at least 2 characters.' }),
  quantity: z.string().min(1, { message: 'Quantity is required.' }), // Keep as string for flexibility (e.g., "10 kg", "20 meals")
  expiryDate: z.date({ required_error: "Expiry date is required." }),
  description: z.string().optional(), // Optional description
});

type FoodListingFormData = z.infer<typeof foodListingSchema>;

// Mock data for past listings - replace with Firestore data
const mockPastListings = [
  { id: 'l1', foodType: 'Fruits', quantity: '10 kg', expiryDate: '2025-05-10', status: 'Listed' },
  { id: 'l2', foodType: 'Cooked Meals', quantity: '15 servings', expiryDate: '2025-05-05', status: 'Requested' },
  { id: 'l3', foodType: 'Bakery Items', quantity: '5 boxes', expiryDate: '2025-05-08', status: 'Picked Up' },
];

// Mock user data (replace with data fetched based on stored ID/role)
const mockUser = {
  name: typeof window !== 'undefined' ? localStorage.getItem('foodConnectUserName') || 'Donor User' : 'Donor User',
  city: typeof window !== 'undefined' ? localStorage.getItem('foodConnectUserCity') || 'Chennai' : 'Chennai',
};

export default function DonorDashboard() {
  const { toast } = useToast();
  const [pastListings, setPastListings] = React.useState(mockPastListings); // State for listings
  const [userName, setUserName] = React.useState('Donor');
  const [userCity, setUserCity] = React.useState('City');

  React.useEffect(() => {
    // Fetch user details from local storage on mount (MVP)
    const storedName = localStorage.getItem('foodConnectUserName');
    const storedCity = localStorage.getItem('foodConnectUserCity');
    const storedRole = localStorage.getItem('foodConnectUserRole');

    if (storedRole !== 'Donor') {
        // Redirect if not a donor (or show an error message)
        toast({ title: 'Access Denied', description: 'You must be registered as a Donor to view this page.', variant: 'destructive' });
        // Consider redirecting: router.push('/');
    }
    if (storedName) setUserName(storedName);
    if (storedCity) setUserCity(storedCity);

    // TODO: Fetch actual past listings from Firestore based on donor ID
  }, [toast]);

  const form = useForm<FoodListingFormData>({
    resolver: zodResolver(foodListingSchema),
    defaultValues: {
      foodType: '',
      quantity: '',
      expiryDate: undefined,
      description: '',
    },
  });

  // TODO: Implement actual food listing logic
  // - Get donor ID from local storage
  // - Add food listing details to Firestore (listings collection: { donorId, donorName, foodType, quantity, expiryDate, city, status: 'Listed', listedAt: Timestamp, description? })
  async function onSubmit(values: FoodListingFormData) {
     // Simulate API call / Firestore write
    console.log('Listing food:', { ...values, city: userCity, donorName: userName });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const newListing = {
        id: `l${Date.now()}`,
        ...values,
        expiryDate: format(values.expiryDate, "yyyy-MM-dd"), // Format date for display
        status: 'Listed',
    };

    // Add to mock data (replace with Firestore update)
    setPastListings([newListing, ...pastListings]);


    toast({
      title: 'Food Listed Successfully!',
      description: `${values.quantity} of ${values.foodType} has been listed for donation.`,
    });
    form.reset(); // Reset form after successful submission
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
      <p className="text-muted-foreground mb-6">Manage your food donations in {userCity}.</p>

       <Tabs defaultValue="listFood" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="listFood"><Utensils className="mr-2 h-4 w-4"/> List Food</TabsTrigger>
          <TabsTrigger value="pastListings"><History className="mr-2 h-4 w-4"/> Past Listings</TabsTrigger>
          {/* Add <TabsTrigger value="chat">Chat</TabsTrigger> later */}
        </TabsList>

        <TabsContent value="listFood">
           <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">List Food for Donation</CardTitle>
              <CardDescription>Fill in the details of the food you want to donate.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="foodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Food</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Fresh Fruits, Cooked Meals, Canned Goods" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5 kg, 10 servings, 2 boxes" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0)) // Disable past dates
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Vegetarian, requires refrigeration, pickup instructions" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full md:w-auto bg-[#FFA726] hover:bg-[#FB8C00] text-white" disabled={form.formState.isSubmitting}>
                     {form.formState.isSubmitting ? 'Listing Food...' : 'List Food'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pastListings">
             <Card className="mt-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">Your Donation History</CardTitle>
                   <CardDescription>View the status of your past food listings.</CardDescription>
                </CardHeader>
                <CardContent>
                    {pastListings.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Food Type</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                                {/* Add Action column if needed */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastListings.map((listing) => (
                                <TableRow key={listing.id}>
                                    <TableCell className="font-medium">{listing.foodType}</TableCell>
                                    <TableCell>{listing.quantity}</TableCell>
                                    <TableCell>{listing.expiryDate}</TableCell>
                                    <TableCell>
                                         <span className={cn("px-2 py-1 rounded-full text-xs font-medium",
                                            listing.status === 'Listed' && 'bg-blue-100 text-blue-800',
                                            listing.status === 'Requested' && 'bg-yellow-100 text-yellow-800',
                                            listing.status === 'Picked Up' && 'bg-green-100 text-green-800'
                                         )}>
                                            {listing.status}
                                         </span>
                                    </TableCell>
                                    {/* <TableCell> <Button variant="ghost" size="sm">View Chat</Button> </TableCell> */}
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                         <p className="text-muted-foreground text-center py-8">You haven't listed any food yet.</p>
                    )}
                </CardContent>
             </Card>
        </TabsContent>

        {/* <TabsContent value="chat">
            <p>Chat functionality will be implemented here.</p>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
