

import { GoogleGenAI, Type } from '@google/genai';
import { Evaluation, Scenario, Difficulty } from '../types';

export const generateDynamicScenario = async (difficulty: Difficulty): Promise<Scenario> => {
  if (!process.env.API_KEY) {
    throw new Error("A chave de API do Gemini não foi configurada. Adicione a variável de ambiente API_KEY nas configurações do seu projeto Vercel.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Crie um cenário de roleplay de vendas para um vendedor da 'Digital Revolution' em Português de Portugal.
    O vendedor precisa de qualificar um consultor imobiliário.
    Gere um cenário único com base no nível de dificuldade: ${difficulty}.

    **Tipos de Cenário a Gerar:**
    - **Qualificado:** Cumpre os critérios ( >50k€ receita, >1 ano exp, ambicioso, aberto a digital).
    - **Não Qualificado:** Falha num ou mais critérios.
    - **Impercetível:** A informação inicial (briefing) pode ser enganadora. Ex: parece qualificado mas na chamada revela que não é, ou vice-versa.

    **Instruções de Geração:**
    1.  Decida aleatoriamente se o lead é 'Qualificado', 'Não Qualificado' ou 'Impercetível'.
    2.  Crie um 'briefing' com nome, experiência, agência e faturação.
    3.  Crie uma 'persona' detalhada para a IA assumir, que reflita a dificuldade e o status de qualificação (real ou aparente). A persona deve incluir o seu estado de espírito, ceticismo, e como irá reagir às perguntas do vendedor.

    Responda APENAS com um objeto JSON.
  `;

  try {
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: "Um ID único para o cenário, e.g., 'dynamic-12345'." },
                    isQualified: { type: Type.BOOLEAN, description: "O verdadeiro status de qualificação do lead (true ou false)." },
                    briefing: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            experience: { type: Type.STRING },
                            agency: { type: Type.STRING },
                            revenue: { type: Type.STRING },
                        },
                        required: ["name", "experience", "agency", "revenue"],
                    },
                    persona: { type: Type.STRING, description: "A persona detalhada para a IA representar." },
                },
                required: ["id", "isQualified", "briefing", "persona"],
            },
        },
    });

    const jsonText = response.text;
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation
    if (parsedJson.id && typeof parsedJson.isQualified === 'boolean' && parsedJson.briefing && parsedJson.persona) {
        return parsedJson as Scenario;
    } else {
        throw new Error("Invalid scenario structure from Gemini API");
    }
  } catch (error) {
    console.error("Error generating dynamic scenario:", error);
    // Fallback scenario in case of API error
    return {
      id: 'fallback-error',
      isQualified: true,
      briefing: { name: 'João Silva (Fallback)', experience: '5 anos', agency: 'Century 21', revenue: '80k€' },
      persona: `Você é o João, um consultor imobiliário há 5 anos com uma receita de 80k€. Está genuinamente interessado em marketing digital e ambicioso. Seja colaborativo. Pode não se lembrar do anúncio de imediato. Seja um pouco passivo, deixando o vendedor guiar.`
    };
  }
};


export const getEvaluation = async (
  transcript: string[],
  scenario: Scenario,
  mission: string
): Promise<Evaluation> => {
  if (!process.env.API_KEY) {
    throw new Error("A chave de API do Gemini não foi configurada. Adicione a variável de ambiente API_KEY nas configurações do seu projeto Vercel.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const transcriptText = transcript.join('\n');

  const prompt = `
    Analise a seguinte transcrição de uma chamada de roleplay de vendas em Português de Portugal.

    **Contexto:**
    - **Missão do Vendedor:** ${mission}
    - **Persona Secreta do Cliente (IA):** O cliente era '${scenario.briefing.name}'. ${scenario.persona}. O facto de o lead ser qualificado era: ${scenario.isQualified}.

    **Transcrição da Chamada:**
    ${transcriptText}

    **Sua Tarefa:**
    Com base na missão do vendedor e no desempenho demonstrado na transcrição, forneça uma avaliação objetiva. Responda APENAS com um objeto JSON.

    A sua resposta deve seguir estritamente o schema JSON fornecido.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    eficacia: {
                        type: Type.INTEGER,
                        description: "Uma pontuação de 0 a 100 para a eficácia geral do vendedor em cumprir a sua missão.",
                    },
                    leadQualificado: {
                        type: Type.BOOLEAN,
                        description: "Qual foi a conclusão do vendedor sobre a qualificação do lead? Responda 'true' se o vendedor concluiu que o lead era qualificado (e.g., tentou agendar reunião) e 'false' caso contrário.",
                    },
                    pontosDeMelhoria: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                        },
                        description: "Uma lista de 3 a 4 pontos de feedback construtivos e acionáveis para o vendedor melhorar na próxima chamada. Seja específico e use exemplos da transcrição se possível.",
                    },
                },
                required: ["eficacia", "leadQualificado", "pontosDeMelhoria"],
            },
        },
    });

    const jsonText = response.text;
    const parsedJson = JSON.parse(jsonText);

    if (typeof parsedJson.eficacia === 'number' && typeof parsedJson.leadQualificado === 'boolean' && Array.isArray(parsedJson.pontosDeMelhoria)) {
      return parsedJson as Evaluation;
    } else {
        throw new Error("Invalid JSON structure from Gemini API");
    }

  } catch (error) {
    console.error("Error fetching evaluation from Gemini:", error);
    return {
      eficacia: 0,
      leadQualificado: false,
      pontosDeMelhoria: [
        "Ocorreu um erro ao processar a avaliação. Verifique a transcrição e tente novamente.",
        "A resposta da API pode não estar no formato JSON esperado."
      ],
    };
  }
};