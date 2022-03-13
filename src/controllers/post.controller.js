const getAllPosts = (req, res) => {
  try {
    res.json({ message: 'success' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  getAllPosts
}