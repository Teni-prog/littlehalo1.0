'use client';

import { useState } from 'react';
import { 
  Grid3x3, Palette, BookOpen, FlaskConical, TreePine, Globe, 
  Puzzle, Music, ChefHat, Clock, Users, TrendingUp, Sparkles 
} from 'lucide-react';
import { activityCategories, mockActivities } from '@/lib/mock-data/activities';

const iconMap = {
  Grid3x3, Palette, BookOpen, FlaskConical, TreePine, 
  Globe, Puzzle, Music, ChefHat
};

export function ActivityLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');

  const filteredActivities = mockActivities.filter(activity => {
    const categoryMatch = selectedCategory === 'all' || activity.category === selectedCategory;
    const ageMatch = selectedAge === 'all' || 
      (parseInt(selectedAge) >= activity.ageMin && parseInt(selectedAge) <= activity.ageMax);
    return categoryMatch && ageMatch;
  });

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-700 border-green-200',
    'Intermediate': 'bg-orange-100 text-orange-700 border-orange-200',
    'Advanced': 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <section id="activities" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Browse Our Activity Library
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from 50+ educational activities or let your sitter customize based on your child's interests
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max sm:min-w-0 sm:flex-wrap sm:justify-center">
            {activityCategories.map((category) => {
              const Icon = iconMap[category.icon];
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E5533D] to-[#D4442C] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Filter */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <label htmlFor="age-filter" className="text-sm font-medium text-gray-700">
            Filter by child's age:
          </label>
          <select
            id="age-filter"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#E5533D]/20"
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

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">
            Showing <strong className="text-gray-900">{filteredActivities.length}</strong> activities
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const CategoryIcon = iconMap[activityCategories.find(c => c.id === activity.category)?.icon || 'Grid3x3'];
            
            return (
              <div
                key={activity.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E5533D] to-[#D4442C] rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${difficultyColors[activity.difficulty]}`}>
                          {activity.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#E5533D] transition-colors">
                        {activity.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {activity.description}
                  </p>

                  {/* Meta Info */}
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

                  {/* Learning Goals */}
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

                  {/* Special Feature Badge */}
                  {activity.specialFeature && (
                    <div className="mb-4 flex items-center gap-1.5 text-xs text-[#E5533D]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="font-medium">{activity.specialFeature}</span>
                    </div>
                  )}

                  {/* Popularity */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      <span>Used in <strong className="text-gray-900">{activity.popularity}</strong> bookings</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Hidden Details */}
                <div className="px-6 pb-6">
                  <details className="group/details">
                    <summary className="cursor-pointer text-sm font-semibold text-[#E5533D] hover:text-[#D4442C] transition-colors list-none">
                      <span className="group-open/details:hidden">View Details →</span>
                      <span className="hidden group-open/details:inline">Hide Details ←</span>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                      {/* Full Description */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 mb-1">Full Description</h4>
                        <p className="text-sm text-gray-600">{activity.fullDescription}</p>
                      </div>

                      {/* Materials */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 mb-1">Materials Needed</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {activity.materials.map((material, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#E5533D] mt-0.5">•</span>
                              <span>{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Properties */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Mess Level:</span>
                          <span className="ml-1 font-medium text-gray-900">{activity.messLevel}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {activity.indoor && activity.outdoor ? 'Indoor/Outdoor' : activity.indoor ? 'Indoor' : 'Outdoor'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No activities match your filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedAge('all');
              }}
              className="text-[#E5533D] font-semibold hover:text-[#D4442C]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
