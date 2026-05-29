export interface Documento {
    documentoId: string;
    nombreArchivo: string;
    tipoArchivo: string;
    tamanoBytes: number;
    textoPreview: string;
}
export interface RespuestaDocumento {
  exito: boolean;
  mensaje: string;
  datos: {
    documentoId: string;
    nombreArchivo: string;
    tipoArchivo: string;
    tamanoBytes: number;
    textoPreview: string;
  };
}

export interface RespuestaPrompt {
  exito: boolean;
  mensaje: string;
  datos: {
    prompt: {
      _id: string;
      tipoProyecto: string;
      tecnologiasDetectadas: string[];
      promptFinal: string;
      contenido: {
        contextoProyecto: string;
        requisitosFuncionales: string[];
        requisitosNoFuncionales: string[];
        stackTecnologico: string[];
        arquitecturaSugerida: string;
        estructuraCarpetas: string;
        componentesPrincipales: string[];
        guiaImplementacion: string[];
        checklistCompleto: string[];
      };
    };
  };
}

