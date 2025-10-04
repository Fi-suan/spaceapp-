import Navigation from '@/components/Navigation'
import MissionCard from '@/components/MissionCard'
import PlanetCard from '@/components/PlanetCard'
import { ChipGroup } from '@/components/Chip'

export default function Home() {
  const navigationItems = [
    { label: 'Home', href: '#', active: true },
    { label: 'Missions', href: '#missions' },
    { label: 'Planets', href: '#planets' },
    { label: 'About', href: '#about' }
  ]

  const missions = [
    {
      title: 'Artemis Program',
      description: 'NASA\'s lunar exploration program to establish sustainable human presence on the Moon.',
      status: 'active' as const,
      launchDate: new Date('2024-11-15'),
      agency: 'NASA'
    },
    {
      title: 'Mars Sample Return',
      description: 'Mission to collect and return samples from Mars for detailed analysis.',
      status: 'planned' as const,
      launchDate: new Date('2028-06-01'),
      agency: 'NASA'
    },
    {
      title: 'James Webb Space Telescope',
      description: 'Advanced space telescope for infrared astronomy and exoplanet research.',
      status: 'active' as const,
      launchDate: new Date('2021-12-25'),
      agency: 'NASA'
    }
  ]

  const planets = [
    {
      name: 'Mars',
      type: 'terrestrial' as const,
      distance: '225M km',
      diameter: '6,779 km',
      moons: 2
    },
    {
      name: 'Jupiter',
      type: 'gas_giant' as const,
      distance: '778M km',
      diameter: '139,820 km',
      moons: 95
    },
    {
      name: 'Saturn',
      type: 'gas_giant' as const,
      distance: '1.4B km',
      diameter: '116,460 km',
      moons: 146
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation items={navigationItems} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Explore the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Universe
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the wonders of space through cutting-edge technology and immersive experiences
            </p>
            
            {/* Chip Group for Categories */}
            <div className="mb-8">
              <ChipGroup className="justify-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
                  Missions
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
                  Planets
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20">
                  Astronomy
                </span>
              </ChipGroup>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                Launch Experience
              </button>
              <button className="px-8 py-3 border border-blue-600 bg-transparent hover:bg-blue-600/10 text-blue-600 font-semibold rounded-lg transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Missions Section */}
      <section id="missions" className="py-24 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Active Space Missions
            </h2>
            <p className="text-gray-300 text-lg">
              Follow the latest space exploration missions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {missions.map((mission, index) => (
              <MissionCard
                key={index}
                title={mission.title}
                description={mission.description}
                status={mission.status}
                launchDate={mission.launchDate}
                agency={mission.agency}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Planets Section */}
      <section id="planets" className="py-24 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Solar System Planets
            </h2>
            <p className="text-gray-300 text-lg">
              Explore the planets in our solar system
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {planets.map((planet, index) => (
              <PlanetCard
                key={index}
                name={planet.name}
                type={planet.type}
                distance={planet.distance}
                diameter={planet.diameter}
                moons={planet.moons}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">SpaceApp</h3>
            <p className="text-gray-400 mb-6">
              Built for NASA Space Apps Challenge 2024
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
