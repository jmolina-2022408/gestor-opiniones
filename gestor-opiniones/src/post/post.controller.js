import Post from './post.model.js';

export const test = (req, res) => {
    console.log('test is running')
    return res.send({ message: 'Test is running' })
}

// Crear Publicación
export const createPost = async (req, res) => {
    try {
        let { title, category, content } = req.body;
        let userId = req.user.id; // Obtener el ID del usuario actual autenticado

        let post = new Post({
            title,
            category,
            content,
            user: userId // Asociar la publicación al usuario actual
        });

        await post.save();
        return res.status(201).send({ message: 'Post created successfully', post: post });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating post' });
    }
};

// Editar Publicación
export const editPost = async (req, res) => {
    try {
        let { id } = req.params;
        let { title, category, content } = req.body;
        let userId = req.user.id; // Obtener el ID del usuario actual autenticado

        // Verificar si la publicación existe y pertenece al usuario actual
        let post = await Post.findOne({ _id: id, user: userId }).populate('user', ['username']);
        if (!post) {
            return res.status(404).send({ message: 'Post not found or you are not authorized to edit this post' });
        }

        // Actualizar los campos de la publicación
        post.title = title;
        post.category = category;
        post.content = content;

        await post.save();
        return res.send({ message: 'Post updated successfully', post });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating post' });
    }
};

// Eliminar Publicación
export const deletePost = async (req, res) => {
    try {
        let { id } = req.params;
        let userId = req.user.id; // Obtener el ID del usuario actual autenticado

        // Verificar si la publicación existe y pertenece al usuario actual
        let post = await Post.findOne({ _id: id, user: userId });
        if (!post) {
            return res.status(404).send({ message: 'Post not found or you are not authorized to delete this post' });
        }

        // Eliminar la publicación
        let deletedPost = await Post.deleteOne({ _id: id })
        //Validar que se eliminó
        if (deletedPost.deletedCount === 0) return res.status(404).send({ message: 'Post not found and not deleted' })
        //Responder        
        return res.send({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting post' });
    }
};
