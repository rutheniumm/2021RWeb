export const abbreviateNumber = (value: string | number): string => {
    // Convert value to a number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
    // Check if the conversion was successful
    if (isNaN(numValue)) {
      throw new Error('Invalid number');
    }
  
    if (numValue < 1000) {
      return numValue.toLocaleString();
    }
    
    if (numValue < 1000000) {
      if (numValue > 99999) {
        return numValue.toString().slice(0, 3) + 'K+';
      }
      if (numValue > 9999) {
        return numValue.toString().slice(0, 2) + 'K+';
      }
    }
  
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor(Math.log10(numValue) / 3);
    const shortValue = parseFloat((numValue / Math.pow(1000, suffixNum)).toPrecision(3));
  
    return shortValue % 1 !== 0 ? shortValue.toFixed(1) : shortValue.toString() + suffixes[suffixNum];
  };
  