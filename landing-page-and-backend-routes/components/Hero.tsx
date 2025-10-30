import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full min-h-screen px-6 pt-32 md:pt-40 pb-4 md:pb-8 flex items-start justify-center">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-white text-5xl md:text-6xl lg:text-7xl mb-8 tracking-tight leading-tight">
          Your creativity has value.
          <br />
          Your moments matter.
          <br />
          <span className="text-[#27C840]">It's time you owned them.</span>
        </h1>

        {/* Description */}
        <p className="text-white/70 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Turn your everyday moments into tradeable NFTs. Share, collect, and build your digital legacy on Solana.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 cursor-pointer rounded-full bg-[#27C840] text-black hover:bg-[#27C840]/90 transition-all flex items-center justify-center gap-2 shadow-[0px_0px_30px_rgba(39,200,64,0.4)] hover:shadow-[0px_0px_40px_rgba(39,200,64,0.6)]">
            Coming Soon to Play Store
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-[#27C840]/30 transition-all">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
