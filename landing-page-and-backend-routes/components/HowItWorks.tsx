export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "SNAP",
      description: "Capture the vibe with the in-app camera.",
      emoji: "📸",
    },
    {
      number: "02",
      title: "POST",
      description: "Share it to your feed for people to see, interact and trade using Solana.",
      emoji: "🚀",
    },
    {
      number: "03",
      title: "OWN",
      description: "Every post becomes a unique digital collectible stored on the blockchain.",
      emoji: "💎",
    },
  ];

  return (
    <section className="w-full px-6 pb-16 md:px-12 md:pb-20" style={{ marginTop: '-100px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-white text-3xl md:text-4xl tracking-tight">
            It's this <span className="relative inline-block">
              simple
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 120 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C20 7 35 5 58 6C75 7 95 8 118 7"
                  stroke="#27C840"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(39, 200, 64, 0.4))'
                  }}
                />
              </svg>
            </span>.
          </h2>
        </div>

        {/* Steps - Horizontal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => {
            return (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Emoji Circle */}
                <div className="relative mb-6">
                  <div className="absolute -inset-2 bg-[#27C840]/10 rounded-full blur-2xl"></div>
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#27C840]/20 to-[#27C840]/5 border-2 border-white/80 flex items-center justify-center backdrop-blur-sm text-4xl md:text-5xl shadow-lg shadow-white/20">
                    {step.emoji}
                  </div>
                </div>

                {/* Number */}
                <div 
                  className="text-[#27C840]/30 text-5xl md:text-6xl leading-none mb-3"
                  style={{
                    WebkitTextStroke: '2px white',
                  }}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="text-white text-2xl md:text-3xl mb-3 tracking-tight">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 max-w-xs">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
