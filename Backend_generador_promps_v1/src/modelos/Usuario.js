import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    contrasena: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener mínimo 6 caracteres'],
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encripta la contraseña antes de guardar
usuarioSchema.pre('save', async function () {
  if (!this.isModified('contrasena')) return;
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
});

// Método para comparar contraseñas al hacer login
usuarioSchema.methods.compararContrasena = async function (contrasenaIngresada) {
  return bcrypt.compare(contrasenaIngresada, this.contrasena);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;