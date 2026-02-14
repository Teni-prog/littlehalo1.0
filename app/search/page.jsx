'use client';

import { SitterCard } from "@/components/sitter-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from 'react';
import Link from "next/link";

export default function SearchPage() {
    const [sitters, setSitters] = useState([]);
    const [filteredSitters, setFilteredSitters] = useState([]);
    const [filters, setFilters] = useState({
        location: '',
        minRate: '',
        maxRate: '',
        experience: 0,
        languages: [],
        specialNeeds: []
    });

    // Fetch sitters on component mount
    useEffect(() => {
        async function fetchSitters() {
            try {
                const response = await fetch('/api/sitters');
                const result = await response.json();

                if (!response.ok) {
                    console.error('Error fetching sitters:', result.error);
                    return;
                }

                const formatted = result.data || [];
                setSitters(formatted);
                setFilteredSitters(formatted);
            } catch (error) {
                console.error('Error fetching sitters:', error);
            }
        }

        fetchSitters();
    }, []);

    // Apply filters whenever filter state changes
    useEffect(() => {
        applyFilters();
    }, [filters, sitters]);

    const applyFilters = () => {
        let filtered = [...sitters];

        // Filter by location (case-insensitive partial match)
        if (filters.location.trim()) {
            filtered = filtered.filter(sitter =>
                sitter.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Filter by hourly rate range
        if (filters.minRate) {
            filtered = filtered.filter(sitter =>
                sitter.hourly_rate >= parseInt(filters.minRate)
            );
        }
        if (filters.maxRate) {
            filtered = filtered.filter(sitter =>
                sitter.hourly_rate <= parseInt(filters.maxRate)
            );
        }

        // Filter by experience (minimum years)
        if (filters.experience > 0) {
            filtered = filtered.filter(sitter =>
                (sitter.experience || 0) >= filters.experience
            );
        }

        // Filter by languages (sitter must have at least one selected language)
        if (filters.languages.length > 0) {
            filtered = filtered.filter(sitter =>
                sitter.languages?.some(lang =>
                    filters.languages.includes(lang)
                )
            );
        }

        // Filter by special needs (sitter must have at least one selected special need)
        if (filters.specialNeeds.length > 0) {
            filtered = filtered.filter(sitter =>
                sitter.special_needs?.some(need =>
                    filters.specialNeeds.includes(need)
                )
            );
        }

        setFilteredSitters(filtered);
    };

    const handleLanguageChange = (language) => {
        setFilters(prev => ({
            ...prev,
            languages: prev.languages.includes(language)
                ? prev.languages.filter(l => l !== language)
                : [...prev.languages, language]
        }));
    };

    const handleSpecialNeedsChange = (need) => {
        setFilters(prev => ({
            ...prev,
            specialNeeds: prev.specialNeeds.includes(need)
                ? prev.specialNeeds.filter(n => n !== need)
                : [...prev.specialNeeds, need]
        }));
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            minRate: '',
            maxRate: '',
            experience: 0,
            languages: [],
            specialNeeds: []
        });
    };

    return (
        <>
            <div className=" container py-8 min-h-screen bg-gray-100 px-4 ">
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-end md:items-center">
                    <div>
                        <Link href="">
                            <h1 className="text-3xl font-bold font-outfit mb-2 justify-center cursor-pointer">Find a Sitter</h1> </Link>
                        <p className="text-muted-foreground justify-center">Connect with trusted local babysitters.</p>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 px-0 md:px-4">
                    <div className=" w-full md:w-72 shrink-0 bg-white rounded-xl p-4 md:p-6 shadow-sm h-fit">

                        <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                            <SlidersHorizontal className="h-5 w-5 text-[#ff6b6b]" />
                            <h2 className="text-lg font-semibold">Filters</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                                <Input
                                    placeholder="Fredericton, NB"
                                    className="h-10"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Hourly Rate</label>
                                <Input
                                    placeholder="Min"
                                    className="h-10 mb-2"
                                    type="number"
                                    value={filters.minRate}
                                    onChange={(e) => setFilters({ ...filters, minRate: e.target.value })}
                                />
                                <Input
                                    placeholder="Max"
                                    className="h-10"
                                    type="number"
                                    value={filters.maxRate}
                                    onChange={(e) => setFilters({ ...filters, maxRate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Experience (years)</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={filters.experience}
                                    onChange={(e) => setFilters({ ...filters, experience: parseInt(e.target.value) })}
                                    className="w-full h-2 rounded-lg cursor-pointer"
                                    style={{ accentColor: "#ff6b6b" }}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>0</span>
                                    <span className="text-[#ff6b6b] font-semibold">{filters.experience}+ years</span>
                                    <span>10+</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Languages</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                                            checked={filters.languages.includes('English')}
                                            onChange={() => handleLanguageChange('English')}
                                        />
                                        <span className="text-gray-700">English</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                                            checked={filters.languages.includes('Spanish')}
                                            onChange={() => handleLanguageChange('Spanish')}
                                        />
                                        <span className="text-gray-700">Spanish</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                                            checked={filters.languages.includes('French')}
                                            onChange={() => handleLanguageChange('French')}
                                        />
                                        <span className="text-gray-700">French</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Special Needs Experience</label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                                            checked={filters.specialNeeds.includes('Autism')}
                                            onChange={() => handleSpecialNeedsChange('Autism')}
                                        />
                                        <span className="text-gray-700">Autism</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                                            checked={filters.specialNeeds.includes('ADHD')}
                                            onChange={() => handleSpecialNeedsChange('ADHD')}
                                        />
                                        <span className="text-gray-700">ADHD</span>
                                    </label>
                                </div>
                            </div>

                            <Button
                                onClick={clearFilters}
                                className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white h-11 cursor-pointer"
                            >
                                Clear Filters
                            </Button>
                        </div>

                    </div>

                    <div className="flex-1 flex flex-col gap-3 md:gap-4 w-full">
                        <p className="text-sm font-semibold bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                            {filteredSitters.length} {filteredSitters.length === 1 ? 'sitter' : 'sitters'} found
                        </p>
                        {filteredSitters.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                                <p className="text-gray-500 text-lg">No sitters match your filters</p>
                                <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            filteredSitters.map((sitter) => (
                                <SitterCard key={sitter.id} sitter={sitter} />
                            ))
                        )}
                    </div>
                </div>


            </div>
        </>
    );
}
