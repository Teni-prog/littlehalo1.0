import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import Image from "next/image";
import Sitter from "@/assets/sitter1.png"

export function SitterCard({ sitter }) {
    return (
        <>
            {/* <div className="flex justify-center "> */}
            <Card className="flex flex-col w-full mx-auto h-full">
                <div className="flex justify-evenly">
                    <div className="relative h-48 w-5/6 bg-muted rounded-lg ml-6">
                        {/* Placeholder for now if no image */}
                        {/* <div className="absolute inset-0 bg-secondary/30 flex items-center justify-center text-4xl">
                        {sitter.name.charAt(0)}
                    </div> */}
                        <Image
                            src={Sitter}
                            alt={sitter.name}
                            fill
                            className="object-cover h-50 w-30 rounded-xl"
                        />
                    </div>
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
                <CardFooter className="flex justify-center gap-4 items-center  pt-4 bg-muted/20 cursor-pointer ">

                    <Button>Book Now</Button>
                    <Button>View Profile</Button>
                </CardFooter>
            </Card>
            {/* </div > */}
        </>
    );
}
