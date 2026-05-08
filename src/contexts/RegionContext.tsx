import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "INR" | "USD" | "EUR" | "GBP";

interface RegionContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number) => string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("INR");

  const formatPrice = (amount: number) => {
    // Basic conversion rates for demo purposes
    const rates: Record<Currency, number> = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.009
    };
    
    const symbols: Record<Currency, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£"
    };

    const converted = amount * rates[currency];
    return `${symbols[currency]}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <RegionContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) throw new Error("useRegion must be used within a RegionProvider");
  return context;
};
