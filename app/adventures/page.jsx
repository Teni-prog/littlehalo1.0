import { AdventureCard } from "@/components/adventure-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Dummy Data
const ADVENTURES = [
    {
        id: "1",
        sitter_id: "1",
        sitter_name: "Sarah Chen",
        title: "Mandarin Storytelling & Calligraphy",
        description: "An immersive hour of storytelling in Mandarin followed by a fun beginner calligraphy session for kids.",
        duration_minutes: 60,
        price: 30,
        tags: ["Language", "Art", "Culture"]
    },
    {
        id: "2",
        sitter_id: "2",
        sitter_name: "Maria Rodriguez",
        title: "Little Chefs: Taco Making",
        description: "Safe and fun cooking session where we make mini tacos. Kids learn about ingredients and kitchen safety.",
        duration_minutes: 90,
        price: 45,
        tags: ["Cooking", "Fun", "Food"]
    },
    {
        id: "3",
        sitter_id: "3",
        sitter_name: "Fatima Al-Sayed",
        title: "Arabic Nursery Rhymes & Songs",
        description: "Singing and dancing to popular Arabic nursery rhymes. Great for toddlers to hear the language sounds.",
        duration_minutes: 45,
        price: 25,
        tags: ["Music", "Language", "Toddlers"]
    },
    {
        id: "4",
        sitter_id: "1",
        sitter_name: "Sarah Chen",
        title: "Origami Zoo",
        description: "Folding paper animals together. Teaches patience and fine motor skills.",
        duration_minutes: 45,
        price: 20,
        tags: ["Art", "Crafts"]
    }
];

export default function AdventuresPage() {
    return (
        <div className="container py-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-bold font-outfit mb-4">Micro-Adventures Library</h1>
                <p className="text-lg text-muted-foreground">
                    Don't just book a sitter, book an experience. Educational and fun activities for your children.
                </p>
            </div>

            <div className="flex justify-center mb-12">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search adventures..." className="pl-9 h-12" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ADVENTURES.map((adventure) => (
                    <AdventureCard key={adventure.id} adventure={adventure} />
                ))}
            </div>
        </div>
    );
}
