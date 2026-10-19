import React, { useState, useEffect } from 'react';
import {
  Key,
  X,
  Eye,
  EyeOff,
  Check,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [hasExistingKey, setHasExistingKey] = useState<boolean>(false);
  const [testingKey, setTestingKey] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Cargar clave guardada al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const currentKey = GeminiService.getApiKey();
      setApiKeyInput(currentKey);
      setHasExistingKey(currentKey.length > 0);
      setSaveSuccess(false);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKeyInput.trim()) {
      setTestResult({
        success: false,
        message: 'Por favor ingresa una clave válida antes de guardar.',
      });
      return;
    }

    try {
      GeminiService.saveApiKey(apiKeyInput.trim());
      setHasExistingKey(true);
      setSaveSuccess(true);
      setTestResult(null);
      if (onKeySaved) onKeySaved();

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e.message || 'Error al guardar la clave.',
      });
    }
  };

  const handleDeleteKey = () => {
    GeminiService.removeApiKey();
    setApiKeyInput('');
    setHasExistingKey(false);
    setSaveSuccess(false);
    setTestResult({
      success: true,
      message: 'Clave eliminada del navegador correctamente.',
    });
    if (onKeySaved) onKeySaved();
  };

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: 'Ingresa una clave para probar.',
      });
      return;
    }

    setTestingKey(true);
    setTestResult(null);

    try {
      // Guardar temporalmente para prueba
      GeminiService.saveApiKey(keyToTest);
      setHasExistingKey(true);
      const testAffirmation = await GeminiService.generateAffirmation('Mañana');

      if (testAffirmation) {
        setTestResult({
          success: true,
          message: '¡Conexión con Gemini API exitosa! La clave es válida y está lista para generar pausas conscientes.',
        });
        if (onKeySaved) onKeySaved();
      } else {
        setTestResult({
          success: false,
          message: 'No se recibió respuesta de Gemini. Revisa la clave ingresada.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error al validar la clave con Gemini.',
      });
    } finally {
      setTestingKey(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera institucional del Modal */}
        <div className="bg-gradient-to-r from-[#0A3B74] to-[#009BB0] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20">
              <Key className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 id="api-key-modal-title" className="font-extrabold text-base tracking-tight">
                Configuración de Gemini API Key
              </h2>
              <p className="text-xs text-cyan-100">
                Hospital Universitario del Valle • Funciones de Inteligencia Artificial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* Estado actual de la clave */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Estado de la clave:</span>
            {hasExistingKey ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Clave configurada en el navegador
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Sin clave registrada
              </span>
            )}
          </div>

          {/* Formulario de ingreso de la API Key */}
          <div className="space-y-2">
            <label
              htmlFor="gemini-api-key-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#0A3B74]"
            >
              Ingresa tu API Key de Google Gemini
            </label>
            <div className="relative">
              <input
                id="gemini-api-key-input"
                type={showPassword ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setSaveSuccess(false);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                autoComplete="off"
                spellCheck="false"
                className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-slate-200 focus:border-[#009BB0] focus:ring-4 focus:ring-[#009BB0]/10 focus:outline-hidden transition-all text-sm font-mono text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              La clave se almacena de forma segura exclusivamente en tu navegador (localStorage).
            </p>
          </div>

          {/* Mensajes de feedback */}
          {saveSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Clave de Gemini guardada con éxito en tu navegador!</span>
            </div>
          )}

          {testResult && (
            <div
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-start gap-2 animate-fadeIn ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-[#0A3B74] hover:bg-[#06234B] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Guardar clave en el navegador</span>
            </button>

            <button
              type="button"
              onClick={handleTestKey}
              disabled={testingKey || !apiKeyInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#E6F7F9] hover:bg-[#d4f2f6] text-[#007B8C] border border-[#009BB0]/30 font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              title="Verificar que la clave funciona"
            >
              {testingKey ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#009BB0]" />
                  <span>Probando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#009BB0]" />
                  <span>Probar clave</span>
                </>
              )}
            </button>

            {hasExistingKey && (
              <button
                type="button"
                onClick={handleDeleteKey}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                title="Eliminar clave guardada"
                aria-label="Eliminar clave guardada"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cuadro de ayuda con las instrucciones paso a paso (Requerimiento exacto) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>¿Cómo obtener tu API Key gratuita de Gemini?</span>
              </div>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#009BB0] hover:text-[#0A3B74] transition-colors"
              >
                <span>Abrir AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-xs text-amber-950 font-medium leading-relaxed pl-1">
              <li>
                Entrar a{' '}
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-[#0A3B74] hover:text-[#009BB0]"
                >
                  aistudio.google.com
                </a>
                .
              </li>
              <li>
                <strong>Iniciar sesión</strong> con tu cuenta de Google.
              </li>
              <li>
                Hacer clic en la opción <strong>Get API key</strong> en el menú lateral.
              </li>
              <li>
                Presionar <strong>Create API key</strong> y copiar el código generado.
              </li>
            </ol>

            <div className="pt-2 border-t border-amber-200/60 text-[11px] text-amber-800">
              💡 <em>Una vez pegada la clave arriba, presiona <strong>"Guardar clave en el navegador"</strong> para habilitar la generación de pausas conscientes personalizadas con IA en tu jornada hospitalaria.</em>
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
