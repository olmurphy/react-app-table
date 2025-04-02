import { CardActionable, Heading } from "@americanexpress/dls-react";
import styles from "@src/components/LandingCards/LandingCards.module.css";
import { useState } from "react";
import { Link } from "@americanexpress/one-app-router";
import { LandingPageCards } from "@src/components/LandingCards/LandingCardConfig";
import { useTheme } from "@src/contexts/themeContext";

export function LandingCards() {
  const [filled, setFilled] = useState<{ key: string | null; filled: boolean }>({ key: null, filled: false });
  const { state } = useTheme();

  const handleMouseEnter = (title: string) => {
    setFilled((prev) => ({ ...prev, key: title, filled: true }));
  };

  const handleMouseLeave = () => {
    setFilled((prev) => ({ ...prev, key: null, filled: false }));
  };

  const handleClick = (title: string) => {
    console.log(title);
  };

  return (
    <div className={`${styles.container} ${styles.variables}`}>
      <div className={`${styles["container-content"]}`}>
          <div className={"row pad-1-l pad-2-b pad-2-r pad-2-t"}>
            {LandingPageCards.map((card) => {
              const isFilled = filled.key === card.title;
              const imgSrc =
                state.currentTheme === "dark"
                  ? isFilled
                    ? card.imgSrcDarkFilled
                    : card.imgSrcDark
                  : isFilled
                  ? card.imgSrcFilled
                  : card.imgSrc;
              return (
                <div
                  key={card.title}
                  className={`${styles.card}`}
                >
                    <button
                      onMouseEnter={() => handleMouseEnter(card.title)}
                      onMouseLeave={() => handleMouseLeave()}
                      onClick={() => handleClick(card.title)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleClick(card.title); // Handle keyboard interaction
                        }
                      }}
                      className={`${styles.cardActionable}`}
                    >
                      <img
                        alt={card.title}
                        style={{ width: "50px", height: "50px" }}
                        className={`${styles.cardImg} margin-1-b`}
                        src={imgSrc}
                      />
                      <Heading
                        variant="sans-medium-regular"
                        className={`${styles.cardText} margin-1-b`}
                        id="heading-1"
                        level={2}
                      >
                        {card.title}
                      </Heading>
                      <p className={`body-1 margin-1-b ${styles.cardDescription}`}>
                        {card.description}
                      </p>

                      {card.links?.map((link) => (
                        <Link key={link.link} href={link.link}>
                          {link.label}
                        </Link>
                      ))}
                    </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}
