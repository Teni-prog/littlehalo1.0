import { Brain, Users2, DollarSign, Palette, Globe, MonitorOff } from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Real Learning, Real Skills',
    description: 'Every activity targets specific developmental goals—from fine motor skills and problem-solving to cultural awareness and emotional intelligence. Your child grows with every session.',
    example: 'Science experiments teach cause-and-effect thinking and scientific method basics'
  },
  {
    icon: Users2,
    title: 'Perfect for Your Child\'s Stage',
    description: 'Each activity is tagged with appropriate age ranges and difficulty levels. Whether your child is 2 or 12, we have engaging options that challenge without frustrating.',
    example: 'Storytime for ages 2-5, coding basics for ages 8-12'
  },
  {
    icon: DollarSign,
    title: 'Included in Your Booking',
    description: 'All materials, supplies, and planning are included in your babysitter\'s hourly rate. No surprise charges. No hidden fees. Just quality activities that maximize your childcare investment.',
    example: 'Science experiments use household items; craft materials provided by sitter'
  },
  {
    icon: Palette,
    title: 'Tailored to Your Child\'s Interests',
    description: 'Choose from our library, request specific activities, or let babysitters create custom adventures based on your child\'s unique interests. Obsessed with dinosaurs? Space? Princesses? We\'ve got activities for that.',
    example: 'Dinosaur dig excavation, rocket ship building, royal castle crafts'
  },
  {
    icon: Globe,
    title: 'Your Heritage, Honored',
    description: 'Many activities incorporate cultural elements—traditional stories, cultural cooking, heritage crafts, language practice—helping your child maintain cultural identity while learning new skills.',
    example: 'Making dumplings teaches measurements and cultural traditions simultaneously'
  },
  {
    icon: MonitorOff,
    title: 'Hands-On, Not Screen Time',
    description: 'Every micro-adventure prioritizes active engagement over passive entertainment. Real materials, real experiences, real learning—not just another YouTube video.',
    example: 'Building actual structures vs. watching building videos'
  }
];

export function ActivitiesBenefits() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Makes Our Activities Special?
          </h2>
          <p className="text-lg text-gray-600">
            Micro-adventures are structured, educational activities designed to engage children's minds, bodies, and creativity. 
            They're called <strong>'micro'</strong> because they fit into 20-60 minute time blocks, and <strong>'adventures'</strong> because 
            they make learning feel exciting, not like homework.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#E5533D] to-[#D4442C] rounded-xl flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{benefit.description}</p>
              <div className="text-sm text-gray-500 italic">
                Example: {benefit.example}
              </div>
            </div>
          ))}
        </div>

        {/* The Difference Callout */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-[#FFE5B4]/30 to-[#EFA59A]/20 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">The Difference</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-2">❌ Traditional Babysitting</div>
              <p className="text-gray-600">Keeping kids safe while they entertain themselves with screens or toys. Passive supervision.</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E5533D] mb-2">✓ littlëHALO Micro-Adventures</div>
              <p className="text-gray-900 font-medium">Active, guided learning experiences that develop skills, build knowledge, and create lasting memories.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
