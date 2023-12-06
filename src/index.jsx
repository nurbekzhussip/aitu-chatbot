import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import AIPrimaryIcon from "./assets/icon_ai_primary.png";
import AISecondaryIcon from "./assets/icon_ai_secondary.png";
import ArrowBackIcon from "./assets/icon_arrow_back.svg";
import AILoaderIcon from "./assets/icon_ai_loader.png";
import MicrophoneIcon from "./assets/icon_microphone.png";

import styles from "./style.module.css";

const STEP_CONTENT = {
  1: {
    header: {
      icon: AISecondaryIcon,
      alt: "",
    },
    main: {
      className: styles.iconWrap,
      icon: AIPrimaryIcon,
      alt: "icon",
      title: "Начни говорить",
    },
  },
  2: {
    header: {
      icon: ArrowBackIcon,
    },
    main: {
      className: styles.aiLoaderWrap,
      imgClassName: styles.rotate,
      icon: AILoaderIcon,
      alt: "icon",
      title: "Принимаю обращение",
    },
  },
  3: {
    header: {
      icon: ArrowBackIcon,
    },
    main: {
      className: styles.aiLoaderAnimationWrap,
      imgClassName: styles.rotateAndPulse,
      icon: AILoaderIcon,
      alt: "icon",
      title: "",
    },
  },
  4: {
    header: {
      icon: ArrowBackIcon,
    },
    main: {
      className: `${styles.iconWrap} ${styles.moveInCircle}`,
      icon: AIPrimaryIcon,
      alt: "icon",
      title: "",
    },
  },
};

export function App() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const interval = setTimeout(() => {
      setStep((prev) => {
        if (prev > 3) {
          return 1;
        }
        return prev + 1;
      });
    }, 3000);
    return () => {
      clearTimeout(interval);
    };
  }, [step]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img
          src={STEP_CONTENT[step].header.icon}
          alt={STEP_CONTENT[step].header.alt}
          width="45"
          height="45"
        />
        <h5>ChatBot</h5>
      </div>
      <div className={styles.main}>
        <div>
          <div>
            <div className={STEP_CONTENT[step].main.className}>
              <img
                src={STEP_CONTENT[step].main.icon}
                alt={STEP_CONTENT[step].main.alt}
                width="250"
                height="250"
                className={STEP_CONTENT[step].main.imgClassName}
              />
            </div>
          </div>
          <h6>{STEP_CONTENT[step].main.title}</h6>
        </div>
      </div>
      <div className={styles.footer}>
        <FooterContent step={step} />
      </div>
    </div>
  );
}

const FooterContent = ({ step }) => {
  if (step === 1) {
    return (
      <>
        {/* <h6>Начни говорить</h6> */}
        <div className={styles.footerAnimation}>
          <div>
            <div className={styles.loaderCircle}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </>
    );
  } else if (step === 2) {
    return (
      <>
        {/* <h6>Принимаю обращение</h6> */}
        <div className={styles.footerAnimation}>
          <div className={styles.button}>
            <div className={`${styles.pulseOutline} ${styles.pulse1}`}></div>
            <div className={`${styles.pulseOutline} ${styles.pulse2}`}></div>
            <div className={`${styles.pulseOutline} ${styles.pulse3}`}></div>
            <div className={styles.pulseMicrophone}>
              <img
                src={MicrophoneIcon}
                alt="Microphone"
                width="38"
                height="38"
              />
            </div>
          </div>
        </div>
      </>
    );
  } else if (step === 3) {
    return (
      <>
        <div className={styles.footerAnimation}>
          <div>
            <h6>Готовлю ответ</h6>
            <div className={styles.loaderProgress}></div>
          </div>
        </div>
      </>
    );
  } else if (step === 4) {
    return (
      <div className={styles.footerAnimation}>
        <div>
          <h6>Нажми, чтобы остановить</h6>
          <div className={styles.loaderBars}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return <></>;
};

render(<App />, document.getElementById("app"));
