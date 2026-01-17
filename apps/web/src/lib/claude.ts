import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// System prompts
const CHAT_SYSTEM_PROMPT = `You are a helpful financial wellness assistant for Handled, an app that helps women aged 30-50 complete financial maintenance tasks they keep putting off.

Your role is to:
- Answer questions about personal finance topics in a clear, judgment-free way
- Help users understand financial tasks like checking credit scores, updating beneficiaries, rolling over 401(k)s, reviewing insurance, etc.
- Provide step-by-step guidance when users are working through tasks
- Be supportive and encouraging - celebrate progress, no matter how small
- Keep explanations simple and actionable

Important guidelines:
- Never provide specific investment advice or tell users what to buy/sell
- Don't ask for or store sensitive financial account numbers
- If a question requires professional advice (tax, legal, investment), recommend consulting the appropriate professional
- Be warm and conversational, not robotic
- Use "you" language to make it personal`;

const DOCUMENT_ANALYSIS_PROMPT = `You are a financial document analyzer for Handled, an app that helps users manage their financial tasks.

Analyze the provided document and extract relevant information. Return a JSON response with:
- documentType: The type of document (tax_return, bank_statement, investment_statement, insurance_policy, etc.)
- summary: A brief 2-3 sentence summary of the document
- keyFindings: Array of important findings or data points
- actionItems: Array of suggested actions based on the document
- relevantTasks: Array of task categories this relates to (credit_score, retirement, insurance, etc.)

Be helpful and surface information that would help the user stay on top of their finances.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  promptTokens: number;
  completionTokens: number;
}

export interface DocumentAnalysis {
  documentType: string;
  summary: string;
  keyFindings: string[];
  actionItems: string[];
  relevantTasks: string[];
}

/**
 * Send a chat message and get a response from Claude
 */
export async function chat(
  messages: ChatMessage[],
  userContext?: string
): Promise<ChatResponse> {
  const systemPrompt = userContext
    ? `${CHAT_SYSTEM_PROMPT}\n\nUser context: ${userContext}`
    : CHAT_SYSTEM_PROMPT;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textContent = response.content.find((c) => c.type === 'text');

  return {
    message: textContent?.type === 'text' ? textContent.text : '',
    promptTokens: response.usage.input_tokens,
    completionTokens: response.usage.output_tokens,
  };
}

/**
 * Stream a chat response from Claude
 */
export async function* chatStream(
  messages: ChatMessage[],
  userContext?: string
): AsyncGenerator<string, { promptTokens: number; completionTokens: number }> {
  const systemPrompt = userContext
    ? `${CHAT_SYSTEM_PROMPT}\n\nUser context: ${userContext}`
    : CHAT_SYSTEM_PROMPT;

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }

  const finalMessage = await stream.finalMessage();
  return {
    promptTokens: finalMessage.usage.input_tokens,
    completionTokens: finalMessage.usage.output_tokens,
  };
}

/**
 * Analyze a document using Claude's vision capabilities
 */
export async function analyzeDocument(
  base64Content: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'application/pdf',
  fileName: string
): Promise<DocumentAnalysis> {
  // PDF files can't be sent as images - analyze via text extraction prompt
  if (mediaType === 'application/pdf') {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: DOCUMENT_ANALYSIS_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Please analyze this PDF document: "${fileName}". Note: The document content could not be extracted. Please provide a generic analysis structure for a PDF document.`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    const text = textContent?.type === 'text' ? textContent.text : '{}';

    try {
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      return JSON.parse(jsonStr);
    } catch {
      return {
        documentType: 'pdf',
        summary: 'PDF document uploaded - content analysis requires additional processing.',
        keyFindings: [],
        actionItems: [],
        relevantTasks: [],
      };
    }
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: DOCUMENT_ANALYSIS_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
              data: base64Content,
            },
          },
          {
            type: 'text',
            text: `Please analyze this document: "${fileName}". Provide your analysis in the JSON format specified.`,
          },
        ],
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  const text = textContent?.type === 'text' ? textContent.text : '{}';

  // Parse the JSON response
  try {
    // Extract JSON from the response (it might be wrapped in markdown code blocks)
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
    return JSON.parse(jsonStr);
  } catch {
    // If parsing fails, return a basic structure
    return {
      documentType: 'unknown',
      summary: text,
      keyFindings: [],
      actionItems: [],
      relevantTasks: [],
    };
  }
}

export default anthropic;
