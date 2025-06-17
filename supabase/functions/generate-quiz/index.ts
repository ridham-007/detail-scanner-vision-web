
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { quizId, prompt, difficulty } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // You'll need to add your OpenAI API key to Supabase Edge Function Secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = `You are a quiz generator. Create exactly 10 multiple choice questions based on the given topic and difficulty level. 

    Difficulty guidelines:
    - Easy: Basic knowledge, simple concepts
    - Medium: Intermediate knowledge, some analysis required
    - Hard: Advanced knowledge, complex concepts

    Return ONLY a JSON array with exactly 10 objects, each containing:
    - question: the question text
    - correct_answer: the correct answer
    - wrong_answer_1: first wrong answer
    - wrong_answer_2: second wrong answer
    - wrong_answer_3: third wrong answer

    Make sure all answers are roughly the same length and plausible. No explanations, just the JSON array.`

    const userPrompt = `Create a ${difficulty} difficulty quiz about: ${prompt}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    let questions

    try {
      questions = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', data.choices[0].message.content)
      throw new Error('Invalid response format from OpenAI')
    }

    if (!Array.isArray(questions) || questions.length !== 10) {
      throw new Error('Invalid questions format - expected array of 10 questions')
    }

    // Insert questions into database
    const questionsToInsert = questions.map((q, index) => ({
      quiz_id: quizId,
      question_text: q.question,
      correct_answer: q.correct_answer,
      wrong_answer_1: q.wrong_answer_1,
      wrong_answer_2: q.wrong_answer_2,
      wrong_answer_3: q.wrong_answer_3,
      question_order: index + 1
    }))

    const { error: insertError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert)

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true, questionsGenerated: questions.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating quiz:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate quiz',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
