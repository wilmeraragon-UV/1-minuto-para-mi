import { GoogleGenAI } from '@google/genai';
import { ExerciseGuide, BreathPhase } from '../types';

const API_KEY_STORAGE_KEY = 'huv_gemini_api_key_v1';

export const GeminiService = {
  /**
   * Obtiene la clave de API guardada en el navegador o variable de entorno
   */
  getApiKey(): string {
    if (typeof window === 'undefined') return '';
    try {
      const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedKey && storedKey.trim().length > 0) {
        return storedKey.trim();
      }
    } catch (e) {
      console.warn('Error reading API key from localStorage', e);
    }

    // Fallback a variable de entorno si existe
    try {
      const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
        return envKey.trim();
      }
    } catch {
      // Ignorar
    }

    return '';
  },

  /**
   * Guarda la clave de API en el navegador del usuario
   */
  saveApiKey(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } catch (e) {
      console.error('Error saving API key to localStorage', e);
      throw new Error('No se pudo guardar la clave en el almacenamiento local del navegador.');
    }
  },

  /**
   * Elimina la clave de API guardada
   */
  removeApiKey(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (e) {
      console.error('Error removing API key', e);
    }
  },

  /**
   * Verifica si existe una clave de API configurada
   */
  hasApiKey(): boolean {
    return this.getApiKey().length > 0;
  },

  /**
   * Genera una pausa consciente personalizada de 1 minuto con Gemini
   */
  async generatePersonalizedPause(situation: string, shiftName: string): Promise<ExerciseGuide> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('No se ha configurado la API Key de Gemini. Por favor ingresa tu clave haciendo clic en el icono de llave (🔑).');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Eres un especialista en salud ocupacional y psicología médica del Hospital Universitario del Valle "Evaristo García" E.S.E. (HUV).
El usuario es un trabajador de salud (médico, enfermero, auxiliar, administrativo o asistencial) durante su turno de ${shiftName}.
Su situación o necesidad actual es: "${situation}".

Crea una micro-pausa guiada de relajación consciente de EXACTAMENTE 1 MINUTO (60 segundos) personalizada para este momento hospitalario.
Responde ÚNICAMENTE con un JSON válido con la siguiente estructura exacta:
{
  "title": "Título corto y reconfortante del ejercicio (ej: Pausa de Calma tras Urgencias)",
  "subtitle": "Subtítulo empático y conciso",
  "description": "Breve descripción clínica y humana del ejercicio",
  "pattern": "Ciclo respiratorio sugerido (ej: 4s Inhala • 4s Sostén • 4s Exhala • 4s Reposa)",
  "affirmation": "Una afirmación o recordatorio vocacional cálido para el profesional del HUV",
  "inhalaInstruction": "Instrucción corta para la inhalación",
  "sostenInstruction": "Instrucción corta para sostener el aire",
  "exhalaInstruction": "Instrucción corta para exhalar",
  "reposaInstruction": "Instrucción corta para la pausa en vacío",
  "mindfulPrompts": [
    "Frase de foco 1",
    "Frase de foco 2",
    "Frase de foco 3"
  ]
}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('La respuesta de Gemini vino vacía.');
      }

      const parsed = JSON.parse(responseText);

      const phases: BreathPhase[] = [
        {
          name: 'inhala',
          label: 'Inhala suave por la nariz',
          durationSeconds: 4,
          instruction: parsed.inhalaInstruction || 'Inhala despacio sintiendo el soporte del HUV.',
        },
        {
          name: 'sosten',
          label: 'Sostén el aire con calma',
          durationSeconds: 4,
          instruction: parsed.sostenInstruction || 'Retén con serenidad, estás en un espacio seguro.',
        },
        {
          name: 'exhala',
          label: 'Exhala soltando toda tensión',
          durationSeconds: 4,
          instruction: parsed.exhalaInstruction || 'Libera el cansancio y la presión acumulada.',
        },
        {
          name: 'reposa',
          label: 'Reposa en quietud antes de reiniciar',
          durationSeconds: 4,
          instruction: parsed.reposaInstruction || 'Pausa en calma sintiendo cómo tu pulso se desacelera.',
        },
      ];

      const prompts: string[] = Array.isArray(parsed.mindfulPrompts) && parsed.mindfulPrompts.length > 0
        ? parsed.mindfulPrompts
        : [
            parsed.affirmation || 'Tu entrega y cuidado en el HUV transforman vidas.',
            'Cuidar de tu mente y tu cuerpo es indispensable para cuidar de otros.',
            'Vuelve a tu servicio hospitalario con renovada calma y claridad.',
          ];

      const generatedExercise: ExerciseGuide = {
        id: `ai-custom-${Date.now()}`,
        title: parsed.title || 'Micro-Pausa Consciente HUV',
        subtitle: parsed.subtitle || 'Generada con Inteligencia Artificial para tu momento de turno',
        category: 'relajacion',
        categoryLabel: 'Pausa IA Personalizada',
        description: parsed.description || `Pausa guiada personalizada para la situación: ${situation}`,
        clinicalBenefit: 'Regula el sistema nervioso autónomo y devuelve el equilibrio emocional y fisiológico.',
        idealFor: situation,
        iconName: 'Sparkles',
        patternName: parsed.pattern || '4s Inhala • 4s Sostén • 4s Exhala • 4s Reposa',
        phases,
        cycles: 3,
        totalSeconds: 60,
        mindfulPrompts: prompts,
      };

      return generatedExercise;
    } catch (err: any) {
      console.error('Error calling Gemini API:', err);
      if (err.message && (err.message.includes('401') || err.message.includes('API key') || err.message.includes('PERMISSION_DENIED'))) {
        throw new Error('Clave de API inválida o sin permisos (Error 401). Verifica tu API Key de Gemini en el botón de llave (🔑).');
      }
      throw new Error(err.message || 'Error al conectar con la API de Gemini. Revisa tu conexión y tu clave.');
    }
  },

  /**
   * Genera un mensaje de afirmación y gratitud personalizado
   */
  async generateAffirmation(shiftName: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) return '';

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Escribe una frase corta (máximo 2 renglones, en español) inspiradora, reconfortante y cálida para un profesional del Hospital Universitario del Valle (HUV) en su turno de ${shiftName}. Sin comillas ni texto adicional.`,
      });

      return response.text?.trim() || '';
    } catch (e) {
      console.warn('Error generating affirmation with Gemini:', e);
      return '';
    }
  },
};
