import { Scale, Droplets, Flame, Target, Zap, Baby } from "lucide-react";

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
const tdeeHowToUse = {
  title: "How to Use the TDEE Calculator",

  intro: `
Knowing your caloric needs on a day-to-day basis is crucial in managing your weight successfully. The concept of Total Daily Energy Expenditure, also known as TDEE, takes into account the total number of calories your body sheds on a daily basis.

Though many of you pay attention to only the calories you are consuming, understanding your expenditure of calories is equally significant. Consuming calories above your TDEE value causes you to gain weight, whereas burning calories below your TDEE value makes you lean. Your TDEE value can be known by using a TDEE calculator.

This calculator not only uses BMR calculations but also adjusts the value according to the activity you perform. This gives a very accurate idea about how much calories you burn each day.

That being said, whether you want to lose weight, build muscle mass, or simply maintain your current body weight, this TDEE calculator ensures you are always making well-informed decisions in your pursuit of healthy lifestyle choices.
  `,

  steps: [
    {
      title: "Enter Your Basic Details",
      description: `
To begin, you'll want to input your age, as well as whether you are male or female, height, and weight. These variables have a direct impact on BMR, which is used as a basis to calculate TDE

Data accuracy will lead to a much more precise estimation of calories.
      `,
    },
    {
      title: "Select Your Activity Level",
      description: `
Select your activity level from sedentary to very active that best fits your lifestyle.

This is very important, as exercising the body leads to increased expenditure of calories each day.
      `,
    },
    {
      title: "Calculate Your TDEE",
      description: `
Enter all of the above information to calculate your Total Daily Energy Expenditure.

How To Get Started Title Page: Title: Nutritional Needs for a Healthy Life Author: [Author Name] Report Title: Understanding Nutritional
      `,
    },
    {
      title: "Adjust Calories Based on Your Goal",
      description: `
Set your personal TDEE as a basis:
• Reduce calorie intake to lose weight
     • Healthy eating habits
• Increase caloric intake by eating more.

• Consume caloric intake close to TDEE for weight maintenance
      `,
    },
    {
      title: "Recalculate as Your Body Changes",
      description: `
Small change equals lasting success. Your TDEE will automatically update as you change your weight, level of physical activity, or goals.
      `,
    },
  ],

  benefits: [
    "Personalized daily calorie estimation",
    "Supports weight loss, gain, and maintenance goals",
    "Accounts for lifestyle and activity level",
    "Based on proven scientific formulas",
    "Helps avoid under- or over-eating",
    "Simple and quick to use",
    "Ideal for long-term health planning",
  ],

  useCases: [
    "Weight loss planning",
    "Muscle gain and bulking",
    "Maintaining current body weight",
    "Designing meal plans",
    "Tracking fitness progress",
    "Understanding calorie balance",
    "Improving nutrition awareness",
  ],

  whoShouldUse: `
Anwendungsbereich des TDEE-Rechners
The TDEE calculator may be applied to anyone who wishes to effectively manage their weight. This may include bodybuilders, athletes, beginners, as well as those who

It is also useful for individuals switching between phases such as weight reduction and maintenance as well as adjusting their caloric intake following a change in their lifestyles.
  `,

  formulas: [
    {
      title: "BMR (Mifflin-St Jeor Equation)",
      formula: "Men: BMR = (10 × weight) + (6.25 × height) − (5 × age) + 5",
      explanation: `
This formula estimates the number of calories your body needs at rest and is widely considered one of the most accurate BMR formulas.
      `,
    },
    {
      title: "TDEE Formula",
      formula: "TDEE = BMR × Activity Factor",
      explanation: `
Activity factors range from sedentary to very active and account for physical movement and exercise throughout the day.
      `,
    },
  ],

  tips: [
    "Choose an honest activity level for accuracy",
    "Use TDEE as a starting point, not a strict rule",
    "Create small calorie deficits or surpluses",
    "Recalculate TDEE after significant weight changes",
    "Combine calorie tracking with strength training",
    "Focus on nutrition quality, not just calories",
    "Be patient and consistent with your plan",
  ],

  limitations: [
    "Provides estimated values, not exact numbers",
    "Does not account for metabolic adaptations",
    "Activity level selection is subjective",
    "Does not replace professional dietary advice",
    "Daily calorie burn may fluctuate",
    "Not designed for medical diagnosis",
  ],

  resources: [
    {
      label: "What Is TDEE?",
      url: "https://www.healthline.com/nutrition/tdee",
    },
    {
      label: "Mifflin-St Jeor Equation Explained",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/",
    },
    {
      label: "Calories and Weight Management",
      url: "https://www.cdc.gov/healthyweight",
    },
  ],
};
const proteinHowToUse = {
  title: "How to Use the Protein Calculator",

  intro: `
Protein is regarded as one of the macronutrients that play an important role in maintaining human health. Protein is very important for muscles, immunity, enzymes, hormones, and for overall health. Unlike carbs and fats, protein intake differs from person to person according to his/her activities, structure, and health goals.

The Protein Calculator will enable you to determine the daily protein intake requirements based on your weight, age, sex, and activity levels. Unlike general advice, the protein calculator will enable you to establish your own daily protein requirement requirements.

Too many people either are not getting enough protein, which works slowly on recovery and metabolism for their muscles, or are getting too much without realizing their body requirements. This tool is designed to find a balanced use of protein that works well on muscle development and health.

Whether it is for muscle gain, fat loss, weight management, or simply improving the quality of your nutrition, the Protein Calculator is the very starting point you need. `,

  steps: [
    {
      title: "Enter Your Basic Information",
      description: `
To begin with, you will be required to provide details regarding age, height, weight, and whether you are a male or female user. All these details play a significant role in deciding lean body mass, basal

It is important to have accurate information to generate reliable daily values of proteins.
      `,
    },
    {
      title: "Select Your Activity Level",
      description: `
You can choose the activity level according to your activity pattern from light activities to strenuous training.

The body requires more proteins depending on high activity levels in order to repair and renovate muscles.
      `,
    },
    {
      title: "Calculate Your Daily Protein Intake",
      description: `
After all data is filled out, calculate to see how many grams of daily protein intake are recommended.

This is more of a realistic goal that you can attain every day than a hard and fast rule to be followed.
      `,
    },
    {
      title: "Distribute Protein Across Meals",
      description: `
Distribute protein doses evenly throughout the day to promote muscle protein synthesis and feelings of fullness.

Regular consumption is better than consuming most of it in a single sitting.
      `,
    },
    {
      title: "Track Progress Over Time",
      description: `
Notice your body reaction for several weeks. Make changes if your energy outputs, rates of recovery, or body compositions vary.      `,
    },
  ],

  benefits: [
    "Personalized daily protein recommendations",
    "Supports muscle growth and recovery",
    "Helps preserve lean mass during weight loss",
    "Improves satiety and appetite control",
    "Adaptable to different activity levels",
    "Encourages balanced nutrition",
    "Easy to understand and follow",
  ],

  useCases: [
    "Muscle building and strength training",
    "Weight loss and fat reduction",
    "Healthy weight maintenance",
    "Athletic performance support",
    "Meal planning and diet structuring",
    "Recovery after exercise",
    "Improving overall diet quality",
  ],

  whoShouldUse: `
Protein Calculator is designed to be used on an adult scale of the amount of protein the user needs daily. This is an effective tool to employ when one is starting on fitness or is an avid fitness practitioner or is on the weight-loss or muscle-building phases of fitness.

Also, it might be beneficial for people who are experiencing tiredness, difficulty with muscle recovery, and imbalances in their diet.`,

  formulas: [
    {
      title: "Protein Requirement Based on Body Weight",
      formula: `
Sedentary: 0.8 g per kg of body weight  
Moderately Active: 1.0–1.2 g per kg  
Active / Training: 1.2–1.6 g per kg  
Intense Training / Muscle Building: 1.6–2.0 g per kg
      `,
      explanation: `
Protein needs scale with physical activity and training intensity. Higher activity increases muscle breakdown and recovery needs, requiring more protein.
      `,
    },
    {
      title: "Protein Distribution Per Meal",
      formula: "Daily Protein ÷ Number of Meals",
      explanation: `
Dividing protein evenly across meals helps maximize muscle protein synthesis throughout the day.
      `,
    },
  ],

  tips: [
    "Distribute protein evenly across meals",
    "Aim for 20–30g protein per meal when possible",
    "Prioritize whole food protein sources",
    "Increase protein slightly during weight loss",
    "Pair protein with strength training for best results",
    "Stay hydrated to support protein metabolism",
    "Adjust intake based on recovery and energy levels",
  ],

  limitations: [
    "Provides estimated ranges, not exact requirements",
    "Does not account for medical conditions",
    "Individual digestion and absorption may vary",
    "Protein needs can fluctuate day to day",
    "Not a replacement for professional dietary advice",
    "Does not assess protein quality directly",
  ],

  faqs: [
    {
      question: "How much protein do I need per day?",
      answer: `
Protein needs depend on body weight and activity level. Most adults require between 0.8 and 1.6 grams per kilogram of body weight per day.
      `,
    },
    {
      question: "Is eating too much protein harmful?",
      answer: `
For healthy individuals, moderate high-protein intake is generally safe. Extremely excessive intake over long periods may stress the kidneys in people with existing kidney issues.
      `,
    },
    {
      question: "Do I need protein supplements?",
      answer: `
Supplements are optional. Whole foods can meet protein needs, but supplements can be convenient when dietary intake is insufficient.
      `,
    },
    {
      question: "Does protein help with weight loss?",
      answer: `
Yes. Protein increases satiety, preserves muscle mass, and slightly boosts metabolism, making it beneficial during weight loss.
      `,
    },
  ],

  uniqueInsights: `
Many people focus on total protein intake but overlook consistency. Consuming adequate protein spread across the day is often more effective than high intake concentrated in one meal.

This calculator encourages sustainable habits rather than extreme targets. Viewing protein intake as a flexible range allows room for lifestyle variation while still supporting health and fitness goals.
  `,

  resources: [
    {
      label: "Protein and Muscle Health",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6566799/",
    },
    {
      label: "Dietary Protein Explained",
      url: "https://www.healthline.com/nutrition/how-much-protein-per-day",
    },
    {
      label: "Protein Intake and Weight Management",
      url: "https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/protein/",
    },
  ],
};
const pregnancyHowToUse = {
  title: "How to Use the Pregnancy Calculator",

  intro: `
Pregnancy is a very unique and private experience, and knowledge of key dates and milestones can help expecting parents feel more educated and ready for any situation. The Pregnancy Calculator calculates your estimated due date and monitors your pregnant months by recognized medical calculations.

The given calculator will help you calculate a gestation period according to various dates such as the first day of the last menstrual period (LMP), the date of conception, dates of ultrasound measurements, dates of IVF transfer, as well as other dates. Because it is hard to pinpoint the conception dates accurately, a standardized approach is used by medical professionals.

This is more of a guide so that you do not have a specific date, but rather an approximate window during which your due date is, and other important milestones that you are expected to reach during pregnancy.

If you are pregnant for the first time or monitoring your pregnancy progress, this calculator will provide you with an accurate idea of your progress. `,

  steps: [
    {
      title: "Choose the Calculation Method",
      description: `
First, select how you will calculate your pregnancy timeline: from LMP, conception date, ultrasound data, or your IVF transfer date.

Different methods are useful depending on the information that one has.
      `,
    },
    {
      title: "Enter the Relevant Date",
      description: `
Give the date that corresponds to your chosen method, such as the first date of your last menstrual period or the date of embryo transfer.

Precise dates lead to better results when estimates are made.
      `,
    },
    {
      title: "Select Average Cycle Length (If Applicable)",
      description: `
If you are using the LMP date method, you can then enter your average menstrual cycle length.      `,
    },
    {
      title: "Calculate Pregnancy Timeline",
      description: `
Once all inputs have been entered, calculate to see your estimated due date, current gestational age, and pregnancy milestones.      `,
    },
    {
      title: "Use Results as a Guideline",
      description: `
Consider the calculated dates to be estimates. Not all pregnancies have the same length, and actual delivery may happen prior to or after those dates.      `,
    },
  ],

  benefits: [
    "Estimates pregnancy due date using multiple methods",
    "Tracks gestational age and pregnancy progress",
    "Supports planning and milestone awareness",
    "Uses medically accepted calculation approaches",
    "Easy to use and understand",
    "Helpful throughout all pregnancy stages",
    "Provides clarity without medical jargon",
  ],

  useCases: [
    "Estimating pregnancy due date",
    "Tracking pregnancy milestones",
    "Planning prenatal appointments",
    "Understanding gestational age",
    "Supporting IVF pregnancy tracking",
    "Monitoring trimester progression",
    "General pregnancy awareness",
  ],

  whoShouldUse: `
The Pregnancy Calculator is appropriate for those pregnant or planning to conceive and wishing to have a general idea of their dates.

In a natural conception, or with the aid of reproduction biotechnologies such as IVF, or with ultrasound date estimation, it can be used in any stage of pregnancy. `,

  formulas: [
    {
      title: "Naegeles Rule (LMP Method)",
      formula: "Due Date = First Day of Last Menstrual Period + 280 days",
      explanation: `
Naegele’s Rule is the most commonly used method to estimate pregnancy due dates based on the first day of the last menstrual period.
      `,
    },
    {
      title: "Conception-Based Calculation",
      formula: "Due Date = Conception Date + 266 days",
      explanation: `
This method estimates pregnancy length from the estimated date of conception rather than menstrual cycles.
      `,
    },
    {
      title: "IVF Pregnancy Calculation",
      formula: "Due Date = Embryo Transfer Date + 261–263 days",
      explanation: `
For IVF pregnancies, calculations are adjusted based on embryo age at transfer to align with standard gestational timelines.
      `,
    },
  ],

  tips: [
    "Remember that due dates are estimates",
    "Only about 5% of babies are born on their exact due date",
    "Full-term pregnancy ranges from 37 to 42 weeks",
    "Early ultrasounds may adjust due dates",
    "Track milestones rather than fixating on dates",
    "Consult healthcare providers for medical guidance",
    "Use the calculator for planning, not diagnosis",
  ],

  limitations: [
    "Provides estimates, not guaranteed dates",
    "Cycle length assumptions may vary",
    "Does not replace ultrasound confirmation",
    "Pregnancy duration differs between individuals",
    "Not intended for medical decision-making",
    "Does not assess pregnancy health or risk",
  ],

  faqs: [
    {
      question: "How accurate is the pregnancy due date?",
      answer: `
The calculated due date is an estimate. Only a small percentage of babies are born on the exact due date, with most deliveries occurring within a few weeks before or after.
      `,
    },
    {
      question: "What does LMP mean?",
      answer: `
LMP stands for Last Menstrual Period. It refers to the first day of your last menstrual cycle and is commonly used to estimate pregnancy length.
      `,
    },
    {
      question: "Can ultrasound change my due date?",
      answer: `
Yes. Early ultrasound measurements can provide a more accurate estimate of gestational age and may adjust the due date.
      `,
    },
    {
      question: "How is IVF pregnancy calculated?",
      answer: `
IVF pregnancy dating is based on the embryo transfer date and embryo age, which allows for precise adjustment of gestational age.
      `,
    },
  ],

  uniqueInsights: `
Pregnancy calculators are tools for guidance, not prediction. Each pregnancy develops differently, and factors such as genetics, health, and environment influence delivery timing.

This calculator emphasizes understanding pregnancy progression rather than focusing solely on a single due date, helping expectant parents stay informed and flexible.
  `,

  resources: [
    {
      label: "Pregnancy Due Date Explained",
      url: "https://www.acog.org/womens-health/faqs/due-dates",
    },
    {
      label: "Understanding Pregnancy Weeks and Trimesters",
      url: "https://www.nhs.uk/pregnancy/week-by-week/",
    },
    {
      label: "IVF Pregnancy Dating",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK279106/",
    },
  ],
};

export interface CalculatorConfig {
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<{
    className?: string;
}>;
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
    path: "/calculators/bmi-calculator",
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
    path: "/calculators/calorie-calculator",
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
    path: "/calculators/water-intake-calculator",
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
  tdee: {
    title: "TDEE Calculator",
    description:
      "Calculate your Total Daily Energy Expenditure (TDEE) to understand your daily caloric needs for weight management, including detailed breakdowns and historical tracking.",
    path: "/calculators/tdee-calculator",
    category: "health",
    icon: Target,
    howToUse: tdeeHowToUse,
    details: {
      whatIs:
        "TDEE (Total Daily Energy Expenditure) represents the total number of calories you burn in a day, including your basal metabolic rate and physical activity.",
      howItWorks:
        "The calculator first determines your BMR using the Mifflin-St Jeor equation, then multiplies it by an activity factor.",
      tips: [
        "Use TDEE to determine calorie intake for weight goals",
        "Create a 500-calorie deficit to lose 1 pound per week",
        "Add 500 calories daily to gain 1 pound per week",
        "Recalculate TDEE as your weight changes significantly",
        "Consider tracking calories to validate your TDEE",
      ],
    },
    faqs: [
      {
        question: "What is TDEE?",
        answer:
          "TDEE (Total Daily Energy Expenditure) is the total number of calories your body burns in a day, including basic bodily functions (BMR), physical activity, and digestion.",
      },
      {
        question: "How is TDEE calculated?",
        answer:
          "TDEE is calculated by first determining your Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation, then multiplying it by an activity factor based on your lifestyle.",
      },
      {
        question: "Which activity level should I choose?",
        answer:
          "Choose the activity level that best matches your average weekly routine. If unsure, it's better to select a lower activity level and adjust based on real-world results.",
      },
      {
        question: "Can I use TDEE to lose or gain weight?",
        answer:
          "Yes. Eating about 500 calories below your TDEE can help you lose roughly 1 pound per week, while eating 500 calories above your TDEE can help you gain weight gradually.",
      },
      {
        question: "How often should I recalculate my TDEE?",
        answer:
          "You should recalculate your TDEE whenever your weight, activity level, or body composition changes significantly, or every few months for accuracy.",
      },
    ],
  },
  protein: {
    title: "Protein Calculator",
    description:
      "Calculate your daily protein requirements with progress tracking to optimize muscle growth, weight management, and overall health based on your activity level.",
    path: "/calculators/protein-calculator",
    icon: Zap,
    category: "health",
    howToUse: proteinHowToUse,
    details: {
      whatIs:
        "A protein calculator determines your daily protein needs based on your body weight, activity level, age, and gender. Protein is essential for muscle maintenance, repair, and growth, and requirements vary significantly based on your lifestyle and objectives.",
      howItWorks:
        "The calculator uses established formulas that consider your activity level. Base requirements start at 0.8g per kg for sedentary individuals and increase up to 1.6g+ per kg for athletes and those building muscle. It also calculates your BMR and total caloric needs to show protein as a percentage of your total intake.",
      tips: [
        "Distribute protein evenly throughout the day for optimal absorption",
        "Aim for 20-30g of protein per meal for muscle protein synthesis",
        "Complete proteins contain all essential amino acids",
        "Higher protein needs during weight loss help preserve muscle mass",
        "Quality matters - choose lean, high-quality protein sources",
        "Track your progress over time to ensure consistency",
      ],
    },
    faqs: [
      {
        question: "How much protein do I need per day?",
        answer:
          "Daily protein needs depend on body weight, activity level, and goals. Sedentary adults typically need about 0.8g per kg of body weight, while active individuals and athletes may require 1.2–1.6g per kg or more.",
      },
      {
        question: "Is eating too much protein harmful?",
        answer:
          "For healthy individuals, higher protein intake is generally safe. However, extremely high protein intake over long periods may stress the kidneys in people with existing kidney conditions. Always consult a healthcare professional if unsure.",
      },
      {
        question: "Should protein intake change during weight loss?",
        answer:
          "Yes. Increasing protein intake during weight loss helps preserve muscle mass, improves satiety, and supports metabolic health. Many experts recommend the higher end of protein ranges when dieting.",
      },
      {
        question: "Does protein timing matter?",
        answer:
          "Total daily protein intake matters most, but distributing protein evenly across meals (20–30g per meal) can improve muscle protein synthesis and recovery.",
      },
      {
        question: "Are plant-based proteins as effective as animal proteins?",
        answer:
          "Plant-based proteins can be just as effective if consumed in adequate amounts and variety. Combining different plant protein sources helps ensure all essential amino acids are included.",
      },
    ],
  },
  pregnancy: {
    title: "Pregnancy Calculator",
    description:
      "Estimate due dates and pregnancy milestones based on LMP, conception, ultrasound, or IVF data.",
    path: "/calculators/pregnancy-calculator",
    icon: Baby,
    category: "health",
    howToUse: pregnancyHowToUse,
    details: {
      whatIs:
        "A pregnancy calculator estimates your due date and tracks pregnancy progress using your LMP, due date, conception, ultrasound, or IVF date.",
      howItWorks:
        "It applies Naegele's rule (adding 280 days to the last menstrual period) or equivalent adjustments for other calculation types.",
      tips: [
        "Due dates are estimates — only 5% of babies are born exactly on that day.",
        "Full-term pregnancy is 37–42 weeks.",
        "Consult your doctor for personalized medical advice.",
      ],
    },
    faqs: [
      {
        question: "How accurate is the pregnancy due date?",
        answer:
          "The calculated due date is an estimate. Only about 5% of babies are born on their exact due date. Most pregnancies last between 37 and 42 weeks.",
      },
      {
        question: "What is LMP and why is it used?",
        answer:
          "LMP stands for Last Menstrual Period. It is commonly used to estimate pregnancy duration because ovulation and conception dates are often uncertain.",
      },
      {
        question: "Can ultrasound dating change my due date?",
        answer:
          "Yes. Early ultrasounds, especially in the first trimester, can provide a more accurate gestational age and may adjust the estimated due date.",
      },
      {
        question: "How is pregnancy calculated for IVF?",
        answer:
          "For IVF pregnancies, calculations are based on the embryo transfer date and embryo age (day 3, 5, or 6), then adjusted to align with standard gestational age counting.",
      },
      {
        question: "What does full-term pregnancy mean?",
        answer:
          "A full-term pregnancy typically ranges from 37 to 42 weeks. Babies born before 37 weeks are considered preterm.",
      },
    ],
  },
};
