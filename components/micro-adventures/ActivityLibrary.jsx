"use client";

import { useMemo, useState } from "react";
import {
  Grid3x3,
  Palette,
  BookOpen,
  FlaskConical,
  TreePine,
  Globe,
  Puzzle,
  Music,
  ChefHat,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import {
  activityCategories,
  getMicroActivities,
} from "@/lib/mock-data/activities";

const iconMap = {
  Grid3x3,
  Palette,
  BookOpen,
  FlaskConical,
  TreePine,
  Globe,
  Puzzle,
  Music,
  ChefHat,
};

const difficultyColors = {
  Beginner: "bg-peach text-primary-dark border-coral/30",
  Intermediate: "bg-coral/20 text-primary-dark border-coral/30",
  Advanced: "bg-primary/10 text-primary-dark border-primary/20",
};

export function ActivityLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedLearningGoal, setSelectedLearningGoal] = useState("all");

  const baseActivities = getMicroActivities({
    categoryId: selectedCategory,
    age: selectedAge,
  });

  const learningGoalOptions = useMemo(() => {
    const goals = baseActivities.flatMap(
      (activity) => activity.learningGoals || [],
    );
    return [...new Set(goals)].sort((a, b) => a.localeCompare(b));
  }, [baseActivities]);

  const filteredActivities = baseActivities.filter((activity) => {
    const price = Number(activity.price) || 0;
    const priceMatch =
      selectedPriceRange === "all" ||
      (selectedPriceRange === "under-25" && price < 25) ||
      (selectedPriceRange === "25-30" && price >= 25 && price <= 30) ||
      (selectedPriceRange === "31-40" && price >= 31 && price <= 40) ||
      (selectedPriceRange === "over-40" && price > 40);

    const learningGoalMatch =
      selectedLearningGoal === "all" ||
      activity.learningGoals?.includes(selectedLearningGoal);

    return priceMatch && learningGoalMatch;
  });

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedAge("all");
    setSelectedPriceRange("all");
    setSelectedLearningGoal("all");
  };

  return (
    <section id="activities" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary font-semibold text-xs px-3 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Micro-Adventures Library
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Find the Perfect Activity in Seconds
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Filter by age, budget, and learning goals to quickly match the right
            activity to your child.
          </p>
        </div>

        <div className="mb-6 overflow-x-auto pb-3">
          <div className="flex gap-2.5 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
            {activityCategories.map((category) => {
              const Icon = iconMap[category.icon];
              const isActive = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                    isActive
                      ? "bg-linear-to-r from-primary to-primary-dark border-transparent text-white shadow-md"
                      : "bg-white border-gray-200 text-gray-700 hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/20" : "bg-gray-100"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white/90 backdrop-blur border border-gray-200 p-4 sm:p-5 shadow-sm">
          {/* <div className="flex items-center gap-2 mb-4 text-gray-900">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">Smart Filters</p>
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="age-filter"
                className="text-xs font-semibold text-gray-600"
              >
                Child Age
              </label>
              <select
                id="age-filter"
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All ages</option>
                <option value="2">2 years old</option>
                <option value="3">3 years old</option>
                <option value="4">4 years old</option>
                <option value="5">5 years old</option>
                <option value="6">6 years old</option>
                <option value="7">7 years old</option>
                <option value="8">8 years old</option>
                <option value="9">9 years old</option>
                <option value="10">10 years old</option>
                <option value="11">11 years old</option>
                <option value="12">12 years old</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="price-filter"
                className="text-xs font-semibold text-gray-600"
              >
                Price Range
              </label>
              <select
                id="price-filter"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All prices</option>
                <option value="under-25">Under $25</option>
                <option value="25-30">$25 - $30</option>
                <option value="31-40">$31 - $40</option>
                <option value="over-40">Over $40</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="goal-filter"
                className="text-xs font-semibold text-gray-600"
              >
                Learning Goal
              </label>
              <select
                id="goal-filter"
                value={selectedLearningGoal}
                onChange={(e) => setSelectedLearningGoal(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All learning goals</option>
                {learningGoalOptions.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <strong className="text-gray-900">
              {filteredActivities.length}
            </strong>{" "}
            activities
          </p>
          <button
            onClick={clearAllFilters}
            className="text-sm font-semibold text-primary hover:text-primary-dark"
          >
            Reset filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const CategoryIcon =
              iconMap[
                activityCategories.find((c) => c.id === activity.category)
                  ?.icon || "Grid3x3"
              ];

            return (
              <article
                key={activity.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-linear-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-4 h-4 text-white" />
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border font-medium ${difficultyColors[activity.difficulty]}`}
                        >
                          {activity.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {activity.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                        Price
                      </p>
                      <p className="text-base font-bold text-primary">
                        ${activity.price}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{activity.ageRange}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{activity.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {activity.learningGoals.slice(0, 3).map((goal, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {goal}
                      </span>
                    ))}
                    {activity.learningGoals.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                        +{activity.learningGoals.length - 3} more
                      </span>
                    )}
                  </div>

                  {activity.specialFeature && (
                    <div className="mb-4 flex items-center gap-1.5 text-xs text-primary">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        {activity.specialFeature}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span>
                        Used in{" "}
                        <strong className="text-gray-900">
                          {activity.popularity}
                        </strong>{" "}
                        bookings
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <details className="group/details">
                    <summary className="cursor-pointer text-sm font-semibold text-primary hover:text-primary-dark transition-colors list-none">
                      <span className="group-open/details:hidden">
                        View Details →
                      </span>
                      <span className="hidden group-open/details:inline">
                        Hide Details ←
                      </span>
                    </summary>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 mb-1">
                          Full Description
                        </h4>
                        <p className="text-sm text-gray-600">
                          {activity.fullDescription}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 mb-1">
                          Materials Needed
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {activity.materials.map((material, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-1 font-medium text-primary">
                            ${activity.price}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Mess Level:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {activity.messLevel}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {activity.indoor && activity.outdoor
                              ? "Indoor/Outdoor"
                              : activity.indoor
                                ? "Indoor"
                                : "Outdoor"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </article>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-white border border-gray-200 mt-6">
            <p className="text-gray-600 mb-4">
              No activities match your filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="text-primary font-semibold hover:text-primary-dark"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
