import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, HeartHandshake, Users } from 'lucide-react'; // Using relevant icons
import Link from 'next/link';
import Image from 'next/image';

// Sample data for impact stats - replace with dynamic data from Firestore later
const impactStats = {
  foodDonated: 1250, // in kg
  mealsServed: 5000,
  peopleHelped: 800,
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="text-center mb-12 md:mb-20">
        <Image
          src="https://picsum.photos/1200/400?random=1" // Placeholder community image
          alt="Community receiving food donations"
          width={1200}
          height={400}
          className="rounded-lg shadow-md mb-8 mx-auto object-cover max-h-[300px] md:max-h-[400px]"
          priority // Load image quickly
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          Zero Waste, Zero Hunger
        </h1>
        <p className="text-lg md:text-xl text-foreground mb-8 max-w-3xl mx-auto">
          Connecting compassionate hearts to bridge the gap between surplus food and those in need. Join us in making a difference, one meal at a time.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-[#FFA726] hover:bg-[#FB8C00] text-white">
            <Link href="/register?role=Donor">Donate Food</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/register?role=Receiver">Request Food</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
             <Link href="/register?role=NGO">Register as NGO</Link>
          </Button>
        </div>
      </section>

      <section className="mb-12 md:mb-20">
        <h2 className="text-3xl font-semibold text-center mb-8 text-primary">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <Card className="shadow-lg border-t-4 border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Food Donated (kg)
              </CardTitle>
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{impactStats.foodDonated.toLocaleString()} kg</div>
              <p className="text-xs text-muted-foreground">
                Reducing waste and nourishing lives.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-t-4 border-[#FFA726]">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Meals Served
              </CardTitle>
              <HeartHandshake className="h-5 w-5 text-[#FFA726]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{impactStats.mealsServed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Bringing warmth and sustenance to many.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-t-4 border-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                People Helped
              </CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{impactStats.peopleHelped.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Supporting individuals and families in need.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

       <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4 text-primary">How It Works</h2>
          <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
            A simple process to connect donors and receivers efficiently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
               <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <UtensilsCrossed className="h-10 w-10 text-primary" />
               </div>
               <h3 className="text-xl font-semibold mb-2">1. List or Request</h3>
               <p className="text-muted-foreground">Donors list surplus food. Receivers find and request what they need.</p>
            </div>
             <div className="flex flex-col items-center">
               <div className="bg-[#FFA726]/10 p-4 rounded-full mb-4">
                  <HeartHandshake className="h-10 w-10 text-[#FFA726]" />
               </div>
               <h3 className="text-xl font-semibold mb-2">2. Match & Connect</h3>
               <p className="text-muted-foreground">Our system matches based on location and urgency. Users connect via chat.</p>
            </div>
             <div className="flex flex-col items-center">
               <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <Users className="h-10 w-10 text-accent" />
               </div>
               <h3 className="text-xl font-semibold mb-2">3. Coordinate & Collect</h3>
               <p className="text-muted-foreground">Arrange pickup/delivery details. NGOs help verify and track impact.</p>
            </div>
          </div>
       </section>

    </div>
  );
}
