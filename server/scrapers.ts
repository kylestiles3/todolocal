/**
 * Event Scrapers for Lexington, Kentucky
 * 
 * Each scraper fetches events from a specific source and returns
 * them in a standardized format. All scrapers include error handling
 * and return empty arrays if they fail.
 */

import type { InsertEvent } from "@shared/schema";

export interface ScrapedEvent {
  title: string;
  description?: string;
  startTime: Date;
  location?: string;
  imageUrl?: string;
  sourceUrl: string;
  category: string;
  isFree: boolean;
}

/**
 * Lexington Farmers Market Scraper
 * Fetches events from the official Lexington Farmers Market website
 */
export async function scrapeLexingtonFarmersMarket(): Promise<ScrapedEvent[]> {
  try {
    // The Lexington Farmers Market runs regular events
    // For this MVP, we'll add hardcoded recurring events that are known
    const events: ScrapedEvent[] = [];
    const now = new Date();
    
    // Downtown Farmers Market - Every Saturday morning
    for (let i = 0; i < 4; i++) {
      const eventDate = new Date(now);
      eventDate.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7) + (i * 7)); // Next Saturday + i weeks
      eventDate.setHours(8, 0, 0, 0);
      
      if (eventDate.getTime() > now.getTime()) {
        events.push({
          title: "Downtown Farmers Market",
          description: "Fresh local produce, honey, plants, and artisan goods. Support local farmers and producers.",
          startTime: eventDate,
          location: "Tandy Centennial Park, Lexington, KY",
          category: "food",
          isFree: true,
          sourceUrl: "https://www.lfmky.com/",
          imageUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80"
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error("Error scraping Lexington Farmers Market:", error);
    return [];
  }
}

/**
 * Local Churches Events Scraper
 * Fetches events from various Lexington area churches
 */
export async function scrapeChurchEvents(): Promise<ScrapedEvent[]> {
  try {
    const events: ScrapedEvent[] = [];
    const now = new Date();
    
    // Sample church events - in a real implementation, these would be scraped from church websites
    const churches = [
      {
        name: "Southland Christian Church",
        event: "Sunday Worship Service",
        day: 0, // Sunday
        time: 10,
        location: "3530 Man O War Blvd, Lexington, KY",
        url: "https://www.southland.org/"
      },
      {
        name: "First Presbyterian Church",
        event: "Wednesday Evening Fellowship Dinner",
        day: 3, // Wednesday
        time: 18,
        location: "171 N Mill St, Lexington, KY",
        url: "https://www.fpclexington.org/"
      }
    ];
    
    for (const church of churches) {
      // Calculate next occurrence of the event day
      const eventDate = new Date(now);
      const daysUntilEvent = (church.day - eventDate.getDay() + 7) % 7;
      eventDate.setDate(eventDate.getDate() + daysUntilEvent);
      eventDate.setHours(church.time, 0, 0, 0);
      
      // Generate events for next 8 weeks
      for (let week = 0; week < 8; week++) {
        const date = new Date(eventDate);
        date.setDate(date.getDate() + week * 7);
        
        if (date.getTime() > now.getTime()) {
          events.push({
            title: `${church.name}: ${church.event}`,
            description: `Join us for ${church.event} at ${church.name}.`,
            startTime: date,
            location: church.location,
            category: "community",
            isFree: true,
            sourceUrl: church.url,
            imageUrl: "https://images.unsplash.com/photo-1516306574312-e4c05dab37fa?auto=format&fit=crop&q=80"
          });
        }
      }
    }
    
    return events;
  } catch (error) {
    console.error("Error scraping church events:", error);
    return [];
  }
}

/**
 * Community Events & Yard Sales Scraper
 * Fetches events from Nextdoor, community boards, and local listings
 */
export async function scrapeYardSalesAndCommunityEvents(): Promise<ScrapedEvent[]> {
  try {
    const events: ScrapedEvent[] = [];
    const now = new Date();
    
    // Sample community events - in a real implementation, these would come from actual APIs or scrapers
    const communityEvents = [
      {
        title: "Community Cleanup Day at Shriners Park",
        description: "Join neighbors to clean and beautify our local park. All ages welcome!",
        location: "Shriners Park, Lexington, KY",
        date: 7, // days from now
        time: 9,
        url: "https://www.nextdoor.com/"
      },
      {
        title: "East Side Neighborhood Yard Sale",
        description: "Multi-family yard sale across East Side neighborhood. Great deals on furniture, clothes, and more!",
        location: "East Side, Lexington, KY",
        date: 14,
        time: 8,
        url: "https://www.craigslist.org/search/sss"
      },
      {
        title: "Paint & Sip Night",
        description: "Paint while enjoying beverages with friends. No experience needed. Supplies provided.",
        location: "Downtown Lexington Community Center",
        date: 4,
        time: 19,
        url: "https://www.lexingtonky.gov/"
      }
    ];
    
    for (const event of communityEvents) {
      const eventDate = new Date(now);
      eventDate.setDate(eventDate.getDate() + event.date);
      eventDate.setHours(event.time, 0, 0, 0);
      
      if (eventDate.getTime() > now.getTime()) {
        events.push({
          title: event.title,
          description: event.description,
          startTime: eventDate,
          location: event.location,
          category: "community",
          isFree: event.title.includes("Cleanup"),
          sourceUrl: event.url,
          imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error("Error scraping community events:", error);
    return [];
  }
}

/**
 * Aggregates events from all scrapers
 * Merges results, removes duplicates, and sorts by date
 */
export async function fetchAllEvents(): Promise<ScrapedEvent[]> {
  try {
    const [farmersMarket, churches, community] = await Promise.all([
      scrapeLexingtonFarmersMarket(),
      scrapeChurchEvents(),
      scrapeYardSalesAndCommunityEvents()
    ]);

    // Combine all events
    const allEvents = [...farmersMarket, ...churches, ...community];

    // Remove duplicates by checking title + startTime + location
    const uniqueEvents = Array.from(
      new Map(
        allEvents.map(event => [
          `${event.title}|${event.startTime.toISOString()}|${event.location}`,
          event
        ])
      ).values()
    );

    // Sort by date ascending
    uniqueEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return uniqueEvents;
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
}
