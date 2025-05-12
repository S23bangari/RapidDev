"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}) => {
  // Split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const ref = useRef(null);

  useEffect(() => {
    const spans = ref.current.querySelectorAll("span.typewriter-char");
    spans.forEach((span, index) => {
      span.style.animationDelay = `${index * 0.1}s`; // Delay each character's animation
    });

    // Add the CSS for the typewriter effect dynamically
    const style = document.createElement("style");
    style.innerHTML = `
      .typewriter-char {
        display: inline-block;
        opacity: 0;
        animation: typewriter 0.3s forwards;
      }

      @keyframes typewriter {
        to {
          opacity: 1;
        }
      }

      .typewriter-cursor {
        position: absolute;
        top: 0;
        left: 0;
        animation: move-cursor 3s linear forwards, blink 0.8s infinite;
      }

      @keyframes move-cursor {
        0% {
          left: 0;
        }
        100% {
          left: 100%;
        }
      }

      @keyframes blink {
        50% {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup the style element on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderWords = () => {
    return (
      <div ref={ref} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black opacity-0`,
                    word.className,
                    "typewriter-char"
                  )}
                >
                  {char}
                </span>
              ))}
              {/* Add a space after each word */}
              <span className="typewriter-char p-1"> </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center relative",
        className
      )}
    >
      {renderWords()}
      <span
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500 typewriter-cursor",
          cursorClassName
        )}
      ></span>
    </div>
  );
};