import { useRoute, Link } from "wouter";
import { useEvent } from "@/hooks/use-events";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Share2, 
  ExternalLink,
  Clock,
  Ticket
} from "lucide-react";
import { format } from "date-fns";

export default function EventDetail() {
  const [, params] = useRoute("/events/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: event, isLoading, error } = useEvent(id);

  if (isLoading) return <EventDetailSkeleton />;
  if (error || !event) return <EventNotFound />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Events
        </Link>
        
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-xl">
          <div className="relative aspect-video sm:aspect-[21/9] bg-secondary">
            {event.imageUrl ? (
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <Calendar className="w-20 h-20 text-muted-foreground/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
              <div className="flex gap-3 mb-4">
                <Badge className="bg-primary hover:bg-primary text-white border-0 text-sm py-1 px-3">
                  {event.category}
                </Badge>
                {event.isFree && (
                  <Badge variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-md">
                    Free Event
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 text-shadow">
                {event.title}
              </h1>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8">
            <div className="col-span-2 p-6 sm:p-10 space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  About this Event
                </h2>
                <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed">
                  {event.description || "No description provided."}
                </div>
              </div>
              
              <div className="border-t border-border pt-8">
                <h3 className="font-semibold mb-4">Share this event</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full gap-2">
                    <Share2 className="w-4 h-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:border-l border-border bg-secondary/30 p-6 sm:p-10 space-y-8">
              {/* AdSense Sidebar Ad */}
              <div className="bg-secondary/50 border border-border rounded-lg p-4 text-center text-muted-foreground text-sm">
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
                  crossOrigin="anonymous"></script>
                <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
                  data-ad-slot="0000000002" data-ad-format="vertical" data-full-width-responsive="true"></ins>
                <script>
                  {`(adsbygoogle = window.adsbygoogle || []).push({});`}
                </script>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-border/50 text-primary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Date</p>
                    <p className="text-muted-foreground">
                      {format(new Date(event.startTime), "EEEE, MMMM do, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-border/50 text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Time</p>
                    <p className="text-muted-foreground">
                      {format(new Date(event.startTime), "h:mm a")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-border/50 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Location</p>
                    <p className="text-muted-foreground">{event.location || "Location TBD"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-border/50 text-primary">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Price</p>
                    <p className="text-muted-foreground">
                      {event.isFree ? "Free admission" : "Check website for pricing"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                {event.sourceUrl ? (
                  <Button className="w-full text-lg h-12 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                    <a href={event.sourceUrl} target="_blank" rel="noreferrer">
                      Visit Event Website
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full text-lg h-12 rounded-xl" disabled>
                    More Info Coming Soon
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-6 w-32 bg-secondary rounded mb-8 animate-pulse" />
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-xl">
          <Skeleton className="w-full aspect-[21/9]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10">
            <div className="col-span-2 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Event Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          We couldn't find the event you're looking for. It might have been removed or the link is incorrect.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full">
            Browse All Events
          </Button>
        </Link>
      </div>
    </div>
  );
}
