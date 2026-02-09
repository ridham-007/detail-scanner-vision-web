import { Scale, Droplets, Flame } from "lucide-react";

// Inline HowToUse data for BMI - Simplified for cleaner file
const bmiHowToUse = {
  title: "How to Use the BMI Calculator",

  intro: `
Body Mass Index (BMI) is a common way for determining the appropriate weight for a person based on his or her height. BMI is a good means for quickly determining a person’s level of body fat in order to spot health risks associated with being underweight, obese, or overweight.

BMI Calculator
       This is an application that will help you compute your BMI instantly, without requiring any complicated computations of your weight and height. It will interpret the resulting data into health categories.

People with healthy BMI ranges have low possibilities of developing heart problems, diabetes, and other lifestyle diseases. BMI does not measure fat levels in the body but is quite helpful when used as an indicator for healthy or unhealthy bodies.

This calculator can be of immense help to you if you or someone you know has plans to begin physical exercises, or perhaps weigh changes to see different effects.
  `,

  steps: [
    {
      title: "Enter Your Age",
      description: `
First, you'll need to enter your age. This is because calculations for BMI are more geared towards those who are already adults. Your age will serve to add some perspective to the outcome.

For kids and adolescents, BMI calculation might need to be done separately, taking into consideration the child’s age.
      `,
    },
    {
      title: "Select Your Gender",
      description: `
Select your gender to increase the accuracy of health information and suggestions.

Even though the equation used in the BMI calculation is identical, there may be variation in body composition that can affect interpretation.
      `,
    },
    {
      title: "Input Your Height",
      description: `
Please enter your height in centimeters.

Height measurement needs to be accurate because small inaccuracies can cause great discrepancies in BMI values.
      `,
    },
    {
      title: "Input Your Weight",
      description: `
Enter your current body weight in kilograms.

Ensure that the weight used is current for the best possible results for a calculation of body mass index.
      `,
    },
    {
      title: "Calculate and View BMI Result",
      description: `
Click on calculate to instantaneously calculate your BMI and corresponding health status as underweight, normal, overweight, and obese.

This visual progress chart assists you in determining your current position within the BMI chart.
      `,
    },
  ],

  benefits: [
    "Instant BMI calculation",
    "Easy understanding of weight category",
    "Helps identify potential health risks",
    "Visual progress tracking",
    "Simple and user-friendly interface",
    "Useful for fitness and health monitoring",
    "No manual calculations required",
  ],

  useCases: [
    "Tracking weight and fitness progress",
    "Assessing overall health status",
    "Planning diet or workout routines",
    "Monitoring lifestyle changes",
    "Initial health screening",
    "Supporting wellness goals",
    "Understanding body weight classification",
  ],

  whoShouldUse: `
The BMI Calculator is appropriate for use by adult users who want to calculate their body mass status.

It is mostly employed by people beginning fitness routines, by people dealing with weight changes, and by people needing fast feedback on their health. For a child, an athlete, or a person with a heavy muscular build, it is recommended that the BMI calculations also take other health factors into account.
  `,

  formulas: [
    {
      title: "BMI Formula",
      formula: "BMI = weight (kg) / height (m)²",
      explanation: `
This is the standard BMI formula used worldwide.

Weight is measured in kilograms and height in meters. The result provides a numerical value used to classify weight categories.
      `,
    },
  ],

  limitations: [
    "Does not distinguish between muscle and fat",
    "May overestimate fat in muscular individuals",
    "May underestimate fat in older adults",
    "Not suitable as a sole health indicator",
    "Does not account for body composition",
    "Results are general estimates",
  ],

  resources: [
    {
      label: "What is BMI?",
      url: "https://www.cdc.gov/healthyweight/assessing/bmi/",
    },
    {
      label: "BMI Categories Explained",
      url: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index",
    },
    {
      label: "Healthy Weight Guidelines",
      url: "https://www.nhs.uk/common-health-questions/lifestyle/what-is-the-body-mass-index-bmi/",
    },
  ],
};

// Inline HowToUse data for Calorie
const calorieHowToUse = {
  title: "How to Use the Calorie Calculator",

  intro: `
Knowledge about the number of calories your body requires daily is one of the most crucial steps to effectively controlling your weight. Calorie refers to units of energy your body employs for all activities ranging from basic survival processes like breathing to physical exercises.

The Calorie Calculator allows you to calculate the number of calories you need each day. This .is dependent on age, sex, .height, weight, and activity level. These calculations use three different activities for each level. There are also three options for dieting: maintaining weight, losing weight, or gaining weight.

While an general estimate of calorie needs is offered in other calorie calculators, this particular calorie calculator provides you with an estimate based on your unique needs and requirements. This is because everyone has different metabolic rates and needs in life.

Regardless if it is a fitness plan, diet adjustment, or simply the curiosity about everyday energy expenditure, it is a starting point that provides you with a clear and straightforward answer.
  `,

  steps: [
    {
      title: "Choose Your Measurement System",
      description: `
First, choose to measure length in centimeters or feet, and mass in kilograms or pounds.

This ensures that calculations are done accurately without converting errors.
      `,
    },
    {
      title: "Enter Age and Gender",
      description: `
You need to give your age and choose your gender. Both of these variables affect your metabolic rate and calorie needs.

Metabolism also gradually slows with age, and this impacts caloric needs.
      `,
    },
    {
      title: "Input Height and Weight",
      description: `
Enter the value of your current height and weight. These values are required to calculate BMR, or the number of calories burned when a person is resting.

Reliable inputs result in more accurate calorie estimates.
      `,
    },
    {
      title: "Select Your Activity Level",
      description: `
Select the level of activity which will better fit your every day activities, ranging from sedentary to very active.

The activity level also has a significant effect on overall calorie needs. You should therefore pick a value which corresponds more to your typical rather than actual lifestyle situation. For instance, instead of choosing “very active
      `,
    },
    {
      title: "Calculate Your Daily Calories",
      description: `
Enter all the inputs and calculate to know your approximate calorie requirements per day.

The value computed will represent the number of calories needed for weight maintenance, along with recommendations for weight loss or gain.
      `,
    },
    {
      title: "Adjust Based on Your Goal",
      description: `
Use the calculated value as a baseline:
• consume fewer calories if trying to lose weight
• Increase caloric intake for weight gain

• Eat near maintenance calories to maintain body weight Small, incremental changes make for lasting success.
      `,
    },
  ],

  benefits: [
    "Personalized daily calorie estimation",
    "Supports weight loss, gain, and maintenance goals",
    "Based on scientifically accepted formulas",
    "Accounts for lifestyle and activity level",
    "Easy to understand and use",
    "Helps prevent extreme dieting",
    "Useful for long-term health planning",
  ],

  useCases: [
    "Weight loss planning",
    "Healthy weight maintenance",
    "Muscle gain and bulking",
    "Diet and meal planning",
    "Fitness and training programs",
    "Understanding calorie balance",
    "Improving nutrition awareness",
  ],

  whoShouldUse: `
The Calorie Calculator is suitable for adults who want a clearer understanding of their daily energy needs. It can be used by beginners starting a diet plan, fitness enthusiasts tracking progress, or individuals adjusting their calorie intake after lifestyle changes.

It is also helpful for people transitioning between weight loss, maintenance, and weight gain phases, as calorie needs change over time.
  `,

  formulas: [
    {
      title: "Basal Metabolic Rate (Mifflin-St Jeor Equation)",
      formula: `
Men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
Women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161
      `,
      explanation: `
The Mifflin-St Jeor equation estimates the number of calories your body needs at rest explains why it is widely considered the most accurate BMR formula for the general population.
      `,
    },
    {
      title: "Total Daily Energy Expenditure (TDEE)",
      formula: "TDEE = BMR × Activity Factor",
      explanation: `
The activity factor accounts for physical movement and exercise. Sedentary lifestyles have lower multipliers, while active lifestyles increase total calorie needs.
      `,
    },
    {
      title: "Weight Change Adjustment",
      formula: `
Weight Loss: TDEE − 300 to 500 calories  
Weight Gain: TDEE + 300 to 500 calories
      `,
      explanation: `
Moderate calorie adjustments help achieve steady weight change without excessive stress on the body.
      `,
    },
  ],

  tips: [
    "Choose an honest activity level for better accuracy",
    "Avoid extreme calorie deficits or surpluses",
    "Recalculate calories after weight changes",
    "Combine calorie control with regular exercise",
    "Focus on food quality, not just calorie count",
    "Track progress over several weeks, not days",
    "Listen to hunger and energy levels",
  ],

  limitations: [
    "Provides estimates, not exact values",
    "Does not account for metabolic adaptations",
    "Activity level selection is subjective",
    "Daily calorie burn can fluctuate",
    "Not suitable for medical diagnosis",
    "Does not replace professional advice",
  ],

  faqs: [
    {
      question: "How many calories should I eat to lose weight?",
      answer: `
A daily calorie deficit of 300–500 calories is commonly recommended for gradual and sustainable weight loss. Larger deficits may lead to faster results but are harder to maintain.
      `,
    },
    {
      question: "Is eating too few calories harmful?",
      answer: `
Yes. Consistently eating too few calories can slow metabolism, reduce muscle mass, cause nutrient deficiencies, and affect energy levels. Balance is essential.
      `,
    },
    {
      question: "Do calorie needs change with age?",
      answer: `
Yes. Calorie needs often decrease with age due to reduced muscle mass and metabolic rate. Regular recalculation helps maintain accuracy.
      `,
    },
    {
      question: "Can exercise increase my daily calorie allowance?",
      answer: `
Yes. Increased physical activity raises total daily energy expenditure, allowing for higher calorie intake while maintaining or losing weight.
      `,
    },
  ],

  uniqueInsights: `
Unlike many calculators that present a single number, this calorie calculator encourages flexibility and awareness. Daily energy needs are not static and can vary based on sleep, stress, hormones, and activity patterns.

Instead of focusing solely on hitting an exact calorie target, consider using the result as a range. Monitoring trends over time provides better insight than reacting to daily fluctuations.
  `,

  resources: [
    {
      label: "Understanding Calories and Energy Balance",
      url: "https://www.cdc.gov/healthyweight",
    },
    {
      label: "Basal Metabolic Rate Explained",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/",
    },
    {
      label: "Healthy Weight Management",
      url: "https://www.healthline.com/nutrition",
    },
  ],
};

// Inline HowToUse data for Water Intake
const waterIntakeHowToUse = {
  title: "How to Use the Water Intake Calculator",

  intro: `
Hydration is a major aspect of personal health. Water serves a number of functions, such as digestion, blood circulation, regulating body temperature, keeping joints lubricated, and aiding in cognition. However, hydration is a function whose specific amount is not fixed, regardless of a universally applied standard.

The "Water Intake Calculator" can be used to calculate the amount of water that should be taken based on your "body weight," "activity," "exercise time," "climate," and "habits." This water intake guide offers a more personalized approach to water intake recommendations that can be applied according to "your lifestyle."

calculator.as calculated in order to raise awareness regarding the issue of hydration and to help individuals make better water-drinking habits. `,

  steps: [
    {
      title: "Enter Your Body Weight",
      description: `
Please enter your body weight, then set a preference for pounds or kilograms. Body weight is a basis for calculating an estimated hydration rate.      `,
    },
    {
      title: "Select Your Activity Level",
      description: `
Select the best description from among the options concerning the level of activity you usually observe on a daily basis, from sedentary to very active.      `,
    },
    {
      title: "Add Daily Exercise Duration",
      description: `
Enter the average number of minutes you spend exercising daily. Exercise will increase your rate of fluid loss along with your need for water.      `,
    },
    {
      title: "Choose Climate and Environment",
      description: `
Choose the climate which suits your environment, be it cold, temperate, warm, hot, or humid. When your climate is either hot or humid, you lose fluids through your sweat glands.      `,
    },
    {
      title: "Include Additional Lifestyle Factors",
      description: `
Include additional covariates like daily caffeine consumption or pregnancy and breastfeeding, which could be important in affecting hydration requirements.      `,
    },
    {
      title: "Calculate Daily Water Intake",
      description: `
You can calculate the amount of water needed by simply clicking the "calculate" button. The amount of water shown is the      `,
    },
  ],

  benefits: [
    "Personalized daily hydration estimate",
    "Accounts for activity level and exercise",
    "Adjusts for climate and environment",
    "Supports healthy hydration habits",
    "Easy to understand and use",
    "Encourages consistent water intake",
  ],

  useCases: [
    "Daily hydration planning",
    "Fitness and exercise support",
    "Hot or humid climate adjustment",
    "Pregnancy and breastfeeding hydration awareness",
    "General health and wellness tracking",
  ],

  whoShouldUse: `
This calculator is intended to be useful to adults to give them an accurate idea about the amount of water they should consume on a daily basis.

It would benefit people most who are active, in a warm climate, or have a problem drinking water regularly. The outcome should not be considered absolute medical advice. `,

  formulas: [
    {
      title: "Base Water Intake Estimation",
      formula: "Daily water ≈ 30–35 ml per kg of body weight",
      explanation: `
This baseline range is commonly used to estimate hydration needs based on body weight.
      `,
    },
    {
      title: "Activity and Exercise Adjustment",
      formula: "Additional water added per exercise duration",
      explanation: `
Extra fluid is added to account for sweat loss during physical activity.
      `,
    },
    {
      title: "Climate and Lifestyle Modifiers",
      formula: "Intake adjusted for temperature, humidity, and habits",
      explanation: `
Environmental and lifestyle factors further refine the daily hydration estimate.
      `,
    },
  ],

  tips: [
    "Drink water consistently throughout the day",
    "Do not wait until you feel thirsty to hydrate",
    "Increase intake during hot weather or illness",
    "Balance caffeinated drinks with extra water",
    "Monitor urine color as a hydration indicator",
  ],

  limitations: [
    "Provides estimates, not medical prescriptions",
    "Does not measure individual sweat rate",
    "Fluid needs vary day to day",
    "Certain medical conditions affect hydration needs",
    "Should not replace professional medical advice",
  ],

  faqs: [
    {
      question: "Why does body weight affect water needs?",
      answer: `
Larger bodies require more water to support basic physiological functions and maintain fluid balance.
      `,
    },
    {
      question: "Does exercise increase water requirements?",
      answer: `
Yes. Physical activity leads to fluid loss through sweat, increasing hydration needs.
      `,
    },
    {
      question: "Is thirst a reliable indicator?",
      answer: `
Thirst often signals mild dehydration. Drinking regularly helps prevent this from occurring.
      `,
    },
    {
      question: "Do foods count toward water intake?",
      answer: `
Yes. Many fruits and vegetables contain significant amounts of water and contribute to hydration.
      `,
    },
  ],

  uniqueInsights: `
Hydration needs are influenced by more than just water bottles and reminders. Factors like daily movement, climate, and dietary choices all play a role. Instead of aiming for a fixed number, focusing on consistency and awareness helps support long-term health.

Using a personalized hydration estimate encourages mindful drinking habits without creating unnecessary pressure or rigid targets.
  `,

  resources: [
    {
      label: "Hydration and Health",
      url: "https://www.cdc.gov/nutrition/",
    },
    {
      label: "Daily Water Intake Guidance",
      url: "https://www.healthline.com/",
    },
    {
      label: "Healthy Living and Hydration",
      url: "https://www.nhs.uk/live-well/",
    },
  ],
};

export interface CalculatorConfig {
  title: string;
  description: string;
  path: string;
  icon: any;
  category: "health" | "financial" | "business" | "utility" | "other";
  faqs?: Array<{ question: string; answer: string }>;
  details?: {
    whatIs: string;
    howItWorks: string;
    tips: string[];
  };
  howToUse: {
    title: string;
    intro: string;
    steps?: Array<{ title: string; description: string }>;
    benefits?: string[];
    useCases?: string[];
    whoShouldUse?: string;
    formulas?: Array<{ title: string; formula: string; explanation: string }>;
    tips?: string[];
    limitations?: string[];
    resources?: Array<{ label: string; url: string }>;
  };
}

export const calculatorConfig: Record<string, CalculatorConfig> = {
  bmi: {
    title: "BMI Calculator",
    description:
      "Calculate your Body Mass Index (BMI) and track your progress with instant results.",
    path: "/calculators/bmi",
    icon: Scale,
    category: "health",
    howToUse: bmiHowToUse,
    details: {
      whatIs:
        "Body Mass Index (BMI) is a simple measurement using your height and weight to estimate body fat and health risk.",
      howItWorks:
        "BMI = weight (kg) / [height (m)]². Based on your BMI value, you fall into categories like underweight, normal, overweight, or obese.",
      tips: [
        "BMI doesn’t account for muscle mass or body composition.",
        "Athletes may have higher BMI but low fat percentage.",
        "Use BMI as a general guide, not a diagnostic tool.",
        "For children, use age-specific BMI charts.",
        "Consult your doctor for personalized advice.",
      ],
    },
    faqs: [
      {
        question: "What is a healthy BMI range?",
        answer:
          "A healthy BMI is typically between 18.5 and 24.9. Below 18.5 is considered underweight, 25-29.9 is overweight, and 30 or above is classified as obese. However, BMI is just one indicator of health and should be considered alongside other factors.",
      },
      {
        question: "Is BMI accurate for athletes and muscular people?",
        answer:
          "BMI may overestimate body fat in athletes and people with high muscle mass, as it doesn't distinguish between muscle and fat. For these individuals, body fat percentage measurements or waist-to-hip ratio may be more accurate health indicators.",
      },
      {
        question: "How often should I check my BMI?",
        answer:
          "For general health monitoring, checking your BMI once a month is sufficient. If you're actively working on weight management, weekly checks can help track progress, but avoid daily measurements as weight naturally fluctuates.",
      },
      {
        question: "Does BMI differ for men and women?",
        answer:
          "The BMI formula is the same for both men and women. However, women naturally have more body fat than men at the same BMI. Some health professionals recommend slightly different healthy ranges by gender for more accurate health assessment.",
      },
      {
        question: "Can children use this BMI calculator?",
        answer:
          "This calculator is designed for adults aged 18 and older. Children and teens require age-and-gender-specific BMI percentile charts because their body composition changes as they grow. Consult a pediatrician for children's BMI assessment.",
      },
    ],
  },
  calorie: {
    title: "Calorie Calculator",
    description:
      "Calculate your daily caloric needs for weight maintenance, loss, or gain.",
    path: "/calculators/calorie",
    icon: Flame,
    category: "health",
    howToUse: calorieHowToUse,
    details: {
      whatIs:
        "This calorie calculator estimates your daily calorie needs using standard BMR equations (Mifflin-St Jeor) and your activity level.",
      howItWorks:
        "It calculates your Basal Metabolic Rate (BMR) and multiplies it by an activity factor to find your maintenance calories, then adjusts for weight goals.",
      tips: [
        "A daily deficit of ~500 Calories is often associated with ~0.5 kg/week weight loss.",
        "A daily surplus of ~500 Calories is often associated with ~0.5 kg/week weight gain.",
        "Use consistent units when tracking.",
      ],
    },
    faqs: [
      {
        question: "How many calories should I eat to lose weight?",
        answer:
          "To lose weight safely, aim for a caloric deficit of 500-750 calories per day below your maintenance level. This typically results in 0.5-0.75 kg (1-1.5 lbs) of weight loss per week. Never go below 1,200 calories (women) or 1,500 calories (men) without medical supervision.",
      },
      {
        question: "What is TDEE and why does it matter?",
        answer:
          "TDEE (Total Daily Energy Expenditure) is the total number of calories you burn each day including basal metabolism, physical activity, and digestion. Knowing your TDEE helps you set accurate calorie goals for weight loss, maintenance, or muscle gain.",
      },
      {
        question: "Which BMR formula is most accurate?",
        answer:
          "The Mifflin-St Jeor equation is generally considered most accurate for most people. The Katch-McArdle formula is more accurate if you know your body fat percentage, as it accounts for lean body mass. Harris-Benedict is the original formula but slightly less accurate.",
      },
      {
        question: "Does my calorie need change with age?",
        answer:
          "Yes, calorie needs typically decrease with age due to loss of muscle mass and decreased metabolic rate. After age 30, metabolism slows by about 2-4% per decade. Regular strength training can help maintain muscle mass and metabolic rate.",
      },
      {
        question: "How accurate are calorie calculators?",
        answer:
          "Calorie calculators provide estimates that are typically accurate within 10-20% for most people. Individual factors like genetics, hormones, and exact activity levels can affect actual needs. Use the calculator as a starting point and adjust based on your results over 2-4 weeks.",
      },
    ],
  },
  waterintake: {
    title: "Water Intake Calculator",
    description:
      "Calculate your daily water intake based on your activity and weight.",
    path: "/calculators/waterintake",
    icon: Droplets,
    category: "health",
    howToUse: waterIntakeHowToUse,
    details: {
      whatIs:
        "A tool to estimate the optimal amount of water you should drink daily.",
      howItWorks:
        "It uses a formula based on your body weight (typically ~30-35ml per kg) and adds extra for physical activity.",
      tips: [
        "Drink a glass of water immediately after waking up.",
        "Eat water-rich foods like cucumber and watermelon.",
        "Don't wait until you're thirsty to drink.",
      ],
    },
    faqs: [
      {
      question: "Why does body weight affect water needs?",
      answer: `
Larger bodies require more water to support basic physiological functions and maintain fluid balance.
      `,
    },
    {
      question: "Does exercise increase water requirements?",
      answer: `
Yes. Physical activity leads to fluid loss through sweat, increasing hydration needs.
      `,
    },
    {
      question: "Is thirst a reliable indicator?",
      answer: `
Thirst often signals mild dehydration. Drinking regularly helps prevent this from occurring.
      `,
    },
    {
      question: "Do foods count toward water intake?",
      answer: `
Yes. Many fruits and vegetables contain significant amounts of water and contribute to hydration.
      `,
    },
    ],
  },
};
