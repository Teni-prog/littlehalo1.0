import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Sitter from "@/assets/sitter1.png"
import Link from "next/link";

export function SitterCard({ sitter }) {
    return (
        <>
            {/* <div className="flex justify-center "> */}
            <Card className="flex flex-col w-full mx-auto h-full">
                <div className="flex-col md:flex-row justify-evenly">
                    <div className="relative h-48 md:h-48 w-full md:w-48 shrink-0 bg-muted rounded-t-lg md:rounded-lg md:ml-6 md:my-6">
                        {/* Placeholder for now if no image */}
                        {/* <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center text-4xl">
                        {sitter.name.charAt(0)}
                    </div> */}
                        <Image
                            src={sitter.image}
                            alt={sitter.name}
                            fill
                            className="object-cover rounded-t-xl md:rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        {sitter.name}
                                        {sitter.is_verified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <MapPin className="w-4 h-4" /> {sitter.location}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-yellow-700 text-sm font-bold">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    {sitter.rating} <span className="text-muted-foreground font-normal ml-1">({sitter.reviews})</span>
                                </div>
                            </div>
                        </CardHeader>
                    </div>
                    <CardContent>
                        <div className="font-bold text-lg">
                            ${sitter.hourly_rate}<span className="text-sm font-normal text-muted-foreground">/hr</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {sitter.languages?.map((lang) => (
                                <span key={lang} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                    {lang}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {sitter.bio}
                        </p>
                    </CardContent>

                </div>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 items-stretch sm:items-center pt-4 bg-muted/20">

                    <Link href="/booking"><Button className="w-full sm:w-auto">Book Now</Button></Link>
                    <Link href="/profile"><Button className="w-full sm:w-auto">View Profile</Button></Link>
                </CardFooter>
            </Card>
            {/* </div > */}
        </>
    );
}
