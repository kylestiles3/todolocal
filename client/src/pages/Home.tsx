import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/use-events";
import { EventCard } from "@/components/EventCard";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2 } from "lucide-react";

export default function Home() {
  const [filter, setFilter] = useState<'all' | 'week' | 'weekend' | 'free'>('all');
  const [search, setSearch] = useState("");
  
  const { data: events, isLoading, error } = useEvents({ filter, search });

  // Add JSON-LD structured data for SEO
  useEffect(() => {
    const upcomingEvents = events?.slice(0, 5) || [];
    
    const eventSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Lexington Local Events",
      description: "Discover what's happening in Lexington, Kentucky - events, workshops, festivals, and more",
      url: window.location.href,
      mainEntity: upcomingEvents.map(event => ({
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: event.startTime,
        endDate: event.startTime,
        eventAttendanceMode: "OfflineEventAttendanceMode",
        eventStatus: "EventScheduled",
        location: {
          "@type": "Place",
          name: event.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Lexington",
            addressRegion: "Kentucky",
            addressCountry: "US"
          }
        },
        image: event.imageUrl,
        url: event.sourceUrl,
        offers: {
          "@type": "Offer",
          url: event.sourceUrl,
          price: event.isFree ? "0" : "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString()
        }
      }))
    };

    // Add meta description tag
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover what\'s happening in Lexington, Kentucky. Browse local events, festivals, workshops, classes, volunteer opportunities, and community gatherings.');
    }

    // Add Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Lexington Local Events - Discover What\'s Happening');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Find the best events happening in Lexington, Kentucky. Farmers markets, festivals, workshops, museums, volunteer opportunities and more.');
    }

    // Inject JSON-LD schema
    let scriptTag = document.getElementById('event-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'event-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(eventSchema);
      // Load Google AdSense script safely (only once)
  if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
    const script = document.createElement("script");
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  // Trigger ads render
  setTimeout(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("Adsense not ready yet");
    }
  }, 500);

  }, [events]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navigation />
      
      {/* Hero Section */}
      <header className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-secondary/50 to-background overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Discover what's happening in <span className="text-primary relative inline-block">
              Lexington
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your curated guide to local workshops, community gatherings, food festivals, and live music.
          </p>
          
          <div className="max-w-xl mx-auto mt-8 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search events, locations, or categories..."
              className="pl-10 h-14 rounded-2xl shadow-lg border-2 border-transparent focus:border-primary/20 text-lg bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h2 className="text-2xl font-bold font-display text-foreground">Upcoming Events</h2>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-[400px] bg-secondary/50 p-1 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="week" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">This Week</TabsTrigger>
              <TabsTrigger value="weekend" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Weekend</TabsTrigger>
              <TabsTrigger value="free" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Free</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* AdSense Banner Ad Placeholder */}
        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-4xl bg-secondary/30 border border-border rounded-lg p-8 text-center text-muted-foreground">
           
            <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
              data-ad-slot="0000000000" data-ad-format="horizontal" data-full-width-responsive="true"></ins>
          
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Finding the best events for you...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-500 font-medium">Failed to load events. Please try again later.</p>
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-24 bg-secondary/30 rounded-3xl border border-dashed border-border">
            <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters to see more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </main>
      
      {/* AdSense Footer Ad Placeholder */}
      <div className="bg-secondary/20 py-12 mt-20 mb-0 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
            data-ad-slot="0000000001" data-ad-format="horizontal" data-full-width-responsive="true"></ins>
          
        </div>
      </div>

      <footer className="bg-foreground text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="font-display font-bold text-2xl">Lexington Local</span>
              <p className="text-white/60 mt-2 text-sm">Connecting the community, one event at a time.</p>
            </div>
            <div className="flex gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Submit Event</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
