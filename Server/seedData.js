const DEFAULT_HEADINGS = [
  {
    headingId: 'household_fixed_living',
    title: 'Household / Fixed Living',
    icon: '🏠',
    items: [
      { key: 'maintenance_charges', label: 'Maintenance Charges (Apartment)', icon: '🏢' },
      { key: 'property_tax', label: 'Property Tax', icon: '📋' },
      { key: 'home_repairs', label: 'Home Repairs & Maintenance', icon: '🔧' },
      { key: 'house_help_salary', label: 'House Help Salary (Maid, Cook)', icon: '🧑‍🍳' },
      { key: 'ironing', label: 'Ironing', icon: '👕' },
      { key: 'security', label: 'Security', icon: '🛡️' },
    ],
  },
  {
    headingId: 'utilities',
    title: 'Utilities',
    icon: '⚡',
    items: [
      { key: 'electricity', label: 'Electricity', icon: '💡' },
      { key: 'water', label: 'Water', icon: '🚰' },
      { key: 'gas', label: 'Gas (Cylinder / Piped)', icon: '🔥' },
      { key: 'internet', label: 'Internet / Broadband', icon: '🌐' },
      { key: 'mobile_bills', label: 'Mobile Bills', icon: '📱' },
    ],
  },
  {
    headingId: 'groceries_essentials',
    title: 'Groceries & Essentials',
    icon: '🛒',
    items: [
      { key: 'vegetables_fruits', label: 'Vegetables & Fruits', icon: '🥦' },
      { key: 'provisions', label: 'Provisions (Rice, Dal, Oil, etc.)', icon: '🍚' },
      { key: 'dairy', label: 'Dairy Products', icon: '🥛' },
      { key: 'eggs_meat_fish', label: 'Eggs / Meat / Fish', icon: '🥚' },
      { key: 'cleaning_supplies', label: 'Cleaning Supplies', icon: '🧹' },
      { key: 'toiletries', label: 'Toiletries / Personal Care', icon: '🧴' },
    ],
  },
  {
    headingId: 'food_dining',
    title: 'Food & Dining',
    icon: '🍕',
    items: [
      { key: 'eating_out', label: 'Eating Out', icon: '🍽️' },
      { key: 'food_delivery', label: 'Food Delivery (Swiggy / Porter etc.)', icon: '📦' },
      { key: 'snacks_bakery', label: 'Snacks / Bakery', icon: '🥐' },
    ],
  },
  {
    headingId: 'transport',
    title: 'Transport',
    icon: '🚗',
    items: [
      { key: 'fuel', label: 'Fuel (Petrol / Diesel)', icon: '⛽' },
      { key: 'auto_cab_parking', label: 'Auto / Cab / Parking Charges', icon: '🚕' },
      { key: 'vehicle_maintenance', label: 'Vehicle Maintenance', icon: '🔩' },
    ],
  },
  {
    headingId: 'health_medical',
    title: 'Health & Medical',
    icon: '🏥',
    items: [
      { key: 'doctor_consultation', label: 'Doctor Consultation / Admission', icon: '🩺' },
      { key: 'medicines', label: 'Medicines', icon: '💊' },
      { key: 'health_checkups', label: 'Health Checkups', icon: '🩻' },
      { key: 'health_insurance', label: 'Health Insurance Premium', icon: '🛡️' },
      { key: 'ayurvedic_treatment', label: 'Ayurvedic Treatment', icon: '🌿' },
    ],
  },
  {
    headingId: 'education_learning',
    title: 'Education / Learning',
    icon: '📚',
    items: [
      { key: 'courses_certifications', label: 'Courses / Certifications', icon: '🎓' },
      { key: 'books_study', label: 'Books & Study Materials', icon: '📖' },
    ],
  },
  {
    headingId: 'personal_lifestyle',
    title: 'Personal & Lifestyle',
    icon: '👔',
    items: [
      { key: 'clothing', label: 'Clothing', icon: '👕' },
      { key: 'footwear', label: 'Footwear', icon: '👟' },
      { key: 'salon_grooming', label: 'Salon / Grooming', icon: '💇' },
      { key: 'cosmetics_skincare', label: 'Cosmetics / Skincare', icon: '💄' },
    ],
  },
  {
    headingId: 'family_social',
    title: 'Family & Social',
    icon: '🎉',
    items: [
      { key: 'gifts', label: 'Gifts', icon: '🎁' },
      { key: 'functions_events', label: 'Functions / Events', icon: '🥳' },
      { key: 'donations_charity', label: 'Donations / Charity / Temple', icon: '🙏' },
    ],
  },
  {
    headingId: 'wellness_fitness',
    title: 'Well-being & Fitness',
    icon: '🧘',
    items: [
      { key: 'yoga_wellness', label: 'Yoga / Wellness Programs', icon: '🧘' },
      { key: 'supplements', label: 'Supplements', icon: '💪' },
    ],
  },
  {
    headingId: 'professional_business',
    title: 'Professional / Business',
    icon: '💼',
    items: [
      { key: 'office_expenses', label: 'Office Expenses', icon: '📎' },
      { key: 'travel_for_work', label: 'Travel for Work', icon: '✈️' },
      { key: 'training_dev', label: 'Training / Development', icon: '📈' },
    ],
  },
  {
    headingId: 'financial_commitments',
    title: 'Financial Commitments',
    icon: '💰',
    items: [
      { key: 'credit_card', label: 'Credit Card Payments', icon: '💳' },
      { key: 'investment', label: 'Investment', icon: '📊' },
      { key: 'emi_loan', label: 'EMI / Loan', icon: '🏦' },
      { key: 'insurance_life_vehicle', label: 'Insurance (Life / Vehicle)', icon: '🛡️' },
    ],
  },
  {
    headingId: 'travel_leisure',
    title: 'Travel & Leisure',
    icon: '✈️',
    items: [
      { key: 'vacation_travel', label: 'Vacation Travel', icon: '🏖️' },
      { key: 'movies', label: 'Movies', icon: '🎬' },
      { key: 'local_sightseeing', label: 'Local Sightseeing', icon: '🗺️' },
    ],
  },
  {
    headingId: 'miscellaneous',
    title: 'Miscellaneous',
    icon: '📦',
    items: [
      { key: 'misfits', label: 'Any misfits', icon: '❓' },
    ],
  },
];

export default DEFAULT_HEADINGS;
