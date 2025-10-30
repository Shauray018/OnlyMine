import { Zap, Shield, Users, Palette, TrendingUp, Heart } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: "Instant Minting",
      description: "Turn your moments into NFTs in seconds with our streamlined process"
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "Built on blockchain technology ensuring authenticity and ownership"
    },
    {
      icon: Users,
      title: "Social First",
      description: "Connect with creators and collectors in a vibrant community"
    },
    {
      icon: Palette,
      title: "Creative Tools",
      description: "Access powerful tools to enhance and customize your creations"
    },
    {
      icon: TrendingUp,
      title: "Grow Your Value",
      description: "Watch your collection appreciate as you build your digital legacy"
    },
    {
      icon: Heart,
      title: "Support Creators",
      description: "Directly support artists and creators you love through minting"
    }
  ];

  return (
    <section className="w-full px-6 py-20 md:px-12 md:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-white text-3xl md:text-5xl mb-4">
            Everything you need to mint
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Powerful features designed for creators, collectors, and communities
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-[#27C840]/20 hover:border-[#27C840]/40 hover:bg-white/10 transition-all duration-300 group hover:shadow-[0px_0px_30px_rgba(39,200,64,0.1)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#27C840]/10 border border-[#27C840]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:shadow-[0px_0px_20px_rgba(39,200,64,0.3)]">
                <feature.icon className="w-6 h-6 text-[#27C840]" />
              </div>
              <h3 className="text-white text-xl mb-3">
                {feature.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 p-12 rounded-3xl bg-[#27C840]/5 backdrop-blur-md border border-[#27C840]/20 text-center shadow-[0px_0px_40px_rgba(39,200,64,0.1)]">
          <h3 className="text-white text-2xl md:text-3xl mb-4">
            Ready to start your journey?
          </h3>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            Join thousands of creators who are already minting their moments on onlymine
          </p>
          <button className="px-8 py-4 rounded-full bg-[#27C840] text-black hover:bg-[#27C840]/90 transition-all shadow-[0px_0px_30px_rgba(39,200,64,0.4)] hover:shadow-[0px_0px_40px_rgba(39,200,64,0.6)]">
            Create Your First Mint
          </button>
        </div>
      </div>
    </section>
  );
}
