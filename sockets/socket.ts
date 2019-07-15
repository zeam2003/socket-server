import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
}

// Desconectar 
export const desconectar = ( cliente: Socket) => {

    cliente.on('disconnect', () => {
        console.log('Cliente Desconectado');
        usuariosConectados.borrarUsuario( cliente.id );
    })
}


// Escuchar Mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server) => {

    cliente.on('mensaje', ( payload: { de: string, cuerpo:string }) => {

        console.log('Mensaje Recibido', payload);

        io.emit('mensaje-nuevo', payload);
    });
}


// Configurar Usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server) => {

    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function) => {

        // console.log('Configurando Usuario', payload.nombre);

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );
        // io.emit('mensaje-nuevo', payload);

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    });
}

