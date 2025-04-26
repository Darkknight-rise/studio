'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, CheckCircle, PieChart, MessageSquare, Users, UtensilsCrossed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Using recharts for impact chart


// Mock data for pending requests - replace with Firestore data
const mockPendingRequests = [
  { id: 'req1', listingId: 'l2', foodType: 'Bread Loaves', quantity: '30 loaves', expiryDate: '2025-05-14', donorName: 'Bakery A', receiverName: 'Bob R.', requestDate: '2025-05-13', status: 'Requested' },
  { id: 'req2', listingId: 'l1', foodType: 'Fresh Vegetables', quantity: '5 kg', expiryDate: '2025-05-15', donorName: 'John D.', receiverName: 'Community Kitchen', requestDate: '2025-05-13', status: 'Requested' },
];

// Mock data for donation history - replace with Firestore data
const mockDonationHistory = [
 { id: 'd1', foodType: 'Fruits', quantity: '10kg', donorName: 'John D.', receiverName: 'Bob R.', completionDate: '2025-04-28', verified: true },
 { id: 'd2', foodType: 'Meals', quantity: '20 servings', donorName: 'Alice M.', receiverName: 'Clara S.', completionDate: '2025-04-27', verified: true },
 { id: 'd3', foodType: 'Bakery Items', quantity: '5 boxes', donorName: 'Supermarket C', receiverName: 'Shelter Home', completionDate: '2025-05-08', verified: false }, // Example unverified
];

// Mock impact data - replace with aggregated Firestore data
const mockImpactData = {
  totalDonations: 35, // total count
  totalKgDonated: 55, // approx kg
  totalMealsServed: 150,
  monthlyDonations: [ // Example data for chart
    { month: 'Jan', donations: 5, kg: 10 },
    { month: 'Feb', donations: 8, kg: 15 },
    { month: 'Mar', donations: 12, kg: 20 },
    { month: 'Apr', donations: 10, kg: 10 },
  ]
};


// Mock user data (replace with data fetched based on stored ID/role)
const mockUser = {
  name: typeof window !== 'undefined' ? localStorage.getItem('foodConnectUserName') || 'NGO Admin' : 'NGO Admin',
  city: typeof window !== 'undefined' ? localStorage.getItem('foodConnectUserCity') || 'Chennai' : 'Chennai',
};


export default function NGODashboard() {
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = React.useState(mockPendingRequests);
  const [donationHistory, setDonationHistory] = React.useState(mockDonationHistory);
   const [impactData, setImpactData] = React.useState(mockImpactData); // State for impact data
   const [userName, setUserName] = React.useState('NGO Admin');


   React.useEffect(() => {
    // Fetch user details from local storage on mount (MVP)
    const storedName = localStorage.getItem('foodConnectUserName');
    const storedRole = localStorage.getItem('foodConnectUserRole');

     if (storedRole !== 'NGO') {
         toast({ title: 'Access Denied', description: 'You must be registered as an NGO to view this page.', variant: 'destructive' });
         // Consider redirecting
    }
    if (storedName) setUserName(storedName);


    // TODO: Fetch actual data from Firestore
    // - Query listings collection where status == 'Requested' (potentially filter by NGO's city if applicable)
    // - Query donations collection for history and aggregation for impact stats
    // - Set up real-time listeners for new requests/updates
  }, [toast]);


   // TODO: Implement approve/reject request logic
   const handleUpdateRequestStatus = async (requestId: string, newStatus: 'Approved' | 'Rejected') => {
     console.log(`Updating request ${requestId} to ${newStatus}`);
     // Simulate API call / Firestore update
     await new Promise(resolve => setTimeout(resolve, 1000));

      // Update UI state (replace with real-time listener update)
      setPendingRequests(pendingRequests.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
      ).filter(req => req.status === 'Requested')); // Keep only pending in this view

      // Potentially move approved/rejected to donation history or another tracking mechanism
       if (newStatus === 'Approved') {
            // Add to donation history (example) - Needs more details
            const request = pendingRequests.find(req => req.id === requestId);
            if (request) {
                const newDonation = {
                     id: `d${Date.now()}`,
                    foodType: request.foodType,
                    quantity: request.quantity,
                    donorName: request.donorName,
                    receiverName: request.receiverName,
                    completionDate: format(new Date(), "yyyy-MM-dd"),
                    verified: false, // Needs verification after pickup
                };
                setDonationHistory([newDonation, ...donationHistory]);
            }
        }

     toast({
       title: `Request ${newStatus}`,
       description: `The request has been marked as ${newStatus}.`,
     });
   };


   // TODO: Implement verify donation logic
   const handleVerifyDonation = async (donationId: string) => {
        console.log(`Verifying donation ${donationId}`);
        // Simulate API call / Firestore update
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update UI state (replace with real-time listener update)
        setDonationHistory(donationHistory.map(don =>
            don.id === donationId ? { ...don, verified: true } : don
        ));

        toast({
            title: 'Donation Verified',
            description: 'The donation has been successfully marked as completed.',
        });
   };


  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-2">NGO Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome, {userName}! Manage donations and track impact.</p>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="requests"><Handshake className="mr-2 h-4 w-4"/> Manage Requests</TabsTrigger>
          <TabsTrigger value="history"><CheckCircle className="mr-2 h-4 w-4"/> Verify Donations</TabsTrigger>
          <TabsTrigger value="impact"><PieChart className="mr-2 h-4 w-4"/> View Impact</TabsTrigger>
          <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4"/> Coordination Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card className="mt-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">Pending Food Requests</CardTitle>
              <CardDescription>Review and manage incoming food requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Food</TableHead>
                        <TableHead>Donor</TableHead>
                        <TableHead>Receiver</TableHead>
                         <TableHead>Requested On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingRequests.map((req) => (
                        <TableRow key={req.id}>
                            <TableCell>{req.foodType} ({req.quantity})</TableCell>
                            <TableCell>{req.donorName}</TableCell>
                            <TableCell>{req.receiverName}</TableCell>
                            <TableCell>{format(new Date(req.requestDate), "PPp")}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleUpdateRequestStatus(req.id, 'Approved')}>Approve</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleUpdateRequestStatus(req.id, 'Rejected')}>Reject</Button>
                                <Button variant="ghost" size="sm">Chat</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
              ) : (
                 <p className="text-muted-foreground text-center py-8">No pending requests at the moment.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
            <Card className="mt-6 shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Donation History & Verification</CardTitle>
                <CardDescription>Verify completed donations to update impact metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                 {donationHistory.length > 0 ? (
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Food</TableHead>
                            <TableHead>Donor</TableHead>
                             <TableHead>Receiver</TableHead>
                            <TableHead>Completed On</TableHead>
                            <TableHead className="text-right">Status / Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donationHistory.map((don) => (
                            <TableRow key={don.id}>
                                <TableCell>{don.foodType} ({don.quantity})</TableCell>
                                <TableCell>{don.donorName}</TableCell>
                                <TableCell>{don.receiverName}</TableCell>
                                <TableCell>{format(new Date(don.completionDate), "PPP")}</TableCell>
                                <TableCell className="text-right">
                                    {don.verified ? (
                                        <Badge className="bg-green-100 text-green-800">
                                            <CheckCircle className="mr-1 h-3 w-3"/> Verified
                                        </Badge>
                                    ) : (
                                        <Button variant="secondary" size="sm" onClick={() => handleVerifyDonation(don.id)}>
                                            Verify Pickup
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                 ) : (
                    <p className="text-muted-foreground text-center py-8">No donation history available yet.</p>
                 )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="impact">
           <Card className="mt-6 shadow-lg">
                <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Community Impact Overview</CardTitle>
                <CardDescription>Track the collective effort in reducing waste and hunger.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <Card className="bg-primary/10">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                                <Handshake className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{impactData.totalDonations}</div>
                            </CardContent>
                         </Card>
                         <Card className="bg-[#FFA726]/10">
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Food Donated (Est. kg)</CardTitle>
                                <UtensilsCrossed className="h-4 w-4 text-[#FFA726]" />
                             </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{impactData.totalKgDonated} kg</div>
                            </CardContent>
                         </Card>
                          <Card className="bg-accent/10">
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Meals Served (Est.)</CardTitle>
                                <Users className="h-4 w-4 text-accent" />
                             </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{impactData.totalMealsServed}</div>
                            </CardContent>
                         </Card>
                     </div>

                     <div>
                        <h3 className="text-lg font-semibold mb-4">Monthly Donation Trends</h3>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={impactData.monthlyDonations}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" orientation="left" stroke="#4CAF50" label={{ value: 'Donations (Count)', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle'} }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#FFA726" label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight', style: {textAnchor: 'middle'} }}/>
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="donations" fill="hsl(var(--primary))" name="Donation Count" />
                             <Bar yAxisId="right" dataKey="kg" fill="hsl(var(--secondary))" name="Estimated Weight (kg)" /> {/* Using Warm Orange hex directly for now */}
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </CardContent>
            </Card>
        </TabsContent>


         <TabsContent value="chat">
             <Card className="mt-6 shadow-lg">
                 <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary">Coordination Chat</CardTitle>
                    <CardDescription>Communicate with donors and receivers to facilitate pickups.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     {/* TODO: Implement Chat Interface */}
                    <p className="text-muted-foreground text-center py-16">Chat interface placeholder. Select a conversation to start.</p>
                    {/* Need a list of conversations on the left and chat window on the right */}
                 </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
