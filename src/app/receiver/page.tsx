'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, CalendarClock, MapPin, CheckCircle, Hourglass, Search, Inbox } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';

// Mock data for available/matched listings - replace with Firestore data
const mockAvailableListings = [
  { id: 'l1', donorName: 'John D.', foodType: 'Fresh Vegetables', quantity: '5 kg', expiryDate: '2025-05-15', city: 'Chennai', listedAt: '2025-05-12T10:00:00Z', status: 'Listed' },
  { id: 'l4', donorName: 'Restaurant B', foodType: 'Sandwiches', quantity: '25 packs', expiryDate: '2025-05-13', city: 'Chennai', listedAt: '2025-05-12T14:00:00Z', status: 'Listed' },
   { id: 'l5', donorName: 'Supermarket C', foodType: 'Canned Goods', quantity: '2 crates', expiryDate: '2025-06-30', city: 'Chennai', listedAt: '2025-05-11T09:30:00Z', status: 'Listed' },
    { id: 'l6', donorName: 'Alice M.', foodType: 'Milk', quantity: '10 liters', expiryDate: '2025-05-14', city: 'Mumbai', listedAt: '2025-05-12T11:00:00Z', status: 'Listed' }, // Different city
];

// Mock data for requested listings
const mockRequestedListings = [
   { id: 'l2', donorName: 'Bakery A', foodType: 'Bread Loaves', quantity: '30 loaves', expiryDate: '2025-05-14', city: 'Chennai', status: 'Requested' },
];

// Mock user data (replace with data fetched based on stored ID/role)
const mockUser = {
  name: typeof window !== 'undefined' ? localStorage.getItem('foodConnectUserName') || 'Receiver User' : 'Receiver User',
  city: typeof window !== 'undefined' ? localStorage.getItem('foodConnectUserCity') || 'Chennai' : 'Chennai',
};

export default function ReceiverDashboard() {
  const { toast } = useToast();
  const [availableListings, setAvailableListings] = React.useState<any[]>([]);
  const [requestedListings, setRequestedListings] = React.useState(mockRequestedListings);
  const [userName, setUserName] = React.useState('Receiver');
  const [userCity, setUserCity] = React.useState('City');


   React.useEffect(() => {
    // Fetch user details from local storage on mount (MVP)
    const storedName = localStorage.getItem('foodConnectUserName');
    const storedCity = localStorage.getItem('foodConnectUserCity');
    const storedRole = localStorage.getItem('foodConnectUserRole');

    if (storedRole !== 'Receiver') {
         toast({ title: 'Access Denied', description: 'You must be registered as a Receiver to view this page.', variant: 'destructive' });
         // Consider redirecting
    }
     if (storedName) setUserName(storedName);
     if (storedCity) {
         setUserCity(storedCity);
         // Filter mock data based on user's city (replace with Firestore query)
         const filteredListings = mockAvailableListings.filter(
             listing => listing.city === storedCity && listing.status === 'Listed'
         );
         // Sort by expiry date (earlier first)
         filteredListings.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
         setAvailableListings(filteredListings);
     }


    // TODO: Fetch actual listings from Firestore
    // - Query listings collection where city == userCity and status == 'Listed'
    // - Order by expiryDate (ascending)
    // - Set up real-time listener for new/updated listings
    // - Fetch listings requested by this user (based on receiverId field added on request)
  }, [toast]);

  // TODO: Implement request food logic
  // - Get receiver ID and name from local storage
  // - Update the listing status in Firestore to 'Requested'
  // - Add receiverId and receiverName to the listing document
  // - Send a notification/chat message to the Donor (and potentially NGO)
  const handleRequestFood = async (listingId: string, foodType: string) => {
    console.log(`Requesting food listing ID: ${listingId}`);
     // Simulate API call / Firestore update
     await new Promise(resolve => setTimeout(resolve, 1000));

      // Update UI state (replace with real-time listener update)
      const requestedItem = availableListings.find(l => l.id === listingId);
      if (requestedItem) {
          setAvailableListings(availableListings.filter(l => l.id !== listingId));
          setRequestedListings([{ ...requestedItem, status: 'Requested' }, ...requestedListings]);
      }


    toast({
      title: 'Request Sent!',
      description: `Your request for ${foodType} has been sent to the donor.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
      <p className="text-muted-foreground mb-6">Find available food donations in {userCity}.</p>

      <Tabs defaultValue="available" className="w-full">
         <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="available"><Search className="mr-2 h-4 w-4"/> Available Food</TabsTrigger>
          <TabsTrigger value="requested"><Hourglass className="mr-2 h-4 w-4"/> Your Requests</TabsTrigger>
           {/* Add <TabsTrigger value="chat">Chat</TabsTrigger> later */}
        </TabsList>

        <TabsContent value="available">
            <Card className="mt-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Available Donations in {userCity}</CardTitle>
                    <CardDescription>Browse food items available for pickup near you. Requests are subject to donor approval.</CardDescription>
                </CardHeader>
                <CardContent>
                   {availableListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableListings.map((listing) => (
                        <Card key={listing.id} className="flex flex-col justify-between">
                            <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{listing.foodType}</CardTitle>
                            <CardDescription>Donated by: {listing.donorName}</CardDescription>
                             <Badge variant="secondary" className="w-fit mt-1">{listing.quantity}</Badge>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                    <CalendarClock className="mr-2 h-4 w-4 text-orange-500" />
                                    <span>Expires: {format(new Date(listing.expiryDate), "PPP")}</span>
                                </div>
                                 <div className="flex items-center text-muted-foreground">
                                    <MapPin className="mr-2 h-4 w-4 text-blue-500" />
                                    <span>City: {listing.city}</span>
                                </div>
                                 <div className="flex items-center text-muted-foreground">
                                    <Hourglass className="mr-2 h-4 w-4 text-gray-500" />
                                    <span>Listed: {formatDistanceToNow(parseISO(listing.listedAt), { addSuffix: true })}</span>
                                </div>
                                {listing.description && <p className="text-xs pt-1 italic">"{listing.description}"</p>}
                            </CardContent>
                             <div className="p-4 pt-0">
                                <Button
                                    className="w-full bg-[#FFA726] hover:bg-[#FB8C00] text-white"
                                    onClick={() => handleRequestFood(listing.id, listing.foodType)}
                                >
                                    Request Food
                                </Button>
                             </div>
                        </Card>
                        ))}
                    </div>
                    ) : (
                        <div className="text-center py-12">
                             <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No available food listings found in your city right now.</p>
                            <p className="text-sm text-muted-foreground">Check back later or expand your search criteria.</p>
                        </div>
                   )}
                </CardContent>
             </Card>
        </TabsContent>

         <TabsContent value="requested">
            <Card className="mt-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Your Food Requests</CardTitle>
                    <CardDescription>Track the status of the food items you have requested.</CardDescription>
                </CardHeader>
                 <CardContent>
                    {requestedListings.length > 0 ? (
                        <div className="space-y-4">
                            {requestedListings.map((listing) => (
                                <Card key={listing.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4">
                                     <div className="flex-grow">
                                        <p className="font-semibold">{listing.foodType} <span className="text-sm font-normal text-muted-foreground">({listing.quantity})</span></p>
                                        <p className="text-sm text-muted-foreground">From: {listing.donorName} | Expires: {format(new Date(listing.expiryDate), "PPP")}</p>
                                     </div>
                                     <div className="flex items-center gap-2 flex-shrink-0">
                                         <Badge className={cn(
                                             listing.status === 'Requested' && 'bg-yellow-100 text-yellow-800',
                                             listing.status === 'Approved' && 'bg-green-100 text-green-800', // Example status
                                             listing.status === 'Declined' && 'bg-red-100 text-red-800' // Example status
                                         )}>
                                            {listing.status === 'Requested' && <Hourglass className="mr-1 h-3 w-3"/>}
                                            {listing.status === 'Approved' && <CheckCircle className="mr-1 h-3 w-3"/>}
                                             {listing.status}
                                         </Badge>
                                        <Button variant="outline" size="sm" >Chat</Button>
                                     </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12">
                            <Inbox className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">You haven't requested any food yet.</p>
                            <p className="text-sm text-muted-foreground">Browse the 'Available Food' tab to find donations.</p>
                        </div>
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
