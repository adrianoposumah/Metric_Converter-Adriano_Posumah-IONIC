import React, { useState } from "react";
import { IonSelect, IonSelectOption, IonInput, IonLabel, IonItem, IonText, IonHeader } from "@ionic/react";
import "./MetricConverter.css";

const MetricSelect = {
  header: "Pilih Metrik",
  message: "Choose One",
  tranlucent: true,
};

const UnitSelect = {
  header: "Pilih Unit",
  message: "Choose One",
};

const metrics: { [key: string]: string[] } = {
  Panjang: ["Meter", "Centimeter", "Kilometer"],
  Massa: ["Kilogram", "Gram", "Ton"],
  Suhu: ["Celcius", "Fahrenheit", "Kelvin"],
};

const conversionRates: any = {
  Panjang: {
    Meter: { Centimeter: 100, Kilometer: 0.001 },
    Centimeter: { Meter: 0.01, Kilometer: 0.00001 },
    Kilometer: { Meter: 1000, Centimeter: 100000 },
  },
  Massa: {
    Kilogram: { Gram: 1000, Ton: 0.001 },
    Gram: { Kilogram: 0.001, Ton: 0.000001 },
    Ton: { Kilogram: 1000, Gram: 1000000 },
  },
  Suhu: {
    Celcius: { Fahrenheit: (x: number) => (x * 9) / 5 + 32, Kelvin: (x: number) => x + 273.15 },
    Fahrenheit: { Celcius: (x: number) => ((x - 32) * 5) / 9, Kelvin: (x: number) => ((x - 32) * 5) / 9 + 273.15 },
    Kelvin: { Celcius: (x: number) => x - 273.15, Fahrenheit: (x: number) => ((x - 273.15) * 9) / 5 + 32 },
  },
};

const MetricConverter: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [inputValue, setInputValue] = useState<number | null>(null);
  const [convertedValue, setConvertedValue] = useState<number | string>("");

  const handleConvert = () => {
    if (!selectedMetric || !fromUnit || !toUnit || inputValue === null) return;

    const conversion = conversionRates[selectedMetric][fromUnit][toUnit];
    let result;

    if (typeof conversion === "function") {
      result = conversion(inputValue);
    } else {
      result = inputValue * conversion;
    }

    setConvertedValue(result);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setInputValue(parseFloat(value));
      handleConvert();
    } else {
      setConvertedValue("Invalid input");
    }
  };

  return (
    <div>
      <div className="select-body">
        <IonItem>
          {/* <IonLabel>Dari:</IonLabel> */}
          <IonSelect
            value={selectedMetric}
            label="Metrik:"
            interfaceOptions={MetricSelect}
            interface="alert"
            placeholder="Pilih Metric"
            onIonChange={(e: CustomEvent) => {
              setSelectedMetric(e.detail.value);
              setFromUnit("");
              setToUnit("");
            }}
          >
            {Object.keys(metrics).map((metric: string) => (
              <IonSelectOption key={metric} value={metric}>
                {metric}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          {/* <IonLabel>Ke:</IonLabel> */}
          <IonSelect value={fromUnit} label="Dari:" interfaceOptions={UnitSelect} interface="popover" placeholder="--Pilih Satuan" onIonChange={(e: CustomEvent) => setFromUnit(e.detail.value)} disabled={!selectedMetric}>
            {selectedMetric &&
              metrics[selectedMetric].map((unit: string) => (
                <IonSelectOption key={unit} value={unit}>
                  {unit}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          {/* <IonLabel>Ke:</IonLabel> */}
          <IonSelect value={toUnit} label="Ke:" interfaceOptions={UnitSelect} interface="popover" placeholder="--Pilih Satuan" onIonChange={(e: CustomEvent) => setToUnit(e.detail.value)} disabled={!selectedMetric || !fromUnit}>
            {selectedMetric &&
              metrics[selectedMetric].map((unit: string) => (
                <IonSelectOption key={unit} value={unit}>
                  {unit}
                </IonSelectOption>
              ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Nilai:</IonLabel>
          <IonInput value={inputValue || ""} placeholder="Masukkan nilai" onIonInput={handleInputChange} disabled={!selectedMetric || !fromUnit || !toUnit} />
        </IonItem>

        <IonItem>
          <IonLabel>Hasil:</IonLabel>
          <IonText>{convertedValue}</IonText>
        </IonItem>
      </div>
    </div>
  );
};

export default MetricConverter;
