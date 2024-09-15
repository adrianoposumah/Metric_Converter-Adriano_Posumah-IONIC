import React, { useEffect, useState } from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, IonCardHeader, IonCardContent, IonGrid, IonRow, IonCol } from "@ionic/react";
import MetricConverter from "../components/MetricConverter";
import { moon, sunny } from "ionicons/icons";

import "./Home.css";

const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkModeHandler = () => {
    document.body.classList.toggle("dark", !darkMode);
    setDarkMode(!darkMode);
  };
  return (
    <IonPage>
      <IonContent>
        <div className="logo-container">
          <div className="themeModeToggle">
            <IonButton slot="end" fill="clear" onClick={toggleDarkModeHandler}>
              <IonIcon icon={darkMode ? sunny : moon} />
            </IonButton>
          </div>
          <div className="AppProfile">
            <img className="logo-img" src="../public/MetricConverterLogo.png" alt="logo" />
            <div className="AppName">
              <h2 className="logo-name">Metric Converter</h2>
              <p className="logo-username">by: Adriano Posumah</p>
            </div>
          </div>
        </div>
        <IonCard>
          <MetricConverter />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
