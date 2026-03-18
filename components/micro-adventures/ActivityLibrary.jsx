"use client";

import { useState } from "react";
import { mockActivities } from "@/lib/mock-data/activities";

export function ActivityLibrary() {
  const [selectedAge, setSelectedAge] = useState("all");

  const filteredActivities = mockActivities.filter((activity) => {
    const ageMatch =
      selectedAge === "all" ||
      (parseInt(selectedAge) >= activity.ageMin &&
        parseInt(selectedAge) <= activity.ageMax);
    return ageMatch;
  });

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Micro Adventures</h1>
          <p className="text-gray-600">
            Educational activities for your babysitting sessions
          </p>
        </div>

        {/* Simple Age Filter */}
        <div className="mb-6">
          <label className="text-sm font-medium mr-2">Filter by age:</label>
          <select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All ages</option>
            <option value="2">2 years</option>
            <option value="3">3 years</option>
            <option value="4">4 years</option>
            <option value="5">5 years</option>
            <option value="6">6 years</option>
            <option value="7">7 years</option>
            <option value="8">8 years</option>
            <option value="9">9 years</option>
            <option value="10">10 years</option>
            <option value="11">11 years</option>
            <option value="12">12 years</option>
          </select>
          <span className="ml-4 text-sm text-gray-600">
            {filteredActivities.length} activities
          </span>
        </div>

        {/* Simple Activity List */}
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white border p-4 rounded">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{activity.title}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                  {activity.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                {activity.description}
              </p>

              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                <span>Ages: {activity.ageRange}</span>
                <span>Duration: {activity.duration}</span>
              </div>

              <div className="mb-3">
                <strong className="text-sm">Materials needed:</strong>
                <ul className="text-sm text-gray-600 mt-1">
                  {activity.materials.map((material, idx) => (
                    <li key={idx}>• {material}</li>
                  ))}
                  {activity.materials.length > 3 && (
                    <li className="text-gray-500">
                      ... and {activity.materials.length} more
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <strong className="text-sm">Learning goals:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {activity.learningGoals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12 bg-white border rounded">
            <p className="text-gray-600 mb-2">No activities found</p>
            <button
              onClick={() => setSelectedAge("all")}
              className="text-blue-600 underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
