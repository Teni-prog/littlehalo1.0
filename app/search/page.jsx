import { SitterCard } from "@/components/sitter-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";

// Dummy Data
const SITTERS = [
    {
        id: "1",
        email: "sarah@example.com",
        user_type: "sitter",
        created_at: "",
        name: "Sarah Chen",
        image: "https://i.pravatar.cc/150?u=jennifer",
        bio: "Experienced childcare provider specializing in special needs support with a warm, patient approach. Committed to creating safe and engaging environments for children to thrive.",
        hourly_rate: 25,
        languages: ["Mandarin", "English"],
        location: "Fredericton, NB",
        is_verified: true,
        rating: 4.9,
        reviews: 12,
        background_check_status: "approved"
    },
    {
        id: "2",
        email: "maria@example.com",
        user_type: "sitter",
        created_at: "",
        name: "Maria Rodriguez",
        image: "",
        bio: "Patient and loving sitter from Colombia. I love cooking and teaching Spanish to kids. First aid certified.",
        hourly_rate: 22,
        languages: ["Spanish", "English"],
        location: "Dartmouth, NS",
        is_verified: true,
        rating: 4.8,
        reviews: 28,
        background_check_status: "approved"
    },
    {
        id: "3",
        email: "fatima@example.com",
        user_type: "sitter",
        created_at: "",
        name: "Fatima Al-Sayed",
        image: "",
        bio: "Mother of two, offering babysitting for newcomer families. I understand the challenges of settling in. Speak Arabic and English.",
        hourly_rate: 20,
        languages: ["Arabic", "English", "French"],
        location: "Bedford, NS",
        is_verified: false, // For demo
        rating: 5.0,
        reviews: 5,
        background_check_status: "pending"
    }
];

export default function SearchPage() {
    return (
        <>
            <div className=" container py-8 min-h-screen bg-gray-100 ">
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-end md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold font-outfit mb-2 justify-center">Find a Sitter</h1>
                        <p className="text-muted-foreground justify-center">Connect with trusted local babysitters.</p>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
                    <div className=" md:w-72 shrink-0 bg-white rounded-xl p-6 shadow-sm h-fit">

                        <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                            <SlidersHorizontal className="h-5 w-5 text-[#ff6b6b]" />
                            <h2 className="text-lg font-semibold">Filters</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                                <Input placeholder="Fredericton, NB" className="h-10" />
                            </div>
                            {/* <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
                                <Input type="date" className="h-10" />
                            </div> */}
                            {/* <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
                                <Input type="checkbox" className="h-10" />
                            </div> */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Hourly Rate</label>
                                <Input placeholder="Min" className="h-10 mb-2" type="number" />
                                <Input placeholder="Max" className="h-10" type="number" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Experience (years)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    defaultValue="10"
                                    className="w-full h-2 rounded-lg cursor-pointer"
                                    style={{ accentColor: "#ff6b6b" }}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>0</span>
                                    <span>10+</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Certifications</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">First Aid</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">CPR</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Languages</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">English</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">Spanish</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">French</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Special Needs Experience</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">Autism</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">ADHD</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]" />
                                        <span className="text-gray-700">Language Barriers</span>
                                    </label>
                                </div>
                            </div>

                            <Button className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white h-11 cursor-pointer">
                                Apply Filters
                            </Button>
                        </div>

                    </div>
                    {/* <div className="grid grid-cols-1justify-center items-center "> */}

                    {/* <p className="text-sm font-semibold mb-4 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                            {SITTERS.length} verified sitters available in your area
                        </p> */}
                    <div className="flex-1 flex flex-col gap-4">
                        {SITTERS.map((sitter) => (
                            <SitterCard key={sitter.id} sitter={sitter} />
                        ))}
                    </div>

                    {/* </div> */}
                </div>


            </div>
        </>
    );
}
