import React, { useState } from "react";
import { IonSelect, IonSelectOption, IonInput, IonLabel, IonItem, IonText } from "@ionic/react";
import "./MetricConverter.css";

const MetricSelect = {
  header: "Pilih Metrik",
  message: "Choose One",
  translucent: true,
};

const UnitSelect = {
  header: "Pilih Unit",
  message: "Choose One",
};

const metrics: { [key: string]: string[] } = {
  Panjang: ["Meter", "Centimeter", "Kilometer"],
  Massa: ["Kilogram", "Gram", "Ton"],
  Suhu: ["Celcius", "Fahrenheit", "Kelvin"],
  Waktu: ["Detik", "Menit", "Jam"],
  "Arus Listrik": ["Ampere", "Milliampere"],
  // "Intensitas Cahaya": ["Candela"],
  "Jumlah Zat": ["Mol", "Milimol"],
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
  Waktu: {
    Detik: { Menit: 1 / 60, Jam: 1 / 3600 },
    Menit: { Detik: 60, Jam: 1 / 60 },
    Jam: { Detik: 3600, Menit: 60 },
  },
  "Arus Listrik": {
    Ampere: { Milliampere: 1000 },
    Milliampere: { Ampere: 0.001 },
  },
  // "Intensitas Cahaya": {
  //   Candela: {},
  // },
  "Jumlah Zat": {
    Mol: { Milimol: 1000 },
    Milimol: { Mol: 0.001 },
  },
};

const MetricConverter: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [inputValue, setInputValue] = useState<string>("");
  const [convertedValue, setConvertedValue] = useState<string>("");

  const handleConvert = (value: string) => {
    if (!selectedMetric || !fromUnit || !toUnit || value === "") return;

    const conversion = conversionRates[selectedMetric][fromUnit][toUnit];
    let result;

    const numericInput = parseFloat(value);

    if (typeof conversion === "function") {
      result = conversion(numericInput);
    } else {
      result = numericInput * conversion;
    }

    setConvertedValue(result + " " + toUnit); // Menambahkan satuan hasil
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setInputValue(value);
      handleConvert(value);
    } else {
      setConvertedValue("Invalid input");
    }
  };

  const handleKeypadInput = (value: string) => {
    if (value === "C") {
      setInputValue("");
      setConvertedValue("");
    } else if (value === "Del") {
      const newValue = inputValue.slice(0, -1);
      setInputValue(newValue);
      handleConvert(newValue);
    } else {
      const newValue = inputValue + value;
      setInputValue(newValue);
      handleConvert(newValue);
    }
  };

  return (
    <div>
      <div className="select-body">
        <IonItem>
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
              setConvertedValue(""); // Reset result when metric changes
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
          <IonSelect value={toUnit} label="Ke:" interfaceOptions={UnitSelect} interface="popover" placeholder="--Pilih Satuan" onIonChange={(e: CustomEvent) => setToUnit(e.detail.value)} disabled={!selectedMetric || !fromUnit}>
            {selectedMetric &&
              metrics[selectedMetric]
                .filter((unit: string) => unit !== fromUnit)
                .map((unit: string) => (
                  <IonSelectOption key={unit} value={unit}>
                    {unit}
                  </IonSelectOption>
                ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Nilai:</IonLabel>
          <IonInput value={inputValue} placeholder="Masukkan nilai" onIonInput={handleInputChange} disabled={!selectedMetric || !fromUnit || !toUnit} />
        </IonItem>

        <IonItem>
          <IonLabel>Hasil:</IonLabel>
          <IonText>{convertedValue}</IonText>
        </IonItem>

        <div className="keypad-grid">
          <button onClick={() => handleKeypadInput("1")}>1</button>
          <button onClick={() => handleKeypadInput("2")}>2</button>
          <button onClick={() => handleKeypadInput("3")}>3</button>
          <button onClick={() => handleKeypadInput("4")}>4</button>
          <button onClick={() => handleKeypadInput("5")}>5</button>
          <button onClick={() => handleKeypadInput("6")}>6</button>
          <button onClick={() => handleKeypadInput("7")}>7</button>
          <button onClick={() => handleKeypadInput("8")}>8</button>
          <button onClick={() => handleKeypadInput("9")}>9</button>
          <button onClick={() => handleKeypadInput("C")}>C</button>
          <button onClick={() => handleKeypadInput("0")}>0</button>
          <button onClick={() => handleKeypadInput("Del")}>Del</button>
        </div>
      </div>
    </div>
  );
};

export default MetricConverter;
