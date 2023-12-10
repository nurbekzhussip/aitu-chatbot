import { render } from "preact";
import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import useWebSocket from "react-use-websocket";
import AIPrimaryIcon from "./assets/icon_ai_primary.png";
import AIBodyPrimaryIcon from "./assets/icon_ai_body.png";
import AISecondaryIcon from "./assets/icon_ai_secondary.png";
import AILoaderIcon from "./assets/icon_ai_loader.png";
import MicrophoneIcon from "./assets/icon_microphone.png";
import AIMouseGIF from "./assets/icon_mouse.gif";

import styles from "./style.module.css";

const WebsocketComponent = () => {
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    "wss://echo.websocket.events",
    {
      onOpen: () => console.log("opened"),
      onClose: () => console.log("onClose"),
      onMessage: (message) => console.log("onMessage: ", message),
      onError: () => console.log("onError"),
    }
  );

  const handleClick = () => {
    sendMessage("Abracadabra");
  };

  const handleClose = () => {
    getWebSocket().close();
  };

  return null;
};

export function App() {
  const [step, setStep] = useState(5);

  const getStepContent = useCallback((step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <div className={`${styles.imgWrap} ${styles.primaryWrap}`}>
              <img
                src={AIPrimaryIcon}
                alt="icon"
                width="250"
                height="250"
                className={styles.primaryLogo}
              />
            </div>
            <h6>Подключаюсь...</h6>
          </div>
        );
      case 1:
        return (
          <div>
            <div className={`${styles.imgWrap} ${styles.primaryWrap}`}>
              <img
                src={AIPrimaryIcon}
                alt="icon"
                width="250"
                height="250"
                className={styles.primaryLogo}
              />
            </div>
            <h6>Начни говорить</h6>
          </div>
        );
      case 2:
        return (
          <div>
            <div className={styles.imgWrap}>
              <img
                src={AILoaderIcon}
                alt="icon"
                width="250"
                height="250"
                className={`${styles.primaryLogo} ${styles.animRotate}`}
              />
            </div>
            <h6>Принимаю обращение</h6>
          </div>
        );
      case 3:
        return (
          <div>
            <div className={`${styles.imgWrap} ${styles.primaryMaxWrap}`}>
              <img
                src={AILoaderIcon}
                alt="icon"
                width="250"
                height="250"
                className={`${styles.primaryLogo} ${styles.animRotateAndPulse}`}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className={`${styles.imgWrap} ${styles.primaryWrap}`}>
            <div className={styles.moveInCircle}>
              <img
                src={AIBodyPrimaryIcon}
                alt="icon"
                width="250"
                height="250"
                className={styles.primaryLogo}
              />
              <img
                className={styles.aiMouseAnimation}
                src={AIMouseGIF}
                alt="icon_mouse"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <div className={`${styles.imgWrap} ${styles.primaryWrap}`}>
              <img
                src={AIBodyPrimaryIcon}
                alt="icon"
                width="250"
                height="250"
                className={styles.primaryLogo}
              />
              <span className={styles.aiMouse}></span>
            </div>
            <h6>Упс, что то пошло не так</h6>
          </div>
        );
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <img src={AISecondaryIcon} alt="ai_logo" width="45" height="45" />
        <h5>ChatBot</h5>
      </div>
      <div className={styles.main}>{getStepContent(step)}</div>
      <div className={styles.footer}>
        {/* <AudioRecorder /> */}
        <FooterContent step={step} />
      </div>
    </div>
  );
}

const FooterContent = ({ step }) => {
  if (step <= 1) {
    return (
      <>
        <div>
          <div className={styles.loaderCircle}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </>
    );
  } else if (step === 2) {
    return (
      <>
        <div className={styles.button}>
          <div className={`${styles.pulseOutline} ${styles.pulse1}`}></div>
          <div className={`${styles.pulseOutline} ${styles.pulse2}`}></div>
          <div className={`${styles.pulseOutline} ${styles.pulse3}`}></div>
          <div className={styles.pulseMicrophone}>
            <img src={MicrophoneIcon} alt="Microphone" width="38" height="38" />
          </div>
        </div>
      </>
    );
  } else if (step === 3) {
    return (
      <>
        <div>
          <h6>Готовлю ответ</h6>
          <div className={styles.loaderProgress}></div>
        </div>
      </>
    );
  } else if (step === 4) {
    return (
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
    );
  } else if (step === 5) {
    return (
      <div>
        <button
          className={styles.buttonRounded}
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  return <></>;
};

render(<App />, document.getElementById("app"));
