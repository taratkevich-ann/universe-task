export const getCurrency = (currency: string) => {
  if (currency === "USD") {
    return "$";
  }

  if (currency === "GBP") {
    return "£";
  }

  return "€";
};

export const getTrialFormattedPrice = (price: number, currency: string) => {
  const currencyCode = getCurrency(currency);
  const trialPrice = price / 100;

  return `${currencyCode}${trialPrice}`;
};

export const getAnnualFormattedPrice = (price: number, currency: string) => {
  const currencyCode = getCurrency(currency);
  const annualPrice = (price / 100 / 12).toFixed(2);

  return `${currencyCode}${annualPrice}`;
};
