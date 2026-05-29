export interface PromptHistorial {
  _id: string;
  tipoProyecto: string;
  tecnologiasDetectadas: string[];
  promptFinal: string;
  favorito: boolean;
  createdAt: string;
  documento: {
    nombreArchivo: string;
    tipoArchivo: string;
  };
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
}

export interface RespuestaHistorial {
  exito: boolean;
  mensaje: string;
  datos: {
    prompts: PromptHistorial[];
  };
}

export interface RespuestaPromptDetalle {
  exito: boolean;
  mensaje: string;
  datos: {
    prompt: PromptHistorial;
  };
}export interface Historial {
}
