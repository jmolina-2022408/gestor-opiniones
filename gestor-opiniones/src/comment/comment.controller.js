import Comment from './comment.model.js';

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

// Crear Comentario
export const createComment = async (req, res) => {
    try {
        let { text, post } = req.body;
        let userId = req.user.id; // Obtener el ID del usuario actual autenticado

        let comment = new Comment({
            text,
            user: userId, // Asociar el comentario al usuario actual
            post: post // Asociar el comentario a la publicación especificada
        });

        await comment.save();
        return res.status(201).send({ message: 'Comment created successfully', comment: comment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating comment' });
    }
};

// Editar Comentario
export const editComment = async (req, res) => {
    try {
        let { id } = req.params;
        let { text } = req.body;
        let userId = req.user.id; // Obtener el ID del usuario actual autenticado

        // Verificar si el comentario existe y pertenece al usuario actual
        let comment = await Comment.findOne({ _id: id, user: userId });
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found or you are not authorized to edit this comment' });
        }

        // Actualizar el texto del comentario
        comment.text = text;

        await comment.save();
        return res.send({ message: 'Comment updated successfully', comment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating comment' });
    }
};

// Eliminar Comentario
export const deleteComment = async (req, res) => {
    try {
        let { id } = req.params;
        let userId = req.user.id; // Obtener el ID del usuario actual autenticado

        // Verificar si el comentario existe y pertenece al usuario actual
        let comment = await Comment.findOne({ _id: id, user: userId });
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found or you are not authorized to delete this comment' });
        }

        // Eliminar la publicación
        let deletedComment = await Comment.deleteOne({ _id: id })
        //Validar que se eliminó
        if (deletedComment.deletedCount === 0) return res.status(404).send({ message: 'Comment not found and not deleted' })
        //Responder
        return res.send({ message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting comment' });
    }
};
