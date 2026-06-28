import Groq from 'groq-sdk'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are an expert data science career advisor and project designer.

A user will give you a job description and a list of skills they want to use.
Your job is to suggest exactly 3 tailored hands-on projects they can build to match that JD.

Return ONLY raw JSON. No markdown. No backticks. No explanation. No text before or after.
Start your response with { and end with }

The JSON must follow this exact structure:
{
  "suggestions": [
    {
      "title": "Project title here",
      "domain": "DA",
      "relevancy_score": 87,
      "why_relevant": "2 sentence explanation of why this project matches the JD",
      "tech_stack": ["Python", "Pandas", "Matplotlib"],
      "difficulty": "BEGINNER",
      "is_case_study": false,
      "datasets": [
        {
          "name": "Dataset name",
          "url": "https://www.kaggle.com/datasets/actual-dataset-url",
          "why_suitable": "One sentence on why this dataset works"
        },
        {
          "name": "Dataset name 2",
          "url": "https://www.kaggle.com/datasets/actual-dataset-url-2",
          "why_suitable": "One sentence on why this dataset works"
        },
        {
          "name": "Dataset name 3",
          "url": "https://www.kaggle.com/datasets/actual-dataset-url-3",
          "why_suitable": "One sentence on why this dataset works"
        }
      ]
    }
  ]
}

Rules:
- Return exactly 3 suggestions in the suggestions array
- domain must be exactly one of: DA, DS, ML, AI_ENGINEER, NLP, GENAI, RAG
- difficulty must be exactly one of: BEGINNER, INTERMEDIATE, ADVANCED
- relevancy_score must be a number between 1 and 100, not a string
- Each suggestion must have exactly 3 datasets with real Kaggle URLs
- is_case_study is true if the project simulates a real business scenario
- If the JD is vague or unclear, infer the most likely domain and suggest relevant projects anyway
- Return only raw JSON, absolutely no markdown, no backticks, no code fences, no preamble`

export async function POST(request: Request) {
  try {
    // Check for test mode
    const isTest = request.headers.get('X-Test') === 'true'
    if (isTest) {
      return NextResponse.json({
        suggestions: [
          {
            title: "Customer Churn Prediction Dashboard",
            domain: "DA",
            relevancy_score: 92,
            why_relevant: "This project directly mirrors fintech analyst work involving transaction data and customer behavior analysis. It demonstrates SQL querying, Python analysis, and Power BI visualization skills listed in the JD.",
            tech_stack: ["Python", "Pandas", "SQL", "Power BI"],
            difficulty: "BEGINNER",
            is_case_study: true,
            datasets: [
              { name: "Telco Customer Churn", url: "https://www.kaggle.com/datasets/blastchar/telco-customer-churn", why_suitable: "Contains customer transaction history and churn labels perfect for fintech analysis" },
              { name: "Bank Customer Churn", url: "https://www.kaggle.com/datasets/shubh0799/churn-modelling", why_suitable: "Real banking customer data with account details and exit flags" },
              { name: "Credit Card Customers", url: "https://www.kaggle.com/datasets/sakshigoyal7/credit-card-customers", why_suitable: "Financial services dataset with customer demographics and transaction patterns" }
            ]
          },
          {
            title: "Sales Forecasting with Time Series",
            domain: "DS",
            relevancy_score: 78,
            why_relevant: "Time series forecasting is a core skill for data analysts in financial services. This project demonstrates predictive analytics and data storytelling for non-technical stakeholders.",
            tech_stack: ["Python", "Pandas", "Matplotlib", "Statsmodels"],
            difficulty: "INTERMEDIATE",
            is_case_study: false,
            datasets: [
              { name: "Superstore Sales", url: "https://www.kaggle.com/datasets/vivek468/superstore-dataset-final", why_suitable: "Multi-year sales data ideal for time series forecasting" },
              { name: "Rossmann Store Sales", url: "https://www.kaggle.com/competitions/rossmann-store-sales", why_suitable: "Real retail chain data with promotions and seasonality" },
              { name: "Weekly Sales Forecasting", url: "https://www.kaggle.com/datasets/manjeetsingh/retaildataset", why_suitable: "Weekly sales figures across multiple store departments" }
            ]
          },
          {
            title: "HR Attrition Analysis",
            domain: "DA",
            relevancy_score: 71,
            why_relevant: "HR analytics is a common use case for data analysts learning to present insights to non-technical managers. Demonstrates Python, SQL, and visualization skills in a business context.",
            tech_stack: ["Python", "Pandas", "Seaborn", "SQL"],
            difficulty: "BEGINNER",
            is_case_study: true,
            datasets: [
              { name: "IBM HR Analytics", url: "https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset", why_suitable: "Classic HR dataset with 35 employee features and attrition labels" },
              { name: "Employee Attrition", url: "https://www.kaggle.com/datasets/vjchoudhary7/hr-analytics-case-study", why_suitable: "Case study format with manager ratings and performance data" },
              { name: "HR Employee Dataset", url: "https://www.kaggle.com/datasets/rhuebner/human-resources-data-set", why_suitable: "Comprehensive HR data with salary, department, and satisfaction scores" }
            ]
          }
        ]
      })
    }

    // Parse request body
    const body = await request.json()
    const { jd, skills } = body

    // Validate inputs
    if (!jd || jd.trim().length === 0) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 })
    }
    if (!skills || skills.length === 0) {
      return NextResponse.json({ error: 'At least one skill is required' }, { status: 400 })
    }

    // Rate limiting check
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set() {},
          remove() {},
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { data: rateLimit } = await supabase
        .from('rate_limits')
        .select('count, window_start')
        .eq('user_id', session.user.id)
        .eq('endpoint', 'suggest')
        .single()

      if (rateLimit) {
        if (rateLimit.window_start > oneHourAgo && rateLimit.count >= 10) {
          return NextResponse.json(
            { error: 'Too many requests. Try again in an hour.' },
            { status: 429 }
          )
        }
        if (rateLimit.window_start <= oneHourAgo) {
          await supabase.from('rate_limits')
            .update({ count: 1, window_start: new Date().toISOString() })
            .eq('user_id', session.user.id)
            .eq('endpoint', 'suggest')
        } else {
          await supabase.from('rate_limits')
            .update({ count: rateLimit.count + 1 })
            .eq('user_id', session.user.id)
            .eq('endpoint', 'suggest')
        }
      } else {
        await supabase.from('rate_limits')
          .insert({ user_id: session.user.id, endpoint: 'suggest', count: 1 })
      }
    }

    // Build prompt
    const userPrompt = `Job Description:\n${jd}\n\nSkills the user wants to use: ${skills.join(', ')}`

    // Call Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const text = completion.choices[0]?.message?.content || ''

    // Strip any accidental backticks just in case
    const cleaned = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json(result, {
      headers: { 'X-Model-Used': 'groq-llama' }
    })

  } catch (error) {
    console.error('Suggest API error:', error)
    return NextResponse.json(
      { error: 'suggestion_failed', retry: true },
      { status: 500 }
    )
  }
}