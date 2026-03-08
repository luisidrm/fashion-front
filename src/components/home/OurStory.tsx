const stats = [
  { number: "50+", label: "Years of Heritage" },
  { number: "12K", label: "Happy Customers" },
  { number: "100%", label: "Sustainable Materials" },
]

export function OurStory() {
  return (
    <section className="relative z-10 py-24 sm:py-32" id="story">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.25em] text-retro-paper/70">
          Our story
        </p>
        <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-retro-cream sm:text-5xl">
          Fashion That{' '}
          <em className="not-italic text-retro-terracota">Remembers</em>
        </h2>
        <div className="mx-auto mt-5 h-px w-12 bg-retro-terracota/80" />
        <p className="mt-8 font-body text-lg leading-relaxed text-retro-paper/90">
          Combinamos vintage americana y artesanía europea. Telas con herencia y técnicas
          probadas en el tiempo: cada pieza está pensada para durar y contar una historia.
        </p>
        <p className="mt-6 font-body text-base italic text-retro-accent">
          Creemos en la calidad por encima de la cantidad. Diseño con intención.
        </p>
      </div>

      {/* Stats */}
      <div className="mx-auto mt-16 max-w-3xl px-8 pt-16 border-t border-retro-warm/60">
        <div className="grid grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-center text-3xl md:text-4xl font-bold text-retro-terracota mb-2">
                {stat.number}
              </p>
              <p className="font-sans text-center text-retro-paper/60 text-xs uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
