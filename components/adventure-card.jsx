import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock } from "lucide-react";

export function AdventureCard({ adventure }) {
    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all group">
            <div className="relative h-40 w-full bg-secondary/50 overflow-hidden">
                {/* Placeholder for image */}
                <div className="absolute inset-0 bg-secondary flex items-center justify-center text-secondary-foreground opacity-50">
                    Micro-Adventure
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1">{adventure.title}</CardTitle>
                <CardDescription>by {adventure.sitter_name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="w-4 h-4" />
                    {adventure.duration_minutes} mins
                </div>
                <p className="text-sm line-clamp-3 mb-4">{adventure.description}</p>
                <div className="flex flex-wrap gap-1">
                    {adventure.tags?.map(tag => (
                        <span key={tag} className="text-[10px] uppercase font-bold bg-accent/10 text-accent-foreground px-2 py-1 rounded-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
                <div className="font-bold text-lg">
                    ${adventure.price}
                </div>
                <Button size="sm" variant="secondary">Details</Button>
            </CardFooter>
        </Card>
    );
}
