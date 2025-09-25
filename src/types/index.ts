export interface User {
  _id: string;
  id?: string; // For compatibility
  name: string;
  email: string;
  doshaType?: 'Vata' | 'Pitta' | 'Kapha' | 'Mixed';
  preferences?: {
    dietaryRestrictions: string[];
    goals: string[];
  };
}

export interface Food {
  _id: string;
  name: string;
  category: string;
  doshaEffect: {
    vata: 'increase' | 'decrease' | 'neutral';
    pitta: 'increase' | 'decrease' | 'neutral';
    kapha: 'increase' | 'decrease' | 'neutral';
  };
  season: string[];
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  benefits: string[];
  description: string;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: {
    foodId: string;
    quantity: number;
    unit: string;
  }[];
  time: string;
}

export interface DietPlan {
  _id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Progress {
  _id: string;
  userId: string;
  date: string;
  waterIntake: number;
  calories: number;
  weight?: number;
  mood?: 'excellent' | 'good' | 'average' | 'poor' | 'terrible';
  notes?: string;
}