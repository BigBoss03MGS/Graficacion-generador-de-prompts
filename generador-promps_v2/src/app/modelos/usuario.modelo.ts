export interface Usuario {
    id: string;
    nombre: string;
    email: string;
}

export interface RespuestaAuth {
  exito: boolean;
  mensaje: string;
  datos: {
    token: string;
    usuario: Usuario;
  };
}

export interface PeticionLogin {
  email: string;
  contrasena: string;
}

export interface PeticionRegistro {
  nombre: string;
  email: string;
  contrasena: string;
}
