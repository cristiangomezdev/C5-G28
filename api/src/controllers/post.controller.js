import PostModel from "../models/PostModel";
// import validator from 'validator';

export const create = async (req, res) => {
  let { username, title, content, urlPhoto } = req.body;
  try {
    if (!username || !title || !content) {
      return res.status(400).json({
        status: "error",
        message: "Complet username,title,content",
      });
    }

    const newPost = new PostModel({
      username,
      title,
      content,
      urlPhoto,
    });
    newPost.save();
    return res.status(200).json({ status: "succed", message: "ok" });
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (req, res) => {
  try {
    let _id = req.body.id;
    PostModel.findOneAndDelete({ _id: _id }, (err, postRemoved) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al borrar !!!",
        });
      }

      if (!postRemoved) {
        return res.status(404).send({
          status: "error",
          message: "post does not exist",
        });
      }

      return res.status(200).send({
        status: "success",
        article: postRemoved,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
export const search = (req, res) => {
  let searchString = req.params.search;

  PostModel.find({
    $or: [
      { title: { $regex: searchString, $options: "i" } },
      { content: { $regex: searchString, $options: "i" } },
    ],
  })
    .sort([["date", "descending"]])
    .exec((error, post) => {
      if (error) {
        return res.status(500).send({
          status: "error",
          message: "error",
        });
      }
      if (!post || post.length <= 0) {
        return res.status(500).send({
          status: "result",
          message: "No results",
        });
      }
      // console.log(error,post)
      return res.status(200).send({
        status: "success",
        post,
      });
    });
};

export const edit = async (req, res) => {
  let { _id, username, title, content, urlPhoto } = req.body;
  try {
    if (!username || !title || !content) {
      return res.status(400).json({
        status: "error",
        message: "Complet username,title,content",
      });
    }
    let params = req.body;
    if (title && content) {
      await PostModel.findByIdAndUpdate(
        { _id: _id },
        params,
        { new: true },
        (error, postUpdated) => {
          if (error) {
            return res.status(500).send({
              status: "error",
              message: "error after update",
            });
          }
          if (!postUpdated) {
            return res.status(404).send({
              status: "error",
              message: "post does not exist",
            });
          }
          return res.status(200).json({
            status: "succed",
            post: postUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        status: "error",
        message: "validation not succed",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
