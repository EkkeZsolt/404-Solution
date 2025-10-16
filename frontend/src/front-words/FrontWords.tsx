// src/components/FrontWords.tsx
import React, { useMemo } from "react";
import "./FrontWords.scss";

interface FrontSection {
  id: string;
  title: string;
  text: string[];
}

const sections: FrontSection[] = [
  {
    id: "frontWords1",
    title: "Tanulás játékosan",
    text: [
      "„A tudás akkor ragad meg igazán, ha élménnyé válik.”",
      "Oldalunk célja, hogy a tanulás ne csak kötelesség legyen, hanem kaland is. A kvízek segítségével a diákok játékos formában mérhetik fel tudásukat, a tanárok pedig könnyedén követhetik a fejlődésüket – mindezt digitális, modern környezetben."
    ]
  },
  {
    id: "frontWords2",
    title: "Kvízek minden témában – egy kattintással",
    text: [
      "Legyen szó történelemről, irodalomról, matematikáról vagy akár földrajzról, néhány perc alatt összeállítható egy teljes kvíz.",
      "Választható feleletválasztós, igaz-hamis, párosítós vagy nyílt végű kérdésforma is. A rendszer automatikusan értékel – így a tanárok időt spórolnak, a diákok pedig azonnali visszajelzést kapnak."
    ]
  },
  {
    id: "frontWords3",
    title: "Motiváció, verseny és sikerélmény",
    text: [
      "A diákok egyéni pontszámokat, ranglistát és akár jelvényeket is gyűjthetnek, hogy a tanulás ne csak hasznos, hanem izgalmas is legyen.",
      "Hiszünk benne, hogy a tudás nem száraz adat, hanem egy közösen felfedezhető világ – és minden jó felfedezés egy jó kérdéssel kezdődik."
    ]
  }
];

const FrontWords: React.FC = () => {
  const randomSection = useMemo(
    () => sections[Math.floor(Math.random() * sections.length)],
    []
  );

  return (
    <section className="frontWords" data-type={randomSection.id}>
      <h2>{randomSection.title}</h2>
      {randomSection.text.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </section>
  );
};

export default FrontWords;
