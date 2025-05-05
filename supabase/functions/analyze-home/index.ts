import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js'
import OpenAI from 'npm:openai@4.28.0'

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY')
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

serve(async (req) => {
  try {
    const { homeId, utilityBillUrl, assetUrls } = await req.json()

    // Analyze utility bill and home assets
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert in home energy efficiency analysis. Analyze the utility bill and home assets to provide detailed recommendations for energy savings."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this utility bill and home assets to provide energy saving recommendations."
            },
            {
              type: "image_url",
              image_url: utilityBillUrl
            },
            ...assetUrls.map(url => ({
              type: "image_url",
              image_url: url
            }))
          ]
        }
      ],
      max_tokens: 4096
    })

    const analysis = completion.choices[0].message.content

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})