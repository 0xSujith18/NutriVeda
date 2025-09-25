export interface CSVFood {
  Item: string;
  Category: string;
  Calories_per_100g: number;
  Protein_g: number;
  Carbs_g: number;
  Fat_g: number;
  Taste_Rasa: string;
  Virya: string;
  Vipaka: string;
  Dosha_Effects: string;
}

export const parseCSVData = (csvText: string): CSVFood[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const item: any = {};
    
    headers.forEach((header, i) => {
      const value = values[i]?.replace(/"/g, '').trim();
      
      if (header === 'Calories_per_100g' || header === 'Protein_g' || 
          header === 'Carbs_g' || header === 'Fat_g') {
        item[header] = parseFloat(value) || 0;
      } else {
        item[header] = value || '';
      }
    });
    
    return item as CSVFood;
  });
};

export const convertToFoodFormat = (csvFoods: CSVFood[]) => {
  return csvFoods.map((csvFood, index) => {
    // Parse dosha effects
    const doshaEffects = parseDoshaEffects(csvFood.Dosha_Effects);
    
    // Determine season based on category and properties
    const season = determineSeasons(csvFood);
    
    // Extract benefits from taste and properties
    const benefits = extractBenefits(csvFood);
    
    return {
      _id: `csv-${index + 1}`,
      name: csvFood.Item,
      category: csvFood.Category,
      description: generateDescription(csvFood),
      doshaEffect: doshaEffects,
      season: season,
      nutrients: {
        calories: csvFood.Calories_per_100g,
        protein: csvFood.Protein_g,
        carbs: csvFood.Carbs_g,
        fat: csvFood.Fat_g,
        fiber: 0 // Not available in CSV
      },
      benefits: benefits
    };
  });
};

const parseDoshaEffects = (doshaEffectsStr: string) => {
  const effects = { vata: 'neutral', pitta: 'neutral', kapha: 'neutral' };
  
  if (doshaEffectsStr.toLowerCase().includes('balances vata')) {
    effects.vata = 'decrease';
  }
  if (doshaEffectsStr.toLowerCase().includes('increases vata')) {
    effects.vata = 'increase';
  }
  if (doshaEffectsStr.toLowerCase().includes('reduces vata')) {
    effects.vata = 'decrease';
  }
  
  if (doshaEffectsStr.toLowerCase().includes('balances pitta')) {
    effects.pitta = 'decrease';
  }
  if (doshaEffectsStr.toLowerCase().includes('increases pitta')) {
    effects.pitta = 'increase';
  }
  if (doshaEffectsStr.toLowerCase().includes('reduces pitta')) {
    effects.pitta = 'decrease';
  }
  
  if (doshaEffectsStr.toLowerCase().includes('balances kapha')) {
    effects.kapha = 'decrease';
  }
  if (doshaEffectsStr.toLowerCase().includes('increases kapha') || 
      doshaEffectsStr.toLowerCase().includes('may increase kapha')) {
    effects.kapha = 'increase';
  }
  if (doshaEffectsStr.toLowerCase().includes('reduces kapha')) {
    effects.kapha = 'decrease';
  }
  
  return effects;
};

const determineSeasons = (csvFood: CSVFood): string[] => {
  const virya = csvFood.Virya.toLowerCase();
  
  if (virya.includes('cooling')) {
    return ['Summer'];
  } else if (virya.includes('heating')) {
    return ['Winter'];
  } else {
    return ['All seasons'];
  }
};

const extractBenefits = (csvFood: CSVFood): string[] => {
  const benefits: string[] = [];
  const taste = csvFood.Taste_Rasa.toLowerCase();
  const virya = csvFood.Virya.toLowerCase();
  const category = csvFood.Category.toLowerCase();
  
  if (taste.includes('sweet')) benefits.push('Nourishing');
  if (taste.includes('bitter')) benefits.push('Detoxifying');
  if (taste.includes('pungent')) benefits.push('Digestive');
  if (taste.includes('astringent')) benefits.push('Cleansing');
  if (taste.includes('sour')) benefits.push('Appetizing');
  
  if (virya.includes('cooling')) benefits.push('Cooling');
  if (virya.includes('heating')) benefits.push('Warming');
  
  if (category.includes('spice')) benefits.push('Aromatic');
  if (category.includes('fruit')) benefits.push('Hydrating');
  if (category.includes('vegetable')) benefits.push('Fiber-rich');
  if (category.includes('grain')) benefits.push('Energy-giving');
  if (category.includes('legume')) benefits.push('Protein-rich');
  if (category.includes('dairy')) benefits.push('Strengthening');
  if (category.includes('nuts')) benefits.push('Brain tonic');
  
  return benefits.slice(0, 4); // Limit to 4 benefits
};

const generateDescription = (csvFood: CSVFood): string => {
  const category = csvFood.Category.toLowerCase();
  const virya = csvFood.Virya.toLowerCase();
  const taste = csvFood.Taste_Rasa.toLowerCase();
  
  let description = `${csvFood.Item} is a ${category}`;
  
  if (virya.includes('cooling')) {
    description += ' with cooling properties';
  } else if (virya.includes('heating')) {
    description += ' with warming properties';
  }
  
  if (taste.includes('sweet')) {
    description += ', having a sweet taste that nourishes the body';
  } else if (taste.includes('bitter')) {
    description += ', with bitter qualities that help detoxify';
  } else if (taste.includes('pungent')) {
    description += ', with pungent properties that aid digestion';
  }
  
  return description + '.';
};